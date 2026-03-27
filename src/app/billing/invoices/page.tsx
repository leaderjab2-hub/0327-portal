'use client';

import React, { useState } from 'react';
import { Download, Plus, FileText, ChevronDown, ChevronRight, CheckCircle2, AlertTriangle, Building2, UploadCloud, X, MoreVertical, Search, RotateCcw } from 'lucide-react';
import CompanyListPanel from '@/components/CompanyListPanel';

import { tenants, billings, creditHistory } from '@/lib/mockData';

const mockBilling = {
  tenants: tenants.map(t => {
    let tenantTotal = 0;
    let tenantBillingCount = 0;
    let unregisteredSubtenants = 0;
    
    const subtenants = t.subtenants.map(s => {
      const records = billings.filter(b => b.subtenantId === s.id);
      tenantTotal += records.reduce((sum, r) => sum + r.totalAmount, 0);
      tenantBillingCount += records.length;
      if (records.length === 0) unregisteredSubtenants += 1;
      return { name: s.name, records };
    });

    return {
      name: t.name,
      totalAmount: tenantTotal,
      billingCount: tenantBillingCount,
      unregisteredSubtenants,
      subtenants
    };
  })
};

function formatCurrency(num: number) {
  return `₩ ${Math.abs(num).toLocaleString()}`;
}

