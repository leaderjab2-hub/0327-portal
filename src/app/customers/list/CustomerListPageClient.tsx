'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Search, MoreVertical, Building2, SearchIcon, UserPlus, Info, ExternalLink, ShieldAlert, Cpu, HardDrive, X } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/contexts/AuthContext';
import type { MemberRole, UserRole } from '@/types/auth';
type SubtenantOption = {
  id: string;
  name: string;
  tenantId: string;
  status: string;
  products: string[];
  startDate: string;
  endDate: string;
  memberCount: number;
};
type TenantOption = {
  id: string;
  name: string;
  subtenants: SubtenantOption[];
};
type CustomerMember = {
  id: string;
  name: string;
  email: string;
  subtenantId: string | null;
  tenantId: string;
  role: 'tenant_admin' | 'pm' | 'member';
  isContractor: boolean;
  lastLogin: string;
  subtenant: string | null;
};
type ApiMember = {
  id: string;
  email: string | null;
  name: string | null;
  role: UserRole | null;
  tenantId: string | null;
  subtenantId: string | null;
  memberRole: MemberRole;
  lastSignIn: string | null;
};
type TenantRecord = {
  id: string;
  name: string;
};
type SubtenantRecord = {
  id: string;
  tenant_id: string | null;
  name: string;
  status: string | null;
  products: unknown;
  start_date: string | null;
  end_date: string | null;
  member_count: number | null;
};

type InviteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  subtenants: SubtenantOption[];
  tenantId: string | null;
  currentUserRole: UserRole | null | undefined;
  onInvite: (input: {
    email: string;
    role: 'tenant_admin' | 'subtenant_member';
    tenantId: string;
    subtenantId?: string | null;
    memberRole?: 'pm' | 'member' | null;
  }) => Promise<void>;
};

function buildInitialTenants(tenantRecords: TenantRecord[], subtenantRecords: SubtenantRecord[]): TenantOption[] {
  return tenantRecords.map((tenantRecord) => ({
    id: tenantRecord.id,
    name: tenantRecord.name,
    subtenants: subtenantRecords
      .filter((subtenant) => subtenant.tenant_id === tenantRecord.id)
      .map((subtenant) => ({
        id: subtenant.id,
        name: subtenant.name,
        tenantId: subtenant.tenant_id ?? tenantRecord.id,
        status: subtenant.status ?? '대기',
        products: Array.isArray(subtenant.products)
          ? subtenant.products.filter((item): item is string => typeof item === 'string')
          : [],
        startDate: subtenant.start_date ?? '-',
        endDate: subtenant.end_date ?? '-',
        memberCount: subtenant.member_count ?? 0,
      })),
  }));
}

