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
      <div className="flex items-center justify-between rounded-[10px] border border-gray-200 bg-white p-4 text-left">
        <div className="border-r border-gray-200 pr-5 text-[14px] font-semibold text-gray-900">Total {companies.length}</div>
        <div className="flex flex-1 items-center gap-3 px-5">
          <select className="h-[34px] w-[200px] rounded-[7px] border border-gray-200 bg-white px-3 text-[13px] focus:border-primary-500 focus:outline-none">
            <option>전체 회사</option>
            {companies.map((company) => (
              <option key={company.tenantId}>{company.name}</option>
            ))}
          </select>
          <div className="flex h-[34px] w-[200px] items-center gap-2 rounded-[7px] border border-gray-200 bg-white px-3">
            <Calendar className="text-gray-400" size={14} />
            <span className="text-[12px] font-mono text-gray-600">최근 30 포인트</span>
          </div>
          <button className="flex h-[34px] w-[34px] items-center justify-center rounded-[7px] border border-gray-200 text-gray-600 hover:bg-gray-50">
            <RotateCcw size={14} />
          </button>
        </div>
        <button className="flex h-[34px] w-[80px] items-center justify-center gap-1 rounded-[7px] bg-primary-500 text-[13px] font-semibold text-white hover:bg-primary-600">
          검색
        </button>
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
            <div key={company.tenantId} className="overflow-hidden rounded-[10px] border border-gray-200 bg-white text-left">
              <div className="flex items-center justify-between border-b border-gray-100 bg-[#FAFAFA] p-5">
                <div className="flex items-center gap-4">
                  <h2 className="text-[16px] font-bold text-gray-900">{company.name}</h2>
                  <span className="font-mono text-[13px] text-gray-600">{company.tenantId}</span>
                </div>
                <div className="flex items-center gap-4 rounded-[7px] border border-gray-200 bg-white px-4 py-1.5">
                  <span className="text-[12px] font-semibold uppercase tracking-wide text-gray-400">사용량</span>
                  <span className="font-mono text-[14px] font-bold text-gray-900">
                    {company.usageTB} TB / {company.totalTB} TB
                  </span>
                  <span
                    className={`rounded-[4px] px-2 py-0.5 font-mono text-[11px] font-bold ${
                      company.usagePercent >= 80
                        ? "bg-[#FEF2F2] text-[#DC2626]"
                        : "bg-primary-50 text-primary-600"
                    }`}
                  >
                    {company.usagePercent}%
                  </span>
                  <div className="mx-2 h-4 w-px bg-gray-200" />
                  <ToggleRight className="text-[#10B981]" size={24} />
                  <span className="text-[12px] font-semibold text-[#10B981]">활성</span>
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
