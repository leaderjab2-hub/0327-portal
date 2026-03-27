import { NextResponse } from "next/server";
import {
  canAccessTenant,
  canManageSubtenant,
  handleAuthError,
  requireCurrentUser,
} from "@/lib/auth";
import { getNodeById } from "@/lib/nodeAllocations";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Database } from "@/types/database";

type NodeAllocationRow = Database["public"]["Tables"]["node_allocations"]["Row"];
type NodeAllocationInsert = Database["public"]["Tables"]["node_allocations"]["Insert"];

type CreateAllocationBody = {
  nodeId: string;
  tenantId: string;
  subtenantId?: string | null;
};

export async function GET(request: Request) {
  try {
    const currentUser = await requireCurrentUser();
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const subtenantId = searchParams.get("subtenantId");

    let query = supabaseAdmin.from("node_allocations").select("id, tenant_id, subtenant_id, node_id, allocated_at");

    if (tenantId) {
      if (!canAccessTenant(currentUser, tenantId)) {
        throw new Error("FORBIDDEN");
      }
      query = query.eq("tenant_id", tenantId);
    } else if (currentUser.role === "tenant_admin" || currentUser.role === "subtenant_member") {
      query = query.eq("tenant_id", currentUser.tenantId ?? "");
    }

    if (subtenantId && subtenantId !== "all") {
      if (!tenantId && currentUser.role === "subtenant_member" && currentUser.subtenantId !== subtenantId) {
        throw new Error("FORBIDDEN");
      }
      query = query.eq("subtenant_id", subtenantId);
    } else if (currentUser.role === "subtenant_member") {
      query = query.eq("subtenant_id", currentUser.subtenantId ?? "");
    }

    const { data, error } = await query.order("node_id");

    if (error) {
      throw error;
    }

    return NextResponse.json({
      data: ((data ?? []) as NodeAllocationRow[]).map((allocation) => ({
        ...allocation,
        node: getNodeById(allocation.node_id),
      })),
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await requireCurrentUser();
    const body = (await request.json()) as CreateAllocationBody;
    const tenantId = body.tenantId;
    const subtenantId = body.subtenantId ?? null;

    if (!body.nodeId || !tenantId) {
      throw new Error("nodeId와 tenantId가 필요합니다.");
    }

    if (subtenantId) {
      if (!canManageSubtenant(currentUser, tenantId, subtenantId)) {
        throw new Error("FORBIDDEN");
      }

      const { data: existingTenantPool, error: existingTenantPoolError } = await supabaseAdmin
        .from("node_allocations")
        .select("id, tenant_id, subtenant_id, node_id, allocated_at")
        .eq("tenant_id", tenantId)
        .eq("node_id", body.nodeId)
        .single();

      if (existingTenantPoolError) {
        throw new Error("Tenant Pool에 존재하지 않는 노드입니다.");
      }

      if (existingTenantPool.subtenant_id) {
        throw new Error("이미 Subtenant에 분배된 노드입니다.");
      }

      const { data, error } = await supabaseAdmin
        .from("node_allocations")
        .update({ subtenant_id: subtenantId })
        .eq("id", existingTenantPool.id)
        .select("id, tenant_id, subtenant_id, node_id, allocated_at")
        .single();

      if (error) {
        throw error;
      }

      return NextResponse.json({
        data: {
          ...(data as NodeAllocationRow),
          node: getNodeById((data as NodeAllocationRow).node_id),
        },
      });
    }

    if (currentUser.role !== "admin") {
      throw new Error("FORBIDDEN");
    }

    const { data: existingAllocation, error: existingAllocationError } = await supabaseAdmin
      .from("node_allocations")
      .select("id")
      .eq("node_id", body.nodeId)
      .maybeSingle();

    if (existingAllocationError) {
      throw existingAllocationError;
    }

    if (existingAllocation) {
      throw new Error("이미 할당된 노드입니다.");
    }

    const payload: NodeAllocationInsert = {
      node_id: body.nodeId,
      tenant_id: tenantId,
      subtenant_id: null,
    };

    const { data, error } = await supabaseAdmin
      .from("node_allocations")
      .insert(payload)
      .select("id, tenant_id, subtenant_id, node_id, allocated_at")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        data: {
          ...(data as NodeAllocationRow),
          node: getNodeById((data as NodeAllocationRow).node_id),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return handleAuthError(error);
  }
}
