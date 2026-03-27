import { NextResponse } from "next/server";
import { assertRole, handleAuthError, requireCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type TenantNameRow = {
  name?: string | null;
};

type PendingUserRecord = {
  id: string;
  email: string | null;
  name: string | null;
  tenantName: string | null;
  createdAt: string | null;
};

function toPendingUserRecord(user: {
  id: string;
  email?: string | null;
  created_at?: string | null;
  user_metadata?: Record<string, unknown>;
}): PendingUserRecord {
  const metadata = user.user_metadata ?? {};

  return {
    id: user.id,
    email: user.email ?? null,
    name: typeof metadata.name === "string" ? metadata.name : null,
    tenantName: typeof metadata.tenantName === "string" ? metadata.tenantName : null,
    createdAt: user.created_at ?? null,
  };
}

export async function GET() {
  try {
    const currentUser = await requireCurrentUser();
    assertRole(currentUser, ["admin", "tenant_admin"]);

    const { data: tenantData, error: tenantError } =
      currentUser.role === "tenant_admin" && currentUser.tenantId
        ? await supabaseAdmin
            .from("tenants")
            .select("name")
            .eq("id", currentUser.tenantId)
            .single()
        : { data: null, error: null };

    if (tenantError) {
      throw tenantError;
    }

    const companyName = (tenantData as TenantNameRow | null)?.name ?? null;
    const pendingUsers: PendingUserRecord[] = [];
    let page = 1;
    const perPage = 200;

    while (true) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage,
      });

      if (error) {
        throw error;
      }

      const users = data.users ?? [];

      const filtered = users
        .filter((user) => {
          const role = user.user_metadata?.role;
          const tenantName = user.user_metadata?.tenantName;

          if (role !== "pending") {
            return false;
          }

          if (currentUser.role === "tenant_admin") {
            return typeof tenantName === "string" && tenantName === companyName;
          }

          return true;
        })
        .map(toPendingUserRecord);

      pendingUsers.push(...filtered);

      if (users.length < perPage) {
        break;
      }

      page += 1;
    }

    pendingUsers.sort((a, b) => {
      return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
    });

    return NextResponse.json({ data: pendingUsers });
  } catch (error) {
    return handleAuthError(error);
  }
}
