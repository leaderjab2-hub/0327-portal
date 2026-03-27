import { NextResponse } from "next/server";
import { canAccessTenant, handleAuthError, requireCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Database } from "@/types/database";

type TicketRow = Database["public"]["Tables"]["tickets"]["Row"];
type TicketInsert = Database["public"]["Tables"]["tickets"]["Insert"];
type TicketNumberRow = { ticket_number?: string | null };

async function getNextTicketNumber() {
  const { data, error } = await supabaseAdmin
    .from("tickets")
    .select("ticket_number")
    .order("ticket_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  const currentValue = (data as TicketNumberRow | null)?.ticket_number?.match(/(\d+)$/)?.[1];
  const nextValue = (currentValue ? Number(currentValue) : 0) + 1;

  return `TKT-${String(nextValue).padStart(5, "0")}`;
}

export async function GET(request: Request) {
  try {
    const currentUser = await requireCurrentUser();
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const status = searchParams.get("status");

    let query = supabaseAdmin.from("tickets").select("*");

    if (currentUser.role === "admin") {
      if (tenantId && tenantId !== "all") {
        query = query.eq("tenant_id", tenantId);
      }
    } else if (currentUser.role === "tenant_admin") {
      const scopedTenantId = currentUser.tenantId ?? "";

      if (tenantId && tenantId !== "all" && tenantId !== scopedTenantId) {
        throw new Error("FORBIDDEN");
      }

      query = query.eq("tenant_id", scopedTenantId);
    } else {
      query = query.eq("author_id", currentUser.id);
    }

    if (status && status !== "전체") {
      query = query.eq("status", status);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ data: (data ?? []) as TicketRow[] });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await requireCurrentUser();
    const body = (await request.json()) as {
      type?: string;
      title?: string;
      content?: string;
      tenantId?: string;
    };

    if (!body.title?.trim() || !body.content?.trim()) {
      throw new Error("유형, 제목, 내용을 입력해 주세요.");
    }

    const scopedTenantId =
      currentUser.role === "admin" ? body.tenantId ?? null : currentUser.tenantId ?? null;

    if (!scopedTenantId) {
      throw new Error("tenantId가 필요합니다.");
    }

    if (currentUser.role !== "admin" && !canAccessTenant(currentUser, scopedTenantId)) {
      throw new Error("FORBIDDEN");
    }

    const payload: TicketInsert = {
      ticket_number: await getNextTicketNumber(),
      type: body.type?.trim() || "기술지원",
      title: body.title.trim(),
      content: body.content.trim(),
      status: "대기중",
      author_id: currentUser.id,
      author_name: currentUser.name ?? currentUser.email,
      tenant_id: scopedTenantId,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin.from("tickets").insert(payload as never).select("*").single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}
