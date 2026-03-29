"use client";

import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { Building2, HardDrive, Package, Pencil, Plus, Search, Server, Trash2, X, Calendar, UserCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { Json } from "@/types/database";
import type { UserRole } from "@/types/auth";

type ContractResource = { quantity?: number; unitPrice?: number; capacity?: number; unit?: string; bandwidth?: number; };
type TenantContract = { startDate?: string; endDate?: string; gpu?: ContractResource; cpu?: ContractResource; storage?: ContractResource; network?: ContractResource; };
type TenantRecord = { id: string; name: string; contractor_email: string | null; manager_email: string | null; created_at: string | null; contract: Json | null; };
type SubtenantRecord = { id: string; tenant_id: string | null; name: string; status: string | null; products: Json | null; start_date: string | null; end_date: string | null; pm: string | null; member_count: number | null; assigned_nodes: Json | null; };

type TenantView = { id: string; name: string; contractorEmail: string; managerEmail: string; createdAt: string; contract: TenantContract; subtenants: SubtenantView[]; };
type SubtenantView = { id: string; tenantId: string; name: string; status: string; products: string[]; startDate: string; endDate: string; pm: string; memberCount: number; assignedNodes: Json; };

type TenantFormState = { id: string; name: string; contractorEmail: string; managerEmail: string; startDate: string; endDate: string; gpuQuantity: string; gpuUnitPrice: string; cpuQuantity: string; cpuUnitPrice: string; storageCapacity: string; storageUnit: string; storageUnitPrice: string; networkBandwidth: string; networkUnit: string; networkUnitPrice: string; };
type SubtenantFormState = { id: string; name: string; status: string; products: string; startDate: string; endDate: string; pm: string; };

const defaultTenantForm: TenantFormState = { id: "", name: "", contractorEmail: "", managerEmail: "", startDate: "", endDate: "", gpuQuantity: "", gpuUnitPrice: "", cpuQuantity: "", cpuUnitPrice: "", storageCapacity: "", storageUnit: "TB", storageUnitPrice: "", networkBandwidth: "", networkUnit: "Gbps", networkUnitPrice: "" };
const defaultSubtenantForm: SubtenantFormState = { id: "", name: "", status: "대기", products: "", startDate: "", endDate: "", pm: "" };

function parseContract(contract: Json | null): TenantContract {
  if (!contract || Array.isArray(contract) || typeof contract !== "object") return {};
  return contract as TenantContract;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  return value.slice(0, 10);
}

function normalizeSubtenantProducts(products: Json | null) {
  if (!Array.isArray(products)) return [];
  return products.filter((item): item is string => typeof item === "string");
}

function buildTenantView(tenants: TenantRecord[], subtenants: SubtenantRecord[]) {
  return tenants.map<TenantView>((tenant) => {
    const contract = parseContract(tenant.contract);
    const tenantSubtenants = subtenants
      .filter((subtenant) => subtenant.tenant_id === tenant.id)
      .map<SubtenantView>((subtenant) => ({
        id: subtenant.id,
        tenantId: subtenant.tenant_id ?? "",
        name: subtenant.name,
        status: subtenant.status ?? "대기",
        products: normalizeSubtenantProducts(subtenant.products),
        startDate: formatDate(subtenant.start_date),
        endDate: formatDate(subtenant.end_date),
        pm: subtenant.pm ?? "-",
        memberCount: subtenant.member_count ?? 0,
        assignedNodes: subtenant.assigned_nodes ?? [],
      }));

    return { id: tenant.id, name: tenant.name, contractorEmail: tenant.contractor_email ?? "", managerEmail: tenant.manager_email ?? "", createdAt: formatDate(tenant.created_at), contract, subtenants: tenantSubtenants };
  });
}

const canEdit = (role: UserRole | undefined) => role === "admin" || role === "tenant_admin";

function ModalFrame({ children, title, onClose }: { children: ReactNode; title: string; onClose: () => void; }) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-950/45 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">{title}</h2>
          <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-gray-50/50">{children}</div>
      </div>
    </div>
  );
}

