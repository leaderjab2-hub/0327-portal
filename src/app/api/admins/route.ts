import { NextResponse } from "next/server";
import { assertRole, handleAuthError, requireCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type AdminRecord = {
  id: string;
  email: string | null;
  name: string | null;
  adminRole: string | null;
  created_at: string | null;
  last_sign_in_at: string | null;
};

export async function GET() {
  try {
    const currentUser = await requireCurrentUser();
    assertRole(currentUser, ["admin"]);

    const { data, error } = await supabaseAdmin
      .from("user_profiles")
      .select("*")
      .eq("role", "admin");

    if (error) {
      throw error;
    }

    const admins: AdminRecord[] = ((data ?? []) as Array<Record<string, unknown>>).map((user) => ({
      id: typeof user.id === "string" ? user.id : "",
      email: typeof user.email === "string" ? user.email : null,
      name: typeof user.name === "string" ? user.name : null,
      adminRole:
        typeof user.admin_role === "string"
          ? user.admin_role
          : typeof user.adminRole === "string"
            ? user.adminRole
            : "관리자",
      created_at:
        typeof user.created_at === "string"
          ? user.created_at
          : typeof user.createdAt === "string"
            ? user.createdAt
            : null,
      last_sign_in_at:
        typeof user.last_sign_in_at === "string"
          ? user.last_sign_in_at
          : typeof user.lastSignIn === "string"
            ? user.lastSignIn
            : null,
    }));

    admins.sort((a, b) => {
      return new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime();
    });

    return NextResponse.json({ data: admins });
  } catch (error) {
    return handleAuthError(error);
  }
}
