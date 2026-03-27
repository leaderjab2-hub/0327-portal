'use client';

import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import Link from 'next/link';
import { tenants, gpuNodes } from '@/lib/mockData';

function KPICard({ title, value, subtext, percentage, status }: any) {
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
    <div className="bg-white border text-left border-gray-200 rounded-[10px] p-3 sm:p-[16px_20px] shadow-sm">
      <div className="flex justify-between items-start mb-1 sm:mb-2">
        <div>
          <h3 className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{title}</h3>
          <p className="hidden sm:block text-[12px] text-gray-400 mt-1">{subtext}</p>
        </div>
      </div>
      <div className="mt-2 sm:mt-4">
        <div className={`text-[18px] sm:text-[28px] font-bold font-mono ${getColorText(status)} leading-none`}>
          {value}
        </div>
        <div className="w-full h-[4px] sm:h-[5px] bg-gray-100 rounded-[3px] mt-3 sm:mt-4 overflow-hidden">
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
  const [activeFilter, setActiveFilter] = useState<'all' | 'ok' | 'warn' | 'err'>('all');
  const [activeTenantIdx, setActiveTenantIdx] = useState(0);

  const tenant = tenants[activeTenantIdx] || tenants[0];
  const tNodes = gpuNodes.filter(n => n.tenantId === tenant.id);

  const cntOk = tNodes.filter(n => n.status === 'ok').length;
  const cntWarn = tNodes.filter(n => n.status === 'warn').length;
  const cntErr = tNodes.filter(n => n.status === 'err').length;

  const filteredInstances = useMemo(() => {
    if (activeFilter === 'all') return tNodes;
    return tNodes.filter(n => n.status === activeFilter);
  }, [tNodes, activeFilter]);

  const gpuOccupancy = tNodes.length > 0 ? (tNodes.filter(n => n.gpuUsage > 0).length / tNodes.length * 100).toFixed(1) : "0.0";
  const cpuUsage = "74.2";
  const memUsage = "62.8";

  return (
    <div className="flex flex-col gap-6 w-full min-w-0">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KPICard title="GPU 점유율" value={`${gpuOccupancy}%`} subtext="할당된 GPU 중 활성화 비율" percentage={parseFloat(gpuOccupancy)} status="normal" />
        <KPICard title="AI 스토리지" value={`${tenant.contract.storage.capacity}${tenant.contract.storage.unit}`} subtext="계약 용량" percentage={45.2} status="normal" />
        <KPICard title="CPU 사용률" value={`${cpuUsage}%`} subtext="전체 클러스터 vCPU 사용" percentage={parseFloat(cpuUsage)} status="normal" />
        <KPICard title="메모리 사용률" value={`${memUsage}%`} subtext="전체 클러스터 RAM 사용" percentage={parseFloat(memUsage)} status="normal" />
      </div>

      <div className="border-b border-gray-200 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1 min-w-max">
          {tenants.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => setActiveTenantIdx(idx)}
              className={`px-[18px] py-[10px] text-[13px] font-medium transition-colors ${
                activeTenantIdx === idx
                  ? 'text-primary-600 border-b-2 border-primary-500'
                  : 'text-gray-600 hover:text-primary-600 border-b-2 border-transparent'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-[300px_1fr_1fr] gap-4 items-stretch relative">
        <div className="bg-white border border-gray-200 rounded-[10px] p-6 flex flex-col relative overflow-visible h-full min-h-[450px] lg:min-h-0">
          <h2 className="text-[14px] font-semibold text-gray-900 mb-6">GPU 사용 현황</h2>

          <div className="flex flex-col items-center mb-8 flex-1 justify-center">
            <div className="w-[180px] h-[180px] flex justify-center items-center">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                <circle
                  cx="60" cy="60" r="48"
                  className="text-gray-100"
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
                <text x="60" y="55" fontSize="9" fill="#9CA3AF" textAnchor="middle" fontWeight="600">GPU 점유율</text>
                <text x="60" y="75" fontSize="18" fill="#111827" textAnchor="middle" fontWeight="bold" fontFamily="monospace">{gpuOccupancy}%</text>
              </svg>
            </div>

            <div className="flex gap-4 mt-6 text-[12px] text-gray-600">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-primary-500 rounded-sm"></div>
                <span>실행 {gpuOccupancy}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-gray-100 rounded-sm border border-gray-200"></div>
                <span>대기 {(100 - parseFloat(gpuOccupancy)).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-[13px] border-t border-gray-100 pt-6 mt-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">GPU 인스턴스 수</span>
              <span className="font-mono font-bold text-gray-900">{tNodes.length} 개</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">GPU 스펙</span>
              <span className="font-mono font-bold text-gray-900">NVIDIA B200</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">총 연산 성능</span>
              <span className="font-mono font-bold text-gray-900">{(tNodes.length * 103).toLocaleString()} PFlops</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-[10px] p-6 flex flex-col relative overflow-hidden h-full min-h-[400px] lg:min-h-0 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[14px] font-semibold text-gray-900">인스턴스 내비게이터</h2>
            <Link href="/monitoring/gpu" className="text-[12px] font-semibold text-gray-600 border border-gray-200 px-3 py-1.5 rounded-[5px] hover:bg-gray-50 flex items-center gap-1 transition-all">
              상세 보기 <span className="text-[10px]">→</span>
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2 py-1 rounded-[5px] text-[11px] font-semibold border transition-all ${activeFilter === 'all' ? 'shadow-[0_0_0_2px_currentColor] border-gray-300 bg-gray-50 text-gray-900' : 'border-gray-200 bg-gray-50 text-gray-600'}`}
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
              <div className="h-full flex items-center justify-center text-gray-400 text-[12px] italic">
                할당된 GPU 리소스가 없습니다.
              </div>
            ) : (
              <div
                className="grid gap-[6px] w-full max-w-[320px] mx-auto lg:mx-0"
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
                      <div className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 w-max bg-white border border-gray-200 rounded-[8px] px-3 py-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                        <div className="text-[12px] font-medium text-gray-900 font-mono mb-1">{inst.name}</div>
                        <div className="flex items-center gap-1 text-[11px] mb-2 font-semibold">
                          {inst.status === 'ok' && <><span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8]"></span><span className="text-gray-900">정상</span></>}
                          {inst.status === 'warn' && <><span className="w-1.5 h-1.5 rounded-full bg-[#92400E]"></span><span className="text-gray-900">주의</span></>}
                          {inst.status === 'err' && <><span className="w-1.5 h-1.5 rounded-full bg-[#BE123C]"></span><span className="text-gray-900">장애</span></>}
                        </div>
                        <div className="text-[11px] text-gray-500 mb-2">GPU {inst.gpuUsage}% · Mem {inst.memUsage}%</div>
                        <div className="text-[10px] text-primary-500 font-medium border-t border-gray-100 pt-2 mt-1 whitespace-nowrap">클릭 → 모니터링 이동 ↗</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 relative h-full lg:min-h-0">
          <div className="bg-white border border-gray-200 rounded-[10px] p-6 relative flex flex-col flex-none md:flex-1 h-full min-h-[350px] shadow-sm">
            <h2 className="text-[14px] font-semibold text-gray-900 mb-6">주간 GPU 사용률</h2>
            <div className="h-[250px] md:h-auto md:flex-1 w-full min-h-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gpuUsageData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} tickFormatter={(val) => `${val}%`} domain={[0, 100]} />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: 600, color: '#111827' }}
                  />
                  <Area type="monotone" dataKey="usage" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorUsage)" activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-[10px] py-6 relative flex-none flex flex-col overflow-hidden min-h-[400px] lg:min-h-0 shadow-sm">
            <div className="px-6 flex justify-between items-center mb-4">
              <h2 className="text-[14px] font-semibold text-gray-900">리소스 사용 TOP3 인스턴스</h2>
              <div className="flex gap-2">
                <button className="text-[11px] px-3 py-1.5 rounded-[5px] bg-primary-600 text-white font-semibold shadow-sm">1일</button>
                <button className="text-[11px] px-3 py-1.5 rounded-[5px] bg-white border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all">3일</button>
              </div>
            </div>

            <div className="w-full max-w-full relative px-6">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={top3ResourceData} margin={{ left: -20, right: 0, top: 4, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} dy={10} interval={Math.ceil(top3ResourceData.length / 5)} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} tickFormatter={(val) => `${val}%`} domain={[0, 12]} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '12px', fontWeight: 600, color: '#111827' }} />
                  <Line type="stepAfter" dataKey="inst1" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  <Line type="stepAfter" dataKey="inst2" stroke="#10B981" strokeWidth={2} dot={false} />
                  <Line type="stepAfter" dataKey="inst3" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center mt-3 gap-x-4 gap-y-1 text-[10px] font-semibold text-gray-500">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div> gsvp-msi-gpu001</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#10B981]"></div> gsvp-msi-gpu025</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#8B5CF6]"></div> gsvp-msi-gpu028</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-[10px] p-0 overflow-hidden relative shadow-sm">
        <div className="px-5 py-4 flex justify-between items-center bg-[#FAFAFA] border-b border-gray-100">
          <h2 className="text-[14px] font-semibold text-gray-900">최근 지원 티켓</h2>
          <Link href="/support/tickets">
             <button className="text-[12px] font-semibold text-primary-600 border border-gray-200 px-3 py-1.5 rounded-[6px] bg-white hover:bg-gray-50 transition-colors">전체 보기</button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse flex-1 inline-table">
            <thead className="hidden md:table-header-group">
              <tr className="bg-[#FAFAFA] border-b border-gray-100 text-gray-400">
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider">유형</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider">티켓 ID</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-left">제목</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-center">상태</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider">작성자</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider">등록 일시</th>
              </tr>
            </thead>
            <tbody className="flex flex-col md:table-row-group">
              {[
                { type: '장애접수', id: 'TKT-00142', title: 'H100 인스턴스 접속 불가 현상', status: '대기 중', user: '김사원', date: '2026-03-19 14:22:01', statusColor: 'bg-[#FFFBEB] text-[#D97706]' },
                { type: '기술지원', id: 'TKT-00141', title: 'PyTorch 노드 환경 설정 문의', status: '처리 중', user: '이대리', date: '2026-03-19 10:15:44', statusColor: 'bg-primary-50 text-primary-600' },
                { type: '일반안내', id: 'TKT-00139', title: '월간 크레딧 청구서 재발급 요청', status: '완료', user: '최과장', date: '2026-03-18 16:40:22', statusColor: 'bg-[#ECFDF5] text-[#059669]' },
              ].map(row => (
                <tr key={row.id} className="flex flex-col border-b border-gray-100 p-5 md:table-row md:p-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-0 py-1 md:px-5 md:py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] md:text-[11px] font-bold ${row.statusColor} border border-current opacity-80 md:opacity-100`}>{row.type}</span>
                  </td>
                  <td className="px-0 py-1 md:px-5 md:py-3.5 font-mono text-[11px] text-gray-400">
                    <span className="md:hidden text-[10px] text-gray-300 mr-2 uppercase">ID</span>
                    {row.id}
                  </td>
                  <td className="px-0 py-2 md:px-5 md:py-3.5 font-bold md:font-semibold text-gray-900 md:text-[13px] hover:text-primary-600 cursor-pointer transition-colors">
                    <Link href="/support/tickets">{row.title}</Link>
                  </td>
                  <td className="px-0 py-1 md:px-5 md:py-3.5 md:text-center">
                    <div className="flex items-center md:justify-center gap-2">
                      <span className="md:hidden text-[10px] text-gray-300 uppercase">상태</span>
                      <span className={`px-2 py-0.5 rounded-[4px] text-[10px] md:text-[11px] font-bold ${row.statusColor}`}>{row.status}</span>
                    </div>
                  </td>
                  <td className="px-0 py-1 md:px-5 md:py-3.5 text-[12px] text-gray-500">
                    <span className="md:hidden text-[10px] text-gray-300 mr-2 uppercase">작성자</span>
                    {row.user}
                  </td>
                  <td className="px-0 py-1 md:px-5 md:py-3.5 font-mono text-[11px] text-gray-400">
                    <span className="md:hidden text-[10px] text-gray-300 mr-2 uppercase">등록일</span>
                    {row.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
