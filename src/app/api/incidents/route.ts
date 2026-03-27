import { NextResponse } from "next/server";
import { assertRole, canAccessTenant, handleAuthError, requireCurrentUser } from "@/lib/auth";
import { calculateCreditAmount, calculateDurationMinutes } from "@/lib/creditMath";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Database } from "@/types/database";

type IncidentRow = Database["public"]["Tables"]["incidents"]["Row"];
type IncidentInsert = Database["public"]["Tables"]["incidents"]["Insert"];
type IncidentCustomerRow = Database["public"]["Tables"]["incident_customers"]["Row"];
type IncidentCustomerInsert = Database["public"]["Tables"]["incident_customers"]["Insert"];
type CreditInsert = Database["public"]["Tables"]["credits"]["Insert"];
type IncidentIdRow = { incident_id: number };

type IncidentType = "incident" | "urgent_pm" | "regular_pm";

type IncidentCustomerInput = {
  tenantId: string;
  subtenantId: string;
  gpuCount: number;
};

type CreateIncidentBody = {
  type: IncidentType;
  occurredAt: string;
  recoveredAt: string;
  nodeType: string;
  nodeId?: string | null;
  instanceName?: string | null;
  customers: IncidentCustomerInput[];
  memo?: string | null;
  recoveryNote?: string | null;
};

type IncidentResponse = {
  id: number;
  type: string | null;
  occurredAt: string | null;
  recoveredAt: string | null;
  durationMinutes: number;
  nodeType: string | null;
  nodeId: string | null;
  instanceName: string | null;
  registeredBy: string | null;
  memo: string | null;
  recoveryNote: string | null;
  createdAt: string | null;
  customers: Array<{
    id: number;
    tenantId: string | null;
    subtenantId: string | null;
    gpuCount: number;
    creditAmount: number;
  }>;
  totalCreditAmount: number;
};

function normalizeIncidentType(type: string | null | undefined) {
  if (type === "urgent_pm" || type === "regular_pm" || type === "incident") {
    return type;
  }

  return "incident";
}

function toIncidentResponse(incident: IncidentRow, customers: IncidentCustomerRow[]): IncidentResponse {
  const incidentType = normalizeIncidentType(incident.type);
  const durationMinutes = incident.duration_minutes ?? 0;
  const mappedCustomers = customers.map((customer) => {
    const gpuCount = customer.gpu_count ?? 0;
    return {
      id: customer.id,
      tenantId: customer.tenant_id,
      subtenantId: customer.subtenant_id,
      gpuCount,
      creditAmount: calculateCreditAmount(incidentType, durationMinutes, gpuCount),
    };
  });

  return {
    id: incident.id,
    type: incident.type,
    occurredAt: incident.occurred_at,
    recoveredAt: incident.recovered_at,
    durationMinutes,
    nodeType: incident.node_type,
    nodeId: incident.node_id,
    instanceName: incident.instance_name,
    registeredBy: incident.registered_by,
    memo: incident.memo,
    recoveryNote: incident.recovery_note,
    createdAt: incident.created_at,
    customers: mappedCustomers,
    totalCreditAmount: mappedCustomers.reduce((sum, customer) => sum + customer.creditAmount, 0),
  };
}

