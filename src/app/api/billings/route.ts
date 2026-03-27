import { NextResponse } from "next/server";
import { assertRole, canAccessTenant, handleAuthError, requireCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Database } from "@/types/database";

type BillingRow = Database["public"]["Tables"]["billings"]["Row"] & {
  credit_deduct?: number | null;
};
type BillingInsert = Database["public"]["Tables"]["billings"]["Insert"];
type CreditInsert = Database["public"]["Tables"]["credits"]["Insert"];

type CreateBillingBody = {
  tenantId: string;
  subtenantId: string;
  periodStart: string;
  periodEnd: string;
  gpuFee: number;
  cpuFee: number;
  storageFee: number;
  networkFee: number;
  creditDeduction: number;
  totalFee: number;
  invoiceUrl?: string | null;
  memo?: string | null;
};

function toBillingResponse(row: BillingRow) {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    subtenantId: row.subtenant_id,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    gpuFee: row.gpu_fee ?? 0,
    cpuFee: row.cpu_fee ?? 0,
    storageFee: row.storage_fee ?? 0,
    networkFee: row.network_fee ?? 0,
    creditDeduction: row.credit_deduction ?? row.credit_deduct ?? 0,
    totalFee: row.total_fee ?? 0,
    invoiceUrl: row.invoice_url,
    memo: row.memo,
    registeredAt: row.registered_at,
  };
}

export async function GET(request: Request) {
  try {
    const currentUser = await requireCurrentUser();
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const subtenantId = searchParams.get("subtenantId");

    if (!tenantId) {
      throw new Error("tenantId가 필요합니다.");
    }

    if (!canAccessTenant(currentUser, tenantId)) {
      throw new Error("FORBIDDEN");
    }

    let query = supabaseAdmin
      .from("billings")
      .select("*")
      .eq("tenant_id", tenantId);

    if (currentUser.role === "subtenant_member") {
      query = query.eq("subtenant_id", currentUser.subtenantId ?? "");
    } else if (subtenantId) {
      query = query.eq("subtenant_id", subtenantId);
    }

    const { data, error } = await query.order("registered_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      data: (data ?? []).map((row) => toBillingResponse(row as BillingRow)),
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await requireCurrentUser();
    assertRole(currentUser, ["admin"]);

    const body = (await request.json()) as CreateBillingBody;

    const payload: BillingInsert = {
      tenant_id: body.tenantId,
      subtenant_id: body.subtenantId,
      period_start: body.periodStart,
      period_end: body.periodEnd,
      gpu_fee: body.gpuFee,
      cpu_fee: body.cpuFee,
      storage_fee: body.storageFee,
      network_fee: body.networkFee,
      credit_deduction: body.creditDeduction,
      total_fee: body.totalFee,
      invoice_url: body.invoiceUrl ?? null,
      memo: body.memo ?? null,
    };

    const { data, error } = await supabaseAdmin
      .from("billings")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    if (body.creditDeduction > 0) {
      const periodLabel = body.periodStart.slice(0, 7);
      const creditPayload: CreditInsert = {
        tenant_id: body.tenantId,
        subtenant_id: body.subtenantId,
        source_type: "billing_deduction",
        source_id: (data as BillingRow).id,
        amount: -Math.abs(body.creditDeduction),
        note: `빌링 ${periodLabel} 크레딧 차감`,
      };

      const { error: creditError } = await supabaseAdmin.from("credits").insert(creditPayload);

      if (creditError) {
        throw creditError;
      }
    }

    return NextResponse.json({ data: toBillingResponse(data as BillingRow) }, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}
