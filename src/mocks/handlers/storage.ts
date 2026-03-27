import { HttpResponse, http } from "msw";
import { mockStorageMetrics } from "@/lib/mockMonitoringData";

export const storageHandlers = [
  http.get("/api/storage/tenants", () => {
    return HttpResponse.json(Object.values(mockStorageMetrics));
  }),

  http.get("/api/storage/metrics/:tenantId", ({ params }) => {
    const tenantId = String(params.tenantId);
    const metrics = mockStorageMetrics[tenantId];

    if (!metrics) {
      return HttpResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    return HttpResponse.json(metrics);
  }),
];
