'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Search, TerminalSquare, Cpu, HardDrive, Network, Download } from 'lucide-react';

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

function buildNetworkChartData(outbound: SeriesPoint[], inbound: SeriesPoint[]) {
  const timestamps = Array.from(new Set([...outbound.map(p => p.timestamp), ...inbound.map(p => p.timestamp)]));
  return timestamps.map(timestamp => ({
    time: timestamp,
    out: outbound.find(p => p.timestamp === timestamp)?.value ?? 0,
    in: inbound.find(p => p.timestamp === timestamp)?.value ?? 0,
  }));
}

export default function MeteringPageClient({
  initialTenants = [],
  initialMetering = null,
  initialTenantId = null,
}: MeteringPageClientProps) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'company' | 'project'>('company');
  const initialCompanyIdx = Math.max(0, initialTenants.findIndex(t => t.id === initialTenantId));
  const [activeCompanyIdx, setActiveCompanyIdx] = useState(initialCompanyIdx);
  const [activeProjIdx, setActiveProjIdx] = useState(0);
  const [tenants, setTenants] = useState<TenantRecord[]>(initialTenants);
  const [metering, setMetering] = useState<MeteringResponse | null>(initialMetering);
  const [loading, setLoading] = useState(initialMetering === null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setActiveProjIdx(0);
  }, [activeCompanyIdx, activeTab]);

  useEffect(() => {
    if (initialTenants.length > 0) return;
    let active = true;
    const loadTenants = async () => {
      try {
        const payload = await readJson<{ data: TenantRecord[] }>(await fetch('/api/tenants', { cache: 'no-store' }));
        if (active) {
          setTenants(payload.data ?? []);
          setActiveCompanyIdx(0);
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : '실패');
      }
    };
    loadTenants();
    return () => { active = false; };
  }, [initialTenants.length]);

  const selectedTenant = tenants[activeCompanyIdx] ?? null;

  useEffect(() => {
    if (!selectedTenant?.id) {
      setMetering(null);
      setLoading(false);
      return;
    }
    if (selectedTenant.id === initialTenantId && initialMetering) {
      setMetering(initialMetering);
      setLoading(false);
      return;
    }
    let active = true;
    const loadMetering = async () => {
      setLoading(true);
      setError(null);
      try {
        const payload = await readJson<{ data: MeteringResponse }>(
          await fetch(`/api/metering/${selectedTenant.id}`, { cache: 'no-store' }),
        );
        if (active) setMetering(payload.data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : '실패');
      } finally {
        if (active) setLoading(false);
      }
    };
    loadMetering();
    return () => { active = false; };
  }, [selectedTenant?.id, initialTenantId, initialMetering]);

  const visibleSubtenants = metering?.subtenants ?? [];
  const safeProjIdx = Math.min(Math.max(0, activeProjIdx), Math.max(0, visibleSubtenants.length - 1));
  const selectedProject = visibleSubtenants[safeProjIdx] ?? null;

  const companyStorageData = useMemo(() => metering?.variable.storage.series.map(p => ({ time: p.timestamp, usage: p.value })) ?? [], [metering]);
  const companyNetworkData = useMemo(() => metering ? buildNetworkChartData(metering.variable.networkOutbound.series, metering.variable.networkInbound.series) : [], [metering]);
  const projectStorageData = useMemo(() => selectedProject?.variable.storage.series.map(p => ({ time: p.timestamp, usage: p.value })) ?? [], [selectedProject]);
  const projectNetworkData = useMemo(() => selectedProject ? buildNetworkChartData(selectedProject.variable.networkOutbound.series, selectedProject.variable.networkInbound.series) : [], [selectedProject]);

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
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-black text-gray-900 tracking-tight">{title}</h2>
          <div className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-black text-blue-700 uppercase">실시간 분석 활성화</div>
        </div>

        {/* KPI Cards (Step 2 Implementation) */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Cpu size={16} className="text-blue-500" />
              </div>
              <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">CPU 코어 자원</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-black text-gray-900 tabular-nums">{allocatedCpu}<span className="text-sm ml-1 text-gray-400">/ {contractedCpu}</span></p>
                <p className="text-xs text-gray-400 mt-1">{isProject ? '할당량 기준' : '계약량 기준'}</p>
              </div>
              <div className="text-xs font-black text-blue-600 mb-1">{Math.round(cpuPercent)}%</div>
            </div>
            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${cpuPercent}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <TerminalSquare size={16} className="text-indigo-500" />
              </div>
              <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">GPU 인스턴스</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-black text-gray-900 tabular-nums">{allocatedGpu}<span className="text-sm ml-1 text-gray-400">/ {contractedGpu}</span></p>
                <p className="text-xs text-gray-400 mt-1">{isProject ? '할당 인스턴스' : '과금 인스턴스'}</p>
              </div>
              <div className="text-xs font-black text-indigo-600 mb-1">{Math.round(gpuPercent)}%</div>
            </div>
            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${gpuPercent}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <HardDrive size={16} className="text-emerald-500" />
              </div>
              <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">스토리지 사용</span>
            </div>
            <p className="text-2xl font-black text-emerald-600 tabular-nums">{storageUsage.toLocaleString()}<span className="text-sm ml-1 text-gray-400">TB</span></p>
            <p className="text-xs text-gray-400 mt-1">월 평균 실사용 누계</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <Network size={16} className="text-amber-500" />
              </div>
              <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">네트워크 트래픽</span>
            </div>
            <p className="text-2xl font-black text-amber-600 tabular-nums">{(networkOutUsage + networkInUsage).toLocaleString()}<span className="text-sm ml-1 text-gray-400">GB</span></p>
            <p className="text-xs text-gray-400 mt-1">In/Out bound 트래픽 합계</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <HardDrive size={14} className="text-emerald-500" /> 스토리지 사용량 트렌드 (TB)
              </h3>
            </div>
            <div className="flex-1 p-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={storageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorStorage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="usage" stroke="#10B981" fillOpacity={1} fill="url(#colorStorage)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <Network size={14} className="text-blue-500" /> 네트워크 트래픽 분석 (GB)
              </h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-[10px] font-bold text-gray-500">Outbound</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[10px] font-bold text-gray-500">Inbound</span></div>
              </div>
            </div>
            <div className="flex-1 p-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={networkData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="out" stroke="#3B82F6" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="in" stroke="#10B981" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filteredTenantsForTabs = useMemo(() => {
    if (!searchTerm) return tenants;
    return tenants.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [tenants, searchTerm]);

  return (
    <div className="flex h-full flex-col bg-[#F8FAFC]">
      <div className="flex-1 overflow-y-auto w-full">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-8 space-y-6">
          
          <div className="flex h-[48px] shrink-0 items-center justify-between bg-white px-4 rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 min-w-0 flex-1">
              {filteredTenantsForTabs.map((t) => {
                const idx = tenants.findIndex(at => at.id === t.id);
                const isSelected = activeCompanyIdx === idx;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveCompanyIdx(idx)}
                    className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold transition-all ${
                      isSelected ? 'bg-primary-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
            <div className="hidden md:flex items-center gap-4 pl-4 shrink-0">
              <div className="h-4 w-px bg-gray-200 shrink-0" />
              <div className="relative shrink-0">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                <input
                  className="h-[30px] w-36 rounded-full border border-gray-200 bg-white pl-8 pr-4 text-[12px] transition-all focus:w-48 focus:border-blue-300 focus:outline-none"
                  placeholder="Tenant 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Combined Sub Filter Bar (Requirement 4 Implementation) */}
          <div className="flex h-[48px] shrink-0 items-center justify-between bg-white px-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-1 select-none">
              <div className="flex items-center rounded-full bg-slate-50 p-1 border border-slate-100">
                <button
                  onClick={() => setActiveTab('company')}
                  className={`rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all ${
                    activeTab === 'company'
                      ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  회사별
                </button>
                <button
                  onClick={() => setActiveTab('project')}
                  className={`rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all ${
                    activeTab === 'project'
                      ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  프로젝트별
                </button>
              </div>

              {activeTab === 'project' && (
                <>
                  <div className="mx-3 h-4 w-px bg-gray-200 shrink-0" />
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {visibleSubtenants.length > 0 ? (
                      visibleSubtenants.map((subtenant, index) => (
                        <button
                          key={subtenant.subtenantId}
                          onClick={() => {
                            if (currentUser?.role !== 'subtenant_member') setActiveProjIdx(index);
                          }}
                          className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all border ${
                            safeProjIdx === index
                              ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm'
                              : 'text-gray-500 border-transparent hover:bg-gray-50'
                          } ${currentUser?.role === 'subtenant_member' && safeProjIdx !== index ? 'hidden' : ''}`}
                        >
                          <Building2 size={12} className={safeProjIdx === index ? 'text-blue-600' : 'text-gray-400'} />
                          {subtenant.name}
                        </button>
                      ))
                    ) : (
                      <span className="text-[11px] font-bold italic text-gray-300 px-2 tracking-tighter">No Subtenants</span>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select className="h-[32px] w-[110px] rounded-lg border border-gray-200 bg-white px-2.5 text-[12px] font-black text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-100 transition-all cursor-pointer">
                <option>2026.03</option>
                <option>2026.02</option>
                <option>2026.01</option>
              </select>
              <button className="h-[32px] px-4 rounded-lg bg-gray-900 shadow-lg shadow-gray-200 text-[11px] font-black uppercase tracking-wider text-white hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center gap-2">
                <Download size={13} /> 다운로드
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 min-h-[600px]">
            {loading ? (
              <div className="flex h-[400px] items-center justify-center text-sm text-gray-400 italic">데이터 로딩 중...</div>
            ) : error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
            ) : activeTab === 'company' && metering ? (
              renderContent(
                `${metering.tenantName} - ${metering.period} 통합 미터링 내역`,
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
                `${selectedProject.name} - ${metering?.period ?? '2026.03'} 프로젝트 미터링 내역`,
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
            ) : (
              <div className="flex h-[400px] flex-col items-center justify-center text-gray-400 bg-gray-50/30 rounded-xl border border-dashed border-gray-200">
                <TerminalSquare className="mb-4 opacity-20" size={48} />
                <p className="text-sm font-bold uppercase tracking-wider">조회할 데이터가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
