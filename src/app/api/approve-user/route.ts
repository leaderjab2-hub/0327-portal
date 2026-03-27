import { NextResponse } from "next/server";
import {
  assertRole,
  canAccessTenant,
  getAuthUserById,
  handleAuthError,
  requireCurrentUser,
} from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { MemberRole, UserRole } from "@/types/auth";

type ApproveUserBody = {
  userId: string;
  role: Exclude<UserRole, "pending">;
  tenantId?: string | null;
  subtenantId?: string | null;
  name?: string | null;
  memberRole?: MemberRole;
};

export async function POST(request: Request) {
  try {
    const currentUser = await requireCurrentUser();
    assertRole(currentUser, ["admin", "tenant_admin"]);

    const body = (await request.json()) as ApproveUserBody;

    if (currentUser.role === "tenant_admin" && !canAccessTenant(currentUser, body.tenantId)) {
      throw new Error("FORBIDDEN");
    }

    if (currentUser.role === "tenant_admin" && body.role === "admin") {
      throw new Error("FORBIDDEN");
    }

    const authUser = await getAuthUserById(body.userId);
    const nextMetadata = {
      ...(authUser.user_metadata ?? {}),
      role: body.role,
      tenantId: body.tenantId ?? null,
      subtenantId: body.subtenantId ?? null,
      name: body.name ?? authUser.user_metadata?.name ?? null,
      memberRole: body.memberRole ?? null,
    };

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(body.userId, {
      user_metadata: nextMetadata,
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ data });
  } catch (error) {
    return handleAuthError(error);
  }
}
