import { NextResponse } from "next/server";
import { canManageSubtenant, handleAuthError, requireCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  try {
    const currentUser = await requireCurrentUser();
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const subtenantId = searchParams.get("subtenantId");

    if (!subtenantId) {
      throw new Error("subtenantId가 필요합니다.");
    }

    const scopedTenantId = tenantId ?? currentUser.tenantId ?? null;

    if (!scopedTenantId || !canManageSubtenant(currentUser, scopedTenantId, subtenantId)) {
      throw new Error("FORBIDDEN");
    }

    const { data, error } = await supabaseAdmin
      .from("credits")
      .select("amount")
      .eq("subtenant_id", subtenantId);

    if (error) {
      throw error;
    }

    const balance = (data ?? []).reduce((sum, row) => sum + (row.amount ?? 0), 0);

    return NextResponse.json({
      data: {
        balance,
      },
    });
  } catch (error) {
    return handleAuthError(error);
  }
}
