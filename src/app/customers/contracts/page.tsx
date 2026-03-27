'use client';

import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Building2, Calendar, HardDrive, Users, CheckSquare, Server, Cpu, Network, Package, Edit, Trash2, X, Download } from 'lucide-react';

import { tenants } from '@/lib/mockData';

const mockTenants = tenants.map(t => ({
  id: t.id,
  name: t.name,
  contractorEmail: t.contractorEmail,
  managerEmail: t.managerEmail,
  createdAt: t.createdAt,
  contract: t.contract,
  subtenants: t.subtenants.map(s => ({
    id: s.id,
    name: s.name,
    status: s.status,
    products: s.products.join(', '),
    startDate: s.startDate,
    endDate: s.endDate,
    pm: s.pm,
    memberCount: s.memberCount
  }))
}));

function TenantModal({ isOpen, onClose, mode, initialData }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-[#F8FAFC] w-full max-w-[640px] max-h-full rounded-[14px] shadow-2xl flex flex-col overflow-hidden shadow-gray-900/20">
        <div className="h-[60px] border-b border-gray-200 px-6 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-[16px] font-bold text-gray-900 flex items-center gap-2">
            <Building2 size={18} className="text-primary-600"/>{mode === 'add' ? 'Tenant 추가' : 'Tenant 수정'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900"><X size={20}/></button>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0 p-6">
          <div className="flex flex-col gap-6">
            <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
             <h3 className="text-sm font-bold text-gray-800 mb-4">회사 기본 정보</h3>
             <div className="grid grid-cols-1 gap-4">
               <div><label className="text-xs text-gray-500 block mb-1">회사명 <span className="text-red-500">*</span></label><input type="text" defaultValue={initialData?.name} className="w-full border border-gray-200 rounded p-2 text-sm text-gray-800 font-medium" placeholder="회사명 입력" /></div>
               <div className="grid grid-cols-2 gap-4">
                 <div><label className="text-xs text-gray-500 block mb-1">계약자 이메일 <span className="text-red-500">*</span></label><input type="email" defaultValue={initialData?.contractorEmail} className="w-full border border-gray-200 rounded p-2 text-sm text-gray-800" placeholder="admin@example.com" /></div>
                 <div><label className="text-xs text-gray-500 block mb-1">담당 관리자 이메일 <span className="text-red-500">*</span></label><input type="email" defaultValue={initialData?.managerEmail} className="w-full border border-gray-200 rounded p-2 text-sm text-gray-800" placeholder="manager@sk.com" /></div>
               </div>
             </div>
          </section>

          <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
             <h3 className="text-sm font-bold text-gray-800 mb-4">계약 기간</h3>
             <div className="grid grid-cols-2 gap-4">
               <div><label className="text-xs text-gray-500 block mb-1">계약 시작일 <span className="text-red-500">*</span></label><input type="date" defaultValue={initialData?.contract?.startDate} className="w-full border border-gray-200 rounded p-2 text-sm text-gray-800" /></div>
               <div><label className="text-xs text-gray-500 block mb-1">계약 종료일 <span className="text-red-500">*</span></label><input type="date" defaultValue={initialData?.contract?.endDate} className="w-full border border-gray-200 rounded p-2 text-sm text-gray-800" /></div>
             </div>
          </section>

          <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
             <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center justify-between">
                리소스 계약 정보
                <span className="text-[11px] font-normal text-gray-500">* 단가 미확정 시 0원으로 자동 저장</span>
             </h3>
             <div className="grid grid-cols-2 gap-5 bg-gray-50/50 p-4 border border-gray-100 rounded-lg">
                <div className="flex flex-col gap-3">
                   <div className="text-[13px] font-extrabold text-gray-800 flex items-center gap-1.5 border-b border-gray-200 pb-2"><Server size={14} className="text-primary-600"/> GPU</div>
                   <div className="flex items-center gap-2"><div className="w-16 text-xs text-gray-500 font-semibold">수량</div><input type="number" defaultValue={initialData?.contract?.gpu?.quantity} className="flex-1 border border-gray-200 rounded p-1.5 text-xs text-right"/><span className="text-xs font-semibold text-gray-600 w-12 shrink-0">장</span></div>
                   <div className="flex items-center gap-2"><div className="w-16 text-xs text-gray-500 font-semibold">월 단가</div><input type="number" defaultValue={initialData?.contract?.gpu?.unitPrice} className="flex-1 border border-gray-200 rounded p-1.5 text-xs text-right"/><span className="text-xs font-semibold text-gray-600 w-12 shrink-0">원/장</span></div>
                </div>
                <div className="flex flex-col gap-3">
                   <div className="text-[13px] font-extrabold text-gray-800 flex items-center gap-1.5 border-b border-gray-200 pb-2"><Cpu size={14} className="text-primary-600"/> vCPU</div>
                   <div className="flex items-center gap-2"><div className="w-16 text-xs text-gray-500 font-semibold">수량</div><input type="number" defaultValue={initialData?.contract?.cpu?.quantity} className="flex-1 border border-gray-200 rounded p-1.5 text-xs text-right"/><span className="text-xs font-semibold text-gray-600 w-12 shrink-0">Core</span></div>
                   <div className="flex items-center gap-2"><div className="w-16 text-xs text-gray-500 font-semibold">월 단가</div><input type="number" defaultValue={initialData?.contract?.cpu?.unitPrice} className="flex-1 border border-gray-200 rounded p-1.5 text-xs text-right"/><span className="text-xs font-semibold text-gray-600 w-12 shrink-0">원/Core</span></div>
                </div>
                <div className="flex flex-col gap-3 pt-3 border-t border-gray-200">
                   <div className="text-[13px] font-extrabold text-gray-800 flex items-center gap-1.5 border-b border-gray-200 pb-2"><HardDrive size={14} className="text-primary-600"/> 스토리지</div>
                   <div className="flex items-center gap-2"><div className="w-16 text-xs text-gray-500 font-semibold">용량</div><input type="number" defaultValue={initialData?.contract?.storage?.capacity} className="flex-1 border border-gray-200 rounded p-1.5 text-xs text-right"/><select className="w-14 border border-gray-200 rounded p-1 text-xs"><option>PB</option><option>TB</option></select></div>
                   <div className="flex items-center gap-2"><div className="w-16 text-xs text-gray-500 font-semibold">월 단가</div><input type="number" defaultValue={initialData?.contract?.storage?.unitPrice} className="flex-1 border border-gray-200 rounded p-1.5 text-xs text-right"/><span className="text-xs font-semibold text-gray-600 w-12 shrink-0">원/TB</span></div>
                </div>
                <div className="flex flex-col gap-3 pt-3 border-t border-gray-200">
                   <div className="text-[13px] font-extrabold text-gray-800 flex items-center gap-1.5 border-b border-gray-200 pb-2"><Network size={14} className="text-primary-600"/> 네트워크</div>
                   <div className="flex items-center gap-2"><div className="w-16 text-xs text-gray-500 font-semibold">대역폭</div><input type="number" defaultValue={initialData?.contract?.network?.bandwidth} className="flex-1 border border-gray-200 rounded p-1.5 text-xs text-right"/><select className="w-14 border border-gray-200 rounded p-1 text-xs"><option>Gbps</option><option>Mbps</option></select></div>
                   <div className="flex items-center gap-2"><div className="w-16 text-xs text-gray-500 font-semibold">월 단가</div><input type="number" defaultValue={initialData?.contract?.network?.unitPrice} className="flex-1 border border-gray-200 rounded p-1.5 text-xs text-right"/><span className="text-xs font-semibold text-gray-600 w-12 shrink-0">원/Mbps</span></div>
                </div>
             </div>
          </section>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">취소</button>
          <button className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-primary-700">{mode === 'add' ? '추가 완료' : '수정 완료'}</button>
        </div>
      </div>
    </div>
  );
}

function SubtenantModal({ isOpen, onClose }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-[#F8FAFC] w-full max-w-[560px] max-h-full rounded-[14px] shadow-2xl flex flex-col overflow-hidden shadow-gray-900/20">
        <div className="h-[60px] border-b border-gray-200 px-6 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-[16px] font-bold text-gray-900 flex items-center gap-2"><Package size={18} className="text-emerald-500"/>Subtenant (프로젝트) 생성</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900"><X size={20}/></button>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0 p-6">
           <div className="flex flex-col gap-5">
             <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
             <h3 className="text-sm font-bold text-gray-800 border-l-4 border-emerald-500 pl-2 mb-4">기본 정보</h3>
             <div className="space-y-4">
                <div><label className="text-xs text-gray-500 block mb-1">Subtenant 명 (프로젝트 명) <span className="text-red-500">*</span></label><input type="text" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-800" placeholder="예: Project AI Lab" /></div>
                <div><label className="text-xs text-gray-500 block mb-1">프로젝트 ID (수정 가능)</label><input type="text" defaultValue="PRJ-AUTOGEN-01" className="w-full border border-gray-200 bg-gray-50 rounded p-2 text-sm text-gray-600 font-mono" /></div>
                <div>
                   <label className="text-xs text-gray-500 block mb-2">포함 상품 <span className="text-red-500">*</span></label>
                   <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800"><input type="checkbox" className="w-4 h-4 text-emerald-500 rounded border-gray-300" defaultChecked/> GPU 인프라</label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800"><input type="checkbox" className="w-4 h-4 text-emerald-500 rounded border-gray-300"/> AI 스토리지</label>
                   </div>
                </div>
             </div>
           </section>

           <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
             <h3 className="text-sm font-bold text-gray-800 border-l-4 border-emerald-500 pl-2 mb-4">사용 기간 (선택적 상이 설정 가능)</h3>
             <div className="grid grid-cols-2 gap-4">
               <div><label className="text-xs text-gray-500 block mb-1">사용 시작일 <span className="text-red-500">*</span></label><input type="date" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-800" /></div>
               <div><label className="text-xs text-gray-500 block mb-1">사용 종료일 <span className="text-red-500">*</span></label><input type="date" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-800" /></div>
             </div>
           </section>

           <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
             <h3 className="text-sm font-bold text-gray-800 border-l-4 border-emerald-500 pl-2 mb-4">PM / 멤버</h3>
             <div className="space-y-4">
                <div><label className="text-xs text-gray-500 block mb-1">프로젝트 매니저 이메일 (PM) <span className="text-red-500">*</span></label><input type="email" className="w-full border border-gray-200 rounded p-2 text-sm text-gray-800" placeholder="pm@company.com" /></div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">멤버 초대</label>
                  <div className="flex gap-2">
                    <input type="email" className="flex-1 border border-gray-200 rounded p-2 text-sm text-gray-800" placeholder="member@company.com" />
                    <button className="px-4 py-2 bg-gray-100 border border-gray-200 hover:bg-gray-200 rounded text-sm font-bold text-gray-700 transition">추가</button>
                  </div>
                  <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded-lg min-h-[60px] flex gap-2 flex-wrap">
                     <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-1 rounded-md text-[11px] font-semibold text-gray-600">user1@company.com <X size={12} className="cursor-pointer hover:text-red-500"/></span>
                     <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-1 rounded-md text-[11px] font-semibold text-gray-600">user2@company.com <X size={12} className="cursor-pointer hover:text-red-500"/></span>
                  </div>
                </div>
             </div>
           </section>
           </div>
        </div>
        <div className="p-4 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">취소</button>
          <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-700">생성 완료</button>
        </div>
      </div>
    </div>
  );
}

export default function ContractsPage() {
  const [activeTenantIdx, setActiveTenantIdx] = useState(0);
  const [tenantModal, setTenantModal] = useState({ isOpen: false, mode: 'add', data: null });
  const [subtenantModal, setSubtenantModal] = useState(false);

  const t = mockTenants[activeTenantIdx];

  const handleEditClick = () => {
    setTenantModal({ isOpen: true, mode: 'edit', data: t as any });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-auto md:h-[calc(100vh-112px)] min-h-0 text-gray-900 pb-8">
      <TenantModal isOpen={tenantModal.isOpen} mode={tenantModal.mode} initialData={tenantModal.data} onClose={() => setTenantModal({ isOpen: false, mode: 'add', data: null })} />
      <SubtenantModal isOpen={subtenantModal} onClose={() => setSubtenantModal(false)} />

      {/* 좌측 패널 — 회사 목록 (모바일에서는 가로 탭) */}
      <div className="w-full md:w-[300px] bg-white border border-gray-200 rounded-[14px] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] flex flex-col md:shrink-0 overflow-hidden">
         <div className="p-4 md:p-5 border-b border-gray-200 flex flex-col gap-3 md:gap-4 shrink-0">
            <h2 className="text-[15px] md:text-[16px] font-bold text-gray-900 flex items-center justify-between">
              Tenant 관리
              <span className="text-gray-400 text-[10px] md:text-xs font-semibold px-2 border border-gray-200 rounded-full">Total 12</span>
            </h2>
            <div className="hidden md:block relative">
              <input type="text" placeholder="회사 명 검색" className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary-500 bg-gray-50 transition-colors" />
              <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            <button onClick={() => setTenantModal({ isOpen: true, mode: 'add', data: null })} className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-[13px] font-bold shadow-sm transition-colors">
              <Plus size={16}/> Tenant 추가
            </button>
         </div>
         {/* Mobile: Horizontal scroll, Desktop: Vertical scroll */}
         <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto scrollbar-hide">
            {mockTenants.map((tenant, idx) => (
              <div 
                key={tenant.id} 
                onClick={() => setActiveTenantIdx(idx)}
                className={`flex-none w-[160px] md:w-full p-3 md:p-4 border-b border-gray-100 md:border-b md:border-gray-100 cursor-pointer flex justify-between items-center transition-all ${
                  activeTenantIdx === idx 
                  ? 'bg-primary-50 border-b-2 md:border-b-0 md:border-l-4 border-primary-500' 
                  : 'hover:bg-gray-50 border-b-2 border-transparent md:border-b-0 md:border-l-4 md:border-l-transparent'
                }`}
              >
                 <div className="flex flex-col gap-1 overflow-hidden">
                   <span className={`font-extrabold text-[13px] md:text-[14px] truncate ${activeTenantIdx === idx ? 'text-primary-700' : 'text-gray-800'}`}>{tenant.name}</span>
                   <span className="text-[10px] md:text-[12px] font-semibold text-gray-500">프로젝트 {tenant.subtenants.length}개</span>
                 </div>
                 <button className="hidden md:block text-gray-400 hover:text-gray-900 p-1" onClick={e => e.stopPropagation()}><MoreVertical size={16}/></button>
              </div>
            ))}
         </div>
      </div>

      {/* 우측 패널 — 상세 */}
      <div className="flex-1 flex flex-col gap-5 overflow-hidden">
         {/* 상세 헤더 */}
         <div className="bg-white border border-gray-200 rounded-[14px] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] p-5 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
               <div className="flex-1 min-w-0">
                  <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                    <Building2 className="text-gray-400 shrink-0"/> <span className="truncate">{t.name}</span>
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 text-[12px] md:text-sm font-medium text-gray-600">
                    <span className="bg-gray-100 px-3 py-1 rounded-md flex items-center gap-1.5 whitespace-nowrap"><Users size={14}/> {t.contractorEmail}</span>
                    <span className="bg-gray-100 px-3 py-1 rounded-md hidden md:flex items-center gap-1.5"><Calendar size={14}/> 계정 생성: {t.createdAt}</span>
                    <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-md flex items-center gap-1.5">
                      <Calendar size={14} className="md:hidden"/>
                      계약: {t.contract?.startDate} ~ {t.contract?.endDate}
                    </span>
                  </div>
               </div>
               <button onClick={handleEditClick} className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                 <Edit size={16}/> 상세 편집
               </button>
            </div>
         </div>

         {/* 3 KPI */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 pr-1 md:pr-0">
            <div className="bg-white border border-gray-200 rounded-[14px] p-4 md:p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] flex items-center gap-4">
               <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0"><Package size={22}/></div>
               <div>
                 <div className="text-[10px] md:text-[12px] font-bold text-gray-500 uppercase">프로젝트 수</div>
                 <div className="text-[20px] md:text-[24px] font-extrabold text-gray-900">{t.subtenants.length}<span className="text-gray-400 text-xs md:text-sm ml-1 font-semibold">개</span></div>
               </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-[14px] p-4 md:p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] flex items-center gap-4">
               <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0"><Server size={22}/></div>
               <div>
                 <div className="text-[10px] md:text-[12px] font-bold text-gray-500 uppercase">GPU 인스턴스</div>
                 <div className="text-[20px] md:text-[24px] font-extrabold text-gray-900">{t.subtenants.length > 0 ? '12' : '0'}<span className="text-gray-400 text-xs md:text-sm ml-1 font-semibold">대</span></div>
               </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-[14px] p-4 md:p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] flex items-center gap-4">
               <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0"><Cpu size={22}/></div>
               <div>
                 <div className="text-[10px] md:text-[12px] font-bold text-gray-500 uppercase">전체 할당 GPU</div>
                 <div className="text-[20px] md:text-[24px] font-mono font-extrabold text-gray-900">{t.contract?.gpu?.quantity || 0}<span className="text-gray-400 text-xs md:text-sm ml-1 font-semibold">장</span></div>
               </div>
            </div>
         </div>

         {/* 프로젝트 테이블 */}
         <div className="flex-1 bg-white border border-gray-200 rounded-[14px] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden min-h-0">
            <div className="p-4 md:p-5 border-b border-gray-200 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
               <h3 className="font-extrabold text-gray-900 text-[14px] md:text-[15px]">프로젝트 목록</h3>
               <div className="flex flex-col md:flex-row gap-2 md:gap-3">
                 <div className="relative flex-1">
                   <input type="text" placeholder="프로젝트 검색" className="w-full md:w-[200px] border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-[13px] bg-gray-50" />
                   <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                 </div>
                 <button onClick={() => setSubtenantModal(true)} className="flex items-center justify-center gap-1.5 px-4 py-2 md:py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[13px] font-bold shadow-sm shadow-emerald-500/30 transition-colors">
                   <Plus size={16}/> 프로젝트 생성
                 </button>
               </div>
            </div>
            <div className="flex-1 overflow-x-auto overflow-y-auto min-h-0 scrollbar-thin">
               <table className="w-full min-w-[1200px] text-left border-collapse">
                  <thead className="hidden md:table-header-group">
                    <tr className="bg-[#FAFAFA] border-b border-gray-200 sticky top-0 z-10">
                      <th className="px-5 py-3.5 text-[12px] font-extrabold text-gray-500 uppercase tracking-widest whitespace-nowrap">프로젝트 명</th>
                      <th className="px-5 py-3.5 text-[12px] font-extrabold text-gray-500 uppercase tracking-widest whitespace-nowrap">상태</th>
                      <th className="px-5 py-3.5 text-[12px] font-extrabold text-gray-500 uppercase tracking-widest whitespace-nowrap">프로젝트 ID</th>
                      <th className="px-5 py-3.5 text-[12px] font-extrabold text-gray-500 uppercase tracking-widest whitespace-nowrap">포함 상품</th>
                      <th className="px-5 py-3.5 text-[12px] font-extrabold text-gray-500 uppercase tracking-widest whitespace-nowrap">사용 기간</th>
                      <th className="px-5 py-3.5 text-[12px] font-extrabold text-gray-500 uppercase tracking-widest whitespace-nowrap">PM</th>
                      <th className="px-5 py-3.5 text-[12px] font-extrabold text-gray-500 uppercase tracking-widest text-center whitespace-nowrap">멤버 수</th>
                      <th className="w-[60px]"></th>
                    </tr>
                  </thead>
                  <tbody className="flex flex-col gap-4 p-4 md:table-row-group md:p-0">
                    {t.subtenants.length === 0 ? (
                      <tr className="flex justify-center md:table-row"><td colSpan={8} className="text-center py-16 text-gray-400 text-sm font-medium">등록된 프로젝트가 없습니다.</td></tr>
                    ) : (
                      t.subtenants.map(sub => (
                        <tr key={sub.id} className="flex flex-col border border-gray-200 rounded-xl p-5 shadow-sm bg-white md:table-row md:border-0 md:border-b md:border-gray-100 md:rounded-none md:p-0 md:shadow-none hover:bg-gray-50/50 transition-colors group relative">
                           <td className="px-0 py-1 md:px-5 md:py-4 font-bold text-gray-900 text-[16px] md:text-[14px] leading-tight mb-2 md:mb-0 whitespace-nowrap">{sub.name}</td>
                           <td className="px-0 py-1 md:px-5 md:py-4 md:static absolute top-5 right-5">
                             <span className={`px-2 py-1 text-[10px] md:text-[11px] font-bold rounded-md border 
                               ${sub.status === '활성' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                                 sub.status === '대기' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                                 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                               {sub.status}
                             </span>
                           </td>
                           <td className="px-0 py-1 md:px-5 md:py-4 font-mono text-[11px] md:text-xs font-semibold text-gray-400 md:text-gray-500 mb-4 md:mb-0 border-b border-gray-50 md:border-0 pb-2 md:pb-0 whitespace-nowrap">
                             <span className="md:hidden text-[10px] text-gray-300 font-normal block mb-0.5">프로젝트 ID</span>
                             {sub.id}
                           </td>
                           <td className="px-0 py-1 md:px-5 md:py-4 text-[12px] md:text-xs font-bold text-gray-600 whitespace-nowrap">
                             <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5 whitespace-nowrap">포함 상품</span>
                             {sub.products}
                           </td>
                           <td className="px-0 py-1 md:px-5 md:py-4 text-[12px] md:text-xs font-medium text-gray-500 whitespace-nowrap">
                             <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">사용 기간</span>
                             {sub.startDate}<span className="md:inline md:before:content-['_~_'] block">~ {sub.endDate}</span>
                           </td>
                           <td className="px-0 py-1 md:px-5 md:py-4 text-[13px] font-medium text-gray-700 flex md:table-cell items-center justify-between border-t border-gray-50 md:border-0 mt-2 pt-2 md:mt-0 md:pt-0 whitespace-nowrap">
                             <div className="flex items-center gap-1.5"><span className="md:hidden text-[10px] text-gray-400 font-normal uppercase">PM</span> {sub.pm}</div>
                             <div className="md:hidden text-[12px] font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-full">{sub.memberCount}명</div>
                           </td>
                           <td className="hidden md:table-cell px-5 py-4 text-center text-[13px] font-bold text-gray-800">{sub.memberCount}명</td>
                           <td className="hidden md:table-cell px-4 py-4"><button className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-1.5 rounded transition-colors"><MoreVertical size={16}/></button></td>
                        </tr>
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
