'use client';

import React, { useState } from 'react';
import { Server, Package, Plus, Trash2, ArrowLeft, Building2, CheckCircle2, AlertTriangle, Cpu, X, RotateCcw } from 'lucide-react';
import CompanyListPanel from '@/components/CompanyListPanel';

interface IntervalData {
  id: string;
  start: string;
  end: string; // 빈 문자열인 경우 "선택 안 함" (단일 노드)
  count: number;
}

import { tenants, gpuNodes } from '@/lib/mockData';

const getNodeNum = (nodeStr: string) => parseInt(nodeStr.replace('gpu', ''), 10);
const getIntervalNodes = (start: string, end: string | null) => {
  if (!start) return [];
  const s = getNodeNum(start);
  const e = end ? getNodeNum(end) : s;
  if (e < s) return [];
  return Array.from({length: e - s + 1}, (_, i) => `gpu${String(s + i).padStart(3, '0')}`);
};

const calcCount = (start: string, end: string | null) => getIntervalNodes(start, end).length;

const totalNodes = 127;
const initialMockData = tenants.map(t => {
  const contractCount = t.contract.gpu.quantity;
  
  let assignedToSubtenants = 0;
  const mappedSubtenants = t.subtenants.map(sub => {
    const intervals = sub.assignedNodes.map((n, i) => ({
      id: `s_${sub.id}_${i}`,
      start: n.start,
      end: n.end || '',
      count: calcCount(n.start, n.end)
    }));
    const uniqueNodes = new Set(intervals.flatMap(inv => getIntervalNodes(inv.start, inv.end)));
    const count = uniqueNodes.size;
    assignedToSubtenants += count;
    return { name: sub.name, intervals, count };
  });

  const tenantIntervals: IntervalData[] = (t.assignedNodes || []).map((n, i) => ({
      id: `t_${t.id}_${i}`,
      start: n.start,
      end: n.end || '',
      count: calcCount(n.start, n.end)
  }));
  const assignedCount = new Set(tenantIntervals.flatMap(inv => getIntervalNodes(inv.start, inv.end))).size;

  return {
    tenant: t.name,
    contractCount,
    intervals: tenantIntervals,
    assignedCount,
    subtenants: mappedSubtenants,
    poolRemaining: assignedCount - assignedToSubtenants,
    tenantNodes: Array.from(new Set(tenantIntervals.flatMap(inv => getIntervalNodes(inv.start, inv.end)))),
    allSubtenantNodes: new Set(mappedSubtenants.flatMap(s => s.intervals.flatMap(inv => getIntervalNodes(inv.start, inv.end))))
  };
});

const genId = () => Math.random().toString(36).substr(2, 9);

function formatIntervals(intervals: IntervalData[]) {
  if (!intervals || intervals.length === 0) return '미지정';
  return intervals.map(v => v.end ? `${v.start}~${v.end}` : v.start).join(', ');
}

const ALL_NODES = Array.from({ length: 127 }, (_, i) => `gpu${String(i + 1).padStart(3, '0')}`);