export async function GET(request: Request) {
  try {
    const currentUser = await requireCurrentUser();
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");

    let incidentIdsByTenant: number[] | null = null;

    if (tenantId) {
      if (!canAccessTenant(currentUser, tenantId)) {
        throw new Error("FORBIDDEN");
      }

      const { data: customerRows, error: customerError } = await supabaseAdmin
        .from("incident_customers")
        .select("incident_id")
        .eq("tenant_id", tenantId);

      if (customerError) {
        throw customerError;
      }

      incidentIdsByTenant = Array.from(
        new Set(((customerRows ?? []) as IncidentIdRow[]).map((row) => row.incident_id)),
      );
    } else if (currentUser.role !== "admin") {
      const scopedTenantId = currentUser.tenantId ?? "";
      const customerQuery = supabaseAdmin
        .from("incident_customers")
        .select("incident_id")
        .eq("tenant_id", scopedTenantId);

      const { data: customerRows, error: customerError } =
        currentUser.role === "subtenant_member"
          ? await customerQuery.eq("subtenant_id", currentUser.subtenantId ?? "")
          : await customerQuery;

      if (customerError) {
        throw customerError;
      }

      incidentIdsByTenant = Array.from(
        new Set(((customerRows ?? []) as IncidentIdRow[]).map((row) => row.incident_id)),
      );
    }

    if (incidentIdsByTenant && incidentIdsByTenant.length === 0) {
      return NextResponse.json({ data: [] });
    }

    let incidentQuery = supabaseAdmin.from("incidents").select("*");

    if (incidentIdsByTenant) {
      incidentQuery = incidentQuery.in("id", incidentIdsByTenant);
    }

    const { data: incidents, error: incidentsError } = await incidentQuery.order("occurred_at", { ascending: false });

    if (incidentsError) {
      throw incidentsError;
    }

    const incidentRows = (incidents ?? []) as IncidentRow[];

    if (incidentRows.length === 0) {
      return NextResponse.json({ data: [] });
    }

    const { data: customerRows, error: incidentCustomersError } = await supabaseAdmin
      .from("incident_customers")
      .select("*")
      .in("incident_id", incidentRows.map((incident) => incident.id));

    if (incidentCustomersError) {
      throw incidentCustomersError;
    }

    const customersByIncidentId = ((customerRows ?? []) as IncidentCustomerRow[]).reduce<Record<number, IncidentCustomerRow[]>>(
      (acc, row) => {
        acc[row.incident_id] = [...(acc[row.incident_id] ?? []), row];
        return acc;
      },
      {},
    );

    const data = incidentRows.map((incident) =>
      toIncidentResponse(incident, customersByIncidentId[incident.id] ?? []),
    );

    return NextResponse.json({ data });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await requireCurrentUser();
    assertRole(currentUser, ["admin"]);

    const body = (await request.json()) as CreateIncidentBody;

    if (!body.type || !body.occurredAt || !body.recoveredAt || !body.nodeType) {
      throw new Error("필수 입력값이 누락되었습니다.");
    }

    if (!Array.isArray(body.customers) || body.customers.length === 0) {
      throw new Error("영향 고객사를 1개 이상 선택해 주세요.");
    }

    const durationMinutes = calculateDurationMinutes(body.occurredAt, body.recoveredAt);

    const incidentPayload: IncidentInsert = {
      type: body.type,
      occurred_at: body.occurredAt,
      recovered_at: body.recoveredAt,
      duration_minutes: durationMinutes,
      node_type: body.nodeType,
      node_id: body.nodeId ?? null,
      instance_name: body.instanceName ?? null,
      registered_by: currentUser.name ?? currentUser.email,
      memo: body.memo ?? null,
      recovery_note: body.recoveryNote ?? null,
    };

    const { data: incidentData, error: incidentError } = await supabaseAdmin
      .from("incidents")
      .insert(incidentPayload as never)
      .select("*")
      .single();

    if (incidentError) {
      throw incidentError;
    }

    const incident = incidentData as IncidentRow;

    const customerPayloads: IncidentCustomerInsert[] = body.customers.map((customer) => ({
      incident_id: incident.id,
      tenant_id: customer.tenantId,
      subtenant_id: customer.subtenantId,
      gpu_count: customer.gpuCount,
    }));

    const { data: customerData, error: customerError } = await supabaseAdmin
      .from("incident_customers")
      .insert(customerPayloads as never)
      .select("*");

    if (customerError) {
      throw customerError;
    }

    if (body.type === "incident" || body.type === "urgent_pm") {
      const creditPayloads: CreditInsert[] = body.customers.map((customer) => ({
        tenant_id: customer.tenantId,
        subtenant_id: customer.subtenantId,
        source_type: body.type,
        source_id: incident.id,
        amount: calculateCreditAmount(body.type, durationMinutes, customer.gpuCount),
        note:
          body.type === "incident"
            ? `장애 등록 #${incident.id} 크레딧 발생`
            : `긴급 PM #${incident.id} 크레딧 발생`,
      }));

      const { error: creditError } = await supabaseAdmin.from("credits").insert(creditPayloads as never);

      if (creditError) {
        throw creditError;
      }
    }

    return NextResponse.json(
      {
        data: toIncidentResponse(incident, (customerData ?? []) as IncidentCustomerRow[]),
      },
      { status: 201 },
    );
  } catch (error) {
    return handleAuthError(error);
  }
}
