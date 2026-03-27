import { NextResponse } from "next/server";
import {
  assertRole,
  canAccessTenant,
  getAuthUserById,
  handleAuthError,
  requireCurrentUser,
} from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type TenantNameRow = {
  name?: string | null;
};

export async function POST(request: Request) {
  try {
    const currentUser = await requireCurrentUser();
    assertRole(currentUser, ["admin", "tenant_admin"]);

    const body = (await request.json()) as { userId: string };
    const authUser = await getAuthUserById(body.userId);
    const metadata = authUser.user_metadata as {
      tenantId?: string | null;
      tenant_id?: string | null;
      tenantName?: string | null;
    };
    const targetTenantId = metadata?.tenantId ?? metadata?.tenant_id ?? null;
    const targetTenantName = metadata?.tenantName ?? null;

    if (currentUser.role === "tenant_admin") {
      const { data: tenantData, error: tenantError } = await supabaseAdmin
        .from("tenants")
        .select("name")
        .eq("id", currentUser.tenantId ?? "")
        .single();

      if (tenantError) {
        throw tenantError;
      }

      const matchesTenantId = canAccessTenant(currentUser, targetTenantId);
      const tenant = tenantData as TenantNameRow | null;
      const matchesTenantName = tenant?.name && targetTenantName === tenant.name;

      if (!matchesTenantId && !matchesTenantName) {
        throw new Error("FORBIDDEN");
      }
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(body.userId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAuthError(error);
  }
}