function IntervalModal({ isOpen, onClose, targetType, targetName, contractCount, maxLimit, initialIntervals, allowedNodes, externalUsedNodes }: any) {
  const [intervals, setIntervals] = useState<IntervalData[]>(
    initialIntervals?.length > 0 ? initialIntervals : [{ id: genId(), start: '', end: '', count: 0 }]
  );

  if (!isOpen) return null;

  const handleAdd = () => setIntervals([...intervals, { id: genId(), start: '', end: '', count: 0 }]);
  const handleRemove = (id: string) => setIntervals(intervals.filter(v => v.id !== id));
  
  const handleChange = (id: string, field: 'start'|'end', value: string) => {
    setIntervals(intervals.map(v => {
      if (v.id === id) {
        const updated = { ...v, [field]: value };
        updated.count = calcCount(updated.start, updated.end);
        return updated;
      }
      return v;
    }));
  };

  const allSelectedNodes = new Set<string>();
  let hasOverlap = false;
  intervals.forEach(inv => {
    getIntervalNodes(inv.start, inv.end).forEach(n => {
      if (allSelectedNodes.has(n)) hasOverlap = true;
      allSelectedNodes.add(n);
    });
  });
  
  const totalSum = allSelectedNodes.size;
  const isTenant = targetType === 'tenant';

  let statusMessage = null;
  if (hasOverlap) {
     statusMessage = <span className="text-red-500 flex items-center gap-1.5"><AlertTriangle size={16}/> 구간 간 중복된 노드가 있습니다 (합계는 중복 제외 수량)</span>;
  } else if (isTenant) {
     if (contractCount > 0 && totalSum === contractCount) statusMessage = <span className="text-emerald-600 flex items-center gap-1.5"><CheckCircle2 size={16}/> 계약 수량({contractCount}대) 일치</span>;
     else if (totalSum > contractCount) statusMessage = <span className="text-red-500 flex items-center gap-1.5"><AlertTriangle size={16}/> 계약 수량({contractCount}대) 초과</span>;
     else if (totalSum > 0) statusMessage = <span className="text-amber-500 flex items-center gap-1.5"><AlertTriangle size={16}/> 계약 수량({contractCount}대) 미달</span>;
  } else {
     if (totalSum > maxLimit) statusMessage = <span className="text-red-500 flex items-center gap-1.5"><AlertTriangle size={16}/> Tenant Pool 최대 배분 허용량 초과</span>;
     else statusMessage = <span className="text-emerald-600 flex items-center gap-1.5"><CheckCircle2 size={16}/> 분배 후 Tenant Pool 잔여: {maxLimit - totalSum}대</span>;
  }

  const isNodeUsedInOtherInterval = (node: string, currentId: string) => {
    let used = false;
    intervals.forEach(inv => {
      if (inv.id !== currentId) {
         if (getIntervalNodes(inv.start, inv.end).includes(node)) used = true;
      }
    });
    return used;
  };

  const isRangeInvalid = (startCandidate: string | null, endCandidate: string | null, currentId: string) => {
    if (!startCandidate || !endCandidate) return false;
    const sNum = getNodeNum(startCandidate);
    const eNum = getNodeNum(endCandidate);
    if (eNum < sNum) return false;
    for (let i = sNum; i <= eNum; i++) {
       const n = `gpu${String(i).padStart(3, '0')}`;
       if (externalUsedNodes.has(n) || isNodeUsedInOtherInterval(n, currentId)) return true;
    }
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/50 flex flex-col items-center justify-center backdrop-blur-sm">
      <div className="bg-white w-[640px] max-h-[90vh] rounded-[14px] shadow-2xl flex flex-col overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#F8FAFC]">
          <h2 className="text-[16px] font-bold text-gray-900 flex items-center gap-2">
            {isTenant ? <Server size={18} className="text-primary-600"/> : <Package size={18} className="text-emerald-500"/>}
            {isTenant ? 'Tenant 노드 할당' : 'Subtenant 노드 분배'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900"><X size={20}/></button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
           <div className="flex flex-col gap-1.5">
             <span className="text-[13px] font-bold text-gray-500">대상 {isTenant ? 'Tenant' : 'Subtenant'}</span>
             <span className="text-[15px] font-extrabold text-gray-900 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">{targetName}</span>
           </div>

           <div>
              <div className="flex justify-between items-end mb-3">
                 <span className="text-[14px] font-bold text-gray-800 border-l-4 border-gray-800 pl-2">노드 구강 설정</span>
                 <button onClick={handleAdd} className="flex items-center gap-1 text-[12px] font-bold text-primary-600 hover:bg-primary-50 px-2 py-1 rounded transition-colors border border-primary-200">
                    <Plus size={14}/> 구간 추가
                 </button>
              </div>
              
              <div className="flex flex-col gap-3">
                 {intervals.length === 0 ? (
                    <div className="text-center py-6 text-[13px] text-gray-400 font-medium border border-dashed border-gray-300 rounded-lg bg-gray-50">설정된 구간이 없습니다. (저장 시 회수 처리됨)</div>
                 ) : (
                    intervals.map((inv, idx) => {
                       const invNodes = getIntervalNodes(inv.start, inv.end);
                       const overlapWithOthers = invNodes.some(n => isNodeUsedInOtherInterval(n, inv.id));
                       return (
                       <div key={inv.id} className={`flex items-center gap-3 p-3 border rounded-lg bg-white shadow-sm ${overlapWithOthers ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`}>
                          <div className={`text-[12px] font-extrabold w-10 text-center select-none ${overlapWithOthers ? 'text-red-500' : 'text-gray-400'}`}>구간 {idx + 1}</div>
                          <div className="flex-1 grid grid-cols-2 gap-3">
                             <select value={inv.start} onChange={e => handleChange(inv.id, 'start', e.target.value)} className={`w-full border rounded p-2 text-[13px] font-mono focus:outline-none ${overlapWithOthers ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}>
                                <option value="">시작 노드 선택</option>
                                {allowedNodes.map((n: string) => <option key={n} value={n} disabled={externalUsedNodes.has(n) || isNodeUsedInOtherInterval(n, inv.id) || (inv.end ? isRangeInvalid(n, inv.end, inv.id) : false)}>{n} {externalUsedNodes.has(n) ? '(타 프로젝트)' : ''}</option>)}
                             </select>
                             <select value={inv.end} onChange={e => handleChange(inv.id, 'end', e.target.value)} className={`w-full border rounded p-2 text-[13px] font-mono focus:outline-none ${overlapWithOthers ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}>
                                <option value="">선택 안 함 (1대 단일 구간)</option>
                                {allowedNodes.map((n: string) => <option key={n} value={n} disabled={externalUsedNodes.has(n) || isNodeUsedInOtherInterval(n, inv.id) || (inv.start ? isRangeInvalid(inv.start, n, inv.id) : false)}>{n} {externalUsedNodes.has(n) ? '(타 프로젝트)' : ''}</option>)}
                             </select>
                          </div>
                          <div className={`w-12 text-center text-[13px] font-extrabold font-mono select-none ${overlapWithOthers ? 'text-red-500' : 'text-primary-600'}`}>{inv.count}대</div>
                          <button onClick={() => handleRemove(inv.id)} className="w-8 h-8 flex flex-col items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 size={16}/></button>
                       </div>
                     );
                    })
                 )}
              </div>
           </div>

           <div className="bg-[#F8FAFC] border border-gray-200 rounded-lg p-5 flex flex-col gap-3">
              <div className="flex justify-between items-center text-[14px]">
                 <span className="font-extrabold text-gray-600">합계 수량 자동계산</span>
                 <span className="font-extrabold font-mono text-[18px] text-gray-900">{totalSum}대</span>
              </div>
              <div className="flex justify-between items-center text-[13px] border-t border-gray-200 pt-3">
                 <span className="font-bold text-gray-500">상태 검증</span>
                 {statusMessage}
              </div>
           </div>
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-white flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-lg text-[13px] font-bold text-gray-600 hover:bg-gray-50 bg-white transition-colors">취소</button>
          <button className={`px-6 py-2.5 rounded-lg text-[13px] font-bold text-white shadow-sm transition-colors ${
            hasOverlap || (isTenant && totalSum > contractCount) || (!isTenant && totalSum > maxLimit)
            ? 'bg-gray-400 cursor-not-allowed'
            : isTenant ? 'bg-primary-600 hover:bg-primary-700' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}>
             {intervals.length === 0 ? '전체 회수 (초기화) 진행' : '변경 사항 확정'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResourceAllocationPage() {
  const [isAdmin] = useState(true);
  const [selectedTenantIdx, setSelectedTenantIdx] = useState(0); 
  const [modalObj, setModalObj] = useState<{isOpen: boolean, type: string, targetName: string, maxTarget: number, initial: IntervalData[], allowed: string[], externalUsed: Set<string>} | null>(null);

  const totalSubtenants = initialMockData.reduce((acc, t) => acc + t.subtenants.length, 0);
  const companies = [
    { id: 'all', name: '전체 (Overview)', subCount: totalSubtenants },
    ...initialMockData.map(t => ({ id: t.tenant, name: t.tenant, subCount: t.subtenants.length }))
  ];

  const openModal = (type: 'tenant'|'subtenant', name: string, maxCount: number, currentIntervals: IntervalData[], allowed: string[], externalUsed: Set<string>) => {
    setModalObj({ isOpen: true, type, targetName: name, maxTarget: maxCount, initial: currentIntervals, allowed, externalUsed });
  };

  const handleClose = () => setModalObj({ ...modalObj!, isOpen: false });

  const isOverview = selectedTenantIdx === 0;
  const t = isOverview ? null : initialMockData[selectedTenantIdx - 1];
  const totalAllocated = initialMockData.reduce((acc, cur) => acc + cur.assignedCount, 0);

  return (
    <div className="flex flex-col md:flex md:flex-row h-auto md:h-[calc(100vh-112px)] min-h-0 gap-6 text-gray-900 pb-2">
      {modalObj?.isOpen && <IntervalModal isOpen={modalObj.isOpen} onClose={handleClose} targetType={modalObj.type} targetName={modalObj.targetName} contractCount={modalObj.maxTarget} maxLimit={modalObj.maxTarget} initialIntervals={modalObj.initial} allowedNodes={modalObj.allowed} externalUsedNodes={modalObj.externalUsed} />}

      <CompanyListPanel
         companies={companies}
         activeIndex={selectedTenantIdx}
         onCompanyClick={setSelectedTenantIdx}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-none flex flex-col gap-5 mb-5 shrink-0">
           <div className="flex justify-between items-center mb-1">
              {isOverview ? (
                <h1 className="text-[18px] font-extrabold flex items-center gap-2"><Building2 className="text-primary-500 w-5 h-5"/> 리소스 할당 현황</h1>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <h1 className="text-[18px] font-extrabold flex items-center gap-2"><Building2 className="text-primary-500 w-5 h-5"/> {t?.tenant} 상세 현황</h1>
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-[12px] font-extrabold text-gray-600 flex items-center gap-1.5 shadow-sm">
                      <Cpu size={14}/> 전체 할당 인스턴스: <span className="text-gray-900 font-mono text-[14px]">총 {t?.assignedCount}대</span>
                    </div>
                    {isAdmin && (
                      <button 
                        onClick={() => openModal('tenant', t!.tenant, t!.contractCount, t!.intervals, ALL_NODES, new Set())} 
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-[13px] font-bold shadow-sm transition-colors flex items-center gap-1.5 outline-none"
                      >
                        <Server size={14} /> Tenant 노드 할당 관리
                      </button>
                    )}
                  </div>
                </div>
              )}
           </div>

           {isOverview ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white border text-left border-gray-200 rounded-[10px] p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
                   <div className="text-[13px] font-bold text-gray-500 mb-2">데이터센터 전체 노드</div>
                   <div className="text-[26px] font-mono font-extrabold tracking-tight text-gray-900 mt-1">{totalNodes}대</div>
                   <div className="mt-2 text-[12px] font-semibold text-gray-400">Total Infrastructure Capacity</div>
                </div>
                <div className="bg-white border text-left border-gray-200 rounded-[10px] p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
                   <div className="text-[13px] font-bold text-gray-500 mb-2">Tenant 할당 완료</div>
                   <div className="text-[26px] font-mono font-extrabold tracking-tight text-primary-600 mt-1">{totalAllocated}대</div>
                   <div className="mt-2 text-[12px] font-semibold text-gray-400">Tenant에 지급 완료된 노드 누계</div>
                </div>
                <div className="bg-white border text-left border-gray-200 rounded-[10px] p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
                   <div className="text-[13px] font-bold text-gray-500 mb-2">미할당 공용 풀</div>
                   <div className="text-[26px] font-mono font-extrabold tracking-tight text-amber-500 mt-1">{totalNodes - totalAllocated}대</div>
                   <div className="mt-2 text-[12px] font-semibold text-gray-400">추가 할당이 가능한 유휴 자원</div>
                </div>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white border text-left border-gray-200 rounded-[10px] p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
                   <div className="text-[13px] font-bold text-gray-500 mb-2">계약 수량</div>
                   <div className="text-[26px] font-mono font-extrabold tracking-tight text-gray-900 mt-1">{t!.contractCount}대</div>
                   <div className="mt-2 text-[12px] font-semibold text-gray-400">데이터센터 → Tenant 배정 목표치</div>
                </div>
                <div className="bg-white border text-left border-gray-200 rounded-[10px] p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
                   <div className="text-[13px] font-bold text-gray-500 mb-2">Subtenant 분배 완료</div>
                   <div className="text-[26px] font-mono font-extrabold tracking-tight text-emerald-600 mt-1">{t!.assignedCount - t!.poolRemaining}대</div>
                   <div className="mt-2 text-[12px] font-semibold text-gray-400">산하 프로젝트에 지급 완료된 서버</div>
                </div>
                <div className="bg-white border text-left border-gray-200 rounded-[10px] p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] bg-gradient-to-br from-white to-amber-50/20">
                   <div className="text-[13px] font-bold text-amber-700 mb-2">미분배 (Tenant Pool)</div>
                   <div className="text-[26px] font-mono font-extrabold tracking-tight text-amber-500 mt-1">{t!.poolRemaining}대</div>
                   <div className="mt-2 text-[12px] font-semibold text-amber-600/60">추가로 분배 가능한 잔여 유휴 자원</div>
                </div>
             </div>
           )}
        </div>

        <div className="flex-1 bg-white border border-gray-200 rounded-[10px] flex flex-col overflow-hidden shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] min-h-0">
           <div className="p-5 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between shrink-0">
              {isOverview ? (
                <h3 className="font-extrabold text-gray-900 text-[14px] flex items-center gap-1.5"><Server size={16} className="text-gray-600"/> 전체 Tenant 배정 테이블</h3>
              ) : (
                <h3 className="font-extrabold text-gray-900 text-[14px] flex items-center gap-1.5"><Package size={16} className="text-emerald-500"/> Subtenant(프로젝트) 하위 분배 테이블</h3>
              )}
           </div>
           
           <div className="flex-1 overflow-x-auto overflow-y-auto">
              {isOverview ? (
                <table className="w-full text-left min-w-[1100px]">
                  <thead className="hidden md:table-header-group">
                    <tr className="bg-[#FAFAFA] border-b border-gray-200">
                      <th className="px-6 py-[12px] text-[12px] font-extrabold text-gray-500 whitespace-nowrap">Tenant 명</th>
                      <th className="px-6 py-[12px] text-[12px] font-extrabold text-gray-500 text-center whitespace-nowrap">계약 대수</th>
                      <th className="px-6 py-[12px] text-[12px] font-extrabold text-gray-500 text-center whitespace-nowrap">현재 할당 대수</th>
                      <th className="px-6 py-[12px] text-[12px] font-extrabold text-gray-500 whitespace-nowrap">인스턴스 구간 내역</th>
                      <th className="px-6 py-[12px] text-[12px] font-extrabold text-gray-500 text-right whitespace-nowrap">관리 액션</th>
                    </tr>
                  </thead>
                  <tbody className="flex flex-col gap-4 p-4 md:table-row-group md:p-0">
                     {initialMockData.map((tenant, i) => (
                       <tr key={tenant.tenant} className="flex flex-col border border-gray-200 rounded-xl p-5 shadow-sm bg-white md:table-row md:border-0 md:border-b md:border-gray-100 md:rounded-none md:p-0 md:shadow-none hover:bg-gray-50/50 transition-colors">
                          <td className="px-0 py-1 md:px-6 md:py-[14px] font-bold text-[15px] md:text-[14px] text-primary-600 cursor-pointer hover:underline border-b border-gray-50 mb-3 pb-2 md:border-0 md:mb-0 md:pb-0 md:text-gray-900 whitespace-nowrap" onClick={() => setSelectedTenantIdx(i + 1)}>
                            <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">Tenant 명</span>
                            {tenant.tenant}
                          </td>
                          <td className="px-0 py-1 md:px-6 font-mono text-[13px] font-bold text-gray-600 md:text-center whitespace-nowrap">
                            <span className="md:hidden text-[10px] text-gray-500 font-normal block mb-0.5">계약 대수</span>
                            {tenant.contractCount}대
                          </td>
                          <td className="px-0 py-1 md:px-6 font-mono text-[13px] md:text-center whitespace-nowrap">
                            <span className="md:hidden text-[10px] text-gray-500 font-normal block mb-0.5">현재 할당 대수</span>
                            {tenant.assignedCount > 0 
                              ? <span className="font-bold text-primary-700 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded md:inline-block">{tenant.assignedCount}대</span>
                              : <span className="text-gray-400 font-bold bg-gray-100 px-2 py-0.5 border border-gray-200 rounded md:inline-block">0대</span>}
                          </td>
                          <td className="px-0 py-1 md:px-6 font-mono text-[12px] text-gray-500 font-medium whitespace-nowrap">
                            <span className="md:hidden text-[10px] text-gray-500 font-normal block mb-0.5">인스턴스 구간 내역</span>
                            {formatIntervals(tenant.intervals)}
                          </td>
                           <td className="px-0 py-2 md:px-6 text-right mt-2 md:mt-0 whitespace-nowrap">
                             <button onClick={() => openModal('tenant', tenant.tenant, tenant.contractCount, tenant.intervals, ALL_NODES, new Set())} className="w-full md:w-auto text-[12px] font-bold text-gray-600 hover:text-gray-900 border border-gray-200 bg-white px-3 py-2 md:py-1.5 rounded shadow-sm outline-none">할당 관리</button>
                          </td>
                       </tr>
                     ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left min-w-[1100px]">
                  <thead className="hidden md:table-header-group">
                    <tr className="bg-[#FAFAFA] border-b border-gray-200">
                      <th className="px-6 py-[12px] text-[12px] font-extrabold text-gray-500 whitespace-nowrap">Subtenant 명</th>
                      <th className="px-6 py-[12px] text-[12px] font-extrabold text-gray-500 text-center whitespace-nowrap">분배 수량 (대)</th>
                      <th className="px-6 py-[12px] text-[12px] font-extrabold text-gray-500 whitespace-nowrap">인스턴스 구간 내역</th>
                      <th className="px-6 py-[12px] text-[12px] font-extrabold text-gray-500 whitespace-nowrap">비율 (Pool 대비)</th>
                      <th className="px-6 py-[12px] text-[12px] font-extrabold text-gray-500 text-right whitespace-nowrap">분배 관리</th>
                    </tr>
                  </thead>
                  <tbody className="flex flex-col gap-4 p-4 md:table-row-group md:p-0">
                     {t!.subtenants.length === 0 ? (
                       <tr className="md:table-row md:border-b-0"><td colSpan={5} className="text-center py-12 text-gray-400 text-[13px] font-medium border-b-0">등록된 Subtenant(프로젝트)가 없습니다.</td></tr>
                     ) : (
                       t!.subtenants.map(sub => {
                         const maxAlloc = t!.poolRemaining + sub.count;
                         const usageRatio = t!.assignedCount > 0 ? (sub.count / t!.assignedCount) * 100 : 0;
                         return (
                           <tr key={sub.name} className="flex flex-col border border-gray-200 rounded-xl p-5 shadow-sm bg-white md:table-row md:border-0 md:border-b md:border-gray-100 md:rounded-none md:p-0 md:shadow-none hover:bg-gray-50/50 transition-colors">
                              <td className="px-0 py-1 md:px-6 md:py-[14px] font-bold text-gray-800 text-[15px] md:text-[13px] border-b border-gray-50 mb-3 pb-2 md:border-0 md:mb-0 md:pb-0">
                                <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">Subtenant 명</span>
                                {sub.name}
                              </td>
                              <td className="px-0 py-1 md:px-6 font-mono text-[13px] md:text-center text-left">
                                <span className="md:hidden text-[10px] text-gray-500 font-normal block mb-0.5">분배 수량 (대)</span>
                                {sub.count > 0 
                                  ? <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded md:inline-block">{sub.count}대</span>
                                  : <span className="text-gray-400 font-bold bg-gray-100 px-2 py-0.5 border border-gray-200 rounded md:inline-block">미분배</span>}
                              </td>
                              <td className="px-0 py-1 md:px-6 font-mono text-[12px] text-gray-500 font-medium">
                                <span className="md:hidden text-[10px] text-gray-500 font-normal block mb-0.5">인스턴스 구간 내역</span>
                                {formatIntervals(sub.intervals)}
                              </td>
                              <td className="px-0 py-1 md:px-6">
                                <span className="md:hidden text-[10px] text-gray-500 font-normal block mb-0.5">비율 (Pool 대비)</span>
                                <div className="flex items-center gap-2">
                                   <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden shrink-0">
                                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${usageRatio}%` }}></div>
                                   </div>
                                   <span className="text-[11px] font-mono font-bold text-gray-500 w-8">{Math.round(usageRatio)}%</span>
                                </div>
                              </td>
                              <td className="px-0 py-2 md:px-6 text-right mt-2 md:mt-0">
                                 <button onClick={() => {
                                   const externalUsed = new Set(t!.allSubtenantNodes);
                                   sub.intervals.forEach((inv: IntervalData) => getIntervalNodes(inv.start, inv.end).forEach(n => externalUsed.delete(n)));
                                   openModal('subtenant', sub.name, maxAlloc, sub.intervals, t!.tenantNodes, externalUsed);
                                 }} className="w-full md:w-auto text-[12px] font-bold text-gray-600 hover:text-gray-900 border border-gray-200 bg-white px-3 py-2 md:py-1.5 rounded shadow-sm outline-none">할당 관리</button>
                              </td>
                           </tr>
                         );
                       })
                     )}
                  </tbody>
                </table>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
