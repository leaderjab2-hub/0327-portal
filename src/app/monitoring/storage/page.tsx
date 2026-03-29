"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, MoreVertical, RotateCcw, ToggleRight } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { tenants } from "@/lib/mockData";

type SeriesPoint = {
  timestamp: string;
  value: number;
};

type StorageTenantSummary = {
  tenantId: string;
  usageTB: number;
  totalTB: number;
  usagePercent: number;
};

type StorageMetricsResponse = {
  capacity: SeriesPoint[];
  bw: SeriesPoint[];
  iops: SeriesPoint[];
  latency: SeriesPoint[];
};

type StorageChartRow = {
  timestamp: string;
  capacity: number;
  bw: number;
  iops: number;
  latency: number;
};

async function readJson<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as T | null;

  if (!response.ok || payload === null) {
    throw new Error("스토리지 데이터를 불러오지 못했습니다.");
  }

  return payload;
}

function getTenantName(tenantId: string) {
  return tenants.find((tenant) => tenant.id === tenantId)?.name ?? tenantId;
}

function buildRows(metrics: StorageMetricsResponse): StorageChartRow[] {
  return metrics.capacity.map((point, index) => ({
    timestamp: point.timestamp,
    capacity: point.value,
    bw: metrics.bw[index]?.value ?? 0,
    iops: metrics.iops[index]?.value ?? 0,
    latency: metrics.latency[index]?.value ?? 0,
  }));
}

function StorageTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ color?: string; name?: string; value?: number }>; label?: string }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-[8px] border border-gray-200 bg-white p-3 text-[12px] font-semibold text-gray-900 shadow-sm">
      <p className="mb-2 font-mono text-[11px] font-normal text-gray-500">{label}</p>
      {payload.map((entry, index) => (
        <div className="mb-1 flex items-center gap-2" key={`${entry.name ?? "entry"}-${index}`}>
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-mono">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function StorageMonitoring() {
  const [summaries, setSummaries] = useState<StorageTenantSummary[]>([]);
  const [metricsByTenant, setMetricsByTenant] = useState<Record<string, StorageMetricsResponse>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStorage = async () => {
      setLoading(true);
      setError(null);

      try {
        const tenantSummaries = await readJson<StorageTenantSummary[]>(
          await fetch("/api/storage/tenants", { cache: "no-store" }),
        );

        const metricEntries = await Promise.all(
          tenantSummaries.map(async (summary) => {
            const metrics = await readJson<StorageMetricsResponse>(
              await fetch(`/api/storage/metrics/${summary.tenantId}`, { cache: "no-store" }),
            );
            return [summary.tenantId, metrics] as const;
          }),
        );

        setSummaries(tenantSummaries);
        setMetricsByTenant(Object.fromEntries(metricEntries));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "스토리지 데이터를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    void loadStorage();
  }, []);

  const companies = useMemo(() => {
    return summaries.map((summary) => {
      const metrics = metricsByTenant[summary.tenantId];
      return {
        ...summary,
        name: getTenantName(summary.tenantId),
        rows: metrics ? buildRows(metrics) : [],
      };
    });
  }, [metricsByTenant, summaries]);

  return (
    <div className="flex h-full min-w-0 w-full flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm">
        <div className="flex flex-1 items-center gap-3 w-full overflow-hidden">
          <div className="hidden md:block border-r border-gray-200 pr-5 text-[14px] font-black text-gray-900 whitespace-nowrap uppercase tracking-widest">Total {companies.length}</div>
          <select className="h-[38px] flex-1 min-w-0 md:w-[220px] md:flex-none rounded-lg border border-gray-200 bg-white px-3 text-sm font-bold text-gray-700 focus:border-blue-500 focus:outline-none transition-colors">
            <option>전체 테넌트 (Company)</option>
            {companies.map((company) => (
              <option key={company.tenantId}>{company.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex h-[38px] flex-1 md:w-[180px] items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 shadow-sm overflow-hidden">
            <Calendar className="shrink-0 text-gray-400" size={14} />
            <span className="truncate text-[10px] font-black uppercase tracking-tight text-gray-500">Last 30 Points</span>
          </div>
          <button className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 shadow-sm transition-colors">
            <RotateCcw size={16} />
          </button>
          <button className="flex h-[38px] w-[80px] shrink-0 items-center justify-center gap-1 rounded-lg bg-blue-600 text-[13px] font-black uppercase tracking-wider text-white hover:bg-blue-700 shadow-xl transition-all active:scale-[0.98]">
            검색
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-y-auto pr-1">
        {loading ? (
          <div className="rounded-[10px] border border-gray-200 bg-white p-6 text-[14px] text-gray-400">
            스토리지 데이터를 불러오는 중입니다...
          </div>
        ) : (
          companies.map((company) => (
            <div key={company.tenantId} className="overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 bg-[#FAFAFA] p-5 gap-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-[15px] font-black text-gray-900 uppercase tracking-tight">{company.name}</h2>
                  <span className="font-mono text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded flex items-center">{company.tenantId}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">USAGE</span>
                    <span className="font-mono text-sm font-black text-gray-900 leading-none">
                      {company.usageTB} / {company.totalTB} TB
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 font-black text-[10px] uppercase border ${
                        company.usagePercent >= 80
                          ? "bg-red-50 text-red-600 border-red-100"
                          : "bg-blue-50 text-blue-600 border-blue-100"
                      }`}
                    >
                      {company.usagePercent}%
                    </span>
                  </div>
                  <div className="hidden h-4 w-px bg-gray-200 sm:block" />
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Active</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-[13px] font-semibold text-gray-900">Capacity (TB)</h3>
                    <MoreVertical className="cursor-pointer text-gray-400" size={16} />
                  </div>
                  <div className="h-[140px] w-full min-w-0">
                    <ResponsiveContainer height="100%" width="100%">
                      <LineChart data={company.rows} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                        <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" vertical={false} />
                        <XAxis axisLine={false} dataKey="timestamp" dy={5} minTickGap={10} tick={{ fontSize: 11, fill: "#9CA3AF" }} tickLine={false} />
                        <YAxis axisLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} tickFormatter={(value) => `${value} TB`} tickLine={false} />
                        <RechartsTooltip content={<StorageTooltip />} />
                        <Line activeDot={{ r: 4 }} dataKey="capacity" dot={false} name="Used" stroke="#10B981" strokeWidth={2} type="monotone" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-[13px] font-semibold text-gray-900">Bandwidth (Mbps)</h3>
                      <MoreVertical className="cursor-pointer text-gray-400" size={16} />
                    </div>
                    <div className="h-[180px] w-full min-w-0">
                      <ResponsiveContainer height="100%" width="100%">
                        <BarChart data={company.rows} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" vertical={false} />
                          <XAxis axisLine={false} dataKey="timestamp" dy={5} minTickGap={10} tick={{ fontSize: 11, fill: "#9CA3AF" }} tickLine={false} />
                          <YAxis axisLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} tickLine={false} />
                          <RechartsTooltip content={<StorageTooltip />} />
                          <Bar dataKey="bw" fill="#3B82F6" maxBarSize={15} name="BW" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-[13px] font-semibold text-gray-900">IOPS</h3>
                      <MoreVertical className="cursor-pointer text-gray-400" size={16} />
                    </div>
                    <div className="h-[180px] w-full min-w-0">
                      <ResponsiveContainer height="100%" width="100%">
                        <BarChart data={company.rows} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" vertical={false} />
                          <XAxis axisLine={false} dataKey="timestamp" dy={5} minTickGap={10} tick={{ fontSize: 11, fill: "#9CA3AF" }} tickLine={false} />
                          <YAxis axisLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} tickLine={false} />
                          <RechartsTooltip content={<StorageTooltip />} />
                          <Bar dataKey="iops" fill="#10B981" maxBarSize={15} name="IOPS" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-[13px] font-semibold text-gray-900">Latency (ms)</h3>
                      <MoreVertical className="cursor-pointer text-gray-400" size={16} />
                    </div>
                    <div className="h-[180px] w-full min-w-0">
                      <ResponsiveContainer height="100%" width="100%">
                        <LineChart data={company.rows} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" vertical={false} />
                          <XAxis axisLine={false} dataKey="timestamp" dy={5} minTickGap={10} tick={{ fontSize: 11, fill: "#9CA3AF" }} tickLine={false} />
                          <YAxis axisLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} tickLine={false} />
                          <RechartsTooltip content={<StorageTooltip />} />
                          <Line activeDot={{ r: 4 }} dataKey="latency" dot={false} name="Latency" stroke="#F59E0B" strokeWidth={2} type="monotone" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
