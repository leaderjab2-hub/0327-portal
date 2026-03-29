"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Search, MoreVertical, Building2, SearchIcon, UserPlus, Info, ExternalLink, ShieldAlert, Cpu, HardDrive, X, Users, Briefcase, UserCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { MemberRole, UserRole } from '@/types/auth';

type SubtenantOption = { id: string; name: string; tenantId: string; status: string; products: string[]; startDate: string; endDate: string; memberCount: number; };
type TenantOption = { id: string; name: string; subtenants: SubtenantOption[]; };
type CustomerMember = { id: string; name: string; email: string; subtenantId: string | null; tenantId: string; role: 'tenant_admin' | 'pm' | 'member'; isContractor: boolean; lastLogin: string; subtenant: string | null; };
type ApiMember = { id: string; email: string | null; name: string | null; role: UserRole | null; tenantId: string | null; subtenantId: string | null; memberRole: MemberRole; lastSignIn: string | null; };
type TenantRecord = { id: string; name: string; };
type SubtenantRecord = { id: string; tenant_id: string | null; name: string; status: string | null; products: unknown; start_date: string | null; end_date: string | null; member_count: number | null; };

function buildInitialTenants(tenantRecords: TenantRecord[], subtenantRecords: SubtenantRecord[]): TenantOption[] {
  return tenantRecords.map((t) => ({
    id: t.id,
    name: t.name,
    subtenants: subtenantRecords.filter((s) => s.tenant_id === t.id).map((s) => ({
      id: s.id,
      name: s.name,
      tenantId: s.tenant_id ?? t.id,
      status: s.status ?? '대기',
      products: Array.isArray(s.products) ? s.products.filter((i): i is string => typeof i === 'string') : [],
      startDate: s.start_date ?? '-',
      endDate: s.end_date ?? '-',
      memberCount: s.member_count ?? 0,
    })),
  }));
}

