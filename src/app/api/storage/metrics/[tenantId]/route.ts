import { NextResponse } from "next/server";
import { handleAuthError, requireCurrentUser } from "@/lib/auth";
import { mockStorageMetrics } from "@/lib/mockMonitoringData";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tenantId: string }> },
) {
  try {
    await requireCurrentUser();
    const { tenantId } = await params;
    const metrics = mockStorageMetrics[tenantId];

    if (!metrics) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    return NextResponse.json({
      capacity: metrics.capacity,
      bw: metrics.bw,
      iops: metrics.iops,
      latency: metrics.latency,
    });
  } catch (error) {
    return handleAuthError(error);
  }
}
