import { NextResponse } from "next/server";
import { requireCurrentUser, handleAuthError } from "@/lib/auth";
import { mockGpuNodes } from "@/lib/mockMonitoringData";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ nodeId: string }> },
) {
  try {
    await requireCurrentUser();
    const { nodeId } = await params;
    const node = mockGpuNodes.find((entry) => entry.id === nodeId);

    if (!node) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 });
    }

    return NextResponse.json(node);
  } catch (error) {
    return handleAuthError(error);
  }
}
