import { NextResponse } from "next/server";
import { assertRole, handleAuthError, requireCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await requireCurrentUser();
    assertRole(currentUser, ["admin"]);
    const { id } = await context.params;

    const { error } = await supabaseAdmin.from("billings").delete().eq("id", Number(id));

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAuthError(error);
  }
}
