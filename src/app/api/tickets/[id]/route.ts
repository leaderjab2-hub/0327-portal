import { NextResponse } from "next/server";
import { assertRole, handleAuthError, requireCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Database } from "@/types/database";

type TicketUpdate = Database["public"]["Tables"]["tickets"]["Update"];

function parseTicketId(id: string) {
  const value = Number(id);

  if (!Number.isInteger(value)) {
    throw new Error("유효하지 않은 티켓 ID입니다.");
  }

  return value;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await requireCurrentUser();
    assertRole(currentUser, ["admin"]);

    const { id } = await params;
    const ticketId = parseTicketId(id);
    const body = (await request.json()) as { status?: string };

    if (!body.status?.trim()) {
      throw new Error("상태값이 필요합니다.");
    }

    const payload: TicketUpdate = {
      status: body.status.trim(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("tickets")
      .update(payload as never)
      .eq("id", ticketId)
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