function InviteModal({ isOpen, onClose, subtenants, tenantId, currentUserRole, onInvite }: InviteModalProps) {
  const [email, setEmail] = useState('');
  const [roleType, setRoleType] = useState<'tenant_admin' | 'pm' | 'member'>('member');
  const [subtenantId, setSubtenantId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const canInviteTenantAdmin = currentUserRole === 'admin';
  const requiresSubtenant = roleType === 'pm' || roleType === 'member';

  const resetAndClose = () => {
    setEmail('');
    setRoleType(canInviteTenantAdmin ? 'tenant_admin' : 'member');
    setSubtenantId('');
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    setError(null);

    if (!tenantId) {
      setError('Tenant가 선택되지 않았습니다.');
      return;
    }

    if (!email.trim()) {
      setError('이메일을 입력해 주세요.');
      return;
    }

    if (requiresSubtenant && !subtenantId) {
      setError('Subtenant를 선택해 주세요.');
      return;
    }

    setSubmitting(true);

    try {
      if (roleType === 'tenant_admin') {
        await onInvite({
          email: email.trim(),
          role: 'tenant_admin',
          tenantId,
        });
      } else {
        await onInvite({
          email: email.trim(),
          role: 'subtenant_member',
          tenantId,
          subtenantId,
          memberRole: roleType === 'pm' ? 'pm' : 'member',
        });
      }

      resetAndClose();
    } catch (inviteError) {
      setError(inviteError instanceof Error ? inviteError.message : '초대 발송에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 mx-4 flex flex-col items-center justify-center bg-gray-900/50 backdrop-blur-sm">
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-[14px] bg-white shadow-2xl">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-gray-900 flex items-center gap-2"><UserPlus size={18} className="text-primary-600"/>구성원 초대</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900"><X size={20}/></button>
        </div>
        <div className="p-6 flex flex-col gap-5">
           <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">초대할 역할 <span className="text-red-500">*</span></label>
              <select
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-primary-500"
                value={roleType}
                onChange={(event) => {
                  const nextRole = event.target.value as 'tenant_admin' | 'pm' | 'member';
                  setRoleType(nextRole);
                  if (nextRole === 'tenant_admin') {
                    setSubtenantId('');
                  }
                }}
              >
                {canInviteTenantAdmin ? <option value="tenant_admin">Tenant Admin</option> : null}
                <option value="pm">PM</option>
                <option value="member">멤버</option>
              </select>
           </div>
           <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">이메일 주소 <span className="text-red-500">*</span></label>
              <input
                type="email"
                placeholder="example@company.com"
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary-500"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
           </div>
           {requiresSubtenant ? (
             <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">소속 Subtenant <span className="text-red-500">*</span></label>
                <select
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-primary-500"
                  value={subtenantId}
                  onChange={(event) => setSubtenantId(event.target.value)}
                >
                  <option value="">발령할 프로젝트 선택</option>
                  {subtenants.map((subtenant) => <option key={subtenant.id} value={subtenant.id}>{subtenant.name}</option>)}
                </select>
             </div>
           ) : null}
           {error ? <p className="text-[13px] font-medium text-red-600">{error}</p> : null}
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
          <button onClick={resetAndClose} className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 bg-white hover:bg-gray-50">취소</button>
          <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2 bg-primary-600 rounded-lg text-sm font-bold text-white shadow hover:bg-primary-700 disabled:opacity-60">{submitting ? '발송 중...' : '초대 발송'}</button>
        </div>
      </div>
    </div>
  );
}

type CustomerListPageClientProps = {
  initialTenantRecords?: TenantRecord[];
  initialSubtenantRecords?: SubtenantRecord[];
  initialMembers?: ApiMember[];
  initialMembersTenantId?: string | null;
};

export default function CustomerLookupPageClient({
  initialTenantRecords = [],
  initialSubtenantRecords = [],
  initialMembers = [],
  initialMembersTenantId = null,
}: CustomerListPageClientProps) {
  const { currentUser, inviteUser } = useAuth();
  const initialTenants = useMemo(
    () => buildInitialTenants(initialTenantRecords, initialSubtenantRecords),
    [initialSubtenantRecords, initialTenantRecords],
  );
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
  const subtenantNameMap = useMemo(() => {
    return new Map((tenant?.subtenants ?? []).map((subtenant) => [subtenant.id, subtenant.name]));
  }, [tenant?.subtenants]);

  const loadMembers = async (tenantId: string) => {
    setMemberLoading(true);
    setMemberError(null);

    try {
      const response = await fetch(`/api/members?tenantId=${tenantId}`, {
        cache: 'no-store',
      });
      const payload = (await response.json().catch(() => ({}))) as { data?: ApiMember[]; error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? '구성원 목록을 불러오지 못했습니다.');
      }

      console.log('[customers/list] /api/members response', payload.data ?? []);
      setMembers(payload.data ?? []);
    } catch (loadError) {
      setMemberError(loadError instanceof Error ? loadError.message : '구성원 목록을 불러오지 못했습니다.');
      setMembers([]);
    } finally {
      setMemberLoading(false);
    }
  };

  useEffect(() => {
    if (initialTenants.length > 0) {
      return;
    }

    let active = true;

    const loadTenants = async () => {
      setTenantLoading(true);
      setTenantError(null);

      try {
        const [tenantsResponse, subtenantsResponse] = await Promise.all([
          fetch('/api/tenants', { cache: 'no-store' }),
          fetch('/api/subtenants', { cache: 'no-store' }),
        ]);

        const tenantsPayload = (await tenantsResponse.json().catch(() => ({}))) as { data?: TenantRecord[]; error?: string };
        const subtenantsPayload = (await subtenantsResponse.json().catch(() => ({}))) as { data?: SubtenantRecord[]; error?: string };

        if (!tenantsResponse.ok) {
          throw new Error(tenantsPayload.error ?? 'Tenant 목록을 불러오지 못했습니다.');
        }

        if (!subtenantsResponse.ok) {
          throw new Error(subtenantsPayload.error ?? 'Subtenant 목록을 불러오지 못했습니다.');
        }

        const nextTenants = (tenantsPayload.data ?? []).map((tenantRecord) => ({
          id: tenantRecord.id,
          name: tenantRecord.name,
          subtenants: (subtenantsPayload.data ?? [])
            .filter((subtenant) => subtenant.tenant_id === tenantRecord.id)
            .map((subtenant) => ({
              id: subtenant.id,
              name: subtenant.name,
              tenantId: subtenant.tenant_id ?? tenantRecord.id,
              status: subtenant.status ?? '대기',
              products: Array.isArray(subtenant.products)
                ? subtenant.products.filter((item): item is string => typeof item === 'string')
                : [],
              startDate: subtenant.start_date ?? '-',
              endDate: subtenant.end_date ?? '-',
              memberCount: subtenant.member_count ?? 0,
            })),
        }));

        if (active) {
          setTenants(nextTenants);
          setActiveSelection((previous) => previous || nextTenants[0]?.id || 'unassigned');
        }
      } catch (loadError) {
        if (active) {
          setTenantError(loadError instanceof Error ? loadError.message : '고객 정보를 불러오지 못했습니다.');
          setTenants([]);
          setActiveSelection('unassigned');
        }
      } finally {
        if (active) {
          setTenantLoading(false);
        }
      }
    };

    void loadTenants();

    return () => {
      active = false;
    };
  }, [initialTenants.length]);

  useEffect(() => {
    if (tenantLoading || isUnassigned || !tenant?.id) {
      setMembers([]);
      setMemberError(null);
      setMemberLoading(false);
      return;
    }

    if (tenant.id === loadedMembersTenantId) {
      return;
    }

    let active = true;

    const loadMembers = async () => {
      try {
        const response = await fetch(`/api/members?tenantId=${tenant.id}`, {
          cache: 'no-store',
        });
        const payload = (await response.json().catch(() => ({}))) as { data?: ApiMember[]; error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? '구성원 목록을 불러오지 못했습니다.');
        }

        if (active) {
          console.log('[customers/list] /api/members response', payload.data ?? []);
          setMembers(payload.data ?? []);
          setLoadedMembersTenantId(tenant.id);
        }
      } catch (loadError) {
        if (active) {
          setMemberError(loadError instanceof Error ? loadError.message : '구성원 목록을 불러오지 못했습니다.');
          setMembers([]);
        }
      } finally {
        if (active) {
          setMemberLoading(false);
        }
      }
    };

    void loadMembers();

    return () => {
      active = false;
    };
  }, [isUnassigned, loadedMembersTenantId, tenant?.id, tenantLoading]);

  const displayMembers = useMemo(() => {
    if (isUnassigned) {
      return [];
    }

    const keyword = memberSearch.trim().toLowerCase();

    return members
      .map((member) => {
        const subtenantName = member.subtenantId ? subtenantNameMap.get(member.subtenantId) ?? null : null;
        const isTenantAdmin = member.role === 'tenant_admin';
        const roleLabel = isTenantAdmin ? 'tenant_admin' : member.memberRole ?? 'member';

        return {
          id: member.id,
          name: member.name ?? '-',
          email: member.email ?? '-',
          subtenantId: member.subtenantId,
          tenantId: member.tenantId ?? tenant?.id ?? '',
          role: roleLabel,
          isContractor: isTenantAdmin,
          lastLogin: member.lastSignIn ? member.lastSignIn.slice(0, 10) : '-',
          subtenant: isTenantAdmin ? 'Tenant 관리자' : subtenantName,
        };
      })
      .filter((member) => {
        const matchesSubtenant = !subtenantFilter || member.subtenant === subtenantFilter;
        const matchesKeyword =
          !keyword ||
          member.name.toLowerCase().includes(keyword) ||
          member.email.toLowerCase().includes(keyword);

        return matchesSubtenant && matchesKeyword;
      });
  }, [isUnassigned, memberSearch, members, subtenantFilter, subtenantNameMap, tenant?.id]);

  const handleSelectTenant = (id: string) => {
    setActiveSelection(id);
    setRightTab('subtenant');
    setSubtenantFilter('');
  };

  const handleDeleteMember = (member: CustomerMember) => {
    if (member.isContractor) alert('계약자(Tenant 대표)는 삭제할 수 없습니다. 계약 관리를 확인해주세요.');
    else {
      if(confirm(`${member.name} 님을 구성원에서 삭제하시겠습니까?`)) {
        // Mock deletion action
      }
    }
  }

  const handleMemberRoleChange = async (member: CustomerMember, nextRole: 'pm' | 'member') => {
    if (!tenant?.id || member.isContractor || member.role === nextRole) {
      return;
    }

    setUpdatingMemberId(member.id);
    setMemberError(null);

    try {
      const response = await fetch('/api/update-member-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: member.id,
          memberRole: nextRole,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? '역할 변경에 실패했습니다.');
      }

      await loadMembers(tenant.id);
    } catch (updateError) {
      setMemberError(updateError instanceof Error ? updateError.message : '역할 변경에 실패했습니다.');
    } finally {
      setUpdatingMemberId(null);
    }
  };

  return (
    <div className="flex flex-col md:flex md:flex-row gap-6 h-full text-gray-900 pb-8">
      <InviteModal
        isOpen={isInviteModal}
        onClose={() => setIsInviteModal(false)}
        subtenants={tenant?.subtenants || []}
        tenantId={tenant?.id || null}
        currentUserRole={currentUser?.role}
        onInvite={inviteUser}
      />

      {/* ── Mobile: horizontal scrollable tab strip ── */}
      <div className="md:hidden w-full bg-white border border-gray-200 rounded-[10px] overflow-hidden mb-3 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
        <div className="flex overflow-x-auto gap-2 p-3 scrollbar-none items-center">
          {tenants.map((t) => {
            const isActive = activeSelection === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTenant(t.id)}
                className={`shrink-0 px-3 py-2 rounded-[8px] text-[12px] font-bold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t.name}
              </button>
            );
          })}
          <div className="w-[1px] h-4 bg-gray-200 mx-1 shrink-0"></div>
          <button
            onClick={() => setActiveSelection('unassigned')}
            className={`shrink-0 px-3 py-2 rounded-[8px] text-[12px] font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              isUnassigned
                ? 'bg-gray-800 text-white'
                : 'bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100'
            }`}
          >
            <ShieldAlert size={14}/> 미분류
          </button>
        </div>
      </div>

      {/* 좌측 패널 — 회사 (Tenant) 목록 (Desktop) */}
      <div className="hidden w-60 flex-shrink-0 flex-col overflow-hidden rounded-[14px] border border-gray-200 bg-white shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] md:flex">
         <div className="p-5 border-b border-gray-100 flex flex-col gap-4">
            <h2 className="text-[16px] font-bold text-gray-900 flex items-center justify-between">
              Tenant 목록
              <span className="text-gray-500 bg-gray-100 text-[11px] font-bold px-2 py-0.5 rounded-md">Total {tenants.length}</span>
            </h2>
            <div className="relative">
              <input type="text" placeholder="회사 명 검색" className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary-500 bg-gray-50 transition-colors" />
              <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
         </div>
         <div className="flex-1 overflow-y-auto flex flex-col">
            {tenants.map(t => (
              <div 
                key={t.id} 
                onClick={() => handleSelectTenant(t.id)}
                className={`p-4 border-b border-gray-50 cursor-pointer flex justify-between items-center transition-all ${
                  activeSelection === t.id 
                  ? 'bg-primary-50/50 border-l-4 border-l-primary-500' 
                  : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                }`}
              >
                 <div className="flex flex-col gap-1">
                   <span className={`font-bold text-[14px] ${activeSelection === t.id ? 'text-primary-700' : 'text-gray-800'}`}>{t.name}</span>
                   <span className="text-[11px] font-semibold text-gray-400">프로젝트 {t.subtenants.length}개</span>
                 </div>
              </div>
            ))}
         </div>
         <div 
            onClick={() => setActiveSelection('unassigned')}
            className={`p-4 border-t border-gray-200 cursor-pointer flex justify-between items-center transition-all ${
              isUnassigned ? 'bg-gray-800 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
            }`}
          >
             <div className="flex items-center gap-2 font-bold text-[14px]">
               <ShieldAlert size={16} className={isUnassigned ? 'text-amber-400' : 'text-gray-400'}/>
               소속 없음 미분류
             </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${isUnassigned ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-500'}`}>0명</span>
         </div>
         <div className="p-4 bg-blue-50/50 border-t border-blue-100">
            <div className="flex items-start gap-2">
               <Info size={16} className="text-blue-500 shrink-0 mt-0.5"/>
               <div className="text-[12px] text-blue-800 font-medium leading-relaxed">
                 Tenant 및 Subtenant 신규 생성은 <Link href="/customers/contracts" className="font-bold underline underline-offset-2 hover:text-blue-600 inline-flex items-center gap-0.5">계약 관리 메뉴<ExternalLink size={10}/></Link>에서 진행해주세요.
               </div>
            </div>
         </div>
      </div>

      {/* 우측 패널 — 상세 */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-gray-200 bg-white shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
         <div className="pt-6 px-6 border-b border-gray-200 bg-gray-50/30">
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              <Building2 className="text-primary-500 shrink-0" size={24}/> 
              <span className="truncate">{isUnassigned ? '소속 없음 미분류 명단' : tenant?.name}</span>
            </h1>
            <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-none">
              {!isUnassigned && (
                <button 
                  onClick={() => setRightTab('subtenant')}
                  className={`pb-3 border-b-2 font-bold text-[13px] md:text-[14px] px-1 transition-colors whitespace-nowrap ${rightTab === 'subtenant' ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  Subtenant (프로젝트) 관리
                </button>
              )}
              <button 
                onClick={() => !isUnassigned && setRightTab('member')}
                className={`pb-3 border-b-2 font-bold text-[13px] md:text-[14px] px-1 transition-colors whitespace-nowrap ${currentTab === 'member' ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                구성원 조회 및 관리
              </button>
            </div>
         </div>

         <div className="flex-1 overflow-x-auto overflow-y-auto scrollbar-thin">
            {tenantLoading ? (
              <div className="p-6 text-sm font-medium text-gray-400">고객 정보를 불러오는 중입니다.</div>
            ) : null}
            {tenantError ? (
              <div className="p-6 text-sm font-medium text-rose-500">{tenantError}</div>
            ) : null}
            {!isUnassigned && rightTab === 'subtenant' && (
              <div className="p-0 md:p-6">
                 <table className="inline-table min-w-[1040px] w-full flex-1 border-collapse text-left">
                   <thead className="hidden md:table-header-group">
                     <tr className="bg-[#FAFAFA] border-y border-gray-200">
                       <th className="px-5 py-3 text-[12px] font-extrabold text-gray-500 whitespace-nowrap">Subtenant 명</th>
                       <th className="px-5 py-3 text-[12px] font-extrabold text-gray-500 whitespace-nowrap">상태</th>
                       <th className="px-5 py-3 text-[12px] font-extrabold text-gray-500 whitespace-nowrap">프로젝트 ID</th>
                       <th className="px-5 py-3 text-[12px] font-extrabold text-gray-500 whitespace-nowrap">포함 상품</th>
                       <th className="px-5 py-3 text-[12px] font-extrabold text-gray-500 whitespace-nowrap">사용 기간</th>
                       <th className="px-5 py-3 text-[12px] font-extrabold text-gray-500 text-center whitespace-nowrap">구성원 수</th>
                       <th className="px-5 py-3 text-[12px] font-extrabold text-gray-500 text-right whitespace-nowrap">관리</th>
                     </tr>
                   </thead>
                   <tbody className="flex flex-col gap-4 p-4 md:table-row-group md:p-0">
                     {tenant?.subtenants.length === 0 ? (
                       <tr className="md:table-row"><td colSpan={7} className="text-center py-10 text-gray-400 text-sm">등록된 Subtenant가 없습니다.</td></tr>
                     ) : (
                       tenant?.subtenants.map(sub => (
                         <tr key={sub.id} className="flex flex-col border border-gray-200 rounded-xl p-5 shadow-sm bg-white md:table-row md:border-0 md:border-b md:border-gray-100 md:rounded-none md:p-0 md:shadow-none hover:bg-gray-50/50 transition-colors group relative">
                            <td className="px-0 py-1 md:px-5 md:py-4 font-bold text-gray-900 text-[16px] md:text-[14px] leading-tight mb-2 md:mb-0 whitespace-nowrap">{sub.name}</td>
                            <td className="px-0 py-1 md:px-5 md:py-4 md:static absolute top-5 right-5">
                               <span className={`inline-flex items-center justify-center px-2 py-0.5 text-[10px] md:text-[11px] font-bold rounded border 
                                 ${sub.status === '활성' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                 {sub.status}
                               </span>
                            </td>
                            <td className="px-0 py-1 md:px-5 md:py-4 font-mono text-[11px] md:text-xs font-semibold text-gray-400 md:text-gray-500 md:mb-0 mb-4 border-b border-gray-50 md:border-0 pb-2 md:pb-0 whitespace-nowrap">
                               <span className="md:hidden text-[10px] text-gray-300 font-normal block mb-0.5">프로젝트 ID</span>
                               {sub.id}
                            </td>
                            <td className="px-0 py-1 md:px-5 md:py-4 text-[12px] md:text-xs font-medium text-gray-600 whitespace-nowrap">
                               <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">포함 상품</span>
                               <div className="flex items-center gap-1.5 pt-1 md:pt-0">
                                  {sub.products.includes('GPU 인프라') && <span className="bg-[#F8FAFC] border border-gray-200 p-1 rounded"><Cpu size={12} className="text-primary-500"/></span>}
                                  {sub.products.includes('AI 스토리지') && <span className="bg-[#F8FAFC] border border-gray-200 p-1 rounded"><HardDrive size={12} className="text-amber-500"/></span>}
                                  {sub.products.join(', ')}
                               </div>
                            </td>
                            <td className="px-0 py-1 md:px-5 md:py-4 text-[12px] md:text-xs font-medium text-gray-500 whitespace-nowrap">
                               <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">사용 기간</span>
                               {sub.startDate}<span className="md:block md:before:content-['~_'] block">~ {sub.endDate}</span>
                            </td>
                            <td className="hidden md:table-cell px-5 py-4 text-center font-bold text-gray-800 whitespace-nowrap">{sub.memberCount}명</td>
                            <td className="px-0 py-2 md:px-5 md:py-4 text-right border-t border-gray-50 md:border-0 mt-2 md:mt-0 pt-3 md:pt-0 whitespace-nowrap">
                               <div className="flex md:block justify-between items-center">
                                  <div className="md:hidden text-[12px] font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-full">{sub.memberCount}명</div>
                                  <button 
                                    onClick={() => { setRightTab('member'); setSubtenantFilter(sub.name); }}
                                    className="w-full md:w-auto text-[11px] font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 border border-primary-200 px-3 py-1.5 rounded-md transition-colors"
                                  >
                                    구성원 이동
                                  </button>
                               </div>
                            </td>
                         </tr>
                       ))
                     )}
                   </tbody>
                 </table>
              </div>
            )}

            {currentTab === 'member' && (
              <div className="flex h-full flex-col gap-5 p-0 md:p-6">
                 <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-4 md:p-0">
                    <div className="flex flex-col md:flex-row gap-3">
                       {!isUnassigned && (
                         <div className="relative">
                           <select 
                             value={subtenantFilter} 
                             onChange={e => setSubtenantFilter(e.target.value)}
                             className="w-full md:max-w-[180px] border border-gray-200 rounded-lg bg-white pl-3 pr-8 py-2 text-[13px] font-medium text-gray-700 appearance-none focus:outline-none focus:border-primary-500"
                           >
                              <option value="">전체 Subtenant</option>
                              {tenant?.subtenants.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                           </select>
                         </div>
                       )}
                       <div className="relative">
                         <input
                           type="text"
                           placeholder="이름/이메일 검색"
                           value={memberSearch}
                           onChange={e => setMemberSearch(e.target.value)}
                           className="w-full md:max-w-[220px] border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-[13px] focus:outline-none focus:border-primary-500"
                         />
                         <SearchIcon size={14} className="absolute left-3 top-2.5 text-gray-400" />
                       </div>
                    </div>
                    {!isUnassigned && (
                      <button onClick={() => setIsInviteModal(true)} className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-600 px-4 py-2 text-[13px] font-bold text-white shadow-sm transition-colors cursor-pointer outline-none hover:bg-primary-700">
                        <UserPlus size={16}/> 구성원 초대 (생성)
                      </button>
                    )}
                 </div>

                 <div className="flex-1 overflow-x-auto rounded-xl bg-white border-0 md:border md:border-gray-200">
                    <table className="inline-table min-w-[960px] w-full flex-1 border-collapse text-left">
                       <thead className="hidden md:table-header-group">
                         <tr className="bg-[#FAFAFA] border-b border-gray-200">
                            <th className="px-5 py-3.5 text-[12px] font-extrabold text-gray-500 whitespace-nowrap">이름</th>
                            <th className="px-5 py-3.5 text-[12px] font-extrabold text-gray-500 whitespace-nowrap">이메일</th>
                            <th className="px-5 py-3.5 text-[12px] font-extrabold text-gray-500 whitespace-nowrap">소속 Subtenant</th>
                            <th className="px-5 py-3.5 text-[12px] font-extrabold text-gray-500 whitespace-nowrap">역할 권한</th>
                            <th className="px-5 py-3.5 text-[12px] font-extrabold text-gray-500 whitespace-nowrap">최근 접속일</th>
                            <th className="min-w-[80px]"></th>
                         </tr>
                       </thead>
                       <tbody className="flex flex-col gap-4 p-4 md:table-row-group md:p-0">
                          {memberError && !isUnassigned ? (
                            <tr className="md:table-row"><td colSpan={6} className="text-center py-10 text-rose-500 text-sm font-medium">{memberError}</td></tr>
                          ) : memberLoading && !isUnassigned ? (
                            <tr className="md:table-row"><td colSpan={6} className="text-center py-10 text-gray-400 text-sm font-medium">구성원 목록을 불러오는 중입니다.</td></tr>
                          ) : displayMembers.length === 0 ? (
                            <tr className="md:table-row"><td colSpan={6} className="text-center py-10 text-gray-400 text-sm font-medium">해당 조건의 구성원이 없습니다.</td></tr>
                          ) : (
                            displayMembers.map(m => (
                              <tr key={m.id} className="flex flex-col border border-gray-200 rounded-xl p-5 shadow-sm bg-white md:table-row md:border-0 md:border-b md:border-gray-100 md:rounded-none md:p-0 md:shadow-none hover:bg-gray-50/50 transition-colors group relative">
                                 <td className="px-0 py-1 md:px-5 md:py-4 md:mb-0 mb-4 border-b border-gray-50 md:border-0 pb-2 md:pb-0 whitespace-nowrap">
                                   <div className="flex items-center gap-2">
                                     <span className="font-bold text-gray-900 text-[16px] md:text-[14px]">{m.name}</span>
                                     {m.isContractor && <span className="bg-primary-100 text-primary-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-primary-200">계약 대표자</span>}
                                   </div>
                                   <div className="md:hidden mt-1 font-mono text-[11px] text-gray-400">{m.email}</div>
                                 </td>
                                 <td className="hidden md:table-cell px-5 py-4 font-mono text-[13px] text-gray-600 whitespace-nowrap">{m.email}</td>
                                 <td className="px-0 py-1 md:px-5 md:py-4 text-[13px] font-semibold text-gray-700 whitespace-nowrap">
                                   <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">소속 Subtenant</span>
                                   {m.subtenant || <span className="text-gray-400 italic font-normal text-[12px]">소속 없음</span>}
                                 </td>
                                 <td className="px-0 py-1 md:px-5 md:py-4">
                                   <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-1">역할 권한</span>
                                   {m.isContractor ? (
                                     <span className="inline-flex rounded border border-primary-200 bg-primary-50 px-2 py-1 text-[12px] font-bold text-primary-700">
                                       Tenant Admin
                                     </span>
                                   ) : (
                                     <select 
                                       value={m.role}
                                       disabled={updatingMemberId === m.id}
                                       onChange={(event) => {
                                         const nextRole = event.target.value as 'pm' | 'member';
                                         void handleMemberRoleChange(m, nextRole);
                                       }}
                                       className={`text-[12px] font-bold px-2 py-1 rounded border outline-none cursor-pointer w-full md:w-auto
                                         ${m.role === 'pm' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'}
                                         ${updatingMemberId === m.id ? 'opacity-60 cursor-wait' : ''}`}
                                     >
                                        <option value="pm">PM (매니저)</option>
                                        <option value="member">멤버 (일반)</option>
                                     </select>
                                   )}
                                 </td>
                                 <td className="px-0 py-1 md:px-5 md:py-4 font-mono text-[12px] text-gray-500 whitespace-nowrap">
                                   <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">최근 접속일</span>
                                   {m.lastLogin}
                                 </td>
                                 <td className="absolute top-5 right-5 md:static px-0 md:px-5 md:py-4 flex items-center">
                                   <button 
                                     onClick={() => handleDeleteMember(m)}
                                     disabled={m.isContractor}
                                     className={`p-1.5 rounded transition-colors ${m.isContractor ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                                     title={m.isContractor ? '계약자는 삭제 불가' : '삭제'}
                                   >
                                     <MoreVertical size={16}/>
                                   </button>
                                 </td>
                              </tr>
                            ))
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
