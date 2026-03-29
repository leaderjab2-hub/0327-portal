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
import { useTheme } from "next-themes";
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
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"gpu" | "cpu">("gpu");
  const [selectedTenantId, setSelectedTenantId] = useState<string>(tenants[0]?.id ?? "");
  const [selectedSubtenantId, setSelectedSubtenantId] = useState<string>("all");
  const [selectedInstances, setSelectedInstances] = useState<string[]>([]);
  const [nodes, setNodes] = useState<MonitoringNode[]>([]);
  const [metricsMap, setMetricsMap] = useState<Record<string, NodeMetricsResponse>>({});
  const [loadingNodes, setLoadingNodes] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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
    <div className="mx-auto w-full max-w-[1400px] px-3 md:px-6 pt-4 pb-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
      <div className="flex w-full flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 md:sticky md:top-0 md:h-full md:w-60 md:shrink-0 shadow-sm card-depth">
        <div className="flex flex-col gap-3 border-b border-gray-100 dark:border-slate-700 p-4">
          <div className="flex gap-2">
            <select
              className="h-[38px] flex-1 min-w-0 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm font-bold text-gray-700 dark:text-slate-200 dark:text-slate-200 focus:border-blue-500 focus:outline-none transition-all"
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
          </div>

          <select
            className="h-[38px] w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm font-bold text-gray-700 dark:text-slate-200 dark:text-slate-200 focus:border-blue-500 focus:outline-none transition-all"
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

          <div className="flex md:mt-1 gap-2">
            <button className="flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900 transition-all">
              <RotateCcw size={16} />
            </button>
            <button className="h-[38px] flex-1 rounded-lg bg-blue-600 text-[13px] font-black uppercase tracking-wider text-white hover:bg-blue-700 shadow-sm card-depth transition-all active:scale-[0.98]">
              필터 적용
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 p-4">
          <span className="text-[12px] font-semibold text-gray-900 dark:text-slate-100">Total {filteredNodes.length}</span>
          <span className="text-[12px] text-gray-600 dark:text-slate-400">{selectedInstances.length}개 선택됨</span>
        </div>

        <div className="max-h-[40vh] min-h-0 flex-1 overflow-y-auto md:max-h-none">
          {loadingNodes ? (
            <div className="p-4 text-[13px] text-gray-400 dark:text-slate-500">노드 목록을 불러오는 중입니다...</div>
          ) : filteredNodes.length === 0 ? (
            <div className="p-4 text-[13px] text-gray-400 dark:text-slate-500">선택한 조건의 노드가 없습니다.</div>
          ) : (
            filteredNodes.map((node) => {
              const isSelected = selectedInstances.includes(node.id);
              const subName =
                currentSubtenants.find((subtenant) => subtenant.id === node.subtenantId)?.name ??
                "미배정 / 공용";

              return (
                <button
                  key={node.id}
                  className={`flex w-full items-center gap-3 border-b border-gray-100 dark:border-slate-700 p-4 text-left ${
                    isSelected ? "bg-primary-50" : "hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900"
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
                    <div className="mb-1 truncate text-[11px] text-gray-400 dark:text-slate-500">{subName}</div>
                    <div className="text-[13px] font-semibold leading-none text-gray-900 dark:text-slate-100">
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

      <div className="flex w-full min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm card-depth">
        <div className="border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="flex bg-gray-100 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 md:border-b-0">
            <button
              className={`flex-1 px-5 py-4 text-[13px] font-black uppercase tracking-widest transition-all ${
                activeTab === "gpu"
                  ? "border-b-[3px] border-blue-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                  : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-900"
              }`}
              onClick={() => setActiveTab("gpu")}
              type="button"
            >
              GPU Metrics
            </button>
            <button
              className={`flex-1 px-5 py-4 text-[13px] font-black uppercase tracking-widest transition-all ${
                activeTab === "cpu"
                  ? "border-b-[3px] border-blue-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                  : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-900"
              }`}
              onClick={() => setActiveTab("cpu")}
              type="button"
            >
              CPU Metrics
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 p-3 md:justify-end md:pr-4">
            <div className="flex h-[34px] overflow-hidden rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-[10px] font-black shadow-sm card-depth">
              <button className="border-r border-gray-200 dark:border-slate-700 px-3 py-1 text-gray-400 dark:text-slate-500 uppercase">1D</button>
              <button className="border-r border-gray-200 dark:border-slate-700 px-3 py-1 text-gray-400 dark:text-slate-500 uppercase">3D</button>
              <button className="border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1 text-blue-600 uppercase">1W</button>
              <button className="px-3 py-1 text-gray-400 dark:text-slate-500 uppercase">1M</button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-[34px] items-center gap-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 shadow-sm card-depth">
                <Calendar className="text-gray-400 dark:text-slate-500" size={13} />
                <span className="truncate text-[10px] font-black uppercase tracking-tight text-gray-500 dark:text-slate-400">Last 30 Points</span>
              </div>
              <button className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500 transition hover:rotate-180 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900 shadow-sm card-depth">
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {error ? (
            <div className="rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-4 text-[13px] text-rose-700">
              {error}
            </div>
          ) : null}

          {selectedInstances.length === 0 ? (
            <div className="flex h-full min-h-[420px] items-center justify-center text-[14px] text-gray-400 dark:text-slate-500">
              좌측에서 인스턴스를 1개 이상 선택해 주세요.
            </div>
          ) : loadingMetrics ? (
            <div className="flex h-full min-h-[420px] items-center justify-center text-[14px] text-gray-400 dark:text-slate-500">
              메트릭을 불러오는 중입니다...
            </div>
          ) : (
            <div className={`grid gap-5 ${charts.length > 2 ? "md:grid-cols-2" : "grid-cols-1 md:grid-cols-2"}`}>
              {charts.map((chart) => (
                <div key={chart.key} className="flex min-h-[320px] flex-col rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm card-depth transition-all hover:shadow-md">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-[14px] font-semibold text-gray-900 dark:text-slate-100">{chart.title}</h3>
                    <button className="text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:text-slate-100" type="button">
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  <div className="min-h-[220px] flex-1">
                    <ResponsiveContainer height="100%" width="100%">
                      <LineChart data={chartDataByKey[chart.key]} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                        <CartesianGrid stroke="#F3F4F6" className="dark:stroke-slate-700" strokeDasharray="3 3" vertical={false} />
                        <XAxis axisLine={false} dataKey="timestamp" dy={10} minTickGap={10} tick={{ fontSize: 11, fill: "#9CA3AF" }} tickLine={false} />
                        <YAxis axisLine={false} domain={chart.domain} tick={{ fontSize: 11, fill: "#9CA3AF" }} tickFormatter={(value) => `${value}${chart.unit}`} tickLine={false} />
                        <RechartsTooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: mounted && resolvedTheme === 'dark' ? "1px solid #334155" : "1px solid #E5E7EB",
                            backgroundColor: mounted && resolvedTheme === 'dark' ? "#1E293B" : "#ffffff",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: mounted && resolvedTheme === 'dark' ? "#F1F5F9" : "#111827",
                          }}
                          itemStyle={{ color: mounted && resolvedTheme === 'dark' ? "#F1F5F9" : "#111827" }}
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
  </div>
);
}
