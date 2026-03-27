import { NextResponse } from "next/server";
import {
  assertRole,
  canAccessTenant,
  handleAuthError,
  requireCurrentUser,
} from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { MemberRole } from "@/types/auth";

type InviteUserBody = {
  email: string;
  role: "tenant_admin" | "subtenant_member";
  tenantId: string;
  subtenantId?: string | null;
  memberRole?: MemberRole;
};

export async function POST(request: Request) {
  try {
    const currentUser = await requireCurrentUser();
    assertRole(currentUser, ["admin", "tenant_admin"]);

    const body = (await request.json()) as InviteUserBody;

    if (!body.email?.trim()) {
      throw new Error("이메일을 입력해 주세요.");
    }

    if (!body.tenantId) {
      throw new Error("tenantId가 필요합니다.");
    }

    if (currentUser.role === "tenant_admin" && !canAccessTenant(currentUser, body.tenantId)) {
      throw new Error("FORBIDDEN");
    }

    if (currentUser.role === "tenant_admin" && body.role === "tenant_admin") {
      throw new Error("FORBIDDEN");
    }

    if (body.role === "subtenant_member") {
      if (!body.subtenantId) {
        throw new Error("subtenantId가 필요합니다.");
      }

      if (body.memberRole !== "pm" && body.memberRole !== "member") {
        throw new Error("memberRole은 pm 또는 member여야 합니다.");
      }
    }

    if (body.role === "tenant_admin") {
      body.subtenantId = null;
      body.memberRole = null;
    }

    const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/signup`;
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(body.email, {
      data: {
        role: body.role,
        tenantId: body.tenantId,
        subtenantId: body.subtenantId ?? null,
        memberRole: body.memberRole ?? null,
      },
      redirectTo,
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}
