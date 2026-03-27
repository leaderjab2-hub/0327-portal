import { NextResponse } from "next/server";
import { canAccessTenant, handleAuthError, requireCurrentUser } from "@/lib/auth";
import { mockNetworkMetrics, mockStorageMetrics } from "@/lib/mockMonitoringData";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { Json } from "@/types/database";

type TenantRow = {
  id: string;
  name: string;
  contract: Json | null;
};

type SubtenantRow = {
  id: string;
  tenant_id: string | null;
  name: string;
};

type AllocationRow = {
  id: number;
  tenant_id: string | null;
  subtenant_id: string | null;
  node_id: string;
};

function readContractQuantity(contract: Json | null, key: "gpu" | "cpu") {
  if (!contract || Array.isArray(contract) || typeof contract !== "object") {
    return 0;
  }

  const section = contract[key];

  if (!section || Array.isArray(section) || typeof section !== "object") {
    return 0;
  }

  const quantity = section.quantity;
  return typeof quantity === "number" ? quantity : 0;
}

function scaleSeries(points: { timestamp: string; value: number }[], ratio: number) {
  return points.map((point) => ({
    timestamp: point.timestamp,
    value: Math.round(point.value * ratio),
  }));
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ tenantId: string }> },
) {
  try {
    const currentUser = await requireCurrentUser();
    const { tenantId } = await context.params;

    if (!canAccessTenant(currentUser, tenantId)) {
      throw new Error("FORBIDDEN");
    }

    const [{ data: tenant, error: tenantError }, { data: subtenants, error: subtenantError }, { data: allocations, error: allocationError }] =
      await Promise.all([
        supabaseAdmin.from("tenants").select("id, name, contract").eq("id", tenantId).single(),
        supabaseAdmin.from("subtenants").select("id, tenant_id, name").eq("tenant_id", tenantId).order("name"),
        supabaseAdmin
          .from("node_allocations")
          .select("id, tenant_id, subtenant_id, node_id")
          .eq("tenant_id", tenantId)
          .order("node_id"),
      ]);

    if (tenantError) {
      throw tenantError;
    }

    if (subtenantError) {
      throw subtenantError;
    }

    if (allocationError) {
      throw allocationError;
    }

    const tenantRow = tenant as TenantRow;
    const subtenantRows = (subtenants ?? []) as SubtenantRow[];
    const allocationRows = (allocations ?? []) as AllocationRow[];
    const contractedGpu = readContractQuantity(tenantRow.contract, "gpu");
    const contractedCpu = readContractQuantity(tenantRow.contract, "cpu");
    const storageMetric = mockStorageMetrics[tenantId];
    const networkMetric = mockNetworkMetrics[tenantId];
    const tenantAllocatedNodes = allocationRows.filter((allocation) => allocation.subtenant_id);
    const allocatedGpuTotal = tenantAllocatedNodes.length;

    const visibleSubtenants =
      currentUser.role === "subtenant_member"
        ? subtenantRows.filter((subtenant) => subtenant.id === currentUser.subtenantId)
        : subtenantRows;

    const data = {
      tenantId: tenantRow.id,
      tenantName: tenantRow.name,
      period: "2026.03",
      fixed: {
        gpu: { contracted: contractedGpu, unit: "대" },
        cpu: { contracted: contractedCpu, unit: "Core" },
      },
      variable: {
        storage: {
          usage: storageMetric?.usageTB ?? 0,
          unit: "TB",
          series: storageMetric?.capacity ?? [],
        },
        networkOutbound: {
          usage: networkMetric?.currentOutboundGB ?? 0,
          unit: "GB",
          series: networkMetric?.outbound ?? [],
        },
        networkInbound: {
          usage: networkMetric?.currentInboundGB ?? 0,
          unit: "GB",
          series: networkMetric?.inbound ?? [],
        },
      },
      subtenants: visibleSubtenants.map((subtenant) => {
        const allocated = allocationRows.filter((allocation) => allocation.subtenant_id === subtenant.id).length;
        const gpuRatio = contractedGpu > 0 ? allocated / contractedGpu : 0;
        const allocatedCpu = Math.round(contractedCpu * gpuRatio);
        const usageRatio = allocatedGpuTotal > 0 ? allocated / allocatedGpuTotal : 0;

        return {
          subtenantId: subtenant.id,
          name: subtenant.name,
          fixed: {
            gpu: { allocated, contracted: allocated },
            cpu: {
              allocated: allocatedCpu,
              contracted: allocatedCpu,
            },
          },
          variable: {
            storage: {
              usage: Math.round((storageMetric?.usageTB ?? 0) * usageRatio),
              unit: "TB",
              series: scaleSeries(storageMetric?.capacity ?? [], usageRatio),
            },
            networkOutbound: {
              usage: Math.round((networkMetric?.currentOutboundGB ?? 0) * usageRatio),
              unit: "GB",
              series: scaleSeries(networkMetric?.outbound ?? [], usageRatio),
            },
            networkInbound: {
              usage: Math.round((networkMetric?.currentInboundGB ?? 0) * usageRatio),
              unit: "GB",
              series: scaleSeries(networkMetric?.inbound ?? [], usageRatio),
            },
          },
        };
      }),
    };

    return NextResponse.json({ data });
  } catch (error) {
    return handleAuthError(error);
  }
}