export default function ContractsPageClient({ initialTenantRecords = [], initialSubtenantRecords = [] }: { initialTenantRecords?: TenantRecord[]; initialSubtenantRecords?: SubtenantRecord[]; }) {
  const { currentUser } = useAuth();
  const initialTenants = useMemo(() => buildTenantView(initialTenantRecords, initialSubtenantRecords), [initialSubtenantRecords, initialTenantRecords]);
  const [tenants, setTenants] = useState<TenantView[]>(initialTenants);
  const [selectedTenantId, setSelectedTenantId] = useState<string>(initialTenants[0]?.id ?? "");
  const [tenantSearch, setTenantSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [loading, setLoading] = useState(initialTenants.length === 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [tenantEditor, setTenantEditor] = useState<{ open: boolean; mode: "create" | "edit"; form: TenantFormState }>({ open: false, mode: "create", form: defaultTenantForm });
  const [subtenantEditor, setSubtenantEditor] = useState<{ open: boolean; mode: "create" | "edit"; form: SubtenantFormState; targetId: string | null }>({ open: false, mode: "create", form: defaultSubtenantForm, targetId: null });

  const loadContracts = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [t, s] = await Promise.all([
        fetch("/api/tenants").then(r => r.json()),
        fetch("/api/subtenants").then(r => r.json())
      ]);
      const nextTenants = buildTenantView(t.data, s.data);
      setTenants(nextTenants);
      if (!selectedTenantId || !nextTenants.some(at => at.id === selectedTenantId)) setSelectedTenantId(nextTenants[0]?.id ?? "");
    } catch (err) { setError("데이터 로드 실패"); }
    finally { setLoading(false); }
  }, [selectedTenantId]);

  useEffect(() => { if (initialTenants.length === 0) loadContracts(); }, [initialTenants.length, loadContracts]);

  const filteredTenants = useMemo(() => {
    const kw = tenantSearch.trim().toLowerCase();
    return kw ? tenants.filter(t => t.name.toLowerCase().includes(kw) || t.id.toLowerCase().includes(kw)) : tenants;
  }, [tenantSearch, tenants]);

  const selectedTenant = useMemo(() => tenants.find(t => t.id === selectedTenantId) || filteredTenants[0] || null, [filteredTenants, selectedTenantId, tenants]);

  const filteredSubtenants = useMemo(() => {
    const kw = projectSearch.trim().toLowerCase();
    const sub = selectedTenant?.subtenants ?? [];
    return kw ? sub.filter(s => s.name.toLowerCase().includes(kw) || s.pm.toLowerCase().includes(kw)) : sub;
  }, [projectSearch, selectedTenant]);

  const editable = canEdit(currentUser?.role);
  const isAdmin = currentUser?.role === "admin";

  const progressPercent = useMemo(() => {
    if (!selectedTenant?.contract.startDate || !selectedTenant?.contract.endDate) return 0;
    const start = new Date(selectedTenant.contract.startDate).getTime();
    const end = new Date(selectedTenant.contract.endDate).getTime();
    const now = Date.now();
    if (now < start) return 0;
    if (now > end) return 100;
    return Math.round(((now - start) / (end - start)) * 100);
  }, [selectedTenant?.contract.startDate, selectedTenant?.contract.endDate]);

  return (
    <div className="flex h-full flex-col bg-[#F8FAFC]">
      <div className="flex-1 overflow-y-auto w-full">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-8 space-y-6">
          <div className="flex h-[48px] shrink-0 items-center justify-between bg-white px-4 rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 min-w-0 flex-1">
              {filteredTenants.map((t) => {
                const isSelected = selectedTenantId === t.id;
                return (
                  <button key={t.id} onClick={() => setSelectedTenantId(t.id)} className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold transition-all ${isSelected ? 'bg-primary-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                    {t.name}
                  </button>
                );
              })}
            </div>
            <div className="hidden md:flex items-center gap-4 pl-4 shrink-0">
              <div className="h-4 w-px bg-gray-200 shrink-0" />
              <div className="relative shrink-0 flex items-center gap-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                <input className="h-[30px] w-36 rounded-full border border-gray-200 bg-white pl-8 pr-4 text-[12px] transition-all focus:w-48 focus:border-blue-300 focus:outline-none" placeholder="회사 검색" value={tenantSearch} onChange={e => setTenantSearch(e.target.value)} />
                {editable && (
                  <button className="flex h-[30px] items-center gap-1.5 rounded-full bg-blue-600 px-4 text-[12px] font-bold text-white transition hover:bg-blue-700" onClick={() => setTenantEditor({ open: true, mode: "create", form: defaultTenantForm })}>
                    <Plus size={12} /> 추가
                  </button>
                )}
              </div>
            </div>
          </div>

          {selectedTenant ? (
            <>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">{selectedTenant.name} <span className="text-sm font-bold text-gray-400 ml-2 italic">#{selectedTenant.id}</span></h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12}/> 계약 기간</p>
                        <p className="text-sm font-bold text-blue-600">{selectedTenant.contract.startDate || "-"} ~ {selectedTenant.contract.endDate || "-"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><UserCheck size={12}/> 계약 정계정 / 담당</p>
                        <p className="text-sm font-bold text-gray-700">{selectedTenant.contractorEmail || "-"} / {selectedTenant.managerEmail || "-"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">계약 생성일</p>
                        <p className="text-sm font-bold text-gray-500 italic">{selectedTenant.createdAt}</p>
                      </div>
                    </div>
                  </div>
                  {editable && (
                    <div className="flex gap-2">
                      <button className="p-2.5 rounded-lg border border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-[0.95]" onClick={() => setTenantEditor({ open: true, mode: "edit", form: { id: selectedTenant.id, name: selectedTenant.name, contractorEmail: selectedTenant.contractorEmail, managerEmail: selectedTenant.managerEmail, startDate: selectedTenant.contract.startDate || "", endDate: selectedTenant.contract.endDate || "", gpuQuantity: String(selectedTenant.contract.gpu?.quantity || ""), gpuUnitPrice: String(selectedTenant.contract.gpu?.unitPrice || ""), cpuQuantity: String(selectedTenant.contract.cpu?.quantity || ""), cpuUnitPrice: String(selectedTenant.contract.cpu?.unitPrice || ""), storageCapacity: String(selectedTenant.contract.storage?.capacity || ""), storageUnit: selectedTenant.contract.storage?.unit || "TB", storageUnitPrice: String(selectedTenant.contract.storage?.unitPrice || ""), networkBandwidth: String(selectedTenant.contract.network?.bandwidth || ""), networkUnit: selectedTenant.contract.network?.unit || "Gbps", networkUnitPrice: String(selectedTenant.contract.network?.unitPrice || "") } })}><Pencil size={16} /></button>
                      {isAdmin && <button className="p-2.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all active:scale-[0.95]" onClick={async () => { if(confirm(`${selectedTenant.name}을 삭제할까요?`)) { await fetch(`/api/tenants/${selectedTenant.id}`, {method:'DELETE'}); loadContracts(); }}}><Trash2 size={16} /></button>}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">계약 이행률 (SLA)</span>
                    <span className="text-[13px] font-black text-blue-600 font-mono">{progressPercent}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(59,130,246,0.5)]" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition-all hover:shadow-md">
                   <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><Package size={16} className="text-blue-500" /></div>
                      <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">Subtenants</span>
                   </div>
                   <p className="text-2xl font-black text-gray-900 tabular-nums">{selectedTenant.subtenants.length}<span className="text-sm ml-1 text-gray-400">개</span></p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition-all hover:shadow-md">
                   <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><Server size={16} className="text-emerald-500" /></div>
                      <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total GPU</span>
                   </div>
                   <p className="text-2xl font-black text-gray-900 tabular-nums">{selectedTenant.contract.gpu?.quantity || 0}<span className="text-sm ml-1 text-gray-400">장</span></p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition-all hover:shadow-md">
                   <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><HardDrive size={16} className="text-amber-500" /></div>
                      <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">Storage Cap</span>
                   </div>
                   <p className="text-2xl font-black text-gray-900 tabular-nums">{selectedTenant.contract.storage?.capacity || 0}<span className="text-sm ml-1 text-gray-400">{selectedTenant.contract.storage?.unit || 'TB'}</span></p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                   <div>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">프로젝트 리스트</h3>
                      <p className="text-[11px] font-bold text-gray-400 mt-0.5">상세 계약 및 SLA가 적용되는 Subtenant 목록</p>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="relative">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                         <input className="h-9 w-44 rounded-full border border-gray-200 bg-white pl-9 pr-4 text-xs font-bold transition-all focus:w-56 focus:border-blue-300 outline-none" placeholder="프로젝트명 검색" value={projectSearch} onChange={e => setProjectSearch(e.target.value)} />
                      </div>
                      {editable && (
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 rounded-lg text-[11px] font-black uppercase tracking-wider text-white shadow-xl shadow-emerald-100 hover:bg-black transition-all active:scale-[0.98]" onClick={() => setSubtenantEditor({ open: true, mode: "create", form: defaultSubtenantForm, targetId: null })}>
                           <Plus size={14} /> NEW PROJECT
                        </button>
                      )}
                   </div>
                </div>
                <div className="overflow-x-auto">
                   <div className="md:hidden space-y-3 p-4 bg-gray-50/50">
                      {loading ? (
                         <div className="py-20 text-center text-sm text-gray-400 italic">로딩 중...</div>
                      ) : filteredSubtenants.length === 0 ? (
                         <div className="py-20 text-center text-sm text-gray-400 italic">등록된 프로젝트가 없습니다.</div>
                      ) : (
                         filteredSubtenants.map(s => (
                            <div key={s.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
                               <div className="flex justify-between items-start">
                                  <div>
                                     <p className="text-sm font-black text-gray-900">{s.name}</p>
                                     <p className="text-[10px] font-bold text-gray-400 font-mono italic">ID: {s.id}</p>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${s.status === '활성' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : s.status === '대기' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>{s.status}</span>
                               </div>
                               <div className="flex flex-wrap gap-1">
                                  {s.products.map(p => <span key={p} className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-500 border border-gray-200">{p}</span>)}
                               </div>
                               <div className="pt-2 border-t border-gray-50 flex justify-between items-center bg-gray-50/50 -mx-4 px-4 py-2 mt-2">
                                  <div className="space-y-1">
                                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">계약 기간 / PM</p>
                                     <p className="text-[11px] font-bold text-gray-500">{s.startDate} ~ {s.endDate} / {s.pm}</p>
                                  </div>
                                  {editable && (
                                     <div className="flex gap-1">
                                        <button className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all" onClick={() => setSubtenantEditor({ open: true, mode: "edit", form: { id: s.id, name: s.name, status: s.status, products: s.products.join(', '), startDate: s.startDate === '-' ? '' : s.startDate, endDate: s.endDate === '-' ? '' : s.endDate, pm: s.pm === '-' ? '' : s.pm }, targetId: s.id })}><Pencil size={14} /></button>
                                        <button className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all" onClick={async () => { if(confirm(`${s.name}을 삭제할까요?`)) { await fetch(`/api/subtenants/${s.id}`, {method:'DELETE'}); loadContracts(); }}}><Trash2 size={14} /></button>
                                     </div>
                                  )}
                               </div>
                            </div>
                         ))
                      )}
                   </div>
                   <table className="hidden md:table w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-left bg-gray-50/50">프로젝트 정보</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-left bg-gray-50/50">상태</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-left bg-gray-50/50">적용 상품</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-left bg-gray-50/50 whitespace-nowrap">계약 기간</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-left bg-gray-50/50">PM</th>
                          {editable && <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center bg-gray-50/50">관리</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {loading ? <tr><td colSpan={7} className="py-20 text-center text-sm text-gray-400 italic">로딩 중...</td></tr> : filteredSubtenants.length === 0 ? <tr><td colSpan={7} className="py-20 text-center text-sm text-gray-400 italic">등록된 프로젝트가 없습니다.</td></tr> : 
                          filteredSubtenants.map(s => (
                            <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                 <p className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{s.name}</p>
                                 <p className="text-[10px] font-bold text-gray-400 font-mono italic">ID: {s.id}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${s.status === '활성' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : s.status === '대기' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>{s.status}</span>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex flex-wrap gap-1">
                                    {s.products.map(p => <span key={p} className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-500 border border-gray-200">{p}</span>)}
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-[11px] font-bold text-gray-500 font-mono tracking-tight">{s.startDate} ~ {s.endDate}</td>
                              <td className="px-6 py-4 text-xs font-bold text-gray-700">{s.pm}</td>
                              {editable && (
                                <td className="px-6 py-4 text-center">
                                   <div className="flex justify-center gap-1">
                                      <button className="p-2 rounded-lg text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-all" onClick={() => setSubtenantEditor({ open: true, mode: "edit", form: { id: s.id, name: s.name, status: s.status, products: s.products.join(', '), startDate: s.startDate === '-' ? '' : s.startDate, endDate: s.endDate === '-' ? '' : s.endDate, pm: s.pm === '-' ? '' : s.pm }, targetId: s.id })}><Pencil size={15} /></button>
                                      <button className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all" onClick={async () => { if(confirm(`${s.name}을 삭제할까요?`)) { await fetch(`/api/subtenants/${s.id}`, {method:'DELETE'}); loadContracts(); }}}><Trash2 size={15} /></button>
                                   </div>
                                </td>
                              )}
                            </tr>
                          ))
                        }
                      </tbody>
                   </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-24 text-center space-y-4">
               <Building2 className="mx-auto text-gray-100" size={64} />
               <p className="text-lg font-black text-gray-400">Tenant를 선택해 주세요.</p>
            </div>
          )}
        </div>
      </div>

      {tenantEditor.open && (
        <ModalFrame title={tenantEditor.mode === 'create' ? '새로운 Tenant 등록' : 'Tenant 정보 수정'} onClose={() => setTenantEditor(p => ({ ...p, open: false }))}>
           <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
                 <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest border-l-4 border-blue-500 pl-3">기본 정보</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <label className="space-y-1.5"><span className="text-[10px] font-black text-gray-500 uppercase">Tenant ID</span><input className="w-full rounded-lg border border-gray-200 p-2 text-[13px] font-bold focus:border-blue-500 outline-none" disabled={tenantEditor.mode === 'edit'} value={tenantEditor.form.id} onChange={e => setTenantEditor(p => ({ ...p, form: { ...p.form, id: e.target.value } }))} /></label>
                    <label className="space-y-1.5"><span className="text-[10px] font-black text-gray-500 uppercase">회사명</span><input className="w-full rounded-lg border border-gray-200 p-2 text-[13px] font-bold focus:border-blue-500 outline-none" value={tenantEditor.form.name} onChange={e => setTenantEditor(p => ({ ...p, form: { ...p.form, name: e.target.value } }))} /></label>
                    <label className="space-y-1.5"><span className="text-[10px] font-black text-gray-500 uppercase">계약자 이메일</span><input className="w-full rounded-lg border border-gray-200 p-2 text-[13px] font-bold focus:border-blue-500 outline-none" value={tenantEditor.form.contractorEmail} onChange={e => setTenantEditor(p => ({ ...p, form: { ...p.form, contractorEmail: e.target.value } }))} /></label>
                    <label className="space-y-1.5"><span className="text-[10px] font-black text-gray-500 uppercase">담당자 이메일</span><input className="w-full rounded-lg border border-gray-200 p-2 text-[13px] font-bold focus:border-blue-500 outline-none" value={tenantEditor.form.managerEmail} onChange={e => setTenantEditor(p => ({ ...p, form: { ...p.form, managerEmail: e.target.value } }))} /></label>
                 </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
                 <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest border-l-4 border-emerald-500 pl-3">계약 기간</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <label className="space-y-1.5"><span className="text-[10px] font-black text-gray-500 uppercase">시작일</span><input className="w-full rounded-lg border border-gray-200 p-2 text-[13px] font-bold focus:border-blue-500 outline-none" type="date" value={tenantEditor.form.startDate} onChange={e => setTenantEditor(p => ({ ...p, form: { ...p.form, startDate: e.target.value } }))} /></label>
                    <label className="space-y-1.5"><span className="text-[10px] font-black text-gray-500 uppercase">종료일</span><input className="w-full rounded-lg border border-gray-200 p-2 text-[13px] font-bold focus:border-blue-500 outline-none" type="date" value={tenantEditor.form.endDate} onChange={e => setTenantEditor(p => ({ ...p, form: { ...p.form, endDate: e.target.value } }))} /></label>
                 </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                 <button className="px-5 py-2 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100" onClick={() => setTenantEditor(p => ({ ...p, open: false }))}>취소</button>
                 <button className="px-8 py-2 rounded-lg bg-gray-900 text-sm font-black text-white hover:bg-black uppercase tracking-wider shadow-lg" onClick={async () => { setSaving(true); try { const isCreate = tenantEditor.mode==='create'; const r = await fetch(isCreate?'/api/tenants':`/api/tenants/${tenantEditor.form.id}`, { method: isCreate?'POST':'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id: tenantEditor.form.id, name: tenantEditor.form.name, contractor_email: tenantEditor.form.contractorEmail, manager_email: tenantEditor.form.managerEmail, contract: { startDate: tenantEditor.form.startDate, endDate: tenantEditor.form.endDate, gpu: { quantity: Number(tenantEditor.form.gpuQuantity), unitPrice: Number(tenantEditor.form.gpuUnitPrice) }, cpu: { quantity: Number(tenantEditor.form.cpuQuantity), unitPrice: Number(tenantEditor.form.cpuUnitPrice) }, storage: { capacity: Number(tenantEditor.form.storageCapacity), unit: tenantEditor.form.storageUnit, unitPrice: Number(tenantEditor.form.storageUnitPrice) }, network: { bandwidth: Number(tenantEditor.form.networkBandwidth), unit: tenantEditor.form.networkUnit, unitPrice: Number(tenantEditor.form.networkUnitPrice) } } }) }); if(!r.ok) throw new Error('저장 실패'); setTenantEditor(p=>({...p, open:false})); loadContracts(); } catch(err) { setError('저장 중 오류 발생'); } finally { setSaving(false); } }}>{saving ? 'Saving...' : '계약 정보 저장'}</button>
              </div>
           </div>
        </ModalFrame>
      )}

      {subtenantEditor.open && (
        <ModalFrame title={subtenantEditor.mode === 'create' ? '새 프로젝트 생성' : '프로젝트 정보 수정'} onClose={() => setSubtenantEditor(p => ({ ...p, open: false }))}>
           <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
                 <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest border-l-4 border-blue-500 pl-3">Subtenant Detail</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <label className="space-y-1.5"><span className="text-[10px] font-black text-gray-500 uppercase">Subtenant ID</span><input className="w-full rounded-lg border border-gray-200 p-2 text-[13px] font-bold focus:border-blue-500 outline-none" disabled={subtenantEditor.mode === 'edit'} value={subtenantEditor.form.id} onChange={e => setSubtenantEditor(p => ({ ...p, form: { ...p.form, id: e.target.value } }))} /></label>
                    <label className="space-y-1.5"><span className="text-[10px] font-black text-gray-500 uppercase">프로젝트명</span><input className="w-full rounded-lg border border-gray-200 p-2 text-[13px] font-bold focus:border-blue-500 outline-none" value={subtenantEditor.form.name} onChange={e => setSubtenantEditor(p => ({ ...p, form: { ...p.form, name: e.target.value } }))} /></label>
                    <label className="space-y-1.5"><span className="text-[10px] font-black text-gray-500 uppercase">상태</span><select className="w-full rounded-lg border border-gray-200 p-2 text-[13px] font-bold focus:border-blue-500 outline-none" value={subtenantEditor.form.status} onChange={e => setSubtenantEditor(p => ({ ...p, form: { ...p.form, status: e.target.value } }))}><option value="활성">활성</option><option value="대기">대기</option><option value="종료">종료</option></select></label>
                    <label className="space-y-1.5"><span className="text-[10px] font-black text-gray-500 uppercase">PM 이메일</span><input className="w-full rounded-lg border border-gray-200 p-2 text-[13px] font-bold focus:border-blue-500 outline-none" value={subtenantEditor.form.pm} onChange={e => setSubtenantEditor(p => ({ ...p, form: { ...p.form, pm: e.target.value } }))} /></label>
                    <label className="col-span-2 space-y-1.5"><span className="text-[10px] font-black text-gray-500 uppercase">상품 목록 (콤마 구분)</span><input className="w-full rounded-lg border border-gray-200 p-2 text-[13px] font-bold focus:border-blue-500 outline-none" placeholder="GPU 연산, 테라 스토리지 등" value={subtenantEditor.form.products} onChange={e => setSubtenantEditor(p => ({ ...p, form: { ...p.form, products: e.target.value } }))} /></label>
                    <label className="space-y-1.5"><span className="text-[10px] font-black text-gray-500 uppercase">시작일</span><input className="w-full rounded-lg border border-gray-200 p-2 text-[13px] font-bold focus:border-blue-500 outline-none" type="date" value={subtenantEditor.form.startDate} onChange={e => setSubtenantEditor(p => ({ ...p, form: { ...p.form, startDate: e.target.value } }))} /></label>
                    <label className="space-y-1.5"><span className="text-[10px] font-black text-gray-500 uppercase">종료일</span><input className="w-full rounded-lg border border-gray-200 p-2 text-[13px] font-bold focus:border-blue-500 outline-none" type="date" value={subtenantEditor.form.endDate} onChange={e => setSubtenantEditor(p => ({ ...p, form: { ...p.form, endDate: e.target.value } }))} /></label>
                 </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                 <button className="px-5 py-2 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100" onClick={() => setSubtenantEditor(p => ({ ...p, open: false }))}>취소</button>
                 <button className="px-8 py-2 rounded-lg bg-emerald-600 text-sm font-black text-white hover:bg-black uppercase tracking-wider shadow-lg" onClick={async () => { setSaving(true); try { const isCreate = subtenantEditor.mode==='create'; const tid = selectedTenant!.id; const r = await fetch(isCreate?'/api/subtenants':`/api/subtenants/${subtenantEditor.targetId}`, { method: isCreate?'POST':'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id: subtenantEditor.form.id, tenant_id: tid, name: subtenantEditor.form.name, status: subtenantEditor.form.status, products: subtenantEditor.form.products.split(',').map(v=>v.trim()).filter(Boolean), start_date: subtenantEditor.form.startDate, end_date: subtenantEditor.form.endDate, pm: subtenantEditor.form.pm }) }); if(!r.ok) throw new Error('저장 실패'); setSubtenantEditor(p=>({...p, open:false})); loadContracts(); } catch(err) { setError('저장 중 오류 발생'); } finally { setSaving(false); } }}>{saving ? '저장 중...' : '프로젝트 정보 저장'}</button>
              </div>
           </div>
        </ModalFrame>
      )}
    </div>
  );
}
