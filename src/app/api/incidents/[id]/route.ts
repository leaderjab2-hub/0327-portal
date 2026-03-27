import { NextResponse } from "next/server";
import { assertRole, handleAuthError, requireCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function parseIncidentId(id: string) {
  const value = Number(id);

  if (!Number.isInteger(value)) {
    throw new Error("유효하지 않은 장애 ID입니다.");
  }

  return value;
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await requireCurrentUser();
    assertRole(currentUser, ["admin"]);

    const { id } = await params;
    const incidentId = parseIncidentId(id);

    const { error: creditError } = await supabaseAdmin
      .from("credits")
      .delete()
      .eq("source_id", incidentId)
      .in("source_type", ["incident", "urgent_pm", "regular_pm"]);

    if (creditError) {
      throw creditError;
    }

    const { error: customerError } = await supabaseAdmin
      .from("incident_customers")
      .delete()
      .eq("incident_id", incidentId);

    if (customerError) {
      throw customerError;
    }

    const { error: incidentError } = await supabaseAdmin.from("incidents").delete().eq("id", incidentId);

    if (incidentError) {
      throw incidentError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAuthError(error);
  }
}
