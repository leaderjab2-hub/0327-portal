'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Building2, TerminalSquare } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import CompanyListPanel from '@/components/CompanyListPanel';
import { useAuth } from '@/contexts/AuthContext';

type TenantRecord = {
  id: string;
  name: string;
};

type SeriesPoint = {
  timestamp: string;
  value: number;
};

type MeteringVariableMetric = {
  usage: number;
  unit: string;
  series: SeriesPoint[];
};

type MeteringResponse = {
  tenantId: string;
  tenantName: string;
  period: string;
  fixed: {
    gpu: { contracted: number; unit: string };
    cpu: { contracted: number; unit: string };
  };
  variable: {
    storage: MeteringVariableMetric;
    networkOutbound: MeteringVariableMetric;
    networkInbound: MeteringVariableMetric;
  };
  subtenants: Array<{
    subtenantId: string;
    name: string;
    fixed: {
      gpu: { allocated: number; contracted: number };
      cpu: { allocated: number; contracted: number };
    };
    variable: {
      storage: MeteringVariableMetric;
      networkOutbound: MeteringVariableMetric;
      networkInbound: MeteringVariableMetric;
    };
  }>;
};

type MeteringPageClientProps = {
  initialTenants?: TenantRecord[];
  initialMetering?: MeteringResponse | null;
  initialTenantId?: string | null;
};

async function readJson<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => ({}))) as T & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? '요청을 처리하지 못했습니다.');
  }

  return payload;
}

function buildNetworkChartData(
  outbound: SeriesPoint[],
  inbound: SeriesPoint[],
) {
  const timestamps = Array.from(new Set([...outbound.map((point) => point.timestamp), ...inbound.map((point) => point.timestamp)]));

  return timestamps.map((timestamp) => ({
    time: timestamp,
    out: outbound.find((point) => point.timestamp === timestamp)?.value ?? 0,
    in: inbound.find((point) => point.timestamp === timestamp)?.value ?? 0,
  }));
}

