'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell, YAxis as RechartsYAxis
} from 'recharts';
import Link from 'next/link';
import { tenants, gpuNodes } from '@/lib/mockData';
import { Cpu, HardDrive, Network, TerminalSquare, Clock, ChevronRight, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';

type KpiCardProps = {
  title: string;
  value: string;
  subtext: string;
  percentage: number;
  status: 'normal' | 'warning' | 'danger';
};

function KPICard({ title, value, subtext, percentage, status }: KpiCardProps) {
  const getGradient = (status: string) => {
    if (status === 'danger') return 'bg-danger';
    if (status === 'warning') return 'bg-warning';
    return 'bg-gradient-to-r from-primary-400 to-primary-600';
  };

  const getColorText = (status: string) => {
    if (status === 'danger') return 'text-danger';
    if (status === 'warning') return 'text-warning';
    return 'text-primary-600';
  };

  return (
    <div className="bg-white dark:bg-slate-800 border text-left border-gray-200 dark:border-slate-700 rounded-[12px] p-3 shadow-sm card-depth sm:p-[16px_20px] lg:rounded-[14px] lg:p-[18px_22px] lg:shadow-[0_8px_24px_-16px_rgba(15,23,42,0.15)]">
      <div className="flex justify-between items-start mb-1 sm:mb-2">
        <div>
          <h3 className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 dark:text-slate-500 uppercase tracking-wide sm:text-[11px] lg:text-[12px]">{title}</h3>
          <p className="mt-1 hidden text-[12px] text-gray-400 dark:text-slate-500 dark:text-slate-500 sm:block lg:text-[13px]">{subtext}</p>
        </div>
      </div>
      <div className="mt-2 sm:mt-4">
        <div className={`text-[18px] font-bold font-mono leading-none sm:text-[28px] lg:text-[26px] ${getColorText(status)}`}>
          {value}
        </div>
        <div className="w-full h-[4px] sm:h-[5px] bg-gray-100 dark:bg-slate-700 rounded-[3px] mt-3 sm:mt-4 overflow-hidden">
          <div 
            className={`h-full ${getGradient(status)} rounded-[3px] transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

const gpuUsageData = [
  { date: '3-13(금)', usage: 98 },
  { date: '3-14(토)', usage: 97 },
  { date: '3-15(일)', usage: 94 },
  { date: '3-16(월)', usage: 94 },
  { date: '3-17(화)', usage: 94 },
  { date: '3-18(수)', usage: 96 },
  { date: '3-19(목)', usage: 95 },
];

const top3ResourceData = [
  { time: '11:00', inst1: 4, inst2: 2, inst3: 3 },
  { time: '14:00', inst1: 7, inst2: 8, inst3: 7 },
  { time: '17:00', inst1: 7, inst2: 7, inst3: 7 },
  { time: '20:00', inst1: 7, inst2: 7, inst3: 7 },
  { time: '23:00', inst1: 7, inst2: 7, inst3: 7 },
  { time: '02:00', inst1: 7, inst2: 6, inst3: 7 },
  { time: '05:00', inst1: 8, inst2: 8, inst3: 8 },
  { time: '08:00', inst1: 4, inst2: 1, inst3: 3 },
  { time: '09:00', inst1: 7, inst2: 7, inst3: 7 },
];

export default function HomeDashboard() {
  const { currentUser } = useAuth();
  const { resolvedTheme } = useTheme();
  const [activeFilter, setActiveFilter] = useState<'all' | 'ok' | 'warn' | 'err'>('all');
  const [activeTenantIdx, setActiveTenantIdx] = useState(0);
  const [meteringData, setMeteringData] = useState<any>(null);
  const [ticketsData, setTicketsData] = useState<any[]>([]);
  const [loadingMetering, setLoadingMetering] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // 역할에 따른 테넌트 필터링
  const visibleTenants = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin') return tenants;
    return tenants.filter(t => t.id === currentUser.tenantId);
  }, [currentUser]);

  const tenant = visibleTenants[activeTenantIdx] || visibleTenants[0];

  useEffect(() => {
    if (!tenant) return;
    const fetchMetering = async () => {
      setLoadingMetering(true);
      try {
        const res = await fetch(`/api/metering/${tenant.id}`);
        const json = await res.json();
        setMeteringData(json.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingMetering(false);
      }
    };
    fetchMetering();
  }, [tenant?.id]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchTickets = async () => {
      setLoadingTickets(true);
      try {
        const res = await fetch('/api/tickets');
        const json = await res.json();
        let data = json.data || [];
        
        // 일관성을 위해 역할별 티켓 필터링
        if (currentUser.role === 'tenant_admin') {
          data = data.filter((t: any) => t.tenantId === currentUser.tenantId);
        } else if (currentUser.role === 'subtenant_member') {
          data = data.filter((t: any) => t.subtenantId === currentUser.subtenantId);
        }
        
        setTicketsData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingTickets(false);
      }
    };
    fetchTickets();
  }, [currentUser]);

  // 역할에 따른 노드 필터링
  const tNodes = useMemo(() => {
    if (!tenant) return [];
    let nodes = gpuNodes.filter(n => n.tenantId === tenant.id);
    
    if (currentUser?.role === 'subtenant_member') {
      nodes = nodes.filter(n => n.subtenantId === currentUser.subtenantId);
    }
    return nodes;
  }, [tenant, currentUser]);

  const cntOk = tNodes.filter(n => n.status === 'ok').length;
  const cntWarn = tNodes.filter(n => n.status === 'warn').length;
  const cntErr = tNodes.filter(n => n.status === 'err').length;

  const filteredInstances = useMemo(() => {
    if (activeFilter === 'all') return tNodes;
    return tNodes.filter(n => n.status === activeFilter);
  }, [tNodes, activeFilter]);

  // KPI 계산
  const totalNodesForKpi = useMemo(() => {
    if (currentUser?.role === 'admin' && activeTenantIdx === -1) return gpuNodes; // 만약 전체선택 기능 있다면
    return tNodes;
  }, [currentUser, tNodes, activeTenantIdx]);

  const gpuOccupancy = totalNodesForKpi.length > 0 ? (totalNodesForKpi.filter(n => n.gpuUsage > 0).length / totalNodesForKpi.length * 100).toFixed(1) : "0.0";
  const cpuUsage = "74.2";
  const memUsage = "62.8";

  // Subtenant별 현황 데이터 (tenant_admin 전용)
  const subtenantStats = useMemo(() => {
    if (currentUser?.role !== 'tenant_admin' || !tenant) return [];
    return tenant.subtenants.map(sub => {
      const subNodes = gpuNodes.filter(n => n.subtenantId === sub.id);
      const avgGpuUsage = subNodes.length > 0 
        ? subNodes.reduce((acc, curr) => acc + curr.gpuUsage, 0) / subNodes.length 
        : 0;
      return {
        name: sub.name,
        usage: Math.round(avgGpuUsage),
        fullScale: 100
      };
    });
  }, [currentUser, tenant]);

  if (!currentUser) return <div className="p-10 text-center text-gray-400 dark:text-slate-500">Loading...</div>;

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 lg:gap-7">
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-5 xl:grid-cols-4">
        <KPICard title="GPU 점유율" value={`${gpuOccupancy}%`} subtext={currentUser.role === 'admin' ? "전체 인프라 활성화" : "할당된 GPU 중 활성화 비율"} percentage={parseFloat(gpuOccupancy)} status="normal" />
        <KPICard title="AI 스토리지" value={`${tenant?.contract.storage.capacity || 0}${tenant?.contract.storage.unit || 'TB'}`} subtext="계약 용량" percentage={45.2} status="normal" />
        <KPICard title="CPU 사용률" value={`${cpuUsage}%`} subtext="전체 클러스터 vCPU 사용" percentage={parseFloat(cpuUsage)} status="normal" />
        <KPICard title="메모리 사용률" value={`${memUsage}%`} subtext="전체 클러스터 RAM 사용" percentage={parseFloat(memUsage)} status="normal" />
      </div>

      {currentUser.role === 'admin' && (
        <div className="border-b border-gray-200 dark:border-slate-700 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 min-w-max">
            {visibleTenants.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setActiveTenantIdx(idx)}
                className={`px-[18px] py-[10px] text-[13px] font-medium transition-all ${
                  activeTenantIdx === idx
                    ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                    : 'text-gray-600 dark:text-slate-400 hover:text-primary-600 border-b-2 border-transparent'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative flex flex-col gap-4 items-stretch xl:grid xl:grid-cols-[260px_minmax(0,1fr)_minmax(0,1fr)] lg:gap-5">
        {currentUser.role === 'tenant_admin' ? (
          <div className="relative flex h-full min-h-[420px] flex-col overflow-visible rounded-[10px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 md:p-6 lg:rounded-[12px] lg:p-7 xl:min-h-0">
            <h2 className="mb-6 text-[14px] font-semibold text-gray-900 dark:text-slate-100 lg:text-[15px]">Subtenant별 GPU 사용률</h2>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subtenantStats} layout="vertical" margin={{ left: 0, right: 30, top: 0, bottom: 0 }}>
                  <XAxis type="number" hide domain={[0, 100]} />
                  <RechartsYAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    width={80} 
                    tick={{ fontSize: 12, fontWeight: 600, fill: '#94A3B8' }} 
                  />
                  <RechartsTooltip 
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-2 rounded shadow-sm card-depth text-xs font-bold text-gray-900 dark:text-slate-100">
                            {payload[0].value}% 사용 중
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="usage" radius={[0, 4, 4, 0]} barSize={24}>
                    {subtenantStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.usage > 90 ? '#EF4444' : entry.usage > 70 ? '#F59E0B' : '#3B82F6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700 flex flex-col gap-2">
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-600 dark:text-slate-400">활성 Subtenant</span>
                <span className="font-bold text-gray-900 dark:text-slate-100">{tenant?.subtenants.filter(s => s.status === '활성').length} / {tenant?.subtenants.length}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-600 dark:text-slate-400">전체 멤버 수</span>
                <span className="font-bold text-gray-900 dark:text-slate-100">{tenant?.subtenants.reduce((acc, curr) => acc + curr.memberCount, 0)} 명</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative flex h-full min-h-[420px] flex-col overflow-visible rounded-[10px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 md:p-6 lg:rounded-[12px] lg:p-7 xl:min-h-0">
            <h2 className="mb-6 text-[14px] font-semibold text-gray-900 dark:text-slate-100 lg:text-[15px]">{currentUser.role === 'subtenant_member' ? '우리 팀 GPU 사용' : 'GPU 사용 현황'}</h2>

            <div className="flex flex-col items-center mb-8 flex-1 justify-center">
              <div className="flex h-[160px] w-[160px] items-center justify-center md:h-[180px] md:w-[180px]">
                <svg viewBox="0 0 120 120" className="w-full h-full">
                  <circle
                    cx="60" cy="60" r="48"
                    className="text-gray-100 dark:text-slate-700"
                    strokeWidth="14" stroke="currentColor" fill="none"
                  />
                  <circle
                    cx="60" cy="60" r="48"
                    className="text-primary-500"
                    strokeWidth="14"
                    strokeDasharray={`${(parseFloat(gpuOccupancy) / 100) * (2 * Math.PI * 48)} ${2 * Math.PI * 48}`}
                    strokeLinecap="round" stroke="currentColor" fill="none"
                    transform="rotate(-90 60 60)"
                  />
                  <text x="60" y="55" fontSize="9" fill="#94A3B8" textAnchor="middle" fontWeight="600">GPU 점유율</text>
                  <text x="60" y="75" fontSize="18" fill="currentColor" className="text-gray-900 dark:text-slate-100" textAnchor="middle" fontWeight="bold" fontFamily="monospace">{gpuOccupancy}%</text>
                </svg>
              </div>

              <div className="flex gap-4 mt-6 text-[12px] text-gray-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-primary-500 rounded-sm"></div>
                  <span>실행 {gpuOccupancy}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-gray-100 dark:bg-slate-700 rounded-sm border border-gray-200 dark:border-slate-700 dark:border-slate-600"></div>
                  <span>대기 {(100 - parseFloat(gpuOccupancy)).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-[13px] border-t border-gray-100 dark:border-slate-700 pt-6 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-slate-400">GPU 인스턴스 수</span>
                <span className="font-mono font-bold text-gray-900 dark:text-slate-100">{tNodes.length} 개</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-slate-400">GPU 스펙</span>
                <span className="font-mono font-bold text-gray-900 dark:text-slate-100">NVIDIA B200</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-slate-400">총 연산 성능</span>
                <span className="font-mono font-bold text-gray-900 dark:text-slate-100">{(tNodes.length * 103).toLocaleString()} PFlops</span>
              </div>
            </div>
          </div>
        )}

        <div className="relative flex h-full min-h-[380px] flex-col overflow-hidden rounded-[10px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm card-depth md:p-6 lg:rounded-[12px] lg:p-7 lg:shadow-[0_8px_24px_-16px_rgba(15,23,42,0.15)] xl:min-h-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[14px] font-semibold text-gray-900 dark:text-slate-100 lg:text-[15px]">인스턴스 내비게이터</h2>
            <Link href="/monitoring/gpu" className="text-[12px] font-semibold text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-700 px-3 py-1.5 rounded-[5px] hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900 dark:hover:bg-slate-700 flex items-center gap-1 transition-all">
              상세 보기 <span className="text-[10px]">→</span>
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2 py-1 rounded-[5px] text-[11px] font-semibold border transition-all ${activeFilter === 'all' ? 'shadow-[0_0_0_2px_currentColor] border-gray-300 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100' : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-slate-400'}`}
            >
              전체 {tNodes.length}개
            </button>
            <button
              onClick={() => setActiveFilter('ok')}
              className={`px-2 py-1 rounded-[5px] text-[11px] font-semibold border transition-all flex items-center gap-1 ${activeFilter === 'ok' ? 'shadow-[0_0_0_2px_currentColor] border-[#BFDBFE] bg-[#DBEAFE] text-[#1D4ED8]' : 'border-[#BFDBFE] bg-[#DBEAFE] text-[#1D4ED8] opacity-70'}`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8]"></div> 정상 {cntOk}개
            </button>
            <button
              onClick={() => setActiveFilter('warn')}
              className={`px-2 py-1 rounded-[5px] text-[11px] font-semibold border transition-all flex items-center gap-1 ${activeFilter === 'warn' ? 'shadow-[0_0_0_2px_currentColor] border-[#FDE68A] bg-[#FEF3C7] text-[#92400E]' : 'border-[#FDE68A] bg-[#FEF3C7] text-[#92400E] opacity-70'}`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#92400E]"></div> 주의 {cntWarn}개
            </button>
            <button
               onClick={() => setActiveFilter('err')}
              className={`px-2 py-1 rounded-[5px] text-[11px] font-semibold border transition-all flex items-center gap-1 ${activeFilter === 'err' ? 'shadow-[0_0_0_2px_currentColor] border-[#FECDD3] bg-[#FFF1F2] text-[#BE123C]' : 'border-[#FECDD3] bg-[#FFF1F2] text-[#BE123C] opacity-70'}`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#BE123C]"></div> 장애 {cntErr}개
            </button>
          </div>

          <div className="w-full relative overflow-visible flex-1">
            {tNodes.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 dark:text-slate-500 text-[12px] italic">
                할당된 GPU 리소스가 없습니다.
              </div>
            ) : (
              <div
                className="grid gap-[6px] w-full max-w-[320px] mx-auto xl:mx-0"
                style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}
              >
                {filteredInstances.map((inst, i) => {
                  let bg = 'bg-[#BFDBFE] hover:bg-[#93C5FD]'; 
                  if (inst.status === 'warn') bg = 'bg-[#FEF3C7] hover:bg-[#FDE68A]';
                  if (inst.status === 'err') bg = 'bg-[#FECDD3] hover:bg-[#FDA4AF]';

                  return (
                    <Link
                      href="/monitoring/gpu"
                      key={i}
                      className={`aspect-square rounded-[5px] transition-all relative group cursor-pointer ${bg}`}
                    >
                      <div className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 w-max bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-[8px] px-3 py-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                        <div className="text-[12px] font-medium text-gray-900 dark:text-slate-100 font-mono mb-1">{inst.name}</div>
                        <div className="flex items-center gap-1 text-[11px] mb-2 font-semibold">
                          {inst.status === 'ok' && <><span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8]"></span><span className="text-gray-900 dark:text-slate-100">정상</span></>}
                          {inst.status === 'warn' && <><span className="w-1.5 h-1.5 rounded-full bg-[#92400E]"></span><span className="text-gray-900 dark:text-slate-100">주의</span></>}
                          {inst.status === 'err' && <><span className="w-1.5 h-1.5 rounded-full bg-[#BE123C]"></span><span className="text-gray-900 dark:text-slate-100">장애</span></>}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-slate-400 mb-2">GPU {inst.gpuUsage}% · Mem {inst.memUsage}%</div>
                        <div className="text-[10px] text-primary-500 font-medium border-t border-gray-100 dark:border-slate-700 pt-2 mt-1 whitespace-nowrap">클릭 → 모니터링 이동 ↗</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="relative flex h-full flex-col gap-4 lg:min-h-0 lg:gap-5">
          <div className="relative flex h-full min-h-[320px] flex-col flex-none rounded-[10px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm card-depth md:flex-1 md:p-6 lg:rounded-[12px] lg:p-7 lg:shadow-[0_8px_24px_-16px_rgba(15,23,42,0.15)]">
            <h2 className="mb-6 text-[14px] font-semibold text-gray-900 dark:text-slate-100 lg:text-[15px]">주간 GPU 사용률</h2>
            <div className="h-[250px] md:h-auto md:flex-1 w-full min-h-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gpuUsageData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-slate-700" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={(val) => `${val}%`} domain={[0, 100]} />
                  <RechartsTooltip
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: resolvedTheme === 'dark' ? '1px solid #334155' : '1px solid #E5E7EB', 
                      backgroundColor: resolvedTheme === 'dark' ? '#1E293B' : '#ffffff', 
                      fontSize: '12px', 
                      fontWeight: 600, 
                      color: resolvedTheme === 'dark' ? '#F1F5F9' : '#111827',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    itemStyle={{ color: resolvedTheme === 'dark' ? '#F1F5F9' : '#111827' }}
                  />
                  {/* Note: Standard tooltips might need specific class for dark mode if custom content is preferred */}
                  <Area type="monotone" dataKey="usage" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorUsage)" activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-[10px] py-5 md:py-6 relative flex-none flex flex-col overflow-hidden min-h-[360px] xl:min-h-0 shadow-sm card-depth">
            <div className="px-6 flex justify-between items-center mb-4">
              <h2 className="text-[14px] font-semibold text-gray-900 dark:text-slate-100">리소스 사용 TOP3 인스턴스</h2>
              <div className="flex gap-2">
                <button className="text-[11px] px-3 py-1.5 rounded-[5px] bg-primary-600 text-white font-semibold shadow-sm card-depth">1일</button>
                <button className="text-[11px] px-3 py-1.5 rounded-[5px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900 dark:hover:bg-slate-700 transition-all">3일</button>
              </div>
            </div>

            <div className="w-full max-w-full relative px-6">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={top3ResourceData} margin={{ left: -20, right: 0, top: 4, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-slate-700" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dy={10} interval={Math.ceil(top3ResourceData.length / 5)} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} tickFormatter={(val) => `${val}%`} domain={[0, 12]} />
                   <RechartsTooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: resolvedTheme === 'dark' ? '1px solid #334155' : '1px solid #E5E7EB', 
                      backgroundColor: resolvedTheme === 'dark' ? '#1E293B' : '#ffffff', 
                      fontSize: '12px', 
                      fontWeight: 600, 
                      color: resolvedTheme === 'dark' ? '#F1F5F9' : '#111827' 
                    }} 
                  />
                  <Line type="stepAfter" dataKey="inst1" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  <Line type="stepAfter" dataKey="inst2" stroke="#10B981" strokeWidth={2} dot={false} />
                  <Line type="stepAfter" dataKey="inst3" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center mt-3 gap-x-4 gap-y-1 text-[10px] font-semibold text-gray-500 dark:text-slate-400 dark:text-slate-500">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div> gsvp-msi-gpu001</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#10B981]"></div> gsvp-msi-gpu025</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#8B5CF6]"></div> gsvp-msi-gpu028</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Monthly Metering Summary */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm card-depth flex flex-col min-h-[360px]">
          <div className="px-5 py-4 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
               <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Activity size={14} className="text-blue-600 dark:text-blue-400" />
               </div>
               <h2 className="text-[14px] font-bold text-gray-900 dark:text-slate-100">이번달 미터링 요약 <span className="text-gray-400 dark:text-slate-500 dark:text-slate-500 font-medium ml-1">({meteringData?.period || '2026.03'})</span></h2>
            </div>
          </div>
          
          <div className="p-6 flex-1 space-y-6">
            {loadingMetering ? (
              <div className="h-full flex items-center justify-center text-gray-400 dark:text-slate-500 text-sm italic">로딩 중...</div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <Cpu size={14} className="text-gray-400 dark:text-slate-500 dark:text-slate-500" />
                        <span className="text-xs font-bold text-gray-500 dark:text-slate-400">CPU 코어</span>
                      </div>
                      <span className="text-xs font-black text-gray-900 dark:text-slate-100">{tNodes.length * 8}<span className="text-gray-400 dark:text-slate-500 dark:text-slate-500 font-bold ml-0.5">/ {meteringData?.fixed?.cpu?.contracted || 0}</span></span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                        style={{ width: `${Math.min(100, ((tNodes.length * 8) / (meteringData?.fixed?.cpu?.contracted || 1)) * 100)}%` }} 
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <TerminalSquare size={14} className="text-gray-400 dark:text-slate-500" />
                        <span className="text-xs font-bold text-gray-500 dark:text-slate-400">GPU 인스턴스</span>
                      </div>
                      <span className="text-xs font-black text-gray-900 dark:text-slate-100">{tNodes.length}<span className="text-gray-400 dark:text-slate-500 font-bold ml-0.5">/ {meteringData?.fixed?.gpu?.contracted || 0}</span></span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                        style={{ width: `${Math.min(100, (tNodes.length / (meteringData?.fixed?.gpu?.contracted || 1)) * 100)}%` }} 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/50 dark:border-emerald-800/30">
                      <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <HardDrive size={12} /> STORAGE
                      </p>
                      <p className="text-xl font-black text-gray-900 dark:text-slate-100 tabular-nums">
                        {meteringData?.variable?.storage?.usage || 0}<span className="text-xs ml-1 text-gray-400 dark:text-slate-500 dark:text-slate-500">TB</span>
                      </p>
                   </div>
                   <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100/50">
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <Network size={12} /> NETWORK OUT
                      </p>
                      <p className="text-xl font-black text-gray-900 dark:text-slate-100 tabular-nums">
                        {meteringData?.variable?.networkOutbound?.usage || 0}<span className="text-xs ml-1 text-gray-400 dark:text-slate-500">GB</span>
                      </p>
                   </div>
                </div>
              </>
            )}
          </div>

          <Link href="/billing/metering" className="p-4 border-t border-gray-100 dark:border-slate-700 text-center text-[12px] font-bold text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-1">
            자세히 보기 <ChevronRight size={14} />
          </Link>
        </div>

        {/* Right: Recent Support Tickets (compact) */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm card-depth flex flex-col min-h-[360px]">
          <div className="px-5 py-4 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
               <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                  <Clock size={14} className="text-amber-600 dark:text-amber-400" />
               </div>
               <h2 className="text-[14px] font-bold text-gray-900 dark:text-slate-100">최근 지원 티켓</h2>
            </div>
            {ticketsData.filter(t => t.status === '대기중').length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold border border-red-100">
                대기 {ticketsData.filter(t => t.status === '대기중').length}건
              </span>
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            {loadingTickets ? (
              <div className="h-full flex items-center justify-center text-gray-400 dark:text-slate-500 text-sm italic">로딩 중...</div>
            ) : ticketsData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 dark:text-slate-500 text-sm italic">등록된 티켓이 없습니다.</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {ticketsData.slice(0, 3).map(ticket => (
                  <Link href="/support/tickets" key={ticket.id} className="block p-4 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900/50 dark:hover:bg-slate-700 transition-all">
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                          ticket.type === '장애접수' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/50' : 
                          ticket.type === '기술지원' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50' : 
                          'bg-gray-50 dark:bg-slate-900 dark:bg-slate-700 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-700 dark:border-slate-600'
                        }`}>
                          {ticket.type}
                        </span>
                        <h3 className="text-[13px] font-bold text-gray-900 dark:text-slate-100 truncate max-w-[200px]">{ticket.title}</h3>
                      </div>
                      <span className={`text-[10px] font-bold ${
                        ticket.status === '대기중' ? 'text-amber-600 dark:text-amber-400' :
                        ticket.status === '처리중' ? 'text-blue-600 dark:text-blue-400' :
                        'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-slate-500 dark:text-slate-500">
                      <span className="font-mono">{ticket.ticket_number}</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {ticket.created_at?.slice(0, 10)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/support/tickets" className="p-4 border-t border-gray-100 dark:border-slate-700 text-center text-[12px] font-bold text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-1">
            전체 보기 <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
