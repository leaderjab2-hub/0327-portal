import { NextResponse } from "next/server";
import { assertRole, handleAuthError, requireCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Database } from "@/types/database";

type TenantInsert = Database["public"]["Tables"]["tenants"]["Insert"];

export async function GET() {
  try {
    const currentUser = await requireCurrentUser();
    const query = supabaseAdmin.from("tenants").select("*").order("created_at", { ascending: false });

    if (currentUser.role !== "admin") {
      query.eq("id", currentUser.tenantId ?? "");
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ data });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await requireCurrentUser();
    assertRole(currentUser, ["admin"]);

    const body = (await request.json()) as TenantInsert;
    const { data, error } = await supabaseAdmin.from("tenants").insert(body).select("*").single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}