function InviteModal({ isOpen, onClose, subtenants, tenantId, currentUserRole, onInvite }: { isOpen: boolean; onClose: () => void; subtenants: SubtenantOption[]; tenantId: string | null; currentUserRole: UserRole | null | undefined; onInvite: (input: any) => Promise<void>; }) {
  const [email, setEmail] = useState('');
  const [roleType, setRoleType] = useState<'tenant_admin' | 'pm' | 'member'>('member');
  const [subtenantId, setSubtenantId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;
  const canInviteTenantAdmin = currentUserRole === 'admin';
  const requiresSubtenant = roleType === 'pm' || roleType === 'member';

  const handleInvite = async () => {
    if (!tenantId || !email.trim() || (requiresSubtenant && !subtenantId)) {
        setError("필수 항목을 입력해 주세요.");
        return;
    }
    setSubmitting(true);
    try {
      await onInvite(roleType === 'tenant_admin' ? { email: email.trim(), role: 'tenant_admin', tenantId } : { email: email.trim(), role: 'subtenant_member', tenantId, subtenantId, memberRole: roleType });
      onClose();
    } catch (e) { setError("초대 발동 중 오류 발생"); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2 italic"><UserPlus size={20} className="text-blue-600"/> INVITE MEMBER</h2>
          <button onClick={onClose} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 transición-colors"><X size={20}/></button>
        </div>
        <div className="p-6 space-y-5 bg-gray-50/50">
           <div className="space-y-1.5"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Role Type</span><select className="w-full border border-gray-200 rounded-lg h-11 px-3 text-sm font-bold focus:border-blue-500 outline-none" value={roleType} onChange={e => setRoleType(e.target.value as any)}>{canInviteTenantAdmin && <option value="tenant_admin">Tenant Admin</option>}<option value="pm">Project Manager (PM)</option><option value="member">Regular Member</option></select></div>
           <div className="space-y-1.5"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Email Address</span><input type="email" placeholder="example@company.com" className="w-full border border-gray-200 rounded-lg h-11 px-4 text-sm font-bold focus:border-blue-500 outline-none" value={email} onChange={e => setEmail(e.target.value)} /></div>
           {requiresSubtenant && <div className="space-y-1.5"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Assign Subtenant</span><select className="w-full border border-gray-200 rounded-lg h-11 px-3 text-sm font-bold focus:border-blue-500 outline-none" value={subtenantId} onChange={e => setSubtenantId(e.target.value)}><option value="">Select Project</option>{subtenants.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>}
           {error && <p className="text-[11px] font-bold text-red-500 pl-1">! {error}</p>}
        </div>
        <div className="p-4 bg-white border-t border-gray-100 flex justify-end gap-3">
           <button onClick={onClose} className="px-5 py-2 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors">CANCEL</button>
           <button onClick={handleInvite} disabled={submitting} className="px-6 py-2 bg-blue-600 rounded-lg text-xs font-black text-white shadow-xl shadow-blue-100 hover:bg-black transition-all active:scale-[0.98]">{submitting ? 'INVITING...' : 'SEND INVITATION'}</button>
        </div>
      </div>
    </div>
  );
}

export default function CustomerLookupPageClient({ initialTenantRecords = [], initialSubtenantRecords = [], initialMembers = [], initialMembersTenantId = null }: { initialTenantRecords?: TenantRecord[]; initialSubtenantRecords?: SubtenantRecord[]; initialMembers?: ApiMember[]; initialMembersTenantId?: string | null; }) {
  const { currentUser, inviteUser } = useAuth();
  const initialTenants = useMemo(() => buildInitialTenants(initialTenantRecords, initialSubtenantRecords), [initialSubtenantRecords, initialTenantRecords]);
  const [activeSelection, setActiveSelection] = useState<string>(initialTenants[0]?.id || 'unassigned');
  const [rightTab, setRightTab] = useState<'subtenant' | 'member'>('subtenant');
  const [isInviteModal, setIsInviteModal] = useState(false);
  const [subtenantFilter, setSubtenantFilter] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [members, setMembers] = useState<ApiMember[]>(initialMembers);
  const [memberLoading, setMemberLoading] = useState(false);
  const [memberError, setMemberError] = useState<string | null>(null);
  const [updatingMemberId, setUpdatingMemberId] = useState<string | null>(null);
  const [tenants, setTenants] = useState<TenantOption[]>(initialTenants);
  const [tenantLoading, setTenantLoading] = useState(initialTenants.length === 0);
  const [tenantError, setTenantError] = useState<string | null>(null);
  const [loadedMembersTenantId, setLoadedMembersTenantId] = useState<string | null>(initialMembersTenantId);

  const isUnassigned = activeSelection === 'unassigned';
  const tenant = isUnassigned ? null : tenants.find(t => t.id === activeSelection);
  const currentTab = isUnassigned ? 'member' : rightTab;

  // Sync state with props when they change (primarily for hydration or soft-navigation)
  useEffect(() => {
    setTenants(initialTenants);
  }, [initialTenants]);

  const subtenantNameMap = useMemo(() => {
    const map = new Map<string, string>();
    tenants.forEach(t => {
      t.subtenants.forEach(s => {
        map.set(s.id, s.name);
      });
    });
    return map;
  }, [tenants]);

  const loadMembers = async (tid: string) => {
    setMemberLoading(true); setMemberError(null);
    try {
      const r = await fetch(`/api/members?tenantId=${tid}`);
      const p = await r.json();
      if (!r.ok) throw new Error(p.error || 'Failed');
      setMembers(p.data || []);
      setLoadedMembersTenantId(tid);
    } catch(err) { setMemberError("목록 로드 실패"); setMembers([]); }
    finally { setMemberLoading(false); }
  };

  useEffect(() => { 
    if (!isUnassigned && tenant?.id && tenant.id !== loadedMembersTenantId) {
      loadMembers(tenant.id); 
    } 
  }, [activeSelection, tenant?.id, loadedMembersTenantId, isUnassigned]);

  const displayMembers = useMemo(() => {
    if (isUnassigned) return [];
    const kw = memberSearch.trim().toLowerCase();
    return members.map(m => {
        // Handle both camelCase from API and snake_case from initialProps
        const sId = m.subtenantId || (m as any).subtenant_id;
        const tenantId = m.tenantId || (m as any).tenant_id || tenant?.id || '';
        const role = m.role || (m as any).role;
        const memberRole = m.memberRole || (m as any).member_role;
        const lastSignIn = m.lastSignIn || (m as any).last_sign_in_at || (m as any).lastSignIn;

        const sn = sId ? subtenantNameMap.get(sId) || null : null;
        const isTA = role === 'tenant_admin';
        
        return { 
            id: m.id, 
            name: m.name || '-', 
            email: m.email || '-', 
            subtenantId: sId, 
            tenantId, 
            role: (isTA ? 'tenant_admin' : memberRole === 'pm' ? 'pm' : 'member') as any,
            isContractor: isTA, 
            lastLogin: lastSignIn ? lastSignIn.slice(0, 10) : '-', 
            subtenant: isTA ? 'Tenant 대표' : sn 
        };
    }).filter(m => (!subtenantFilter || m.subtenant === subtenantFilter) && (!kw || m.name.toLowerCase().includes(kw) || m.email.toLowerCase().includes(kw)));
  }, [isUnassigned, memberSearch, members, subtenantFilter, subtenantNameMap, tenant?.id]);

  return (
    <div className="flex h-full flex-col bg-[#F8FAFC]">
      <InviteModal isOpen={isInviteModal} onClose={() => setIsInviteModal(false)} subtenants={tenant?.subtenants || []} tenantId={tenant?.id || null} currentUserRole={currentUser?.role} onInvite={inviteUser} />
      
      <div className="flex-1 overflow-y-auto w-full">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-8 space-y-6">
          <div className="flex h-[48px] shrink-0 items-center justify-between bg-white px-4 rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 min-w-0 flex-1">
              {tenants.map((t) => (
                  <button key={t.id} onClick={() => setActiveSelection(t.id)} className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold transition-all ${activeSelection === t.id ? 'bg-primary-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>{t.name}</button>
              ))}
              <div className="h-4 w-px bg-gray-200 mx-1 shrink-0" />
              <button onClick={() => setActiveSelection('unassigned')} className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold transition-all flex items-center gap-1.5 ${isUnassigned ? 'bg-gray-800 text-white' : 'text-amber-600 bg-amber-50 hover:bg-amber-100'}`}><ShieldAlert size={14}/> 미분류</button>
            </div>
            <div className="hidden md:flex items-center gap-4 pl-4 shrink-0">
              <SearchIcon className="text-gray-400" size={14} />
              <input className="h-[30px] w-44 rounded-full border border-gray-200 bg-white px-4 text-[12px] font-bold transition-all focus:w-48 focus:border-blue-300 outline-none" placeholder="구성원/회사 검색" value={memberSearch} onChange={e => setMemberSearch(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                     <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><Users size={16} className="text-blue-500" /></div>
                     <span className="text-sm font-bold text-gray-500 uppercase">전체 구성원</span>
                  </div>
                  <p className="text-2xl font-black text-gray-900">{isUnassigned ? '0' : members.length}<span className="text-sm ml-1 text-gray-400">명</span></p>
               </div>
               <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                     <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><Briefcase size={16} className="text-emerald-500" /></div>
                     <span className="text-sm font-bold text-gray-500 uppercase">서브 테넌트</span>
                  </div>
                  <p className="text-2xl font-black text-gray-900">{tenant?.subtenants.length || 0}<span className="text-sm ml-1 text-gray-400">개</span></p>
               </div>
               <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                     <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><UserCheck size={16} className="text-amber-500" /></div>
                     <span className="text-sm font-bold text-gray-500 uppercase">관리자</span>
                  </div>
                  <p className="text-2xl font-black text-gray-900">{members.filter(m => m.role === 'tenant_admin').length}<span className="text-sm ml-1 text-gray-400">명</span></p>
               </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            <div className="pt-6 px-6 border-b border-gray-100">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center"><Building2 className="text-gray-400" size={20}/></div>
                   <div><h2 className="text-lg font-black text-gray-900 tracking-tight">{isUnassigned ? '미분류 명단' : tenant?.name}</h2><p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{isUnassigned ? '미분류 계정' : `ID: ${tenant?.id}`}</p></div>
                 </div>
                 {currentTab === 'member' && !isUnassigned && (
                   <button onClick={() => setIsInviteModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-lg text-xs font-black text-white hover:bg-black transition-all shadow-xl shadow-blue-50">
                     <UserPlus size={16}/> 구성원 초대
                   </button>
                 )}
               </div>
               <div className="flex gap-8">
                 {!isUnassigned && <button onClick={() => setRightTab('subtenant')} className={`pb-4 text-[13px] font-black uppercase tracking-widest transition-all relative ${rightTab === 'subtenant' ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>서브 테넌트</button>}
                 <button onClick={() => setRightTab('member')} className={`pb-4 text-[13px] font-black uppercase tracking-widest transition-all relative ${currentTab === 'member' ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>구성원 명단</button>
               </div>
            </div>

            <div className="p-6">
                {currentTab === 'subtenant' ? (
                  <div className="overflow-x-auto">
                     <div className="md:hidden space-y-3 p-4 bg-gray-50/50">
                        {(tenant?.subtenants || []).map(s => (
                           <div key={s.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
                              <div className="flex justify-between items-start">
                                 <div>
                                    <p className="text-sm font-black text-gray-900">{s.name}</p>
                                    <p className="text-[10px] font-bold text-gray-400 font-mono italic">#{s.id}</p>
                                 </div>
                                 <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${s.status === '활성' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>{s.status}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                 {s.products.map(p => <span key={p} className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-500 border border-gray-200">{p}</span>)}
                              </div>
                              <div className="pt-2 border-t border-gray-50 flex justify-between items-center text-[11px] font-bold text-gray-500">
                                 <span>{s.startDate} ~ {s.endDate}</span>
                                 <span>{s.memberCount}명</span>
                              </div>
                              <button onClick={()=>{setRightTab('member'); setSubtenantFilter(s.name);}} className="w-full py-2 bg-gray-50 rounded-lg text-[11px] font-black text-blue-600 hover:bg-blue-50 transition-colors">VIEW MEMBERS</button>
                           </div>
                        ))}
                     </div>
                     <table className="hidden md:table w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-left bg-gray-50/50">프로젝트 정보</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-left bg-gray-50/50">상태</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-left bg-gray-50/50">리소스</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-left bg-gray-50/50">계약 정보</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-center bg-gray-50/50">인원수</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right bg-gray-50/50">작업</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {(tenant?.subtenants || []).map(s => (
                             <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                               <td className="px-6 py-4"><p className="text-sm font-black text-gray-900">{s.name}</p><p className="text-[10px] font-bold text-gray-400 font-mono italic">#{s.id}</p></td>
                               <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${s.status === '활성' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>{s.status}</span></td>
                               <td className="px-6 py-4"><div className="flex flex-wrap gap-1">{s.products.map(p => <span key={p} className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-500 border border-gray-200">{p}</span>)}</div></td>
                               <td className="px-6 py-4 text-[11px] font-bold text-gray-500 font-mono tracking-tight">{s.startDate} ~ {s.endDate}</td>
                               <td className="px-6 py-4 text-center text-sm font-black text-gray-700">{s.memberCount}명</td>
                               <td className="px-6 py-4 text-right"><button onClick={()=>{setRightTab('member'); setSubtenantFilter(s.name);}} className="text-[11px] font-black text-blue-600 hover:underline">VIEW MEMBERS</button></td>
                             </tr>
                          ))}
                        </tbody>
                     </table>
                  </div>
                ) : (
                   <div className="space-y-4">
                      {!isUnassigned && <div className="flex justify-start"><select value={subtenantFilter} onChange={e=>setSubtenantFilter(e.target.value)} className="h-9 rounded-full border border-gray-200 px-4 text-xs font-bold text-gray-600 outline-none focus:border-blue-500"><option value="">All Subtenants (Filter)</option>{tenant?.subtenants.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}</select></div>}
                      <div className="overflow-x-auto">
                         <div className="md:hidden space-y-3">
                            {displayMembers.map(m => (
                               <div key={m.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
                                  <div className="flex justify-between items-start">
                                     <div className="flex items-center gap-2">
                                        <p className="text-sm font-black text-gray-900">{m.name}</p>
                                        {m.isContractor && <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">OWNER</span>}
                                     </div>
                                     <button onClick={(e)=>{ e.stopPropagation(); if(confirm(`${m.name} 님을 삭제하시겠습니까?`)) { /* Mock Delete */ }}} disabled={m.isContractor} className={`p-2 rounded-full ${m.isContractor ? 'text-gray-100' : 'text-gray-400'}`}><MoreVertical size={16}/></button>
                                  </div>
                                  <div className="space-y-1">
                                     <p className="text-xs font-bold text-gray-500 italic">{m.email}</p>
                                     <p className="text-[11px] font-bold text-gray-400">{m.subtenant || 'No Assignment'}</p>
                                  </div>
                                  <div className="pt-2 border-t border-gray-50 flex justify-between items-center">
                                     {m.isContractor ? <span className="text-[10px] font-black text-blue-600 uppercase">Tenant Admin</span> : 
                                       <select value={m.role} onChange={async (e)=>{
                                          setUpdatingMemberId(m.id);
                                          try {
                                             const r = await fetch('/api/update-member-role', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ userId:m.id, memberRole:e.target.value }) });
                                             if(r.ok) await loadMembers(tenant!.id);
                                          } finally { setUpdatingMemberId(null); }
                                       }} disabled={updatingMemberId === m.id} className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${m.role==='pm'?'bg-amber-50 text-amber-700 border-amber-200':'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                          <option value="pm">PM</option>
                                          <option value="member">MEM</option>
                                       </select>
                                     }
                                     <span className="text-[10px] font-bold text-gray-400 font-mono">{m.lastLogin}</span>
                                  </div>
                               </div>
                            ))}
                         </div>
                         <table className="hidden md:table w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                   <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left bg-gray-50/50">User Information</th>
                                   <th className="hidden md:table-cell px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left bg-gray-50/50">Assignment</th>
                                   <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left bg-gray-50/50">Org Role</th>
                                   <th className="hidden md:table-cell px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left bg-gray-50/50">Last Login</th>
                                   <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right bg-gray-50/50">Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                               {displayMembers.map(m => (
                                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                                      <td className="px-6 py-4">
                                         <div className="flex items-center gap-2">
                                            <p className="text-sm font-black text-gray-900">{m.name}</p>
                                            {m.isContractor && <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-lg shadow-blue-100">OWNER</span>}
                                         </div>
                                         <p className="text-[11px] font-bold text-gray-400 italic">{m.email}</p>
                                      </td>
                                      <td className="hidden md:table-cell px-6 py-4 text-xs font-bold text-gray-500 italic">{m.subtenant || 'No Assignment'}</td>
                                      <td className="px-6 py-4">
                                         {m.isContractor ? <span className="text-[10px] font-black text-blue-600 uppercase border border-blue-200 px-2 py-0.5 rounded-full bg-blue-50">Tenant Admin</span> : 
                                           <select value={m.role} onChange={async (e)=>{
                                              setUpdatingMemberId(m.id);
                                              try {
                                                 const r = await fetch('/api/update-member-role', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ userId:m.id, memberRole:e.target.value }) });
                                                 if(r.ok) await loadMembers(tenant!.id);
                                              } finally { setUpdatingMemberId(null); }
                                           }} disabled={updatingMemberId === m.id} className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border outline-none cursor-pointer ${m.role==='pm'?'bg-amber-50 text-amber-700 border-amber-200':'bg-gray-100 text-gray-500 border-gray-200'} ${updatingMemberId===m.id?'opacity-50 cursor-wait':''}`}>
                                              <option value="pm">PM</option>
                                              <option value="member">MEM</option>
                                           </select>
                                         }
                                      </td>
                                      <td className="hidden md:table-cell px-6 py-4 text-[11px] font-bold text-gray-400 font-mono tracking-tight">{m.lastLogin}</td>
                                     <td className="px-6 py-4 text-right">
                                        <button onClick={(e)=>{ e.stopPropagation(); if(confirm(`${m.name} 님을 삭제하시겠습니까?`)) { /* Mock Delete */ }}} disabled={m.isContractor} className={`p-2 rounded-full transition-colors ${m.isContractor ? 'text-gray-100' : 'text-gray-300 hover:text-red-500 hover:bg-red-50'}`}><MoreVertical size={16}/></button>
                                     </td>
                                  </tr>
                               ))}
                            </tbody>
                         </table>
                      </div>
                   </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
