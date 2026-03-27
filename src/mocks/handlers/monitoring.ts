import { HttpResponse, http } from "msw";
import { mockGpuNodes } from "@/lib/mockMonitoringData";

export const monitoringHandlers = [
  http.get("/api/monitoring/nodes", () => {
    return HttpResponse.json(mockGpuNodes);
  }),

  http.get("/api/monitoring/metrics/:nodeId", ({ params }) => {
    const nodeId = String(params.nodeId);
    const node = mockGpuNodes.find((entry) => entry.id === nodeId);

    if (!node) {
      return HttpResponse.json({ error: "Node not found" }, { status: 404 });
    }

    return HttpResponse.json(node);
  }),
];
