'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Building2, TerminalSquare } from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import { tenants } from '@/lib/mockData';
import CompanyListPanel from '@/components/CompanyListPanel';

// Calculate count for assignedNodes
const getIntervalNodesCount = (ranges?: any[]) => {
  if (!ranges) return 0;
  const getNodes = (start: string, end: string | null) => {
    if (!start) return [];
    const s = parseInt(start.replace('gpu', ''), 10);
    const e = end ? parseInt(end.replace('gpu', ''), 10) : s;
    return Array.from({length: e - s + 1}, (_, i) => s + i);
  };
  const set = new Set(ranges.flatMap(r => getNodes(r.start, r.end)));
  return set.size;
};

export default function Metering() {
  const [activeTab, setActiveTab] = useState<'company' | 'project'>('company');
  const [role, setRole] = useState<'admin' | 'tenant' | 'subtenant'>('admin');
  
  const [activeCompanyIdx, setActiveCompanyIdx] = useState(0);
  const [activeProjIdx, setActiveProjIdx] = useState(0);

  // When company or tab changes, reset proj selection
  useEffect(() => {
    setActiveProjIdx(0);
  }, [activeCompanyIdx, activeTab]);

  const mockStorageData = useMemo(() => [
    { time: '01', usage: 1100 }, { time: '05', usage: 1150 }, { time: '10', usage: 1120 },
    { time: '15', usage: 1200 }, { time: '20', usage: 1250 }, { time: '25', usage: 1220 }, { time: '30', usage: 1248 }
  ], []);

  const mockNetworkData = useMemo(() => [
    { time: '01', out: 1200, in: 250 }, { time: '05', out: 2400, in: 480 }, { time: '10', out: 3000, in: 950 },
    { time: '15', out: 2200, in: 1250 }, { time: '20', out: 4100, in: 880 }, { time: '25', out: 5800, in: 1600 }, { time: '30', out: 4512, in: 820 }
  ], []);

  // Filter based on role simulator
  let displayTenants = tenants;
  if (role === 'tenant' || role === 'subtenant') {
    displayTenants = tenants.filter(t => t.id === 'tenant-lg');
  }
  
  const safeCompanyIdx = Math.min(activeCompanyIdx, displayTenants.length - 1);
  const selectedCompany = displayTenants[safeCompanyIdx] || displayTenants[0];
  
  let displaySubtenants = selectedCompany.subtenants;
  if (role === 'subtenant') {
    displaySubtenants = selectedCompany.subtenants.filter(s => s.id === 'sub-lg-전자');
  }
  const safeProjIdx = Math.min(Math.max(0, activeProjIdx), Math.max(0, displaySubtenants.length - 1));
  const selectedProject = displaySubtenants[safeProjIdx];

  const handleCompanyClick = (idx: number) => {
    if (role === 'tenant' || role === 'subtenant') return; // Restrict left panel for non-admin
    setActiveCompanyIdx(idx);
  };

  const renderContent = (title: string, isProj: boolean, contractGpu: number, usedGpu: number, contractCpu: number, usedCpu: number) => {
    const gpuPercent = Math.min(100, (usedGpu / (contractGpu || 1)) * 100) || 0;
    const cpuPercent = Math.min(100, (usedCpu / (contractCpu || 1)) * 100) || 0;

    return (
      <div className="w-full min-h-0 flex flex-col pt-1">
         <h2 className="text-[18px] font-bold text-gray-900 mb-6 shrink-0">{title}</h2>
         <div className="space-y-6 flex flex-col shrink-0 pb-10">
            <div className="border border-gray-200 rounded-[8px] p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] shrink-0 bg-white">
              <h3 className="text-[14px] font-semibold text-gray-900 mb-4 flex items-center gap-2">고정 항목 <span className="text-[11px] font-normal text-gray-400">계약 수량 기준</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-[8px] p-5 border border-gray-100">
                   <div className="flex justify-between items-end mb-3">
                     <span className="text-[13px] font-semibold text-gray-600">{isProj ? '할당 CPU 자원' : 'CPU 과금 코어 수'}</span>
                     <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-[20px] font-extrabold text-primary-600">{usedCpu || 0}</span>
                        <span className="text-[13px] text-gray-400 font-semibold mb-0.5">/ {contractCpu || 0} Core</span>
                     </div>
                   </div>
                   <div className="h-2.5 bg-gray-200 rounded-full w-full overflow-hidden flex">
                     <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{width: `${cpuPercent}%`}}></div>
                   </div>
                </div>
                <div className="bg-gray-50 rounded-[8px] p-5 border border-gray-100">
                   <div className="flex justify-between items-end mb-3">
                     <span className="text-[13px] font-semibold text-gray-600">{isProj ? '할당 GPU 인스턴스' : 'GPU 인스턴스 과금 대수'}</span>
                     <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-[20px] font-extrabold text-primary-600">{usedGpu || 0}</span>
                        <span className="text-[13px] text-gray-400 font-semibold mb-0.5">/ {contractGpu || 0} 대</span>
                     </div>
                   </div>
                   <div className="h-2.5 bg-gray-200 rounded-full w-full overflow-hidden flex">
                     <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{width: `${gpuPercent}%`}}></div>
                   </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-[8px] p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] flex flex-col shrink-0 min-h-[400px] bg-white">
              <h3 className="text-[14px] font-semibold text-gray-900 mb-4 flex items-center gap-2">변동 항목 <span className="text-[11px] font-normal text-gray-400">실시간 측정 기반</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                <div className="bg-white rounded-[8px] border border-gray-200 flex flex-col shadow-sm min-h-[300px]">
                   <div className="p-4 border-b border-gray-100 shrink-0">
                     <span className="text-[13px] font-semibold text-gray-900">스토리지 사용량 (월 평균)</span>
                     <div className="text-[22px] font-bold font-mono text-primary-600 mt-1">1,248 TB</div>
                   </div>
                   <div className="flex-1 p-4 bg-gradient-to-br from-[#F8F9FF] to-[#EFF6FF] border-dashed border-primary-200 m-2 rounded-[6px] border relative min-h-[220px]">
                     <div className="absolute inset-0 p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={mockStorageData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorStorage" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} dy={5} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} domain={['dataMin - 100', 'dataMax + 100']} />
                            <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '11px', fontWeight: 600 }} />
                            <Area type="monotone" dataKey="usage" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorStorage)" activeDot={{ r: 4 }} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                   </div>
                </div>
                <div className="bg-white rounded-[8px] border border-gray-200 flex flex-col shadow-sm min-h-[300px]">
                   <div className="p-4 border-b border-gray-100 flex justify-between shrink-0">
                     <div>
                       <span className="text-[13px] font-semibold text-gray-900">네트워크 트래픽 Outbound (GB)</span>
                       <div className="text-[22px] font-bold font-mono text-primary-600 mt-1">45,120 GB</div>
                     </div>
                     <div className="text-right">
                       <span className="text-[13px] font-semibold text-gray-900">Inbound (GB)</span>
                       <div className="text-[18px] font-bold font-mono text-gray-600 mt-1">8,204 GB</div>
                     </div>
                   </div>
                   <div className="flex-1 p-4 bg-gradient-to-br from-[#F8F9FF] to-[#EFF6FF] border-dashed border-primary-200 m-2 rounded-[6px] border relative min-h-[220px]">
                     <div className="absolute inset-0 p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={mockNetworkData} margin={{ top: 5, right: 0, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} dy={5} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} domain={[0, 'auto']} />
                            <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '11px', fontWeight: 600 }} />
                            <Line type="monotone" dataKey="out" stroke="#3B82F6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                            <Line type="monotone" dataKey="in" stroke="#10B981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
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
    <div className="flex flex-col md:flex md:flex-row h-auto md:h-[calc(100vh-112px)] min-h-0 gap-6 text-gray-900 pb-2">
      <CompanyListPanel 
        companies={displayTenants.map(t => ({ id: t.id, name: t.name, subCount: t.subtenants.length }))}
        activeIndex={safeCompanyIdx}
        onCompanyClick={handleCompanyClick}
      />

      <div className="flex-1 bg-white border border-gray-200 rounded-[10px] flex flex-col overflow-hidden h-full shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col md:flex-row md:h-[52px] shrink-0 border-b border-gray-200 md:items-center px-4 bg-white gap-3 md:gap-0 py-3 md:py-0">
          <div className="flex h-[40px] md:h-full border-b md:border-none border-gray-100 pb-2 md:pb-0">
            <button 
              onClick={() => setActiveTab('company')}
              className={`px-5 h-full font-bold text-[13px] flex items-center transition-colors outline-none whitespace-nowrap ${activeTab === 'company' ? 'border-b-[2px] border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 border-b-[2px] border-transparent'}`}
            >
              회사별
            </button>
            <button 
              onClick={() => setActiveTab('project')}
              className={`px-5 h-full font-bold text-[13px] flex items-center transition-colors outline-none whitespace-nowrap ${activeTab === 'project' ? 'border-b-[2px] border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 border-b-[2px] border-transparent'}`}
            >
              프로젝트별
            </button>
          </div>
          <div className="flex-1 hidden md:block" />
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
               <span className="whitespace-nowrap">역할:</span>
               <select value={role} onChange={e => setRole(e.target.value as any)} className="bg-transparent text-gray-700 outline-none font-bold w-full sm:w-auto">
                  <option value="admin">관리자</option>
                  <option value="tenant">Tenant Admin</option>
                  <option value="subtenant">Subtenant Member</option>
               </select>
            </div>
            <div className="flex items-center gap-2">
              <select className="h-[36px] w-full sm:w-[110px] border border-gray-200 rounded-[8px] text-[13px] px-3 font-bold focus:outline-none focus:border-primary-500 bg-white">
                <option>2026.03</option>
                <option>2026.02</option>
                <option>2026.01</option>
              </select>
              <button className="h-[36px] px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[13px] rounded-[8px] shadow-sm active:scale-[0.98]">
                다운로드
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'project' && (
           <div className="flex gap-2 px-6 py-4 border-b border-gray-200 bg-[#FAFAFA] shrink-0">
             {displaySubtenants.length > 0 ? (
               displaySubtenants.map((sub, i) => (
                 <button
                   key={sub.id}
                   onClick={() => { if (role !== 'subtenant') setActiveProjIdx(i); }}
                   className={`px-4 py-2 rounded-lg text-[13px] font-bold flex items-center gap-1.5 transition-all outline-none ${
                     safeProjIdx === i
                     ? 'bg-gray-800 text-white shadow-sm ring-2 ring-gray-800 ring-offset-2 z-10'
                     : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 opacity-90'
                   } ${role === 'subtenant' && safeProjIdx !== i ? 'hidden' : ''}`}
                 >
                   <Building2 size={14} className={safeProjIdx === i ? 'text-gray-300' : 'text-gray-400'}/>
                   {sub.name}
                 </button>
               ))
             ) : (
               <div className="text-[13px] text-gray-400 italic py-1">등록된 Subtenant가 없습니다.</div>
             )}
           </div>
        )}

        <div className="flex-1 p-6 overflow-y-auto flex flex-col bg-[#FAFAFA]">
          {activeTab === 'company' && selectedCompany && (
             renderContent(
               `${selectedCompany.name} 2026년 3월 미터링 내역`,
               false,
               selectedCompany.contract.gpu.quantity,
               selectedCompany.contract.gpu.quantity,
               selectedCompany.contract.cpu.quantity,
               selectedCompany.contract.cpu.quantity
             )
          )}

          {activeTab === 'project' && selectedProject ? (
             renderContent(
               `${selectedProject.name} (${selectedCompany.name}) 2026년 3월 미터링 내역`,
               true,
               selectedCompany.contract.gpu.quantity,
               getIntervalNodesCount(selectedProject.assignedNodes),
               selectedCompany.contract.cpu.quantity,
               getIntervalNodesCount(selectedProject.assignedNodes) * 8
             )
          ) : activeTab === 'project' && !selectedProject ? (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-400 min-h-[300px]">
                <TerminalSquare size={48} className="mb-4 opacity-30" />
                <p className="text-[14px] font-medium">조회할 {selectedCompany.name} 하위 프로젝트 내역이 없습니다.</p>
             </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