export default function MeteringPageClient({
  initialTenants = [],
  initialMetering = null,
  initialTenantId = null,
}: MeteringPageClientProps) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'company' | 'project'>('company');
  const initialCompanyIdx = Math.max(0, initialTenants.findIndex((tenant) => tenant.id === initialTenantId));
  const [activeCompanyIdx, setActiveCompanyIdx] = useState(initialCompanyIdx);
  const [activeProjIdx, setActiveProjIdx] = useState(0);
  const [tenants, setTenants] = useState<TenantRecord[]>(initialTenants);
  const [metering, setMetering] = useState<MeteringResponse | null>(initialMetering);
  const [loading, setLoading] = useState(initialMetering === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setActiveProjIdx(0);
  }, [activeCompanyIdx, activeTab]);

  useEffect(() => {
    if (initialTenants.length > 0) {
      return;
    }

    let active = true;

    const loadTenants = async () => {
      try {
        const payload = await readJson<{ data: TenantRecord[] }>(await fetch('/api/tenants', { cache: 'no-store' }));

        if (!active) {
          return;
        }

        setTenants(payload.data ?? []);
        setActiveCompanyIdx(0);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : 'Tenant 목록을 불러오지 못했습니다.');
        setTenants([]);
      }
    };

    void loadTenants();

    return () => {
      active = false;
    };
  }, [initialTenants.length]);

  const selectedTenant = tenants[activeCompanyIdx] ?? null;

  useEffect(() => {
    if (!selectedTenant?.id) {
      setMetering(null);
      setLoading(false);
      return;
    }

    let active = true;

    if (selectedTenant.id === initialTenantId && initialMetering) {
      setLoading(false);
      return;
    }

    const loadMetering = async () => {
      setLoading(true);
      setError(null);

      try {
        const payload = await readJson<{ data: MeteringResponse }>(
          await fetch(`/api/metering/${selectedTenant.id}`, { cache: 'no-store' }),
        );

        if (!active) {
          return;
        }

        setMetering(payload.data);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : '미터링 데이터를 불러오지 못했습니다.');
        setMetering(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadMetering();

    return () => {
      active = false;
    };
  }, [initialMetering, initialTenantId, selectedTenant?.id]);

  const visibleSubtenants = metering?.subtenants ?? [];
  const safeProjIdx = Math.min(Math.max(0, activeProjIdx), Math.max(0, visibleSubtenants.length - 1));
  const selectedProject = visibleSubtenants[safeProjIdx] ?? null;

  const companyStorageData = useMemo(
    () => metering?.variable.storage.series.map((point) => ({ time: point.timestamp, usage: point.value })) ?? [],
    [metering],
  );
  const companyNetworkData = useMemo(
    () =>
      metering
        ? buildNetworkChartData(metering.variable.networkOutbound.series, metering.variable.networkInbound.series)
        : [],
    [metering],
  );

  const projectStorageData = useMemo(
    () => selectedProject?.variable.storage.series.map((point) => ({ time: point.timestamp, usage: point.value })) ?? [],
    [selectedProject],
  );
  const projectNetworkData = useMemo(
    () =>
      selectedProject
        ? buildNetworkChartData(selectedProject.variable.networkOutbound.series, selectedProject.variable.networkInbound.series)
        : [],
    [selectedProject],
  );

  const handleCompanyClick = (idx: number) => {
    if (currentUser?.role === 'tenant_admin' || currentUser?.role === 'subtenant_member') {
      return;
    }

    setActiveCompanyIdx(idx);
  };

  const renderContent = (
    title: string,
    isProject: boolean,
    contractedGpu: number,
    allocatedGpu: number,
    contractedCpu: number,
    allocatedCpu: number,
    storageUsage: number,
    networkOutUsage: number,
    networkInUsage: number,
    storageData: { time: string; usage: number }[],
    networkData: { time: string; out: number; in: number }[],
  ) => {
    const gpuPercent = Math.min(100, (allocatedGpu / (contractedGpu || 1)) * 100) || 0;
    const cpuPercent = Math.min(100, (allocatedCpu / (contractedCpu || 1)) * 100) || 0;

    return (
      <div className="flex min-h-0 w-full flex-col pt-1">
        <h2 className="mb-6 shrink-0 text-[18px] font-bold text-gray-900 lg:mb-7 lg:text-[20px]">{title}</h2>
        <div className="flex shrink-0 flex-col space-y-6 pb-10 lg:space-y-7">
          <div className="shrink-0 rounded-[8px] border border-gray-200 bg-white p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] lg:rounded-[12px] lg:p-6 lg:shadow-[0_10px_30px_-18px_rgba(15,23,42,0.16)]">
            <h3 className="mb-4 flex items-center gap-2 text-[14px] font-semibold text-gray-900">
              고정 항목 <span className="text-[11px] font-normal text-gray-400">계약 수량 기준</span>
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-7">
              <div className="rounded-[8px] border border-gray-100 bg-gray-50 p-5 lg:rounded-[10px] lg:p-6">
                <div className="mb-3 flex items-end justify-between">
                  <span className="text-[13px] font-semibold text-gray-600">{isProject ? '할당 CPU 자원' : 'CPU 과금 코어 수'}</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-[20px] font-extrabold text-primary-600">{allocatedCpu}</span>
                    <span className="mb-0.5 text-[13px] font-semibold text-gray-400">/ {contractedCpu} Core</span>
                  </div>
                </div>
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full rounded-full bg-primary-500 transition-all duration-500" style={{ width: `${cpuPercent}%` }} />
                </div>
              </div>
              <div className="rounded-[8px] border border-gray-100 bg-gray-50 p-5 lg:rounded-[10px] lg:p-6">
                <div className="mb-3 flex items-end justify-between">
                  <span className="text-[13px] font-semibold text-gray-600">{isProject ? '할당 GPU 인스턴스' : 'GPU 인스턴스 과금 대수'}</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-[20px] font-extrabold text-primary-600">{allocatedGpu}</span>
                    <span className="mb-0.5 text-[13px] font-semibold text-gray-400">/ {contractedGpu} 대</span>
                  </div>
                </div>
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full rounded-full bg-primary-500 transition-all duration-500" style={{ width: `${gpuPercent}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-h-[400px] shrink-0 flex-col rounded-[8px] border border-gray-200 bg-white p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
            <h3 className="mb-4 flex items-center gap-2 text-[14px] font-semibold text-gray-900">
              변동 항목 <span className="text-[11px] font-normal text-gray-400">실시간 측정 기반</span>
            </h3>
            <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex min-h-[300px] flex-col rounded-[8px] border border-gray-200 bg-white shadow-sm">
                <div className="shrink-0 border-b border-gray-100 p-4">
                  <span className="text-[13px] font-semibold text-gray-900">스토리지 사용량 (월 평균)</span>
                  <div className="mt-1 font-mono text-[22px] font-bold text-primary-600">{storageUsage.toLocaleString()} TB</div>
                </div>
                <div className="relative m-2 flex-1 rounded-[6px] border border-dashed border-primary-200 bg-gradient-to-br from-[#F8F9FF] to-[#EFF6FF] p-4 min-h-[220px]">
                  <div className="absolute inset-0 p-4">
                    <ResponsiveContainer height="100%" width="100%">
                      <AreaChart data={storageData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorStorage" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
                        <XAxis axisLine={false} dataKey="time" dy={5} tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} />
                        <YAxis axisLine={false} domain={['dataMin - 100', 'dataMax + 100']} tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} />
                        <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '11px', fontWeight: 600 }} />
                        <Area activeDot={{ r: 4 }} dataKey="usage" fill="url(#colorStorage)" fillOpacity={1} stroke="#3B82F6" strokeWidth={2} type="monotone" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="flex min-h-[300px] flex-col rounded-[8px] border border-gray-200 bg-white shadow-sm">
                <div className="flex shrink-0 justify-between border-b border-gray-100 p-4">
                  <div>
                    <span className="text-[13px] font-semibold text-gray-900">네트워크 트래픽 Outbound (GB)</span>
                    <div className="mt-1 font-mono text-[22px] font-bold text-primary-600">{networkOutUsage.toLocaleString()} GB</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[13px] font-semibold text-gray-900">Inbound (GB)</span>
                    <div className="mt-1 font-mono text-[18px] font-bold text-gray-600">{networkInUsage.toLocaleString()} GB</div>
                  </div>
                </div>
                <div className="relative m-2 flex-1 rounded-[6px] border border-dashed border-primary-200 bg-gradient-to-br from-[#F8F9FF] to-[#EFF6FF] p-4 min-h-[220px]">
                  <div className="absolute inset-0 p-4">
                    <ResponsiveContainer height="100%" width="100%">
                      <LineChart data={networkData} margin={{ top: 5, right: 0, left: -10, bottom: 0 }}>
                        <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
                        <XAxis axisLine={false} dataKey="time" dy={5} tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} />
                        <YAxis axisLine={false} domain={[0, 'auto']} tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} />
                        <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '11px', fontWeight: 600 }} />
                        <Line activeDot={{ r: 4 }} dataKey="out" dot={false} stroke="#3B82F6" strokeWidth={2} type="monotone" />
                        <Line activeDot={{ r: 4 }} dataKey="in" dot={false} stroke="#10B981" strokeWidth={2} type="monotone" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-auto min-h-0 flex-col gap-6 pb-2 text-gray-900 md:flex-row md:h-[calc(100vh-112px)]">
      <CompanyListPanel
        companies={tenants.map((tenant) => ({ id: tenant.id, name: tenant.name, subCount: 0 }))}
        activeIndex={Math.min(activeCompanyIdx, Math.max(0, tenants.length - 1))}
        onCompanyClick={handleCompanyClick}
      />

      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
        <div className="flex shrink-0 flex-col gap-3 border-b border-gray-200 bg-white px-4 py-3 md:h-[52px] md:flex-row md:items-center md:gap-0 md:py-0">
          <div className="flex h-[40px] border-b border-gray-100 pb-2 md:h-full md:border-none md:pb-0">
            <button
              onClick={() => setActiveTab('company')}
              className={`flex h-full items-center whitespace-nowrap border-b-[2px] px-5 text-[13px] font-bold transition-colors outline-none ${
                activeTab === 'company'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
              type="button"
            >
              회사별
            </button>
            <button
              onClick={() => setActiveTab('project')}
              className={`flex h-full items-center whitespace-nowrap border-b-[2px] px-5 text-[13px] font-bold transition-colors outline-none ${
                activeTab === 'project'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
              type="button"
            >
              프로젝트별
            </button>
          </div>
          <div className="hidden flex-1 md:block" />
          <div className="flex items-center gap-2">
            <select className="h-[36px] w-full rounded-[8px] border border-gray-200 bg-white px-3 text-[13px] font-bold focus:border-primary-500 focus:outline-none sm:w-[110px]">
              <option>2026.03</option>
            </select>
            <button className="h-[36px] rounded-[8px] bg-gray-100 px-4 text-[13px] font-bold text-gray-700 shadow-sm active:scale-[0.98] hover:bg-gray-200">
              다운로드
            </button>
          </div>
        </div>

        {activeTab === 'project' ? (
          <div className="shrink-0 border-b border-gray-200 bg-[#FAFAFA] px-4 py-4 md:px-6">
            <div className="flex gap-2 overflow-x-auto">
              {visibleSubtenants.length > 0 ? (
                visibleSubtenants.map((subtenant, index) => (
                  <button
                    key={subtenant.subtenantId}
                    onClick={() => {
                      if (currentUser?.role !== 'subtenant_member') {
                        setActiveProjIdx(index);
                      }
                    }}
                    className={`z-10 flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-bold transition-all outline-none ${
                      safeProjIdx === index
                        ? 'bg-gray-800 text-white shadow-sm ring-2 ring-gray-800 ring-offset-2'
                        : 'border border-gray-200 bg-white text-gray-600 opacity-90 hover:bg-gray-100'
                    } ${currentUser?.role === 'subtenant_member' && safeProjIdx !== index ? 'hidden' : ''}`}
                    type="button"
                  >
                    <Building2 className={safeProjIdx === index ? 'text-gray-300' : 'text-gray-400'} size={14} />
                    {subtenant.name}
                  </button>
                ))
              ) : (
                <div className="py-1 text-[13px] italic text-gray-400">등록된 Subtenant가 없습니다.</div>
              )}
            </div>
          </div>
        ) : null}

        <div className="flex flex-1 flex-col overflow-auto bg-[#FAFAFA] p-4 md:p-6">
          {loading ? (
            <div className="flex min-h-[300px] flex-1 items-center justify-center text-[14px] font-medium text-gray-400">
              미터링 데이터를 불러오는 중입니다.
            </div>
          ) : error ? (
            <div className="rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">{error}</div>
          ) : activeTab === 'company' && metering ? (
            renderContent(
              `${metering.tenantName} ${metering.period} 미터링 내역`,
              false,
              metering.fixed.gpu.contracted,
              metering.fixed.gpu.contracted,
              metering.fixed.cpu.contracted,
              metering.fixed.cpu.contracted,
              metering.variable.storage.usage,
              metering.variable.networkOutbound.usage,
              metering.variable.networkInbound.usage,
              companyStorageData,
              companyNetworkData,
            )
          ) : activeTab === 'project' && selectedProject ? (
            renderContent(
              `${selectedProject.name} (${metering?.tenantName ?? '-'}) ${metering?.period ?? '2026.03'} 미터링 내역`,
              true,
              selectedProject.fixed.gpu.contracted,
              selectedProject.fixed.gpu.allocated,
              selectedProject.fixed.cpu.contracted,
              selectedProject.fixed.cpu.allocated,
              selectedProject.variable.storage.usage,
              selectedProject.variable.networkOutbound.usage,
              selectedProject.variable.networkInbound.usage,
              projectStorageData,
              projectNetworkData,
            )
          ) : activeTab === 'project' ? (
            <div className="flex min-h-[300px] flex-1 flex-col items-center justify-center text-gray-400">
              <TerminalSquare className="mb-4 opacity-30" size={48} />
              <p className="text-[14px] font-medium">조회할 하위 프로젝트 내역이 없습니다.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
