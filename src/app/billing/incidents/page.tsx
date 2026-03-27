'use client';

import React, { useState } from 'react';
import { Calendar, AlertTriangle, Building2, Server, Plus, X, Settings, Box, FileText } from 'lucide-react';
import CompanyListPanel from '@/components/CompanyListPanel';

import { tenants, incidents, gpuNodes } from '@/lib/mockData';

const tenantData = tenants.map(t => {
  let tenantTotalCredit = 0;
  let tenantIncidentCount = 0;
  let tenantPmCount = 0;

  const mappedSubtenants = t.subtenants.map(s => {
    const records = incidents.filter(inc => 
      inc.affectedSubtenants.some(aff => aff.subtenantId === s.id)
    ).map(inc => {
      const aff = inc.affectedSubtenants.find(a => a.subtenantId === s.id);
      const gpuCount = aff ? aff.gpuCount : 0;
      
      let subCredit: number | null = null;
      if (inc.creditAmount) {
        subCredit = Math.round(inc.creditAmount * (gpuCount / inc.affectedSubtenants.reduce((sum, a) => sum + a.gpuCount, 0)));
      }

      if (inc.type === '장애') tenantIncidentCount++;
      else tenantPmCount++;
      
      if (subCredit) {
        tenantTotalCredit += subCredit;
      }

      return {
        type: inc.type,
        start: inc.startDatetime,
        end: inc.endDatetime,
        duration: inc.duration,
        node: inc.node,
        instance: inc.instance,
        companies: inc.affectedSubtenants.length > 1 ? `${s.name} 외 ${inc.affectedSubtenants.length - 1}` : s.name,
        gpu: gpuCount,
        credit: subCredit,
        user: inc.registeredBy,
        registeredAt: inc.startDatetime.split(' ')[0] // For "new this month" logic
      };
    });

    return { name: s.name, records };
  });

  return {
    name: t.name,
    totalCredit: tenantTotalCredit,
    incidentCount: tenantIncidentCount,
    pmCount: tenantPmCount,
    totalCount: tenantIncidentCount + tenantPmCount,
    subtenants: mappedSubtenants
  };
});

function IncidentModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [startD, setStartD] = useState('');
  const [endD, setEndD] = useState('');
  const [nodeType, setNodeType] = useState('GPU');
  const [instanceId, setInstanceId] = useState('');

  let durationStr = '자동 계산 결과 표시';
  let isError = false;
  if (startD && endD) {
    const sTime = new Date(startD).getTime();
    const eTime = new Date(endD).getTime();
    if (eTime < sTime) {
      durationStr = '복구 시간이 발생 시간보다 이전입니다';
      isError = true;
    } else {
      const diffMs = eTime - sTime;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      durationStr = `${hours}h ${mins}m`;
    }
  }

  const allocatedInstances = gpuNodes.filter(n => n.tenantId);
  const selectedNode = allocatedInstances.find(n => n.name === instanceId);
  
  let mappedCompany = '';
  if (selectedNode?.subtenantId) {
    for (const t of tenants) {
      for (const s of t.subtenants) {
        if (s.id === selectedNode.subtenantId) {
          mappedCompany = s.name; // e.g. "LG전자"
        }
      }
    }
  }

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 sm:p-0 backdrop-blur-sm">
      <div className="bg-white rounded-[16px] w-full max-w-[600px] max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl transition-all">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0">
          <h2 className="text-[18px] font-extrabold text-gray-900 flex items-center gap-2"><AlertTriangle className="text-red-500" size={20}/>장애 등록</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20}/></button>
        </div>
        <div className="p-5 sm:p-7 flex-1 overflow-y-auto flex flex-col gap-6 scrollbar-hide">
          <section>
            <h3 className="text-sm font-extrabold text-gray-800 mb-4 border-l-4 border-red-500 pl-3">장애 기본 정보</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-[12px] font-bold text-gray-500 mb-1.5 font-mono uppercase tracking-tight">발생 시간 <span className="text-red-500">*</span></label><input type="datetime-local" value={startD} onChange={e => setStartD(e.target.value)} className="w-full border border-gray-200 rounded-[10px] p-2.5 text-[13px] font-bold focus:outline-none focus:border-red-500 transition-all" /></div>
              <div><label className="block text-[12px] font-bold text-gray-500 mb-1.5 font-mono uppercase tracking-tight">복구 시간 <span className="text-red-500">*</span></label><input type="datetime-local" value={endD} onChange={e => setEndD(e.target.value)} className="w-full border border-gray-200 rounded-[10px] p-2.5 text-[13px] font-bold focus:outline-none focus:border-red-500 transition-all" /></div>
            </div>
            <div className="mt-4"><label className="block text-[12px] font-bold text-gray-500 mb-1.5 font-mono uppercase tracking-tight">소요 시간</label><input type="text" readOnly value={durationStr} className={`w-full bg-gray-50 border rounded-[10px] p-3 text-[13px] font-extrabold shadow-inner ${isError ? 'text-red-600 border-red-200 bg-red-50' : 'text-gray-600 border-gray-100'}`}/></div>
          </section>
          
          <section>
            <h3 className="text-sm font-extrabold text-gray-800 mb-4 border-l-4 border-red-500 pl-3">영향 범위</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                 <label className="block text-[12px] font-bold text-gray-500 mb-1.5 font-mono uppercase tracking-tight">발생 유형 <span className="text-red-500">*</span></label>
                 <select value={nodeType} onChange={e => {setNodeType(e.target.value); setInstanceId('');}} className="w-full border border-gray-200 rounded-[10px] p-2.5 text-[13px] font-bold focus:outline-none focus:border-red-500 bg-white cursor-pointer transition-colors">
                    <option value="GPU">GPU</option>
                    <option value="CPU">CPU</option>
                    <option value="Storage">Storage</option>
                    <option value="NW">NW</option>
                 </select>
              </div>
              <div>
                 <label className="block text-[12px] font-bold text-gray-500 mb-1.5 font-mono uppercase tracking-tight">인스턴스 명</label>
                 <select value={instanceId} onChange={e => setInstanceId(e.target.value)} disabled={nodeType !== 'GPU'} className="w-full border border-gray-200 rounded-[10px] p-2.5 text-[13px] font-bold bg-white disabled:bg-gray-50 disabled:text-gray-400 cursor-pointer transition-colors">
                    <option value="">{nodeType === 'GPU' ? '인스턴스 선택' : '해당 없음'}</option>
                    {nodeType === 'GPU' && allocatedInstances.map(n => (
                      <option key={n.name} value={n.name}>{n.name}</option>
                    ))}
                 </select>
              </div>
            </div>
            <div className="mt-4 p-4 border border-gray-200 rounded-[12px] bg-gray-50/50 flex flex-col gap-3">
               <div className="flex justify-between items-center"><span className="text-[12px] font-extrabold text-gray-700">고객사별 GPU 수량</span><button className="text-[11px] text-primary-600 font-bold hover:underline">+ 추가 고객사</button></div>
               <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                  <input type="text" readOnly value={mappedCompany ? `${mappedCompany} (자동매핑)` : '인스턴스를 선택해주세요'} className={`flex-1 border bg-white rounded-[8px] p-2 text-[12px] font-bold ${mappedCompany ? 'border-primary-200 text-primary-700 bg-primary-50' : 'border-gray-100 text-gray-400'}`}/>
                  <input type="number" placeholder="수량 입력" className="w-full sm:w-20 border border-gray-200 rounded-[8px] p-2 text-[12px] font-bold focus:outline-none focus:border-red-400 transition-all"/>
               </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-extrabold text-gray-800 mb-4 border-l-4 border-red-500 pl-3">크레딧 산출</h3>
            <div className="p-4 rounded-[12px] bg-emerald-50 border border-emerald-100 flex justify-between items-center shadow-sm">
               <span className="text-[13px] text-emerald-800 font-bold">크레딧 산출액 (예상)</span>
               <span className="font-mono text-xl font-black text-emerald-600">+₩ 14,500</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-2 font-medium">* 고객에게 적립되는 크레딧 (본사 확정 전 예상수치)</p>
          </section>
          
          <section className="mb-4">
            <h3 className="text-sm font-extrabold text-gray-800 mb-4 border-l-4 border-red-500 pl-3">부가 정보</h3>
            <textarea placeholder="조치 내용 및 메모 입력" className="w-full border border-gray-200 rounded-[12px] p-4 text-[13px] min-h-[100px] resize-none focus:outline-none focus:border-red-400 transition-all" />
          </section>
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3 shrink-0 bg-gray-50/20">
          <button onClick={onClose} className="flex-1 h-[44px] rounded-[10px] text-[14px] font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors">취소</button>
          <button onClick={onClose} className="flex-1 h-[44px] rounded-[10px] text-[14px] font-extrabold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 active:scale-95">장애 등록 완료</button>
        </div>
      </div>
    </div>
  );
}

function PMModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [pmType, setPmType] = useState('정기');

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center backdrop-blur-sm p-4 sm:p-0">
      <div className="bg-white rounded-[16px] w-full max-w-[600px] max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-all">
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 flex-none bg-white">
          <h2 className="text-[17px] sm:text-[18px] font-extrabold text-gray-900 flex items-center gap-2.5">
            <div className={`w-2 h-2 rounded-full animate-pulse ${pmType === '긴급' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`}/>
            PM 등록
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors"><X size={20}/></button>
        </div>
        <div className="p-5 sm:p-7 flex flex-col gap-6 sm:gap-8 overflow-y-auto scrollbar-hide flex-1">
          <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
            <h3 className={`text-sm font-extrabold text-gray-800 mb-5 border-l-4 ${pmType === '긴급' ? 'border-amber-500' : 'border-primary-500'} pl-3 flex items-center gap-2 uppercase tracking-tight`}>
              <Settings size={16} className={pmType === '긴급' ? 'text-amber-500' : 'text-primary-500'}/>
              PM 기본 정보
            </h3>
            <div className="flex flex-col gap-5">
               <div>
                 <label className="block text-[11px] font-extrabold text-gray-500 mb-1.5 uppercase tracking-tight">PM 구분 <span className="text-red-500">*</span></label>
                 <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setPmType('정기')} className={`py-2.5 rounded-[10px] text-[13px] font-bold border transition-all ${pmType === '정기' ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm shadow-primary-500/10' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-white hover:border-gray-200'}`}>정기 PM</button>
                    <button onClick={() => setPmType('긴급')} className={`py-2.5 rounded-[10px] text-[13px] font-bold border transition-all ${pmType === '긴급' ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-sm shadow-amber-500/10' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-white hover:border-gray-200'}`}>긴급 PM</button>
                 </div>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div><label className="block text-[11px] font-extrabold text-gray-500 mb-1.5 uppercase tracking-tight">PM 시작 <span className="text-red-500">*</span></label><input type="datetime-local" className="w-full border border-gray-200 rounded-[10px] p-2.5 text-[13px] font-bold text-gray-800 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 shadow-sm" /></div>
                 <div><label className="block text-[11px] font-extrabold text-gray-500 mb-1.5 uppercase tracking-tight">PM 종료 <span className="text-red-500">*</span></label><input type="datetime-local" className="w-full border border-gray-200 rounded-[10px] p-2.5 text-[13px] font-bold text-gray-800 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 shadow-sm" /></div>
               </div>
            </div>
          </section>
          
          <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
            <h3 className={`text-sm font-extrabold text-gray-800 mb-5 border-l-4 ${pmType === '긴급' ? 'border-amber-500' : 'border-primary-500'} pl-3 flex items-center gap-2 uppercase tracking-tight`}>
              <Box size={16} className={pmType === '긴급' ? 'text-amber-500' : 'text-primary-500'}/>
              영향 범위 및 대상
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div><label className="block text-[11px] font-extrabold text-gray-500 mb-1.5 uppercase tracking-tight">대상 노드 <span className="text-red-500">*</span></label><select className="w-full border border-gray-200 rounded-[10px] p-2.5 text-[13px] font-bold text-gray-800 bg-white cursor-pointer focus:outline-none focus:border-primary-500 shadow-sm"><option>Storage-NVMe-01</option><option>Network-IB-Leaf-02</option></select></div>
              <div><label className="block text-[11px] font-extrabold text-gray-500 mb-1.5 uppercase tracking-tight">실제 인스턴스 (자동 맵핑)</label><input type="text" placeholder="예: STOR-01" className="w-full border border-gray-200 rounded-[10px] p-2.5 text-[13px] font-bold text-gray-800 bg-gray-50/50" /></div>
            </div>
            <div className="p-4.5 border border-gray-100 rounded-[12px] bg-gray-50/50 flex flex-col gap-4 shadow-inner">
               <div className="flex justify-between items-center"><span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-tight">고객사별 GPU 수량</span><button className="text-[11px] text-primary-600 font-extrabold flex items-center gap-1 hover:underline cursor-pointer"><Plus size={12}/> 추가 고객사</button></div>
               <div className="flex gap-3 items-center">
                 <input type="text" readOnly value="전체 고객사 (공용 자원)" className="flex-1 border bg-white border-gray-100 rounded-[8px] p-2 text-[12px] font-bold text-gray-700 shadow-sm"/>
                 <div className="relative">
                   <input type="number" defaultValue={8} className="w-16 border border-gray-200 rounded-[8px] p-2 text-[12px] font-black text-center text-gray-900 font-mono shadow-sm bg-white"/>
                   <span className="absolute -top-4 right-0 text-[9px] font-bold text-gray-400">COUNT</span>
                 </div>
               </div>
            </div>
          </section>

          {pmType === '긴급' && (
            <section className="bg-amber-50/30 p-5 rounded-xl border border-amber-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h3 className="text-sm font-extrabold text-gray-800 mb-4 border-l-4 border-amber-500 pl-3 uppercase tracking-tight">긴급 PM 크레딧 산출</h3>
              <div className="p-5 rounded-[14px] bg-white border border-amber-200 shadow-xl shadow-amber-500/5 flex justify-between items-center">
                 <div className="flex flex-col gap-1">
                   <span className="text-[11px] text-gray-400 font-extrabold uppercase tracking-tight">예상 보상 크레딧</span>
                   <span className="text-[13px] text-amber-800 font-bold">인스턴스당 차등 지급</span>
                 </div>
                 <span className="font-mono text-[20px] font-black text-amber-600 drop-shadow-sm">+₩ 8,000</span>
              </div>
              <p className="text-[10px] text-amber-600/70 font-bold mt-3 px-1 flex items-center gap-1.5"><AlertTriangle size={12}/> 장애 발생 및 긴급 PM 시 규정에 따른 보상금이 산출됩니다.</p>
            </section>
          )}

          <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
            <h3 className={`text-sm font-extrabold text-gray-800 mb-5 border-l-4 ${pmType === '긴급' ? 'border-amber-500' : 'border-primary-500'} pl-3 flex items-center gap-2 uppercase tracking-tight`}>
               <FileText size={16} className={pmType === '긴급' ? 'text-amber-500' : 'text-primary-500'}/>
               세부 내용 작성
            </h3>
            <div className="flex flex-col gap-4">
              <textarea placeholder="PM 작업 내용을 구체적으로 기록하세요 (고객사 공지 포함)" className="w-full border border-gray-200 rounded-[14px] p-4 text-[13px] font-medium h-24 focus:outline-none focus:border-primary-400 transition-all bg-gray-50/20 shadow-inner leading-relaxed"></textarea>
              <textarea placeholder="관리용 메모 (선택)" className="w-full border border-gray-200 rounded-[14px] p-4 text-[13px] font-medium h-20 focus:outline-none focus:border-primary-400 transition-all bg-gray-50/20 shadow-inner"></textarea>
            </div>
          </section>
        </div>
        <div className="px-6 py-5 border-t border-gray-100 flex justify-end gap-3 flex-none bg-gray-50/80 backdrop-blur-md">
          <button onClick={onClose} className="h-[44px] px-6 rounded-[12px] text-[14px] font-bold text-gray-600 hover:bg-gray-200 transition-all active:scale-[0.98]">취소</button>
          <button className={`h-[44px] flex-1 sm:flex-none px-10 rounded-[12px] text-[14px] font-black text-white shadow-lg transition-all active:scale-[0.98] uppercase tracking-wider ${pmType === '긴급' ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20' : 'bg-primary-600 hover:bg-primary-700 shadow-primary-600/20'}`}>
            PM 등록 완료
          </button>
        </div>
      </div>
    </div>
  );
}

