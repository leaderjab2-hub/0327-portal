import { NextResponse } from "next/server";
import { canAccessTenant, handleAuthError, requireCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Database } from "@/types/database";

type TicketRow = Database["public"]["Tables"]["tickets"]["Row"];
type TicketCommentInsert = Database["public"]["Tables"]["ticket_comments"]["Insert"];

function parseTicketId(id: string) {
  const value = Number(id);

  if (!Number.isInteger(value)) {
    throw new Error("유효하지 않은 티켓 ID입니다.");
  }

  return value;
}

async function getAuthorizedTicket(ticketId: number) {
  const currentUser = await requireCurrentUser();
  const { data, error } = await supabaseAdmin
    .from("tickets")
    .select("*")
    .eq("id", ticketId)
    .single();

  if (error) {
    throw error;
  }

  const ticket = data as TicketRow;

  if (currentUser.role === "admin") {
    return { currentUser, ticket };
  }

  if (currentUser.role === "tenant_admin") {
    if (!canAccessTenant(currentUser, ticket.tenant_id)) {
      throw new Error("FORBIDDEN");
    }
    return { currentUser, ticket };
  }

  if (ticket.author_id !== currentUser.id) {
    throw new Error("FORBIDDEN");
  }

  return { currentUser, ticket };
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const ticketId = parseTicketId(id);
    await getAuthorizedTicket(ticketId);

    const { data, error } = await supabaseAdmin
      .from("ticket_comments")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at");

    if (error) {
      throw error;
    }

    return NextResponse.json({ data: data ?? [] });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const ticketId = parseTicketId(id);
    const { currentUser } = await getAuthorizedTicket(ticketId);
    const body = (await request.json()) as { content?: string };

    if (!body.content?.trim()) {
      throw new Error("댓글 내용을 입력해 주세요.");
    }

    const payload: TicketCommentInsert = {
      ticket_id: ticketId,
      author_id: currentUser.id,
      author_name: currentUser.name ?? currentUser.email,
      content: body.content.trim(),
    };

    const { data, error } = await supabaseAdmin
      .from("ticket_comments")
      .insert(payload)
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
