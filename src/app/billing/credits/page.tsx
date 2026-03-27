'use client';

import React, { useState } from 'react';
import { Search, Calendar, ChevronDown, CheckCircle2, AlertTriangle, Building2, Server, FileText } from 'lucide-react';
import CompanyListPanel from '@/components/CompanyListPanel';

import { tenants, creditHistory } from '@/lib/mockData';

let globalGen = 0;
let globalDed = 0;

const mockCreditData = {
  summary: { currentBalance: 0, monthlyGenerated: 0, monthlyDeducted: 0 },
  tenants: tenants.map(t => {
    let tenantCurrentBalance = 0;
    const mappedSubtenants = t.subtenants.map(s => {
      const history = creditHistory.filter(c => c.subtenantId === s.id).map(c => ({
        type: c.type,
        source: c.source,
        datetime: c.datetime,
        duration: c.duration,
        node: c.node,
        generated: c.generated,
        deducted: c.deducted,
      }));
      const subGen = history.reduce((acc, h) => acc + (h.generated || 0), 0);
      const subDed = history.reduce((acc, h) => acc + (h.deducted || 0), 0);
      const subBalance = subGen + subDed; // deducted is negative
      
      tenantCurrentBalance += subBalance;
      globalGen += subGen;
      globalDed += subDed;

      return {
        name: s.name,
        currentBalance: subBalance,
        history
      };
    });

    return {
      name: t.name,
      currentBalance: tenantCurrentBalance,
      subtenants: mappedSubtenants,
    };
  })
};

mockCreditData.summary.currentBalance = globalGen + globalDed;
mockCreditData.summary.monthlyGenerated = globalGen; // assuming all mock data is this month
mockCreditData.summary.monthlyDeducted = globalDed;

