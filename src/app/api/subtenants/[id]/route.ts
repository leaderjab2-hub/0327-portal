import { NextResponse } from "next/server";
import {
  canManageSubtenant,
  handleAuthError,
  requireCurrentUser,
} from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Database } from "@/types/database";

type SubtenantRow = Database["public"]["Tables"]["subtenants"]["Row"];
type SubtenantUpdate = Database["public"]["Tables"]["subtenants"]["Update"];

async function loadSubtenant(id: string) {
  const { data, error } = await supabaseAdmin
    .from("subtenants")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data as SubtenantRow;
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await requireCurrentUser();
    const { id } = await context.params;
    const existing = await loadSubtenant(id);

    if (!canManageSubtenant(currentUser, existing.tenant_id, existing.id)) {
      throw new Error("FORBIDDEN");
    }

    if (currentUser.role === "subtenant_member") {
      throw new Error("FORBIDDEN");
    }

    const body = (await request.json()) as SubtenantUpdate;
    const { data, error } = await supabaseAdmin
      .from("subtenants")
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
    const existing = await loadSubtenant(id);

    if (!canManageSubtenant(currentUser, existing.tenant_id, existing.id)) {
      throw new Error("FORBIDDEN");
    }

    if (currentUser.role === "subtenant_member") {
      throw new Error("FORBIDDEN");
    }

    const { error } = await supabaseAdmin.from("subtenants").delete().eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAuthError(error);
  }
}
