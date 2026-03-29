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
import { useTheme } from 'next-themes';

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
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'company' | 'project'>('company');
  const initialCompanyIdx = Math.max(0, initialTenants.findIndex(t => t.id === initialTenantId));
  const [activeCompanyIdx, setActiveCompanyIdx] = useState(initialCompanyIdx);
  const [activeProjIdx, setActiveProjIdx] = useState(0);
  const [tenants, setTenants] = useState<TenantRecord[]>(initialTenants);
  const [metering, setMetering] = useState<MeteringResponse | null>(initialMetering);
  const [loading, setLoading] = useState(initialMetering === null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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

    const [mainTitle, subTitle] = title.split(' - ');
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div className="flex flex-col">
            <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-slate-100 tracking-tight leading-tight flex items-center gap-2 flex-wrap">
              {mainTitle}
              <div className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-[9px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-tighter">실시간 분석 활성화</div>
              <span className="hidden sm:inline"> - {subTitle}</span>
            </h2>
            <span className="sm:hidden text-xs font-bold text-gray-400 dark:text-slate-500 mt-1">{subTitle}</span>
          </div>
        </div>

        {/* KPI Cards (Step 2 Implementation) */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm card-depth p-5 transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Cpu size={16} className="text-blue-500" />
              </div>
              <span className="text-sm text-gray-500 dark:text-slate-400 font-bold uppercase tracking-wider">CPU 코어 자원</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-black text-gray-900 dark:text-slate-100 tabular-nums">{allocatedCpu}<span className="text-sm ml-1 text-gray-400 dark:text-slate-500">/ {contractedCpu}</span></p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{isProject ? '할당량 기준' : '계약량 기준'}</p>
              </div>
              <div className="text-xs font-black text-blue-600 mb-1">{Math.round(cpuPercent)}%</div>
            </div>
            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${cpuPercent}%` }} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm card-depth p-5 transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <TerminalSquare size={16} className="text-indigo-500" />
              </div>
              <span className="text-sm text-gray-500 dark:text-slate-400 font-bold uppercase tracking-wider">GPU 인스턴스</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-black text-gray-900 dark:text-slate-100 tabular-nums">{allocatedGpu}<span className="text-sm ml-1 text-gray-400 dark:text-slate-500">/ {contractedGpu}</span></p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{isProject ? '할당 인스턴스' : '과금 인스턴스'}</p>
              </div>
              <div className="text-xs font-black text-indigo-600 mb-1">{Math.round(gpuPercent)}%</div>
            </div>
            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${gpuPercent}%` }} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm card-depth p-5 transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <HardDrive size={16} className="text-emerald-500" />
              </div>
              <span className="text-sm text-gray-500 dark:text-slate-400 font-bold uppercase tracking-wider">스토리지 사용</span>
            </div>
            <p className="text-2xl font-black text-emerald-600 tabular-nums">{storageUsage.toLocaleString()}<span className="text-sm ml-1 text-gray-400 dark:text-slate-500">TB</span></p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">월 평균 실사용 누계</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm card-depth p-5 transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <Network size={16} className="text-amber-500" />
              </div>
              <span className="text-sm text-gray-500 dark:text-slate-400 font-bold uppercase tracking-wider">네트워크 트래픽</span>
            </div>
            <p className="text-2xl font-black text-amber-600 tabular-nums">{(networkOutUsage + networkInUsage).toLocaleString()}<span className="text-sm ml-1 text-gray-400 dark:text-slate-500">GB</span></p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">In/Out bound 트래픽 합계</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm card-depth overflow-hidden flex flex-col min-h-[400px]">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/30 flex justify-between items-center">
              <h3 className="text-xs font-black text-gray-900 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
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
                  <RechartsTooltip contentStyle={{ 
                    borderRadius: '12px', 
                    border: mounted && resolvedTheme === 'dark' ? '1px solid #334155' : 'none', 
                    backgroundColor: mounted && resolvedTheme === 'dark' ? '#1E293B' : '#ffffff',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', 
                    fontSize: '11px',
                    color: mounted && resolvedTheme === 'dark' ? '#F1F5F9' : '#111827'
                  }} />
                  <Area type="monotone" dataKey="usage" stroke="#10B981" fillOpacity={1} fill="url(#colorStorage)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm card-depth overflow-hidden flex flex-col min-h-[400px]">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/30 flex justify-between items-center">
              <h3 className="text-xs font-black text-gray-900 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
                <Network size={14} className="text-blue-500" /> 네트워크 트래픽 분석 (GB)
              </h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-[10px] font-bold text-gray-500 dark:text-slate-400">Outbound</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[10px] font-bold text-gray-500 dark:text-slate-400">Inbound</span></div>
              </div>
            </div>
            <div className="flex-1 p-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={networkData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <RechartsTooltip contentStyle={{ 
                    borderRadius: '12px', 
                    border: mounted && resolvedTheme === 'dark' ? '1px solid #334155' : 'none', 
                    backgroundColor: mounted && resolvedTheme === 'dark' ? '#1E293B' : '#ffffff',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', 
                    fontSize: '11px',
                    color: mounted && resolvedTheme === 'dark' ? '#F1F5F9' : '#111827'
                  }} />
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
    <div className="flex h-full flex-col bg-[#F8FAFC] dark:bg-slate-900">
      <div className="flex-1 overflow-y-auto w-full">
        <div className="mx-auto w-full max-w-[1400px] px-6 pb-8 space-y-6">
          
          <div className="flex h-[48px] shrink-0 items-center justify-between bg-white dark:bg-slate-800 px-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm card-depth overflow-hidden">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 min-w-0 flex-1">
              {filteredTenantsForTabs.map((t) => {
                const idx = tenants.findIndex(at => at.id === t.id);
                const isSelected = activeCompanyIdx === idx;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveCompanyIdx(idx)}
                    className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold transition-all ${
                      isSelected ? 'bg-primary-50 text-blue-600' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900'
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
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={13} />
                <input
                  className="h-[30px] w-36 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-4 text-[12px] transition-all focus:w-48 focus:border-blue-300 focus:outline-none"
                  placeholder="Tenant 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Combined Sub Filter Bar (Requirement 4 Implementation) */}
          <div className="flex flex-col md:flex-row md:h-[48px] shrink-0 items-start md:items-center justify-between bg-white dark:bg-slate-800 p-3 md:px-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm card-depth gap-3 md:gap-0">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-1 w-full md:w-auto">
              <div className="flex items-center rounded-full bg-slate-50 dark:bg-slate-900/50 p-1 border border-slate-100 dark:border-slate-700/50 shrink-0">
                <button
                  onClick={() => setActiveTab('company')}
                  className={`rounded-full px-4 py-1.5 text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all ${
                    activeTab === 'company'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm card-depth ring-1 ring-slate-200 dark:ring-slate-600'
                      : 'text-gray-400 dark:text-slate-500 hover:text-gray-600'
                  }`}
                >
                  회사별
                </button>
                <button
                  onClick={() => setActiveTab('project')}
                  className={`rounded-full px-4 py-1.5 text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all ${
                    activeTab === 'project'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm card-depth ring-1 ring-slate-200 dark:ring-slate-600'
                      : 'text-gray-400 dark:text-slate-500 hover:text-gray-600'
                  }`}
                >
                  프로젝트별
                </button>
              </div>

              {activeTab === 'project' && (
                <div className="flex items-center gap-1.5 w-full md:w-auto overflow-hidden">
                  <div className="hidden md:block mx-3 h-4 w-px bg-gray-200 dark:bg-slate-700 shrink-0" />
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide w-full md:max-w-md lg:max-w-lg py-0.5">
                    {visibleSubtenants.length > 0 ? (
                      visibleSubtenants.map((subtenant, index) => (
                        <button
                          key={subtenant.subtenantId}
                          onClick={() => {
                            if (currentUser?.role !== 'subtenant_member') setActiveProjIdx(index);
                          }}
                          className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[10px] md:text-[11px] font-bold transition-all border ${
                            safeProjIdx === index
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-100 dark:border-blue-800 shadow-sm card-depth'
                              : 'text-gray-500 dark:text-slate-400 border-transparent hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900'
                          } ${currentUser?.role === 'subtenant_member' && safeProjIdx !== index ? 'hidden' : ''}`}
                        >
                          <Building2 size={12} className={safeProjIdx === index ? 'text-blue-600' : 'text-gray-400 dark:text-slate-500'} />
                          {subtenant.name}
                        </button>
                      ))
                    ) : (
                      <span className="text-[10px] font-bold italic text-gray-300 px-2 tracking-tighter">No Projects</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-slate-700/50">
              <select className="bg-white dark:bg-slate-900 h-[32px] flex-1 md:flex-none md:w-[110px] rounded-lg border border-gray-200 dark:border-slate-700 px-2.5 text-[12px] font-black text-gray-700 dark:text-slate-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-100 transition-all cursor-pointer">
                <option>2026.03</option>
                <option>2026.02</option>
                <option>2026.01</option>
              </select>
              <button className="h-[32px] flex-1 md:flex-none px-4 rounded-lg bg-gray-900 dark:bg-slate-700 shadow-sm card-depth text-[11px] font-black uppercase tracking-wider text-white hover:bg-gray-800 dark:hover:bg-slate-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                <Download size={13} /> <span className="hidden sm:inline">다운로드</span><span className="sm:hidden">PDF</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm card-depth p-8 min-h-[600px]">
            {loading ? (
              <div className="flex h-[400px] items-center justify-center text-sm text-gray-400 dark:text-slate-500 italic">데이터 로딩 중...</div>
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
              <div className="flex h-[400px] flex-col items-center justify-center text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
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
