import { NextResponse } from "next/server";
import { assertRole, handleAuthError, requireCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Database } from "@/types/database";

type SubtenantRow = Database["public"]["Tables"]["subtenants"]["Row"];
type SubtenantInsert = Database["public"]["Tables"]["subtenants"]["Insert"];
type UserProfileCountRow = {
  subtenant_id?: string | null;
};

export async function GET(request: Request) {
  try {
    const currentUser = await requireCurrentUser();
    const tenantIdFilter = new URL(request.url).searchParams.get("tenantId");
    let query = supabaseAdmin.from("subtenants").select("*");

    if (currentUser.role === "admin" && tenantIdFilter) {
      query = query.eq("tenant_id", tenantIdFilter);
    }

    if (currentUser.role === "tenant_admin") {
      const scopedTenantId = currentUser.tenantId ?? "";

      if (tenantIdFilter && tenantIdFilter !== scopedTenantId) {
        throw new Error("FORBIDDEN");
      }

      query = query.eq("tenant_id", scopedTenantId);
    }

    if (currentUser.role === "subtenant_member") {
      query = query
        .eq("tenant_id", currentUser.tenantId ?? "")
        .eq("id", currentUser.subtenantId ?? "");
    }

    const { data, error } = await query.order("name");

    if (error) {
      throw error;
    }

    const subtenants = (data ?? []) as SubtenantRow[];
    const subtenantIds = subtenants.map((subtenant) => subtenant.id);

    if (subtenantIds.length === 0) {
      return NextResponse.json({ data: subtenants });
    }

    const { data: memberRows, error: memberError } = await supabaseAdmin
      .from("user_profiles")
      .select("subtenant_id")
      .in("subtenant_id", subtenantIds)
      .neq("role", "pending");

    if (memberError) {
      throw memberError;
    }

    const memberCountBySubtenantId = (memberRows ?? []).reduce<Record<string, number>>((acc, row) => {
      const subtenantId = (row as UserProfileCountRow).subtenant_id;

      if (subtenantId) {
        acc[subtenantId] = (acc[subtenantId] ?? 0) + 1;
      }

      return acc;
    }, {});

    const hydratedSubtenants = subtenants.map((subtenant) => ({
      ...subtenant,
      member_count: memberCountBySubtenantId[subtenant.id] ?? 0,
    }));

    return NextResponse.json({ data: hydratedSubtenants });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await requireCurrentUser();
    assertRole(currentUser, ["admin", "tenant_admin"]);

    const body = (await request.json()) as SubtenantInsert;

    if (currentUser.role === "tenant_admin" && currentUser.tenantId !== body.tenant_id) {
      throw new Error("FORBIDDEN");
    }

    const { data, error } = await supabaseAdmin
      .from("subtenants")
      .insert(body as never)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}
