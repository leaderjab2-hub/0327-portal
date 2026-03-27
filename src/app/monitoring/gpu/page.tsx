"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, MoreVertical, RotateCcw } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { tenants } from "@/lib/mockData";
import { mockGpuNodes } from "@/lib/mockMonitoringData";

type MonitoringNode = {
  id: string;
  name: string;
  tenantId: string | null;
  subtenantId: string | null;
  status: "ok" | "warn" | "err";
};

type NodeAllocationRecord = {
  id: number;
  tenant_id: string | null;
  subtenant_id: string | null;
  node_id: string;
  allocated_at: string | null;
};

type SeriesPoint = {
  timestamp: string;
  value: number;
};

type NodeMetricsResponse = {
  nodeId: string;
  gpuUsage: SeriesPoint[];
  gpuMemory: SeriesPoint[];
  gpuTemp: SeriesPoint[];
  gpuPower: SeriesPoint[];
  cpuUsage: SeriesPoint[];
  cpuMemory: SeriesPoint[];
};

type MockNodeMetricsPayload = {
  id: string;
  series?: {
    gpuUsage?: SeriesPoint[];
    memUsage?: SeriesPoint[];
    temp?: SeriesPoint[];
    power?: SeriesPoint[];
    cpuUsage?: SeriesPoint[];
    cpuMemUsage?: SeriesPoint[];
  };
};

type ChartKey =
  | "gpuUsage"
  | "gpuMemory"
  | "gpuTemp"
  | "gpuPower"
  | "cpuUsage"
  | "cpuMemory";

type ChartConfig = {
  title: string;
  key: ChartKey;
  domain: [number, number];
  unit: string;
};

type ChartDatum = {
  timestamp: string;
  [key: string]: string | number;
};

const GPU_CHARTS: ChartConfig[] = [
  { title: "GPU 사용률", key: "gpuUsage", domain: [0, 100], unit: "%" },
  { title: "GPU 메모리 사용률", key: "gpuMemory", domain: [0, 100], unit: "%" },
  { title: "GPU 온도", key: "gpuTemp", domain: [0, 100], unit: "℃" },
  { title: "GPU 전력 사용량", key: "gpuPower", domain: [0, 400], unit: "W" },
];

const CPU_CHARTS: ChartConfig[] = [
  { title: "CPU 사용률", key: "cpuUsage", domain: [0, 100], unit: "%" },
  { title: "CPU 메모리 사용률", key: "cpuMemory", domain: [0, 100], unit: "%" },
];

const LINE_COLORS = [
  "#1d4ed8",
  "#2563eb",
  "#3b82f6",
  "#60a5fa",
  "#0f766e",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];

async function readJson<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as T | null;

  if (!response.ok || payload === null) {
    throw new Error("모니터링 데이터를 불러오지 못했습니다.");
  }

  return payload;
}

function normalizeMetricsPayload(payload: NodeMetricsResponse | MockNodeMetricsPayload): NodeMetricsResponse {
  if ("nodeId" in payload) {
    return payload;
  }

  return {
    nodeId: payload.id,
    gpuUsage: payload.series?.gpuUsage ?? [],
    gpuMemory: payload.series?.memUsage ?? [],
    gpuTemp: payload.series?.temp ?? [],
    gpuPower: payload.series?.power ?? [],
    cpuUsage: payload.series?.cpuUsage ?? [],
    cpuMemory: payload.series?.cpuMemUsage ?? [],
  };
}

function buildChartData(
  selectedInstances: string[],
  metricsMap: Record<string, NodeMetricsResponse>,
  key: ChartKey,
) {
  const timestamps =
    selectedInstances.length > 0
      ? metricsMap[selectedInstances[0]]?.[key].map((point) => point.timestamp) ?? []
      : [];

  return timestamps.map<ChartDatum>((timestamp, index) => {
    const row: ChartDatum = { timestamp };

    selectedInstances.forEach((instanceId) => {
      const metricPoint = metricsMap[instanceId]?.[key]?.[index];
      row[instanceId] = metricPoint?.value ?? 0;
    });

    return row;
  });
}

