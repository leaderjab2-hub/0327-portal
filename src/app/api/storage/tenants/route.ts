import { NextResponse } from "next/server";
import { handleAuthError, requireCurrentUser } from "@/lib/auth";
import { mockStorageMetrics } from "@/lib/mockMonitoringData";

export async function GET() {
  try {
    await requireCurrentUser();

    return NextResponse.json(
      Object.values(mockStorageMetrics).map((metric) => ({
        tenantId: metric.tenantId,
        usageTB: metric.usageTB,
        totalTB: metric.totalTB,
        usagePercent: metric.usagePercent,
      })),
    );
  } catch (error) {
    return handleAuthError(error);
  }
}
