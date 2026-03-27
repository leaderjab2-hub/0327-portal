import { NextResponse } from "next/server";
import { canAccessTenant, handleAuthError, requireCurrentUser } from "@/lib/auth";
import { getNodeById } from "@/lib/nodeAllocations";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function loadAllocation(id: string) {
  const { data, error } = await supabaseAdmin
    .from("node_allocations")
    .select("id, tenant_id, subtenant_id, node_id, allocated_at")
    .eq("id", Number(id))
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await requireCurrentUser();
    const { id } = await context.params;
    const allocation = await loadAllocation(id);
    const forceTenantDelete = new URL(request.url).searchParams.get("scope") === "tenant";

    if (!canAccessTenant(currentUser, allocation.tenant_id)) {
      throw new Error("FORBIDDEN");
    }

    if (forceTenantDelete) {
      if (currentUser.role !== "admin") {
        throw new Error("FORBIDDEN");
      }

      const { error } = await supabaseAdmin.from("node_allocations").delete().eq("id", allocation.id);

      if (error) {
        throw error;
      }

      return NextResponse.json({ success: true });
    }

    if (allocation.subtenant_id) {
      if (currentUser.role === "subtenant_member") {
        throw new Error("FORBIDDEN");
      }

      const { data, error } = await supabaseAdmin
        .from("node_allocations")
        .update({ subtenant_id: null })
        .eq("id", allocation.id)
        .select("id, tenant_id, subtenant_id, node_id, allocated_at")
        .single();

      if (error) {
        throw error;
      }

      return NextResponse.json({
        data: {
          ...data,
          node: getNodeById(data.node_id),
        },
      });
    }

    if (currentUser.role !== "admin") {
      throw new Error("FORBIDDEN");
    }

    const { error } = await supabaseAdmin.from("node_allocations").delete().eq("id", allocation.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAuthError(error);
  }
}