export default function GPUMonitoring() {
  const [activeTab, setActiveTab] = useState<"gpu" | "cpu">("gpu");
  const [selectedTenantId, setSelectedTenantId] = useState<string>(tenants[0]?.id ?? "");
  const [selectedSubtenantId, setSelectedSubtenantId] = useState<string>("all");
  const [selectedInstances, setSelectedInstances] = useState<string[]>([]);
  const [nodes, setNodes] = useState<MonitoringNode[]>([]);
  const [metricsMap, setMetricsMap] = useState<Record<string, NodeMetricsResponse>>({});
  const [loadingNodes, setLoadingNodes] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNodes = async () => {
      if (!selectedTenantId) {
        setNodes([]);
        setLoadingNodes(false);
        return;
      }

      setLoadingNodes(true);
      setError(null);

      try {
        const searchParams = new URLSearchParams({ tenantId: selectedTenantId });

        if (selectedSubtenantId !== "all") {
          searchParams.set("subtenantId", selectedSubtenantId);
        }

        const payload = await readJson<{ data: NodeAllocationRecord[] }>(
          await fetch(`/api/node-allocations?${searchParams.toString()}`, { cache: "no-store" }),
        );

        const nextNodes = payload.data
          .map((allocation) => {
            const mockNode = mockGpuNodes.find((node) => node.id === allocation.node_id);

            if (!mockNode) {
              return null;
            }

            return {
              id: mockNode.id,
              name: mockNode.label,
              tenantId: allocation.tenant_id,
              subtenantId: allocation.subtenant_id,
              status: mockNode.status,
            } satisfies MonitoringNode;
          })
          .filter((node): node is MonitoringNode => Boolean(node));

        setNodes(nextNodes);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "노드 목록을 불러오지 못했습니다.");
        setNodes([]);
      } finally {
        setLoadingNodes(false);
      }
    };

    void loadNodes();
  }, [selectedSubtenantId, selectedTenantId]);

  useEffect(() => {
    if (selectedInstances.length === 0) {
      setMetricsMap({});
      return;
    }

    const loadMetrics = async () => {
      setLoadingMetrics(true);
      setError(null);

      try {
        const entries = await Promise.all(
          selectedInstances.map(async (instanceId) => {
            const payload = await readJson<NodeMetricsResponse | MockNodeMetricsPayload>(
              await fetch(`/api/monitoring/metrics/${instanceId}`, { cache: "no-store" }),
            );
            return [instanceId, normalizeMetricsPayload(payload)] as const;
          }),
        );

        setMetricsMap(Object.fromEntries(entries));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "메트릭을 불러오지 못했습니다.");
      } finally {
        setLoadingMetrics(false);
      }
    };

    void loadMetrics();
  }, [selectedInstances]);

  const tenantOptions = useMemo(() => tenants, []);

  const currentTenant = tenantOptions.find((tenant) => tenant.id === selectedTenantId) ?? tenantOptions[0];

  const currentSubtenants = useMemo(() => {
    return currentTenant?.subtenants ?? [];
  }, [currentTenant]);

  const filteredNodes = nodes;

  const charts = activeTab === "gpu" ? GPU_CHARTS : CPU_CHARTS;

  const toggleInstance = (id: string) => {
    setSelectedInstances((prev) =>
      prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id],
    );
  };

  const chartDataByKey = useMemo(() => {
    const configs = [...GPU_CHARTS, ...CPU_CHARTS];
    return Object.fromEntries(
      configs.map((config) => [
        config.key,
        buildChartData(selectedInstances, metricsMap, config.key),
      ]),
    ) as Record<ChartKey, ChartDatum[]>;
  }, [metricsMap, selectedInstances]);

  return (
    <div className="flex flex-col items-start gap-6 md:flex-row">
      <div className="flex w-full flex-col overflow-hidden rounded-[10px] border border-gray-200 bg-white md:sticky md:top-0 md:h-[calc(100vh-108px)] md:w-[228px] md:shrink-0">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4">
          <select
            className="h-[34px] w-full rounded-[7px] border border-gray-200 bg-white px-3 text-[13px] focus:border-primary-500 focus:outline-none"
            value={selectedTenantId}
            onChange={(event) => {
              setSelectedTenantId(event.target.value);
              setSelectedSubtenantId("all");
              setSelectedInstances([]);
            }}
          >
            {tenantOptions.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.name}
              </option>
            ))}
          </select>

          <select
            className="h-[34px] w-full rounded-[7px] border border-gray-200 bg-white px-3 text-[13px] focus:border-primary-500 focus:outline-none"
            value={selectedSubtenantId}
            onChange={(event) => {
              setSelectedSubtenantId(event.target.value);
              setSelectedInstances([]);
            }}
          >
            <option value="all">전체 프로젝트</option>
            {currentSubtenants.map((subtenant) => (
              <option key={subtenant.id} value={subtenant.id}>
                {subtenant.name}
              </option>
            ))}
          </select>

          <div className="mt-1 flex justify-end gap-2">
            <button className="flex h-[34px] w-[34px] items-center justify-center rounded-[7px] border border-gray-200 text-gray-600 hover:bg-gray-50">
              <RotateCcw size={14} />
            </button>
            <button className="h-[34px] flex-1 rounded-[7px] bg-primary-500 text-[13px] font-semibold text-white hover:bg-primary-600">
              검색
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 p-4">
          <span className="text-[12px] font-semibold text-gray-900">Total {filteredNodes.length}</span>
          <span className="text-[12px] text-gray-600">{selectedInstances.length}개 선택됨</span>
        </div>

        <div className="max-h-[40vh] min-h-0 flex-1 overflow-y-auto md:max-h-none">
          {loadingNodes ? (
            <div className="p-4 text-[13px] text-gray-400">노드 목록을 불러오는 중입니다...</div>
          ) : filteredNodes.length === 0 ? (
            <div className="p-4 text-[13px] text-gray-400">선택한 조건의 노드가 없습니다.</div>
          ) : (
            filteredNodes.map((node) => {
              const isSelected = selectedInstances.includes(node.id);
              const subName =
                currentSubtenants.find((subtenant) => subtenant.id === node.subtenantId)?.name ??
                "미배정 / 공용";

              return (
                <button
                  key={node.id}
                  className={`flex w-full items-center gap-3 border-b border-gray-100 p-4 text-left ${
                    isSelected ? "bg-primary-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => toggleInstance(node.id)}
                  type="button"
                >
                  <input
                    checked={isSelected}
                    className="pointer-events-none rounded-[4px] border-gray-300"
                    onChange={() => {}}
                    type="checkbox"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 truncate text-[11px] text-gray-400">{subName}</div>
                    <div className="text-[13px] font-semibold leading-none text-gray-900">
                      {node.name.split("-").pop()?.toUpperCase()}
                    </div>
                  </div>
                  <div
                    className={`h-2 w-2 rounded-full ${
                      node.status === "ok"
                        ? "bg-blue-600"
                        : node.status === "warn"
                          ? "bg-amber-500"
                          : "bg-red-600"
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[10px] border border-gray-200 bg-white">
        <div className="border-b border-gray-200 bg-white">
          <div className="flex border-b border-gray-100 md:border-b-0">
            <button
              className={`flex-1 px-5 py-4 text-[13px] font-bold uppercase tracking-tight ${
                activeTab === "gpu"
                  ? "border-b-[3px] border-primary-500 text-primary-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("gpu")}
              type="button"
            >
              GPU 모니터링
            </button>
            <button
              className={`flex-1 px-5 py-4 text-[13px] font-bold uppercase tracking-tight ${
                activeTab === "cpu"
                  ? "border-b-[3px] border-primary-500 text-primary-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("cpu")}
              type="button"
            >
              CPU 모니터링
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-3 md:justify-end md:pr-4">
            <div className="flex h-[34px] overflow-hidden rounded-[8px] border border-gray-200 bg-gray-50 text-[11px] shadow-sm">
              <button className="border-r border-gray-100 px-3 py-1 font-bold text-gray-500">1D</button>
              <button className="border-r border-gray-100 px-3 py-1 font-bold text-gray-500">3D</button>
              <button className="border-r border-gray-100 bg-white px-3 py-1 font-black text-primary-600">1W</button>
              <button className="px-3 py-1 font-bold text-gray-500">1M</button>
            </div>
            <div className="flex h-[34px] items-center gap-2 rounded-[8px] border border-gray-200 bg-white px-3 shadow-sm">
              <Calendar className="text-gray-400" size={13} />
              <span className="truncate text-[11px] font-mono font-bold text-gray-600">최근 30 포인트</span>
            </div>
            <button className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-gray-200 text-gray-500 transition hover:rotate-180 hover:bg-gray-50">
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {error ? (
            <div className="rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
              {error}
            </div>
          ) : null}

          {selectedInstances.length === 0 ? (
            <div className="flex h-full min-h-[420px] items-center justify-center text-[14px] text-gray-400">
              좌측에서 인스턴스를 1개 이상 선택해 주세요.
            </div>
          ) : loadingMetrics ? (
            <div className="flex h-full min-h-[420px] items-center justify-center text-[14px] text-gray-400">
              메트릭을 불러오는 중입니다...
            </div>
          ) : (
            <div className={`grid gap-5 ${charts.length > 2 ? "md:grid-cols-2" : "grid-cols-1 md:grid-cols-2"}`}>
              {charts.map((chart) => (
                <div key={chart.key} className="flex min-h-[320px] flex-col rounded-[10px] border border-gray-200 bg-white p-5">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-[14px] font-semibold text-gray-900">{chart.title}</h3>
                    <button className="text-gray-400 hover:text-gray-900" type="button">
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  <div className="min-h-[220px] flex-1">
                    <ResponsiveContainer height="100%" width="100%">
                      <LineChart data={chartDataByKey[chart.key]} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                        <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" vertical={false} />
                        <XAxis axisLine={false} dataKey="timestamp" dy={10} minTickGap={10} tick={{ fontSize: 11, fill: "#9CA3AF" }} tickLine={false} />
                        <YAxis axisLine={false} domain={chart.domain} tick={{ fontSize: 11, fill: "#9CA3AF" }} tickFormatter={(value) => `${value}${chart.unit}`} tickLine={false} />
                        <RechartsTooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#111827",
                          }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />

                        {selectedInstances.map((instanceId, index) => (
                          <Line
                            activeDot={{ r: 4 }}
                            dataKey={instanceId}
                            dot={false}
                            key={instanceId}
                            name={instanceId.split("-").pop()?.toUpperCase()}
                            stroke={LINE_COLORS[index % LINE_COLORS.length]}
                            strokeWidth={2}
                            type="monotone"
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
