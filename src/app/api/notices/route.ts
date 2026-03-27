import { NextResponse } from "next/server";
import { assertRole, handleAuthError, requireCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Database } from "@/types/database";

type NoticeInsert = Database["public"]["Tables"]["notices"]["Insert"];

export async function GET(request: Request) {
  try {
    await requireCurrentUser();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    let query = supabaseAdmin.from("notices").select("*");

    if (type && type !== "전체") {
      query = query.eq("type", type);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ data: data ?? [] });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await requireCurrentUser();
    assertRole(currentUser, ["admin"]);

    const body = (await request.json()) as {
      type?: string;
      title?: string;
      content?: string;
    };

    if (!body.title?.trim() || !body.content?.trim()) {
      throw new Error("유형, 제목, 내용을 입력해 주세요.");
    }

    const payload: NoticeInsert = {
      type: body.type?.trim() || "일반",
      title: body.title.trim(),
      content: body.content.trim(),
      author_id: currentUser.id,
      author_name: currentUser.name ?? currentUser.email,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin.from("notices").insert(payload).select("*").single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}