export default function IncidentRegistration() {
  const [activeTenantIdx, setActiveTenantIdx] = useState(0);
  const t = tenantData[activeTenantIdx] || tenantData[0];
  const [isIncidentOpen, setIsIncidentOpen] = useState(false);
  const [isPmOpen, setIsPmOpen] = useState(false);

  // New this month for active tenant
  const newThisMonth = React.useMemo(() => {
    let count = 0;
    const currentMonth = '2026-03';
    t.subtenants.forEach(s => {
      s.records.forEach(r => {
        if (r.start.startsWith(currentMonth)) count++;
      });
    });
    return count;
  }, [t]);

  return (
    <div className="flex flex-col md:flex md:flex-row h-auto md:h-[calc(100vh-112px)] min-h-0 gap-6 text-gray-900">
      <IncidentModal isOpen={isIncidentOpen} onClose={() => setIsIncidentOpen(false)} />
      <PMModal isOpen={isPmOpen} onClose={() => setIsPmOpen(false)} />

      <CompanyListPanel
        companies={tenantData.map(t => ({ id: t.name, name: t.name, subCount: t.subtenants.length }))}
        activeIndex={activeTenantIdx}
        onCompanyClick={setActiveTenantIdx}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-none flex flex-col gap-5 mb-5 shrink-0">
      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border text-left border-gray-200 rounded-[10px] p-5 flex flex-col justify-between shadow-sm">
          <div className="text-[14px] font-semibold text-gray-600 mb-2">{t.name} 상시 등록 건수</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold tracking-tight text-gray-900">{t.totalCount}</span><span className="text-gray-500 text-sm">건</span>
          </div>
          <div className="mt-4 text-[12px] font-medium text-gray-500 flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md border border-gray-100"><AlertTriangle size={12} className="text-red-500"/>장애 {t.incidentCount}건</span>
            <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md border border-gray-100"><Settings size={12} className="text-blue-500"/>PM {t.pmCount}건</span>
          </div>
        </div>
        <div className="bg-white border text-left border-gray-200 rounded-[10px] p-5 flex flex-col justify-between shadow-sm">
          <div className="text-[14px] font-semibold text-gray-600 mb-2">{t.name} 총 크레딧 산출액</div>
          <div className="text-3xl font-bold tracking-tight text-emerald-600 mt-1">+₩ {Math.abs(t.totalCredit).toLocaleString()}</div>
          <div className="mt-4 text-[12px] font-medium text-gray-400">전체 기간 누적</div>
        </div>
        <div className="bg-white border text-left border-gray-200 rounded-[10px] p-5 flex flex-col justify-between shadow-sm">
          <div className="text-[14px] font-semibold text-gray-600 mb-2">이번 달 신규 등록</div>
          <div className="text-3xl font-bold tracking-tight text-emerald-600 mt-1">{newThisMonth} <span className="text-gray-500 text-sm font-medium">건</span></div>
          <div className="mt-4 text-[12px] font-medium text-gray-400">2026.03 기준</div>
        </div>
      </div>

      {/* 3, 4. Header Tools */}
      <div className="bg-white border border-gray-200 rounded-[14px] p-4 flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-4">
        {/* 상단: 타이틀 */}
        <div className="flex items-center justify-between md:border-r md:border-gray-200 md:pr-5">
           <div className="text-[14px] font-bold text-gray-900 flex items-center gap-2">
             조회 필터 및 등록
           </div>
        </div>

        {/* 중간: 필터 섹션 */}
        <div className="flex-1 md:px-5 flex flex-col sm:flex-row items-stretch md:items-center gap-3">
          <div className="grid grid-cols-2 lg:flex gap-2 flex-1">
            <div className="flex items-center gap-2 border border-gray-200 rounded-[8px] px-3 h-[36px] bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
              <Calendar size={14} className="text-gray-500 shrink-0"/>
              <select className="bg-transparent text-[13px] font-bold text-gray-700 outline-none w-full cursor-pointer"><option>최근 3개월</option></select>
            </div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-[8px] px-3 h-[36px] bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
              <select className="bg-transparent text-[13px] font-bold text-gray-700 outline-none w-full cursor-pointer"><option>전체 구분</option><option>장애</option><option>긴급 PM</option><option>정기 PM</option></select>
            </div>
          </div>
        </div>

        {/* 하단/우측: 액션 버튼 */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-3 md:pt-0 border-t border-gray-50 md:border-none">
          <button onClick={() => setIsIncidentOpen(true)} className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-[8px] bg-red-50 text-red-700 hover:bg-red-100 text-[13px] font-bold border border-red-200 shadow-sm transition-all active:scale-[0.98]">
            <AlertTriangle size={14}/><Plus size={14}/> <span>장애 등록</span>
          </button>
          <button onClick={() => setIsPmOpen(true)} className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-[8px] bg-blue-50 text-blue-700 hover:bg-blue-100 text-[13px] font-bold border border-blue-200 shadow-sm transition-all active:scale-[0.98]">
            <Settings size={14}/><Plus size={14}/> <span>PM 등록</span>
          </button>
        </div>
      </div>
      </div>

      {/* 5. Table */}
      <div className="flex-1 bg-white border border-gray-200 rounded-[10px] overflow-hidden shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] flex flex-col text-left min-h-0">
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <table className="w-full text-left border-collapse table-auto">
          <thead className="hidden md:table-header-group">
            <tr className="bg-[#FAFAFA] border-b border-gray-200">
              <th className="px-5 py-[14px] text-[12px] font-bold text-gray-500 uppercase min-w-[70px] whitespace-nowrap">구분</th>
              <th className="px-5 py-[14px] text-[12px] font-bold text-gray-500 uppercase whitespace-nowrap">발생/시작 일시</th>
              <th className="px-5 py-[14px] text-[12px] font-bold text-gray-500 uppercase whitespace-nowrap">복구/종료 일시</th>
              <th className="px-5 py-[14px] text-[12px] font-bold text-gray-500 uppercase whitespace-nowrap">소요 시간</th>
              <th className="px-5 py-[14px] text-[12px] font-bold text-gray-500 uppercase whitespace-nowrap">발생 노드/인스턴스</th>
              <th className="px-5 py-[14px] text-[12px] font-bold text-gray-500 uppercase whitespace-nowrap">고객사</th>
              <th className="px-5 py-[14px] text-[12px] font-bold text-gray-500 uppercase text-center whitespace-nowrap">GPU</th>
              <th className="px-5 py-[14px] text-[12px] font-bold text-gray-500 uppercase text-right whitespace-nowrap">크레딧 산출액</th>
              <th className="px-5 py-[14px] text-[12px] font-bold text-gray-500 uppercase whitespace-nowrap">등록자</th>
            </tr>
          </thead>
          <tbody className="flex flex-col gap-4 p-4 md:table-row-group md:p-0">
            {t.subtenants.map(sub => (
                   <React.Fragment key={sub.name}>
                     {/* Subtenant Header */}
                     <tr className="flex flex-col md:table-row bg-[#F8FAFC] md:bg-[#FAFAFA] border-b border-gray-100 rounded-t-xl overflow-hidden">
                        <td colSpan={9} className="px-4 py-3 md:px-7 md:py-3 border-l-4 border-primary-500 md:border-l-transparent">
                          <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-700">
                            <Building2 size={14} className="text-primary-500 md:text-gray-400"/>
                            <span className="text-[14px] md:text-[13px]">{sub.name}</span>
                            <span className="text-gray-300 mx-1">|</span>
                            <span className="text-gray-500 font-medium">{sub.records.length}건</span>
                          </div>
                        </td>
                     </tr>

                     {sub.records.map((r, i) => (
                       <tr key={i} className="flex flex-col border border-gray-200 rounded-xl p-5 shadow-sm bg-white md:table-row md:border-0 md:border-b md:border-gray-100 md:rounded-none md:p-0 md:shadow-none hover:bg-gray-50/50 transition-colors group">
                          <td className="px-0 py-1 md:px-5 md:py-3 order-1 md:order-none">
                            <span className={`inline-flex items-center justify-center whitespace-nowrap px-2 py-0.5 md:py-1 rounded-[5px] text-[10px] md:text-[11px] font-bold border ${r.type === '장애' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA] min-w-[40px]' : r.type === '긴급PM' ? 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A] min-w-[52px]' : 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] min-w-[52px]'}`}>{r.type}</span>
                            <div className="md:hidden mt-3 border-b border-gray-50 pb-2 mb-3">
                               <div className="flex items-center gap-1.5 text-[15px] font-bold text-gray-900"><AlertTriangle size={16} className="text-red-500"/> {r.node} ({r.instance})</div>
                            </div>
                          </td>
                          <td className="px-0 py-1 md:px-5 md:py-3 font-mono text-gray-600 text-[12px] order-3 md:order-none">
                            <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">발생/시작 일시</span>
                            {r.start}
                          </td>
                          <td className="px-0 py-1 md:px-5 md:py-3 font-mono text-gray-600 text-[12px] order-4 md:order-none">
                            <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">복구/종료 일시</span>
                            {r.end}
                          </td>
                          <td className="px-0 py-1 md:px-5 md:py-3 font-bold text-gray-800 md:font-medium md:text-gray-700 order-2 md:order-none mb-2 md:mb-0">
                            <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">소요 시간</span>
                            {r.duration}
                          </td>
                          <td className="hidden md:table-cell px-5 py-3 md:whitespace-nowrap"><div className="flex items-center gap-1.5 px-2 py-1 bg-[#F8FAFC] border border-gray-200 rounded text-[12px] font-medium text-gray-600 inline-flex"><Server size={12}/>{r.node} ({r.instance})</div></td>
                          <td className="px-0 py-1 md:px-5 md:py-3 font-medium text-gray-600 order-5 md:order-none">
                            <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">해당 고객사</span>
                            {r.companies}
                          </td>
                          <td className="px-0 py-1 md:px-5 md:py-3 font-mono text-gray-600 text-[13px] md:text-center order-6 md:order-none">
                             <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">영향 GPU</span>
                             {r.gpu} HP
                          </td>
                          <td className="px-0 py-2 md:px-5 md:py-3 font-mono font-bold text-[16px] md:text-[13px] md:text-right border-t border-gray-50 mt-3 md:border-0 md:mt-0 order-7 md:order-none">
                            <div className="flex md:block justify-between items-center">
                              <span className="md:hidden text-[10px] text-emerald-600 font-bold uppercase">크레딧 산출액 (+)</span>
                              {r.credit ? <span className="text-emerald-600">+₩ {Math.abs(r.credit).toLocaleString()}</span> : <span className="text-gray-300 md:inline hidden">—</span>}
                            </div>
                          </td>
                          <td className="px-0 py-1 md:px-5 md:py-3 font-medium text-gray-400 text-[11px] md:text-[13px] md:text-gray-500 order-8 md:order-none mt-2 md:mt-0">
                            <span className="md:hidden text-[10px] text-gray-300 font-normal mr-1">등록자</span>
                            {r.user}
                          </td>
                       </tr>
                     ))}
                   </React.Fragment>
            ))}
          </tbody>
        </table>
        </div>
      </div>
     </div>
    </div>
  );
}
