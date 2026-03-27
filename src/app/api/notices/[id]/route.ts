import { NextResponse } from "next/server";
import { assertRole, handleAuthError, requireCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Database } from "@/types/database";

type NoticeUpdate = Database["public"]["Tables"]["notices"]["Update"];

function parseNoticeId(id: string) {
  const value = Number(id);

  if (!Number.isInteger(value)) {
    throw new Error("유효하지 않은 공지사항 ID입니다.");
  }

  return value;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await requireCurrentUser();
    assertRole(currentUser, ["admin"]);

    const { id } = await params;
    const noticeId = parseNoticeId(id);
    const body = (await request.json()) as {
      type?: string;
      title?: string;
      content?: string;
    };

    if (!body.title?.trim() || !body.content?.trim()) {
      throw new Error("유형, 제목, 내용을 입력해 주세요.");
    }

    const payload: NoticeUpdate = {
      type: body.type?.trim() || "일반",
      title: body.title.trim(),
      content: body.content.trim(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("notices")
      .update(payload)
      .eq("id", noticeId)
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

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await requireCurrentUser();
    assertRole(currentUser, ["admin"]);

    const { id } = await params;
    const noticeId = parseNoticeId(id);

    const { error } = await supabaseAdmin.from("notices").delete().eq("id", noticeId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAuthError(error);
  }
}
