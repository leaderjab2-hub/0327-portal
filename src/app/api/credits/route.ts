import { NextResponse } from "next/server";
import { canAccessTenant, handleAuthError, requireCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Database } from "@/types/database";

type CreditRow = Database["public"]["Tables"]["credits"]["Row"];
type SubtenantRow = Database["public"]["Tables"]["subtenants"]["Row"];

type CreditResponse = {
  id: number;
  tenantId: string | null;
  subtenantId: string | null;
  subtenantName: string | null;
  sourceType: string | null;
  sourceId: number | null;
  amount: number;
  note: string | null;
  createdAt: string | null;
};

export async function GET(request: Request) {
  try {
    const currentUser = await requireCurrentUser();
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");

    if (!tenantId) {
      throw new Error("tenantId가 필요합니다.");
    }

    if (!canAccessTenant(currentUser, tenantId)) {
      throw new Error("FORBIDDEN");
    }

    let query = supabaseAdmin.from("credits").select("*").eq("tenant_id", tenantId);

    if (currentUser.role === "subtenant_member") {
      query = query.eq("subtenant_id", currentUser.subtenantId ?? "");
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const creditRows = (data ?? []) as CreditRow[];
    const subtenantIds = Array.from(
      new Set(creditRows.map((row) => row.subtenant_id).filter((value): value is string => Boolean(value))),
    );

    let subtenantNameById: Record<string, string> = {};

    if (subtenantIds.length > 0) {
      const { data: subtenants, error: subtenantsError } = await supabaseAdmin
        .from("subtenants")
        .select("id, name")
        .in("id", subtenantIds);

      if (subtenantsError) {
        throw subtenantsError;
      }

      subtenantNameById = ((subtenants ?? []) as Pick<SubtenantRow, "id" | "name">[]).reduce<Record<string, string>>(
        (acc, subtenant) => {
          acc[subtenant.id] = subtenant.name;
          return acc;
        },
        {},
      );
    }

    const items: CreditResponse[] = creditRows.map((row) => ({
      id: row.id,
      tenantId: row.tenant_id,
      subtenantId: row.subtenant_id,
      subtenantName: row.subtenant_id ? subtenantNameById[row.subtenant_id] ?? null : null,
      sourceType: row.source_type,
      sourceId: row.source_id,
      amount: row.amount ?? 0,
      note: row.note,
      createdAt: row.created_at,
    }));

    const summary = {
      balance: items.reduce((sum, item) => sum + item.amount, 0),
      generated: items.filter((item) => item.amount > 0).reduce((sum, item) => sum + item.amount, 0),
      deducted: items.filter((item) => item.amount < 0).reduce((sum, item) => sum + item.amount, 0),
    };

    const grouped = items.reduce<Record<string, { subtenantId: string | null; subtenantName: string | null; items: CreditResponse[] }>>(
      (acc, item) => {
        const key = item.subtenantId ?? "unassigned";

        if (!acc[key]) {
          acc[key] = {
            subtenantId: item.subtenantId,
            subtenantName: item.subtenantName,
            items: [],
          };
        }

        acc[key].items.push(item);
        return acc;
      },
      {},
    );

    return NextResponse.json({
      data: {
        items,
        groups: Object.values(grouped),
        summary,
      },
    });
  } catch (error) {
    return handleAuthError(error);
  }
}
