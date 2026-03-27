import { NextResponse } from "next/server";
import { canManageSubtenant, handleAuthError, requireCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { MemberRole, UserRole } from "@/types/auth";

type MemberRecord = {
  id: string;
  email: string | null;
  name: string | null;
  role: UserRole | null;
  tenantId: string | null;
  subtenantId: string | null;
  memberRole: MemberRole;
  lastSignIn: string | null;
};

type UserProfileRow = {
  id: string;
  email?: string | null;
  name?: string | null;
  role?: string | null;
  tenant_id?: string | null;
  tenantId?: string | null;
  subtenant_id?: string | null;
  subtenantId?: string | null;
  member_role?: string | null;
  memberRole?: string | null;
  last_sign_in_at?: string | null;
  lastSignIn?: string | null;
};

function toMemberRecord(user: UserProfileRow): MemberRecord {
  return {
    id: user.id,
    email: user.email ?? null,
    name: user.name ?? null,
    role: (typeof user.role === "string" ? user.role : null) as UserRole | null,
    tenantId: user.tenant_id ?? user.tenantId ?? null,
    subtenantId: user.subtenant_id ?? user.subtenantId ?? null,
    memberRole:
      user.member_role === "pm" || user.member_role === "member"
        ? user.member_role
        : user.memberRole === "pm" || user.memberRole === "member"
          ? user.memberRole
          : null,
    lastSignIn: user.last_sign_in_at ?? user.lastSignIn ?? null,
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

    if (!canManageSubtenant(currentUser, tenantId, subtenantId)) {
      throw new Error("FORBIDDEN");
    }

    let query = supabaseAdmin
      .from("user_profiles")
      .select("*")
      .eq("tenant_id", tenantId)
      .neq("role", "pending")
      .neq("role", "admin");

    if (subtenantId) {
      query = query.eq("subtenant_id", subtenantId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const members = (data ?? []).map((user) => toMemberRecord(user as UserProfileRow));

    return NextResponse.json({ data: members });
  } catch (error) {
    return handleAuthError(error);
  }
}
