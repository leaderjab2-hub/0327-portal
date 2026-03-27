import { NextResponse } from "next/server";
import {
  canManageSubtenant,
  getAuthUserById,
  handleAuthError,
  requireCurrentUser,
} from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { MemberRole, UserMetadata, UserRole } from "@/types/auth";

type UpdateMemberRoleBody = {
  userId: string;
  memberRole: Exclude<MemberRole, null>;
};

export async function POST(request: Request) {
  try {
    const currentUser = await requireCurrentUser();
    const body = (await request.json()) as UpdateMemberRoleBody;

    if (!body.userId) {
      throw new Error("userId가 필요합니다.");
    }

    if (body.memberRole !== "pm" && body.memberRole !== "member") {
      throw new Error("memberRole은 pm 또는 member여야 합니다.");
    }

    const authUser = await getAuthUserById(body.userId);
    const metadata = (authUser.user_metadata ?? {}) as UserMetadata;
    const targetRole = metadata.role as UserRole | undefined;
    const targetTenantId = metadata.tenantId ?? metadata.tenant_id ?? null;
    const targetSubtenantId = metadata.subtenantId ?? metadata.subtenant_id ?? null;

    if (targetRole !== "subtenant_member") {
      throw new Error("구성원 역할만 변경할 수 있습니다.");
    }

    if (!canManageSubtenant(currentUser, targetTenantId, targetSubtenantId)) {
      throw new Error("FORBIDDEN");
    }

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(body.userId, {
      user_metadata: {
        ...metadata,
        memberRole: body.memberRole,
      },
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ data });
  } catch (error) {
    return handleAuthError(error);
  }
}
