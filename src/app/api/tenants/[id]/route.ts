import { NextResponse } from "next/server";
import {
  canAccessTenant,
  handleAuthError,
  requireCurrentUser,
} from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Database } from "@/types/database";

type TenantUpdate = Database["public"]["Tables"]["tenants"]["Update"];

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await requireCurrentUser();
    const { id } = await context.params;

    if (!canAccessTenant(currentUser, id)) {
      throw new Error("FORBIDDEN");
    }

    const body = (await request.json()) as TenantUpdate;
    const { data, error } = await supabaseAdmin
      .from("tenants")
      .update(body as never)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ data });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await requireCurrentUser();
    const { id } = await context.params;

    if (!canAccessTenant(currentUser, id)) {
      throw new Error("FORBIDDEN");
    }

    const { error } = await supabaseAdmin.from("tenants").delete().eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAuthError(error);
  }
}