export default function Credits() {
  const [activeTenantIdx, setActiveTenantIdx] = useState(0);
  const activeTenant = mockCreditData.tenants[activeTenantIdx] || mockCreditData.tenants[0];
  const activeTenantName = activeTenant.name;

  // Calculate summary based on active tenant
  const activeSummary = {
    currentBalance: activeTenant.currentBalance,
    monthlyGenerated: activeTenant.subtenants.reduce((acc, sub) => acc + sub.history.reduce((a, h) => a + (h.generated || 0), 0), 0),
    monthlyDeducted: activeTenant.subtenants.reduce((acc, sub) => acc + sub.history.reduce((a, h) => a + (h.deducted || 0), 0), 0)
  };

  return (
    <div className="flex flex-col md:flex md:flex-row h-auto md:h-[calc(100vh-112px)] min-h-0 gap-6 text-gray-900 pb-2">
      <CompanyListPanel
        companies={mockCreditData.tenants.map(t => ({ id: t.name, name: t.name, subCount: t.subtenants.length }))}
        activeIndex={activeTenantIdx}
        onCompanyClick={setActiveTenantIdx}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-none flex flex-col gap-5 mb-5 shrink-0">
      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1: 현재 크레딧 잔액 */}
        <div className="bg-white border border-gray-200 rounded-[10px] p-5 flex flex-col justify-between shadow-sm">
          <div className="text-[14px] font-semibold text-gray-600 mb-2">현재 크레딧 잔액</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-3xl font-bold tracking-tight ${activeSummary.currentBalance > 0 ? 'text-emerald-600' : activeSummary.currentBalance < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {activeSummary.currentBalance > 0 ? '+₩ ' : activeSummary.currentBalance < 0 ? '-₩ ' : '₩ '}
              {Math.abs(activeSummary.currentBalance).toLocaleString()}
            </span>
          </div>
          <div className="mt-4 text-[12px] font-medium text-gray-400">누적 발생액 + 누적 차감액</div>
        </div>

        {/* KPI 2: 이번 달 발생액 */}
        <div className="bg-white border border-gray-200 rounded-[10px] p-5 flex flex-col justify-between shadow-sm">
          <div className="text-[14px] font-semibold text-gray-600 mb-2">이번 달 발생액</div>
          <div className="text-3xl font-bold tracking-tight text-emerald-600 mt-1">
            +₩ {activeSummary.monthlyGenerated.toLocaleString()}
          </div>
          <div className="mt-4 text-[12px] font-medium text-gray-500 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md border border-gray-100">
              <AlertTriangle size={12} className="text-red-500"/>장애 발생
            </span>
            <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md border border-gray-100">
              <CheckCircle2 size={12} className="text-amber-500"/>PM 발생
            </span>
          </div>
        </div>

        {/* KPI 3: 이번 달 차감액 */}
        <div className="bg-white border border-gray-200 rounded-[10px] p-5 flex flex-col justify-between shadow-sm">
          <div className="text-[14px] font-semibold text-gray-600 mb-2">이번 달 차감액</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold tracking-tight text-red-600">-₩ {Math.abs(activeSummary.monthlyDeducted).toLocaleString()}</span>
          </div>
          <div className="mt-4 text-[12px] font-medium text-gray-500 flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md border border-gray-100">
              <FileText size={12} className="text-blue-500"/>빌링 차감
            </span>
          </div>
        </div>
      </div>

      {/* 4. Filters */}
      <div className="bg-white border border-gray-200 rounded-[14px] p-4 flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-4">
        <div className="flex items-center justify-between md:border-r md:border-gray-200 md:pr-5">
           <div className="text-[14px] font-bold text-gray-900">크레딧 필터 및 조회</div>
        </div>
        
        <div className="flex-1 md:px-5 flex flex-col sm:flex-row items-stretch md:items-center gap-3">
          <div className="grid grid-cols-2 lg:flex gap-2 flex-1 items-center">
            <div className="flex items-center gap-2 border border-gray-200 rounded-[8px] px-3 h-[36px] bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group flex-1">
              <Calendar size={14} className="text-gray-500 shrink-0" />
              <select className="bg-transparent text-[13px] font-bold text-gray-700 outline-none w-full cursor-pointer">
                 <option>전체 (누적)</option>
                 <option>이번 달 (3월)</option>
                 <option>지난 달 (2월)</option>
              </select>
            </div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-[8px] px-3 h-[36px] bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group flex-1">
              <select className="bg-transparent text-[13px] font-bold text-gray-700 outline-none w-full cursor-pointer">
                 <option>전체 구분</option>
                 <option>장애</option>
                 <option>PM</option>
                 <option>빌링 차감</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* 6. Table */}
      <div className="flex-1 bg-white border border-gray-200 rounded-[10px] overflow-hidden shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] flex flex-col min-h-0">
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <table className="w-full text-left border-collapse table-auto">
            <thead className="hidden md:table-header-group">
              <tr className="bg-[#FAFAFA] border-b border-gray-200">
                <th className="px-6 py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Subtenant</th>
                <th className="px-6 py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wider min-w-[70px] whitespace-nowrap">구분</th>
                <th className="px-6 py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">출처</th>
                <th className="px-6 py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">일시</th>
                <th className="px-6 py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">소요 시간</th>
                <th className="px-6 py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">노드</th>
                <th className="px-6 py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wider text-right whitespace-nowrap">발생액</th>
                <th className="px-6 py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wider text-right whitespace-nowrap">차감액</th>
              </tr>
            </thead>
            <tbody className="flex flex-col gap-4 p-4 md:table-row-group md:p-0">
              {mockCreditData.tenants.filter(t => t.name === activeTenantName).map((tenant) => (
                <React.Fragment key={tenant.name}>
                  {tenant.subtenants.map(subtenant => (
                    <React.Fragment key={subtenant.name}>
                      {/* Subtenant Group Header */}
                      <tr className="flex flex-col md:table-row bg-[#F8FAFC] md:bg-[#FAFAFA] border-b border-gray-100 rounded-t-xl overflow-hidden">
                         <td colSpan={8} className="px-4 py-3 md:px-6 md:py-3 border-l-4 border-primary-500 md:border-l-transparent">
                           <div className="md:ml-4 flex flex-col md:flex-row md:items-center gap-2 text-[13px] font-semibold text-gray-800">
                              <div className="flex items-center gap-2">
                                <Building2 size={14} className="text-primary-500 md:text-gray-400"/>
                                <span className="text-[14px] md:text-[13px]">{subtenant.name}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[12px] md:text-[13px] text-gray-500 font-medium">
                                <span className="hidden md:inline text-gray-300">|</span>
                                <span>{subtenant.history.length}건</span>
                                <span className="text-gray-300">|</span>
                                <span>잔액:</span>
                                <span className={`font-mono font-bold ${subtenant.currentBalance > 0 ? 'text-emerald-600' : subtenant.currentBalance < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                  {subtenant.currentBalance > 0 ? '+₩ ' : subtenant.currentBalance < 0 ? '-₩ ' : '₩ '}
                                  {Math.abs(subtenant.currentBalance).toLocaleString()}
                                </span>
                              </div>
                           </div>
                         </td>
                      </tr>

                      {/* History Data Rows */}
                      {subtenant.history.map((record, idx) => (
                        <tr key={idx} className="flex flex-col border border-gray-200 rounded-xl p-5 shadow-sm bg-white md:table-row md:border-0 md:border-b md:border-gray-100 md:rounded-none md:p-0 md:shadow-none hover:bg-gray-50/50 transition-colors relative group">
                           <td className="hidden md:table-cell px-6 py-[14px]">
                              <div className="ml-10">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-[6px] bg-white text-gray-700 text-[12px] font-semibold border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
                                  {subtenant.name}
                                </span>
                              </div>
                           </td>
                           <td className="px-0 py-1 md:px-6 md:py-[14px] order-1">
                              <span className={`inline-flex items-center justify-center whitespace-nowrap px-2 py-0.5 rounded-[5px] text-[10px] md:text-[11px] font-bold border md:static absolute top-5 right-5 
                                ${record.type === '장애' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA] min-w-[40px]' : 
                                  record.type === 'PM' ? 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A] min-w-[52px]' : 
                                  'bg-blue-50 text-blue-600 border-blue-200 min-w-[58px]'}`}>
                                {record.type}
                              </span>
                              <div className="md:hidden">
                                <span className="text-[14px] font-bold text-gray-900 border-b border-gray-50 block pb-2 mb-3">
                                  {record.source}
                                </span>
                              </div>
                           </td>
                           <td className="hidden md:table-cell px-6 py-[14px] text-gray-700 font-medium whitespace-nowrap">{record.source}</td>
                           <td className="px-0 py-1 md:px-6 md:py-[14px] font-mono text-gray-500 text-[12px] order-2">
                             <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">발생 일시</span>
                             {record.datetime}
                           </td>
                           <td className="px-0 py-1 md:px-6 md:py-[14px] text-gray-400 font-medium order-3">
                             <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">소용 시간</span>
                             {record.duration || <span className="text-gray-300">—</span>}
                           </td>
                           <td className="px-0 py-1 md:px-6 md:py-[14px] order-4">
                             <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">대상 노드</span>
                             {record.node ? (
                               <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#F8FAFC] text-gray-600 border border-gray-200 text-[12px] font-medium">
                                 <Server size={12} className="text-gray-400"/>
                                 {record.node}
                               </span>
                             ) : <span className="text-gray-300">—</span>}
                           </td>
                           <td className="px-0 py-2 md:px-6 md:py-[14px] font-mono font-bold text-[14px] md:text-[13px] md:text-right border-t border-gray-50 mt-3 md:border-0 md:mt-0 order-5">
                             <div className="flex md:block justify-between items-center">
                               <span className="md:hidden text-[10px] text-emerald-600 font-bold uppercase">발생액 (+)</span>
                               <span className="text-emerald-600">
                                 {record.generated ? `+₩ ${record.generated.toLocaleString()}` : <span className="text-gray-300 md:inline hidden">—</span>}
                               </span>
                             </div>
                           </td>
                           <td className="px-0 py-2 md:px-6 md:py-[14px] font-mono font-bold text-[14px] md:text-[13px] md:text-right order-6">
                             <div className="flex md:block justify-between items-center">
                               <span className="md:hidden text-[10px] text-red-600 font-bold uppercase">차감액 (-)</span>
                               <span className="text-red-600">
                                 {record.deducted ? `-₩ ${Math.abs(record.deducted).toLocaleString()}` : <span className="text-gray-300 md:inline hidden">—</span>}
                               </span>
                             </div>
                           </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}

                  {/* Tenant Total Summary Section */}
                  <tr className="flex flex-col md:table-row bg-gray-50 border-t border-gray-200 mt-6 md:mt-0">
                    <td colSpan={8} className="px-5 py-6 md:px-6 md:py-[18px]">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4 md:gap-6 text-[14px] font-bold">
                        <div className="flex justify-between items-center md:justify-end md:gap-2">
                          <span className="text-gray-600 font-semibold">누적 발생액:</span>
                          <span className="font-mono text-emerald-600">+₩ {tenant.subtenants.reduce((acc, sub) => acc + sub.history.reduce((a, h) => a + (h.generated || 0), 0), 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center md:justify-end md:gap-2">
                          <span className="text-gray-600 font-semibold">누적 차감액:</span>
                          <span className="font-mono text-red-600">-₩ {Math.abs(tenant.subtenants.reduce((acc, sub) => acc + sub.history.reduce((a, h) => a + (h.deducted || 0), 0), 0)).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center md:justify-end md:gap-2 border-t md:border-t-0 md:border-l border-gray-300 pt-3 md:pt-0 md:pl-6">
                          <span className="text-gray-900 font-extrabold text-[15px] md:text-[14px]">최종 잔액:</span>
                          <span className={`font-mono text-[20px] md:text-[16px] font-extrabold ${tenant.currentBalance > 0 ? 'text-emerald-600' : tenant.currentBalance < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                            {tenant.currentBalance > 0 ? '+₩ ' : tenant.currentBalance < 0 ? '-₩ ' : '₩ '}
                            {Math.abs(tenant.currentBalance).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
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
