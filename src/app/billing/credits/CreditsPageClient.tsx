'use client';

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Calendar, FileText } from 'lucide-react';
import CompanyListPanel from '@/components/CompanyListPanel';
import { useAuth } from '@/contexts/AuthContext';

type Tenant = {
  id: string;
  name: string;
};

type CreditItem = {
  id: number;
  tenantId: string | null;
  subtenantId: string | null;
  subtenantName: string | null;
  sourceType: string | null;
  sourceId: number | null;
  amount: number;
  note: string | null;
  createdAt: string | null;
};

type CreditGroup = {
  subtenantId: string | null;
  subtenantName: string | null;
  items: CreditItem[];
};

function formatDate(value: string | null) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatSourceType(sourceType: string | null) {
  if (sourceType === 'billing_deduction') {
    return '빌링 차감';
  }

  if (sourceType === 'urgent_pm') {
    return '긴급 PM';
  }

  if (sourceType === 'regular_pm') {
    return '정기 PM';
  }

  return '장애';
}

type CreditsPageClientProps = {
  initialTenants?: Tenant[];
  initialItems?: CreditItem[];
  initialGroups?: CreditGroup[];
  initialTenantId?: string | null;
};

export default function CreditsPageClient({
  initialTenants = [],
  initialItems = [],
  initialGroups = [],
  initialTenantId = null,
}: CreditsPageClientProps) {
  const { currentUser } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [activeTenantIdx, setActiveTenantIdx] = useState(
    Math.max(0, initialTenants.findIndex((tenant) => tenant.id === initialTenantId)),
  );
  const [groups, setGroups] = useState<CreditGroup[]>(initialGroups);
  const [items, setItems] = useState<CreditItem[]>(initialItems);
  const [loading, setLoading] = useState(initialTenants.length === 0 && initialItems.length === 0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeTenant = tenants[activeTenantIdx] ?? null;

  const loadTenants = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/tenants');
      const payload = (await response.json()) as { data?: Tenant[]; error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? '회사 목록을 불러오지 못했습니다.');
      }

      setTenants(payload.data ?? []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '회사 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCredits = useCallback(async (tenantId: string) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/credits?tenantId=${tenantId}`);
      const payload = (await response.json()) as {
        data?: { items?: CreditItem[]; groups?: CreditGroup[] };
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? '크레딧 내역을 불러오지 못했습니다.');
      }

      setItems(payload.data?.items ?? []);
      setGroups(payload.data?.groups ?? []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '크레딧 내역을 불러오지 못했습니다.');
      setItems([]);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialTenants.length > 0) {
      return;
    }

    void loadTenants();
  }, [initialTenants.length, loadTenants]);

  useEffect(() => {
    if (!activeTenant?.id) {
      return;
    }

    if (activeTenant.id === initialTenantId && initialItems.length > 0) {
      return;
    }

    void loadCredits(activeTenant.id);
  }, [activeTenant?.id, initialItems.length, initialTenantId, loadCredits]);

  const summary = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyItems = items.filter((item) => (item.createdAt ?? '').startsWith(currentMonth));
    const generated = monthlyItems.filter((item) => item.amount > 0).reduce((sum, item) => sum + item.amount, 0);
    const deducted = monthlyItems.filter((item) => item.amount < 0).reduce((sum, item) => sum + item.amount, 0);
    const balance = items.reduce((sum, item) => sum + item.amount, 0);

    return { balance, generated, deducted };
  }, [items]);

  return (
    <div className="flex h-auto min-h-0 flex-col gap-6 text-gray-900 md:h-[calc(100vh-112px)] md:flex-row lg:gap-7">
      <CompanyListPanel
        companies={tenants.map((tenant) => ({ id: tenant.id, name: tenant.name, subCount: groups.length }))}
        activeIndex={activeTenantIdx}
        onCompanyClick={setActiveTenantIdx}
      />

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div className="mb-5 flex-none space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
            <div className="rounded-[10px] border border-gray-200 bg-white p-5 shadow-sm lg:rounded-[12px] lg:p-6 lg:shadow-[0_8px_24px_-16px_rgba(15,23,42,0.15)]">
              <div className="mb-2 text-[14px] font-semibold text-gray-600">현재 크레딧 잔액</div>
              <div className={`text-[28px] font-bold tracking-tight lg:text-[30px] ${summary.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {summary.balance >= 0 ? '+₩ ' : '-₩ '}
                {Math.abs(summary.balance).toLocaleString()}
              </div>
              <div className="mt-4 text-[12px] font-medium text-gray-400">누적 발생 - 누적 차감</div>
            </div>
            <div className="rounded-[10px] border border-gray-200 bg-white p-5 shadow-sm lg:rounded-[12px] lg:p-6 lg:shadow-[0_8px_24px_-16px_rgba(15,23,42,0.15)]">
              <div className="mb-2 text-[14px] font-semibold text-gray-600">이번 달 발생액</div>
              <div className="text-[28px] font-bold tracking-tight text-emerald-600 lg:text-[30px]">+₩ {summary.generated.toLocaleString()}</div>
              <div className="mt-4 flex items-center gap-3 text-[12px] font-medium text-gray-500">
                <span className="flex items-center gap-1.5 rounded-md border border-gray-100 bg-gray-50 px-2 py-1">
                  <AlertTriangle size={12} className="text-red-500" />
                  장애/PM 발생
                </span>
              </div>
            </div>
            <div className="rounded-[10px] border border-gray-200 bg-white p-5 shadow-sm lg:rounded-[12px] lg:p-6 lg:shadow-[0_8px_24px_-16px_rgba(15,23,42,0.15)]">
              <div className="mb-2 text-[14px] font-semibold text-gray-600">이번 달 차감액</div>
              <div className="text-[28px] font-bold tracking-tight text-red-600 lg:text-[30px]">-₩ {Math.abs(summary.deducted).toLocaleString()}</div>
              <div className="mt-4 flex items-center gap-3 text-[12px] font-medium text-gray-500">
                <span className="flex items-center gap-1.5 rounded-md border border-gray-100 bg-gray-50 px-2 py-1">
                  <FileText size={12} className="text-blue-500" />
                  빌링 차감
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[14px] border border-gray-200 bg-white p-4 shadow-sm lg:p-5 lg:shadow-[0_8px_24px_-16px_rgba(15,23,42,0.12)]">
            <div className="flex items-center gap-2 text-[14px] font-bold text-gray-900">
              <Calendar size={16} className="text-gray-400" />
              {activeTenant?.name ?? currentUser?.tenantId ?? '고객사'} 크레딧 내역
            </div>
          </div>
        </div>

        {errorMessage ? (
          <div className="mb-4 rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-600">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex-1 overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] lg:rounded-[12px] lg:shadow-[0_10px_30px_-18px_rgba(15,23,42,0.18)]">
          <div className="h-full overflow-x-auto overflow-y-auto">
            <table className="min-w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-[#FAFAFA]">
                  <th className="px-6 py-[14px] text-[12px] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">Subtenant</th>
                  <th className="px-6 py-[14px] text-[12px] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">구분</th>
                  <th className="px-6 py-[14px] text-[12px] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">출처</th>
                  <th className="px-6 py-[14px] text-[12px] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap">일시</th>
                  <th className="px-6 py-[14px] text-[12px] font-bold uppercase tracking-wider text-gray-500 text-right whitespace-nowrap">발생/차감액</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-14 text-center text-[13px] text-gray-400">
                      데이터를 불러오는 중입니다.
                    </td>
                  </tr>
                ) : groups.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-14 text-center text-[13px] text-gray-400">
                      표시할 크레딧 이력이 없습니다.
                    </td>
                  </tr>
                ) : (
                  groups.map((group) => {
                    const groupGenerated = group.items.filter((item) => item.amount > 0).reduce((sum, item) => sum + item.amount, 0);
                    const groupDeducted = group.items.filter((item) => item.amount < 0).reduce((sum, item) => sum + item.amount, 0);
                    const groupBalance = group.items.reduce((sum, item) => sum + item.amount, 0);

                    return (
                      <Fragment key={group.subtenantId ?? 'unassigned'}>
                        <tr key={`${group.subtenantId ?? 'unassigned'}-header`} className="border-b border-gray-100 bg-[#F8FAFC]">
                          <td colSpan={5} className="px-6 py-3">
                            <div className="flex flex-wrap items-center gap-3 text-[13px] font-semibold text-gray-800">
                              <span>{group.subtenantName ?? '미지정'}</span>
                              <span className="text-gray-300">|</span>
                              <span className="text-gray-500">{group.items.length}건</span>
                              <span className="text-gray-300">|</span>
                              <span className={groupBalance >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                                {groupBalance >= 0 ? '+₩ ' : '-₩ '}
                                {Math.abs(groupBalance).toLocaleString()}
                              </span>
                            </div>
                          </td>
                        </tr>
                        {group.items.map((item) => (
                          <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                            <td className="px-6 py-[14px] text-[13px] font-medium text-gray-700">{group.subtenantName ?? '미지정'}</td>
                            <td className="px-6 py-[14px]">
                              <span
                                className={`inline-flex rounded-[6px] px-2.5 py-1 text-[11px] font-bold ${
                                  item.amount >= 0
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : 'bg-red-50 text-red-600'
                                }`}
                              >
                                {formatSourceType(item.sourceType)}
                              </span>
                            </td>
                            <td className="px-6 py-[14px] text-[13px] font-medium text-gray-600">{item.note ?? '-'}</td>
                            <td className="px-6 py-[14px] font-mono text-[12px] text-gray-500 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                            <td
                              className={`px-6 py-[14px] text-right font-mono text-[13px] font-bold whitespace-nowrap ${
                                item.amount >= 0 ? 'text-emerald-600' : 'text-red-600'
                              }`}
                            >
                              {item.amount >= 0 ? '+₩ ' : '-₩ '}
                              {Math.abs(item.amount).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                        <tr key={`${group.subtenantId ?? 'unassigned'}-summary`} className="border-t border-gray-200 bg-gray-50">
                          <td colSpan={5} className="px-6 py-[18px]">
                            <div className="flex flex-col gap-3 text-[14px] font-bold md:flex-row md:items-center md:justify-end md:gap-6">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-gray-600">누적 발생액:</span>
                                <span className="font-mono text-emerald-600">+₩ {groupGenerated.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-gray-600">누적 차감액:</span>
                                <span className="font-mono text-red-600">-₩ {Math.abs(groupDeducted).toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between gap-2 border-t border-gray-200 pt-3 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                                <span className="text-gray-900">최종 잔액:</span>
                                <span className={`font-mono text-[16px] ${groupBalance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                  {groupBalance >= 0 ? '+₩ ' : '-₩ '}
                                  {Math.abs(groupBalance).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