function BillingRegistrationModal({ onClose, tenant, subtenant }: { onClose: () => void, tenant: string, subtenant: string }) {
  const [credit, setCredit] = useState('860,000');
  
  const tenantObj = tenants.find(t => t.name === tenant);
  const subtenantObj = tenantObj?.subtenants.find(s => s.name === subtenant);
  
  let currentBalance = 0;
  if (subtenantObj) {
    const history = creditHistory.filter(c => c.subtenantId === subtenantObj.id);
    currentBalance = history.reduce((acc, h) => acc + (h.generated || 0) + (h.deducted || 0), 0);
  }
  
  const deductionNum = parseInt(credit.replace(/[^0-9]/g, ''), 10) || 0;
  const expectedBalance = currentBalance - deductionNum;
  
  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/60 flex flex-col items-center justify-center backdrop-blur-sm p-4 sm:p-0">
      <div className="bg-[#F8FAFC] w-full max-w-[700px] max-h-[95vh] sm:max-h-[90vh] rounded-[16px] shadow-2xl flex flex-col overflow-hidden transition-all">
        <div className="h-[56px] sm:h-[64px] border-b border-gray-200 px-5 sm:px-6 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-[17px] sm:text-[18px] font-extrabold text-gray-900 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"/>
            빌링 등록
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-5 sm:gap-6 scrollbar-hide">
          <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md">
             <h3 className="text-sm font-extrabold text-gray-800 border-l-4 border-primary-500 pl-3 mb-4">기본 정보</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div><label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-tight block mb-1.5">Tenant (읽기전용)</label><input type="text" readOnly value={tenant} className="w-full border border-gray-200 bg-gray-50/50 rounded-[10px] p-2.5 text-[13px] text-gray-700 font-bold focus:outline-none" /></div>
                <div><label className="text-[11px] font-extrabold text-gray-400 uppercase tracking-tight block mb-1.5">Subtenant (읽기전용)</label><input type="text" readOnly value={subtenant} className="w-full border border-gray-200 bg-gray-50/50 rounded-[10px] p-2.5 text-[13px] text-gray-700 font-bold focus:outline-none" /></div>
                <div><label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-tight block mb-1.5">청구 시작일 <span className="text-red-500">*</span></label><input type="date" className="w-full border border-gray-200 rounded-[10px] p-2.5 text-[13px] text-gray-900 font-bold focus:outline-none focus:border-primary-500 transition-all shadow-sm" /></div>
                <div><label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-tight block mb-1.5">청구 종료일 <span className="text-red-500">*</span></label><input type="date" className="w-full border border-gray-200 rounded-[10px] p-2.5 text-[13px] text-gray-900 font-bold focus:outline-none focus:border-primary-500 transition-all shadow-sm" /></div>
             </div>
          </section>

          <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-bold text-gray-800 border-l-4 border-primary-500 pl-2">청구 내역 (자동 산출)</h3>
               <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-1 rounded">2026.02.01 ~ 2026.02.28 (예시)</span>
             </div>
             <div className="border border-gray-200 rounded-lg overflow-hidden bg-[#FAFAFA]">
               <div className="grid grid-cols-2 divide-x divide-gray-200">
                  <div className="p-4 flex flex-col gap-3">
                     <div className="flex justify-between items-center"><span className="text-xs text-gray-500 font-medium">GPU 요금 (고정)</span><span className="text-sm font-mono font-bold text-gray-800">₩ 12,000,000</span></div>
                     <div className="flex justify-between items-center"><span className="text-xs text-gray-500 font-medium">CPU 요금 (고정)</span><span className="text-sm font-mono font-bold text-gray-800">₩ 800,000</span></div>
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                     <div className="flex justify-between items-center"><span className="text-xs text-gray-500 font-medium">스토리지 요금 (변동)</span><span className="text-sm font-mono font-bold text-gray-800">₩ 420,000</span></div>
                     <div className="flex justify-between items-center"><span className="text-xs text-gray-500 font-medium">네트워크 요금 (변동)</span><span className="text-sm font-mono font-bold text-gray-800">₩ 120,000</span></div>
                  </div>
               </div>
               <div className="p-4 border-t border-gray-200 bg-red-50/30 flex flex-col gap-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[13px] text-red-700 font-bold flex items-center gap-1.5"><AlertTriangle size={14}/>크레딧 차감 (수동 수정 가능)</span>
                    <span className="text-[12px] font-medium text-gray-600">
                      현재 잔여 크레딧:{' '}
                      <span className={`font-mono font-bold ${currentBalance > 0 ? 'text-emerald-600' : 'text-gray-500'}`}>
                         {currentBalance > 0 ? `+₩ ${currentBalance.toLocaleString()}` : '₩ 0'}
                      </span>
                      {' '}({subtenant})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      {expectedBalance < 0 ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-red-500 text-[12px] font-bold">차감 후 잔액: -₩ {Math.abs(expectedBalance).toLocaleString()}</span>
                          <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[10px] font-bold">잔여 크레딧을 초과합니다</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-[12px] font-medium">
                          차감 후 잔액:{' '}
                          <span className={expectedBalance > 0 ? 'text-emerald-600 font-mono font-bold' : 'text-gray-500 font-mono font-bold'}>
                             {expectedBalance > 0 ? `+₩ ${expectedBalance.toLocaleString()}` : '₩ 0'}
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-red-500 font-mono text-sm">-₩</span>
                      <input type="text" value={credit} onChange={e => setCredit(e.target.value)} className="w-[100px] text-right bg-white border border-red-200 text-red-600 font-mono font-bold rounded px-2 py-1 shadow-inner focus:outline-none focus:border-red-400" />
                    </div>
                  </div>
               </div>
             </div>
          </section>

          <section className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-xl shadow-md text-white">
             <div className="flex justify-between items-end">
               <span className="text-[14px] text-gray-300 font-medium">최종 청구 금액</span>
               <span className="text-3xl font-mono font-extrabold text-[#FCD34D]">₩ 12,480,000</span>
             </div>
          </section>

          <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
             <h3 className="text-sm font-bold text-gray-800 border-l-4 border-primary-500 pl-2 mb-4">부가 정보</h3>
             <div className="grid grid-cols-2 gap-4">
                <div className="border border-dashed border-gray-300 bg-gray-50 rounded-lg flex flex-col items-center justify-center p-4 hover:bg-gray-100 cursor-pointer">
                   <UploadCloud size={20} className="text-gray-400 mb-2"/>
                   <span className="text-[12px] font-semibold text-gray-600">인보이스 업로드 (PDF)</span>
                </div>
                <textarea placeholder="특이사항 메모 (선택사항)" className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none"></textarea>
             </div>
          </section>

        </div>
        <div className="h-[70px] sm:h-[80px] border-t border-gray-200 px-6 sm:px-8 flex items-center justify-end gap-3 sm:gap-4 bg-white shrink-0">
          <button onClick={onClose} className="h-[44px] px-6 rounded-[12px] text-[14px] font-bold text-gray-600 hover:bg-gray-100 transition-all active:scale-[0.98]">취소</button>
          <button onClick={onClose} className="h-[44px] flex-1 sm:flex-none px-10 rounded-[12px] text-[14px] font-black text-white bg-gray-900 border border-gray-900 shadow-lg shadow-gray-900/10 hover:bg-black transition-all active:scale-[0.98] uppercase tracking-wider">빌링 등록 완료</button>
        </div>
      </div>
    </div>
  );
}

