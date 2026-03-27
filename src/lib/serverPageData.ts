import "server-only";

import { canAccessTenant } from "@/lib/auth";
import { calculateCreditAmount } from "@/lib/creditMath";
import { mockNetworkMetrics, mockStorageMetrics } from "@/lib/mockMonitoringData";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { CurrentUser } from "@/types/auth";
import type { Database, Json } from "@/types/database";

type TenantRow = Database["public"]["Tables"]["tenants"]["Row"];
type SubtenantRow = Database["public"]["Tables"]["subtenants"]["Row"];
type AllocationRow = Database["public"]["Tables"]["node_allocations"]["Row"];
type BillingRow = Database["public"]["Tables"]["billings"]["Row"];
type NoticeRow = Database["public"]["Tables"]["notices"]["Row"];
type TicketRow = Database["public"]["Tables"]["tickets"]["Row"];
type CreditRow = Database["public"]["Tables"]["credits"]["Row"];
type IncidentRow = Database["public"]["Tables"]["incidents"]["Row"];
type IncidentCustomerRow = Database["public"]["Tables"]["incident_customers"]["Row"];
type UserProfileSubtenantRow = { subtenant_id?: string | null };

export async function getScopedTenants(currentUser: CurrentUser) {
  let query = supabaseAdmin.from("tenants").select("*").order("created_at", { ascending: false });

  if (currentUser.role !== "admin") {
    query = query.eq("id", currentUser.tenantId ?? "");
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as TenantRow[];
}

export async function getScopedSubtenants(currentUser: CurrentUser, tenantId?: string) {
  let query = supabaseAdmin.from("subtenants").select("*");

  if (currentUser.role === "admin") {
    if (tenantId) {
      query = query.eq("tenant_id", tenantId);
    }
  } else if (currentUser.role === "tenant_admin") {
    query = query.eq("tenant_id", currentUser.tenantId ?? "");
  } else {
    query = query.eq("tenant_id", currentUser.tenantId ?? "").eq("id", currentUser.subtenantId ?? "");
  }

  const { data, error } = await query.order("name");

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as SubtenantRow[];

  if (rows.length === 0) {
    return rows;
  }

  const { data: memberRows, error: memberError } = await supabaseAdmin
    .from("user_profiles")
    .select("subtenant_id")
    .in("subtenant_id", rows.map((row) => row.id))
    .neq("role", "pending");

  if (memberError) {
    throw memberError;
  }

  const memberCountById = ((memberRows ?? []) as UserProfileSubtenantRow[]).reduce<Record<string, number>>((acc, row) => {
    const subtenantId = typeof row.subtenant_id === "string" ? row.subtenant_id : null;
    if (subtenantId) {
      acc[subtenantId] = (acc[subtenantId] ?? 0) + 1;
    }
    return acc;
  }, {});

  return rows.map((row) => ({
    ...row,
    member_count: memberCountById[row.id] ?? 0,
  }));
}

export async function getScopedAllocations(currentUser: CurrentUser, tenantId?: string) {
  let query = supabaseAdmin.from("node_allocations").select("*");

  if (tenantId) {
    if (!canAccessTenant(currentUser, tenantId)) {
      throw new Error("FORBIDDEN");
    }
    query = query.eq("tenant_id", tenantId);
  } else if (currentUser.role !== "admin") {
    query = query.eq("tenant_id", currentUser.tenantId ?? "");
  }

  if (currentUser.role === "subtenant_member") {
    query = query.eq("subtenant_id", currentUser.subtenantId ?? "");
  }

  const { data, error } = await query.order("node_id");

  if (error) {
    throw error;
  }

  return (data ?? []) as AllocationRow[];
}

export async function getMembersForTenant(currentUser: CurrentUser, tenantId: string) {
  if (!canAccessTenant(currentUser, tenantId)) {
    throw new Error("FORBIDDEN");
  }

  let query = supabaseAdmin.from("user_profiles").select("*").eq("tenant_id", tenantId).neq("role", "pending").neq("role", "admin");

  if (currentUser.role === "subtenant_member") {
    query = query.eq("subtenant_id", currentUser.subtenantId ?? "");
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data ?? [];
}

function readContractQuantity(contract: Json | null, key: "gpu" | "cpu") {
  if (!contract || Array.isArray(contract) || typeof contract !== "object") {
    return 0;
  }
  const section = contract[key];
  if (!section || Array.isArray(section) || typeof section !== "object") {
    return 0;
  }
  return typeof section.quantity === "number" ? section.quantity : 0;
}

function scaleSeries(points: { timestamp: string; value: number }[], ratio: number) {
  return points.map((point) => ({
    timestamp: point.timestamp,
    value: Math.round(point.value * ratio),
  }));
}

export async function getMeteringForTenant(currentUser: CurrentUser, tenantId: string) {
  if (!canAccessTenant(currentUser, tenantId)) {
    throw new Error("FORBIDDEN");
  }

  const [{ data: tenant, error: tenantError }, subtenants, allocations] = await Promise.all([
    supabaseAdmin.from("tenants").select("id, name, contract").eq("id", tenantId).single(),
    getScopedSubtenants(currentUser, tenantId),
    getScopedAllocations({ ...currentUser, role: currentUser.role === "subtenant_member" ? "tenant_admin" : currentUser.role }, tenantId),
  ]);

  if (tenantError) {
    throw tenantError;
  }

  const tenantRow = tenant as Pick<TenantRow, "id" | "name" | "contract">;
  const contractedGpu = readContractQuantity(tenantRow.contract, "gpu");
  const contractedCpu = readContractQuantity(tenantRow.contract, "cpu");
  const storageMetric = mockStorageMetrics[tenantId];
  const networkMetric = mockNetworkMetrics[tenantId];
  const tenantAllocatedNodes = allocations.filter((allocation) => allocation.subtenant_id);
  const allocatedGpuTotal = tenantAllocatedNodes.length;

  return {
    tenantId: tenantRow.id,
    tenantName: tenantRow.name,
    period: "2026.03",
    fixed: {
      gpu: { contracted: contractedGpu, unit: "대" },
      cpu: { contracted: contractedCpu, unit: "Core" },
    },
    variable: {
      storage: {
        usage: storageMetric?.usageTB ?? 0,
        unit: "TB",
        series: storageMetric?.capacity ?? [],
      },
      networkOutbound: {
        usage: networkMetric?.currentOutboundGB ?? 0,
        unit: "GB",
        series: networkMetric?.outbound ?? [],
      },
      networkInbound: {
        usage: networkMetric?.currentInboundGB ?? 0,
        unit: "GB",
        series: networkMetric?.inbound ?? [],
      },
    },
    subtenants: subtenants.map((subtenant) => {
      const allocated = allocations.filter((allocation) => allocation.subtenant_id === subtenant.id).length;
      const gpuRatio = contractedGpu > 0 ? allocated / contractedGpu : 0;
      const allocatedCpu = Math.round(contractedCpu * gpuRatio);
      const usageRatio = allocatedGpuTotal > 0 ? allocated / allocatedGpuTotal : 0;

      return {
        subtenantId: subtenant.id,
        name: subtenant.name,
        fixed: {
          gpu: { allocated, contracted: allocated },
          cpu: { allocated: allocatedCpu, contracted: allocatedCpu },
        },
        variable: {
          storage: {
            usage: Math.round((storageMetric?.usageTB ?? 0) * usageRatio),
            unit: "TB",
            series: scaleSeries(storageMetric?.capacity ?? [], usageRatio),
          },
          networkOutbound: {
            usage: Math.round((networkMetric?.currentOutboundGB ?? 0) * usageRatio),
            unit: "GB",
            series: scaleSeries(networkMetric?.outbound ?? [], usageRatio),
          },
          networkInbound: {
            usage: Math.round((networkMetric?.currentInboundGB ?? 0) * usageRatio),
            unit: "GB",
            series: scaleSeries(networkMetric?.inbound ?? [], usageRatio),
          },
        },
      };
    }),
  };
}

export async function getBillingsForTenant(currentUser: CurrentUser, tenantId: string) {
  if (!canAccessTenant(currentUser, tenantId)) {
    throw new Error("FORBIDDEN");
  }

  let query = supabaseAdmin.from("billings").select("*").eq("tenant_id", tenantId);

  if (currentUser.role === "subtenant_member") {
    query = query.eq("subtenant_id", currentUser.subtenantId ?? "");
  }

  const { data, error } = await query.order("registered_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as BillingRow[];
}

export async function getCreditsForTenant(currentUser: CurrentUser, tenantId: string) {
  if (!canAccessTenant(currentUser, tenantId)) {
    throw new Error("FORBIDDEN");
  }

  let query = supabaseAdmin.from("credits").select("*").eq("tenant_id", tenantId);
  if (currentUser.role === "subtenant_member") {
    query = query.eq("subtenant_id", currentUser.subtenantId ?? "");
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) {
    throw error;
  }

  const rows = (data ?? []) as CreditRow[];
  const subtenantIds = Array.from(new Set(rows.map((row) => row.subtenant_id).filter((value): value is string => Boolean(value))));
  let subtenantNameById: Record<string, string> = {};
  if (subtenantIds.length > 0) {
    const { data: subtenants, error: subtenantError } = await supabaseAdmin.from("subtenants").select("id, name").in("id", subtenantIds);
    if (subtenantError) {
      throw subtenantError;
    }
    subtenantNameById = (subtenants ?? []).reduce<Record<string, string>>((acc, subtenant) => {
      acc[subtenant.id] = subtenant.name;
      return acc;
    }, {});
  }

  const items = rows.map((row) => ({
    id: row.id,
    tenantId: row.tenant_id,
    subtenantId: row.subtenant_id,
    subtenantName: row.subtenant_id ? subtenantNameById[row.subtenant_id] ?? null : null,
    sourceType: row.source_type,
    sourceId: row.source_id,
    amount: row.amount ?? 0,
    note: row.note,
    createdAt: row.created_at,
  }));

  const groups = Object.values(
    items.reduce<Record<string, { subtenantId: string | null; subtenantName: string | null; items: typeof items }>>(
      (acc, item) => {
        const key = item.subtenantId ?? "unassigned";
        if (!acc[key]) {
          acc[key] = { subtenantId: item.subtenantId, subtenantName: item.subtenantName, items: [] };
        }
        acc[key].items.push(item);
        return acc;
      },
      {},
    ),
  );

  return { items, groups };
}

export async function getIncidentsForTenant(currentUser: CurrentUser, tenantId: string) {
  if (!canAccessTenant(currentUser, tenantId)) {
    throw new Error("FORBIDDEN");
  }

  let incidentIds: number[] = [];
  const customerQuery = supabaseAdmin.from("incident_customers").select("incident_id").eq("tenant_id", tenantId);
  const { data: incidentRowsByCustomer, error: customerError } =
    currentUser.role === "subtenant_member"
      ? await customerQuery.eq("subtenant_id", currentUser.subtenantId ?? "")
      : await customerQuery;
  if (customerError) {
    throw customerError;
  }
  incidentIds = Array.from(new Set((incidentRowsByCustomer ?? []).map((row) => row.incident_id)));
  if (incidentIds.length === 0) {
    return [];
  }

  const { data: incidents, error: incidentsError } = await supabaseAdmin.from("incidents").select("*").in("id", incidentIds).order("occurred_at", { ascending: false });
  if (incidentsError) {
    throw incidentsError;
  }
  const { data: customers, error: incidentCustomersError } = await supabaseAdmin.from("incident_customers").select("*").in("incident_id", incidentIds);
  if (incidentCustomersError) {
    throw incidentCustomersError;
  }
  const customersByIncident = ((customers ?? []) as IncidentCustomerRow[]).reduce<Record<number, IncidentCustomerRow[]>>((acc, row) => {
    acc[row.incident_id] = [...(acc[row.incident_id] ?? []), row];
    return acc;
  }, {});

  return ((incidents ?? []) as IncidentRow[]).map((incident) => {
    const incidentType = incident.type ?? "incident";
    const durationMinutes = incident.duration_minutes ?? 0;
    const mappedCustomers = (customersByIncident[incident.id] ?? []).map((customer) => ({
      id: customer.id,
      tenantId: customer.tenant_id,
      subtenantId: customer.subtenant_id,
      gpuCount: customer.gpu_count ?? 0,
      creditAmount: calculateCreditAmount(incidentType, durationMinutes, customer.gpu_count ?? 0),
    }));

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
  });
}

export async function getNotices(type?: string) {
  let query = supabaseAdmin.from("notices").select("*");
  if (type && type !== "전체") {
    query = query.eq("type", type);
  }
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return (data ?? []) as NoticeRow[];
}

export async function getTickets(currentUser: CurrentUser, tenantId?: string, status?: string) {
  let query = supabaseAdmin.from("tickets").select("*");

  if (currentUser.role === "admin") {
    if (tenantId && tenantId !== "all") {
      query = query.eq("tenant_id", tenantId);
    }
  } else if (currentUser.role === "tenant_admin") {
    query = query.eq("tenant_id", currentUser.tenantId ?? "");
  } else {
    query = query.eq("author_id", currentUser.id);
  }

  if (status && status !== "전체") {
    query = query.eq("status", status);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return (data ?? []) as TicketRow[];
}
