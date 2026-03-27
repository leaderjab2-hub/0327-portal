import { NextResponse } from "next/server";
import { canAccessTenant, handleAuthError, requireCurrentUser } from "@/lib/auth";
import { compareNodeIds, getNodeById } from "@/lib/nodeAllocations";
import { mockGpuNodes } from "@/lib/mockMonitoringData";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  try {
    const currentUser = await requireCurrentUser();
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");

    if (tenantId) {
      if (!canAccessTenant(currentUser, tenantId)) {
        throw new Error("FORBIDDEN");
      }

      const { data, error } = await supabaseAdmin
        .from("node_allocations")
        .select("id, tenant_id, subtenant_id, node_id, allocated_at")
        .eq("tenant_id", tenantId)
        .is("subtenant_id", null)
        .order("node_id");

      if (error) {
        throw error;
      }

      return NextResponse.json({
        data: (data ?? []).map((allocation) => ({
          ...allocation,
          node: getNodeById(allocation.node_id),
        })),
      });
    }

    if (currentUser.role !== "admin") {
      throw new Error("FORBIDDEN");
    }

    const { data, error } = await supabaseAdmin.from("node_allocations").select("node_id");

    if (error) {
      throw error;
    }

    const allocatedNodeIds = new Set((data ?? []).map((row) => row.node_id));
    const availableNodes = mockGpuNodes
      .filter((node) => !allocatedNodeIds.has(node.id))
      .sort((left, right) => compareNodeIds(left.id, right.id));

    return NextResponse.json({ data: availableNodes });
  } catch (error) {
    return handleAuthError(error);
  }
}