export default function InvoicesPage() {
  const [activeTenantIdx, setActiveTenantIdx] = useState(0);
  const [activeSubtenantIdx, setActiveSubtenantIdx] = useState(0);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAdmin = true; // 역할 시뮬레이션

  const t = mockBilling.tenants[activeTenantIdx];
  const sub = t.subtenants[activeSubtenantIdx] || t.subtenants[0];

  const handleTenantClick = (idx: number) => {
    setActiveTenantIdx(idx);
    setActiveSubtenantIdx(0);
    setExpandedRow(null);
  };

  const handleSubtenantClick = (idx: number) => {
    setActiveSubtenantIdx(idx);
    setExpandedRow(null);
  };

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="flex flex-col md:flex md:flex-row h-auto md:h-[calc(100vh-112px)] min-h-0 gap-6 text-gray-900">
      {isModalOpen && <BillingRegistrationModal onClose={() => setIsModalOpen(false)} tenant={t.name} subtenant={sub?.name || ''} />}

      {/* 1. Left Panel - Tenant List */}
      <CompanyListPanel
        companies={mockBilling.tenants.map(t => ({ id: t.name, name: t.name, subCount: t.subtenants.length }))}
        activeIndex={activeTenantIdx}
        onCompanyClick={handleTenantClick}
      />

      {/* Right Panel - Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-none flex flex-col gap-5 mb-5 shrink-0">

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border text-left border-gray-200 rounded-[10px] p-5 flex flex-col justify-between shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
          <div className="text-[14px] font-bold text-gray-500 mb-2">{t.name} 총 청구 금액</div>
          <div className="text-[28px] font-mono font-extrabold tracking-tight text-gray-900 mt-1">₩ {t.totalAmount.toLocaleString()}</div>
          <div className="mt-4 text-[12px] font-semibold text-gray-400">선택한 Tenant 누적 기준</div>
        </div>
        <div className="bg-white border text-left border-gray-200 rounded-[10px] p-5 flex flex-col justify-between shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
          <div className="text-[14px] font-bold text-gray-500 mb-2">빌링 등록 건수</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[28px] font-bold tracking-tight text-primary-600">{t.billingCount}</span>
            <span className="text-gray-500 text-sm font-medium">건</span>
          </div>
          <div className="mt-4 text-[12px] font-semibold text-gray-400">이번 달 기준 완료 내역</div>
        </div>
        <div className="bg-white border text-left border-gray-200 rounded-[10px] p-5 flex flex-col justify-between shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
          <div className="text-[14px] font-bold text-gray-500 mb-2">미등록 Subtenant</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[28px] font-bold tracking-tight text-amber-500">{t.unregisteredSubtenants}</span>
            <span className="text-gray-500 text-sm font-medium">개</span>
          </div>
          <div className="mt-4 text-[12px] font-semibold text-gray-400">이번 달 빌링 등록 대기 중</div>
        </div>
      </div>

      {/* 3. Subtenant Tabbar & Tools */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide no-scrollbar">
          {t.subtenants.map((ms, i) => (
            <button
              key={ms.name}
              onClick={() => handleSubtenantClick(i)}
              className={`px-4 py-2 rounded-lg text-[13px] font-bold flex items-center gap-1.5 transition-all outline-none whitespace-nowrap ${
                activeSubtenantIdx === i
                ? 'bg-gray-800 text-white shadow-sm ring-2 ring-gray-800 ring-offset-2'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Building2 size={14} className={activeSubtenantIdx === i ? 'text-gray-300' : 'text-gray-400'}/>
              {ms.name} {ms.records.length === 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block align-top ml-0.5" title="미등록 상태"></span>}
            </button>
          ))}
        </div>
        {isAdmin && sub && (
          <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-1.5 px-6 py-2.5 sm:px-4 sm:py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-[13px] font-bold shadow-sm shadow-primary-500/20 transition-all active:scale-[0.98]">
            <Plus size={16}/> <span>빌링 등록</span>
          </button>
        )}
      </div>

        </div>

      {/* 4. Table */}
      <div className="flex-1 bg-white border border-gray-200 rounded-[10px] flex flex-col min-h-0 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <table className="w-full text-left border-collapse">
          <thead className="hidden md:table-header-group">
            <tr className="bg-[#FAFAFA] border-b border-gray-200">
              <th className="w-10 px-4"></th>
              <th className="px-6 py-4 text-[12px] font-extrabold text-gray-500 uppercase tracking-widest">청구 기간</th>
              <th className="px-6 py-4 text-[12px] font-extrabold text-gray-500 uppercase tracking-widest text-right">청구 금액</th>
              <th className="px-6 py-4 text-[12px] font-extrabold text-gray-500 uppercase tracking-widest">크레딧 차감</th>
              <th className="px-6 py-4 text-[12px] font-extrabold text-gray-500 uppercase tracking-widest">등록일</th>
              <th className="px-6 py-4 text-[12px] font-extrabold text-gray-500 uppercase tracking-widest">다운로드</th>
              {isAdmin && <th className="px-6 py-4 text-[12px] font-extrabold text-gray-500 uppercase tracking-widest text-center">관리</th>}
            </tr>
          </thead>
          <tbody className="flex flex-col gap-4 p-4 md:table-row-group md:p-0">
            {!sub || sub.records.length === 0 ? (
              <tr className="md:table-row">
                <td colSpan={isAdmin ? 7 : 6} className="px-6 py-16 text-center text-gray-400 text-[14px]">
                  해당 Subtenant에 등록된 빌링 내역이 없습니다.
                </td>
              </tr>
            ) : (
              sub.records.map((r, rowIdx) => (
                <React.Fragment key={r.id}>
                  {/* 메인 행 / 카드 */}
                  <tr 
                    onClick={() => toggleRow(r.id)}
                    className={`flex flex-col border border-gray-200 rounded-xl p-5 shadow-sm bg-white md:table-row md:border-0 md:border-b md:rounded-none md:p-0 md:shadow-none transition-colors ${
                      expandedRow === r.id ? 'bg-primary-50/30 border-primary-100 ring-2 ring-primary-500/20 md:ring-0' : 'border-gray-100 hover:bg-gray-50/50'
                    }`}
                  >
                    <td className="hidden md:table-cell w-10 px-4 text-center">
                      <div className={`p-1 rounded-md transition-transform ${expandedRow === r.id ? 'rotate-90 text-primary-600 bg-primary-50' : 'text-gray-400'}`}>
                        <ChevronRight size={16} />
                      </div>
                    </td>
                    <td className="px-0 py-1 md:px-6 md:py-4 font-mono font-bold text-[15px] md:text-[14px] text-gray-700 border-b border-gray-50 mb-3 pb-2 md:border-0 md:mb-0 md:pb-0">
                      <div className="flex justify-between items-center md:block">
                        <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">청구 기간</span>
                        <div className={`md:hidden p-1 rounded transition-transform ${expandedRow === r.id ? 'rotate-90 text-primary-600' : 'text-gray-400'}`}>
                          <ChevronRight size={18} />
                        </div>
                      </div>
                      {r.billingStart} <span className="text-gray-300 font-sans px-1">~</span> {r.billingEnd}
                    </td>
                    <td className="px-0 py-1 md:px-6 md:py-4 font-mono font-extrabold text-gray-900 text-left md:text-right text-[18px] md:text-[15px]">
                      <span className="md:hidden text-[10px] text-gray-500 font-normal block mb-0.5 whitespace-normal">최종 청구 금액</span>
                      {formatCurrency(r.totalAmount)}
                    </td>
                    <td className="px-0 py-1 md:px-6 md:py-4 font-mono font-semibold text-red-500">
                      <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">크레딧 차감</span>
                      {r.creditDeduction !== 0 ? `-₩ ${Math.abs(r.creditDeduction).toLocaleString()}` : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-0 py-1 md:px-6 md:py-4 text-gray-500 font-medium text-[13px]">
                      <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">등록일</span>
                      {r.registeredAt}
                    </td>
                    <td className="px-0 py-3 md:px-6 md:py-4 border-t border-gray-50 mt-2 md:border-0 md:mt-0">
                      <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 text-[11px] font-bold text-gray-600 border border-gray-200 bg-white px-3 py-2 md:py-1.5 rounded-md hover:bg-gray-50 shadow-sm">
                          <FileText size={14} className={r.invoiceFile ? 'text-primary-500' : 'text-gray-400'}/> 인보이스
                        </button>
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 text-[11px] font-bold text-gray-600 border border-gray-200 bg-white px-3 py-2 md:py-1.5 rounded-md hover:bg-gray-50 shadow-sm">
                          <Download size={14} className="text-emerald-500"/> CSV
                        </button>
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="absolute top-5 right-5 md:static px-0 md:px-6 md:py-4 text-center" onClick={e => e.stopPropagation()}>
                         <button className="p-1 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded md:block hidden"><MoreVertical size={16}/></button>
                      </td>
                    )}
                  </tr>

                  {/* 아코디언 상세 내역 */}
                  {expandedRow === r.id && (
                    <tr className="block md:table-row bg-[#FCFCFC] border-b border-gray-200 shadow-inner -mt-4 md:mt-0 rounded-b-xl overflow-hidden mx-1 md:mx-0">
                      <td colSpan={isAdmin ? 7 : 6} className="p-0">
                         <div className="px-6 py-6 md:px-16 md:py-8 flex flex-col md:flex-row gap-6 md:gap-12">
                            {/* 왼쪽: 항목별 요금 테이블 */}
                            <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                               <h4 className="text-[13px] font-extrabold text-gray-800 mb-4 border-l-4 border-gray-800 pl-2">청구 항목 상세</h4>
                               <div className="space-y-3">
                                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                    <span className="text-[13px] font-semibold text-gray-500">GPU 요금 (고정)</span>
                                    <span className="text-[14px] font-mono font-bold text-gray-700">{formatCurrency(r.gpu)}</span>
                                  </div>
                                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                    <span className="text-[13px] font-semibold text-gray-500">CPU 요금 (고정)</span>
                                    <span className="text-[14px] font-mono font-bold text-gray-700">{formatCurrency(r.cpu)}</span>
                                  </div>
                                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                    <span className="text-[13px] font-semibold text-gray-500">스토리지 요금 (변동)</span>
                                    <span className="text-[14px] font-mono font-bold text-gray-700">{formatCurrency(r.storage)}</span>
                                  </div>
                                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                    <span className="text-[13px] font-semibold text-gray-500">네트워크 요금 (변동)</span>
                                    <span className="text-[14px] font-mono font-bold text-gray-700">{formatCurrency(r.network)}</span>
                                  </div>
                                  <div className="flex justify-between items-center pt-2">
                                    <span className="text-[13px] font-bold text-red-600 flex items-center gap-1.5"><AlertTriangle size={14}/>크레딧 차감액</span>
                                    <span className="text-[14px] font-mono font-bold text-red-600">-₩ {Math.abs(r.creditDeduction).toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between items-end pt-4 mt-2 border-t-2 border-gray-800">
                                    <span className="text-[14px] font-extrabold text-gray-900">최종 금액</span>
                                    <span className="text-[20px] font-mono font-extrabold text-primary-600">{formatCurrency(r.totalAmount)}</span>
                                  </div>
                               </div>
                            </div>
                            
                            {/* 오른쪽: 부가 정보 */}
                            <div className="w-full md:w-[300px] flex flex-col gap-4">
                               <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                                  <h4 className="text-[12px] font-bold text-gray-500 mb-2 uppercase">인보이스 파일</h4>
                                  <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                     <FileText size={20} className="text-red-400 shrink-0" />
                                     <span className="text-[12px] font-medium text-gray-700 truncate">{r.invoiceFile || '첨부 파일 없음'}</span>
                                  </div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex-1">
                                  <h4 className="text-[12px] font-bold text-gray-500 mb-2 uppercase">특이사항 메모</h4>
                                  <p className="text-[13px] text-gray-600 leading-relaxed">
                                    {r.creditDeduction < 0 ? '이전 발생한 장애 내역에 대한 크레딧이 차감 반영되었습니다.' : '특이사항 없음.'}
                                  </p>
                               </div>
                            </div>
                         </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  </div>
  );
}
