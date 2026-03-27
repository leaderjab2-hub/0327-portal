import { HttpResponse, http } from "msw";
import { mockNetworkMetrics } from "@/lib/mockMonitoringData";

export const networkHandlers = [
  http.get("/api/network/metrics/:tenantId", ({ params }) => {
    const tenantId = String(params.tenantId);
    const metrics = mockNetworkMetrics[tenantId];

    if (!metrics) {
      return HttpResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    return HttpResponse.json(metrics);
  }),
];
