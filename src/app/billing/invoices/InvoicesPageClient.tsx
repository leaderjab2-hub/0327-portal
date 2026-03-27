'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Download,
  FileText,
  MoreVertical,
  Plus,
  UploadCloud,
  X,
} from 'lucide-react';
import CompanyListPanel from '@/components/CompanyListPanel';
import { useAuth } from '@/contexts/AuthContext';
import { mockNetworkMetrics, mockStorageMetrics } from '@/lib/mockMonitoringData';
import type { Json } from '@/types/database';

type TenantRecord = {
  id: string;
  name: string;
  contract: Json | null;
};

type SubtenantRecord = {
  id: string;
  tenant_id: string | null;
  name: string;
};

type BillingRecord = {
  id: number;
  tenantId: string | null;
  subtenantId: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  gpuFee: number;
  cpuFee: number;
  storageFee: number;
  networkFee: number;
  creditDeduction: number;
  totalFee: number;
  invoiceUrl: string | null;
  memo: string | null;
  registeredAt: string | null;
};

type BillingLikeRecord = BillingRecord & {
  tenant_id?: string | null;
  subtenant_id?: string | null;
  period_start?: string | null;
  period_end?: string | null;
  gpu_fee?: number | null;
  cpu_fee?: number | null;
  storage_fee?: number | null;
  network_fee?: number | null;
  credit_deduction?: number | null;
  credit_deduct?: number | null;
  total_fee?: number | null;
  invoice_url?: string | null;
  registered_at?: string | null;
};

type ContractUnit = {
  quantity?: number;
  unitPrice?: number;
  capacity?: number;
  bandwidth?: number;
};

type TenantContract = {
  gpu?: ContractUnit;
  cpu?: ContractUnit;
  storage?: ContractUnit;
  network?: ContractUnit;
};

function parseContract(contract: Json | null): TenantContract {
  if (!contract || Array.isArray(contract) || typeof contract !== 'object') {
    return {};
  }

  return contract as TenantContract;
}

function formatCurrency(num: number) {
  const safeValue = Number(num ?? 0);
  return `₩ ${Math.abs(Number.isFinite(safeValue) ? safeValue : 0).toLocaleString()}`;
}

function formatNumber(value: number | null | undefined) {
  const safeValue = Number(value ?? 0);
  return (Number.isFinite(safeValue) ? safeValue : 0).toLocaleString();
}

function normalizeBillingRecord(record: BillingLikeRecord): BillingRecord {
  return {
    id: Number(record.id ?? 0),
    tenantId: record.tenantId ?? record.tenant_id ?? null,
    subtenantId: record.subtenantId ?? record.subtenant_id ?? null,
    periodStart: record.periodStart ?? record.period_start ?? null,
    periodEnd: record.periodEnd ?? record.period_end ?? null,
    gpuFee: Number(record.gpuFee ?? record.gpu_fee ?? 0),
    cpuFee: Number(record.cpuFee ?? record.cpu_fee ?? 0),
    storageFee: Number(record.storageFee ?? record.storage_fee ?? 0),
    networkFee: Number(record.networkFee ?? record.network_fee ?? 0),
    creditDeduction: Number(record.creditDeduction ?? record.credit_deduction ?? record.credit_deduct ?? 0),
    totalFee: Number(record.totalFee ?? record.total_fee ?? 0),
    invoiceUrl: record.invoiceUrl ?? record.invoice_url ?? null,
    memo: record.memo ?? null,
    registeredAt: record.registeredAt ?? record.registered_at ?? null,
  };
}

function formatPeriod(start: string | null, end: string | null) {
  if (!start || !end) {
    return '-';
  }

  return `${start} ~ ${end}`;
}

function periodKey(start: string | null) {
  return start ? start.slice(0, 7) : '';
}

async function readJson<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => ({}))) as T & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? '요청을 처리하지 못했습니다.');
  }

  return payload;
}

function downloadCsv(filename: string, rows: Array<Record<string, string | number | null>>) {
  if (rows.length === 0) {
    return;
  }

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          const text = value == null ? '' : String(value);
          return `"${text.replaceAll('"', '""')}"`;
        })
        .join(','),
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function BillingRegistrationModal({
  tenant,
  subtenant,
  onClose,
  onSubmit,
}: {
  tenant: TenantRecord;
  subtenant: SubtenantRecord;
  onClose: () => void;
  onSubmit: (input: {
    periodStart: string;
    periodEnd: string;
    gpuFee: number;
    cpuFee: number;
    storageFee: number;
    networkFee: number;
    creditDeduction: number;
    totalFee: number;
    invoiceUrl: string | null;
    memo: string | null;
  }) => Promise<void>;
}) {
  const [periodStart, setPeriodStart] = useState('2026-02-01');
  const [periodEnd, setPeriodEnd] = useState('2026-02-28');
  const [creditDeduction, setCreditDeduction] = useState('0');
  const [invoiceUrl, setInvoiceUrl] = useState('');
  const [memo, setMemo] = useState('');
  const [creditBalance, setCreditBalance] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadCreditBalance = async () => {
      try {
        const payload = await readJson<{ data: { balance: number } }>(
          await fetch(`/api/credits/balance?tenantId=${tenant.id}&subtenantId=${subtenant.id}`, { cache: 'no-store' }),
        );

        if (active) {
          setCreditBalance(payload.data.balance ?? 0);
        }
      } catch {
        if (active) {
          setCreditBalance(0);
        }
      }
    };

    void loadCreditBalance();

    return () => {
      active = false;
    };
  }, [subtenant.id, tenant.id]);

  const contract = parseContract(tenant.contract);
  const gpuFee = (contract.gpu?.quantity ?? 0) * (contract.gpu?.unitPrice ?? 0);
  const cpuFee = (contract.cpu?.quantity ?? 0) * (contract.cpu?.unitPrice ?? 0);
  const storageFee = Math.round((mockStorageMetrics[tenant.id]?.usageTB ?? 0) * (contract.storage?.unitPrice ?? 0));
  const networkFee = Math.round((mockNetworkMetrics[tenant.id]?.currentOutboundGB ?? 0) * (contract.network?.unitPrice ?? 0));
  const creditValue = Number(creditDeduction.replaceAll(',', '')) || 0;
  const expectedBalance = creditBalance - creditValue;
  const totalFee = gpuFee + cpuFee + storageFee + networkFee - creditValue;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[16px] bg-[#F8FAFC] shadow-2xl">
        <div className="flex h-[56px] shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:h-[64px] sm:px-6">
          <h2 className="flex items-center gap-2 text-[18px] font-extrabold text-gray-900">빌링 등록</h2>
          <button className="text-gray-400 transition-colors hover:text-gray-900" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 sm:gap-6 sm:p-6">
          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <h3 className="mb-4 border-l-4 border-primary-500 pl-3 text-sm font-extrabold text-gray-800">기본 정보</h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-tight text-gray-400">Tenant</label>
                <input className="w-full rounded-[10px] border border-gray-200 bg-gray-50/50 p-2.5 text-[13px] font-bold text-gray-700" readOnly value={tenant.name} />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-tight text-gray-400">Subtenant</label>
                <input className="w-full rounded-[10px] border border-gray-200 bg-gray-50/50 p-2.5 text-[13px] font-bold text-gray-700" readOnly value={subtenant.name} />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-tight text-gray-500">청구 시작일</label>
                <input className="w-full rounded-[10px] border border-gray-200 p-2.5 text-[13px] font-bold text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none" type="date" value={periodStart} onChange={(event) => setPeriodStart(event.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-tight text-gray-500">청구 종료일</label>
                <input className="w-full rounded-[10px] border border-gray-200 p-2.5 text-[13px] font-bold text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none" type="date" value={periodEnd} onChange={(event) => setPeriodEnd(event.target.value)} />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="border-l-4 border-primary-500 pl-2 text-sm font-bold text-gray-800">청구 내역 (자동 산출)</h3>
              <span className="rounded bg-gray-100 px-2 py-1 text-[11px] text-gray-500">{formatPeriod(periodStart, periodEnd)}</span>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-[#FAFAFA]">
              <div className="grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                <div className="flex flex-col gap-3 p-4">
                  <div className="flex items-center justify-between"><span className="text-xs font-medium text-gray-500">GPU 요금 (고정)</span><span className="font-mono text-sm font-bold text-gray-800">{formatCurrency(gpuFee)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-xs font-medium text-gray-500">CPU 요금 (고정)</span><span className="font-mono text-sm font-bold text-gray-800">{formatCurrency(cpuFee)}</span></div>
                </div>
                <div className="flex flex-col gap-3 p-4">
                  <div className="flex items-center justify-between"><span className="text-xs font-medium text-gray-500">스토리지 요금 (변동)</span><span className="font-mono text-sm font-bold text-gray-800">{formatCurrency(storageFee)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-xs font-medium text-gray-500">네트워크 요금 (변동)</span><span className="font-mono text-sm font-bold text-gray-800">{formatCurrency(networkFee)}</span></div>
                </div>
              </div>
              <div className="flex flex-col gap-3 border-t border-gray-200 bg-red-50/30 p-4">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                  <span className="flex items-center gap-1.5 text-[13px] font-bold text-red-700"><AlertTriangle size={14} />크레딧 차감</span>
                  <span className="text-[12px] font-medium text-gray-600">
                    현재 잔여 크레딧:
                    <span className={`ml-1 font-mono font-bold ${creditBalance > 0 ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {creditBalance > 0 ? `₩ ${formatNumber(creditBalance)}` : '₩ 0'}
                    </span>
                  </span>
                </div>
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div className="text-[12px] text-gray-500">
                    차감 후 예상 잔액:
                    <span className={`ml-1 font-mono font-bold ${expectedBalance < 0 ? 'text-red-500' : expectedBalance > 0 ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {expectedBalance >= 0 ? `₩ ${formatNumber(expectedBalance)}` : `-₩ ${formatNumber(Math.abs(expectedBalance))}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-sm text-red-500">-₩</span>
                    <input
                      className="w-[120px] rounded border border-red-200 bg-white px-2 py-1 text-right font-mono font-bold text-red-600 shadow-inner focus:border-red-400 focus:outline-none"
                      value={creditDeduction}
                      onChange={(event) => setCreditDeduction(event.target.value.replace(/[^\d]/g, ''))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-4 text-white shadow-md sm:p-5">
            <div className="flex items-end justify-between">
              <span className="text-[14px] font-medium text-gray-300">최종 청구 금액</span>
              <span className="font-mono text-[28px] font-extrabold text-[#FCD34D] sm:text-3xl">{formatCurrency(totalFee)}</span>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <h3 className="mb-4 border-l-4 border-primary-500 pl-2 text-sm font-bold text-gray-800">부가 정보</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
                <UploadCloud className="mb-2 text-gray-400" size={20} />
                <span className="mb-2 text-[12px] font-semibold text-gray-600">인보이스 URL</span>
                <input
                  className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-[12px] focus:border-primary-500 focus:outline-none"
                  placeholder="https://..."
                  value={invoiceUrl}
                  onChange={(event) => setInvoiceUrl(event.target.value)}
                />
              </div>
              <textarea
                className="min-h-[110px] w-full resize-none rounded-lg border border-gray-200 p-3 text-sm focus:border-primary-500 focus:outline-none"
                placeholder="특이사항 메모"
                value={memo}
                onChange={(event) => setMemo(event.target.value)}
              />
            </div>
          </section>

          {error ? <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">{error}</div> : null}
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-gray-200 bg-white px-4 py-4 sm:h-[80px] sm:flex-row sm:items-center sm:justify-end sm:gap-4 sm:px-8 sm:py-0">
          <button className="h-[44px] rounded-[12px] px-6 text-[14px] font-bold text-gray-600 transition-all hover:bg-gray-100" onClick={onClose} type="button">취소</button>
          <button
            className="h-[44px] rounded-[12px] border border-gray-900 bg-gray-900 px-10 text-[14px] font-black uppercase tracking-wider text-white shadow-lg shadow-gray-900/10 transition-all hover:bg-black disabled:opacity-60"
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              setError(null);

              try {
                await onSubmit({
                  periodStart,
                  periodEnd,
                  gpuFee,
                  cpuFee,
                  storageFee,
                  networkFee,
                  creditDeduction: creditValue,
                  totalFee,
                  invoiceUrl: invoiceUrl || null,
                  memo: memo || null,
                });
              } catch (submitError) {
                setError(submitError instanceof Error ? submitError.message : '빌링 등록에 실패했습니다.');
              } finally {
                setSaving(false);
              }
            }}
            type="button"
          >
            {saving ? '등록 중...' : '빌링 등록 완료'}
          </button>
        </div>
      </div>
    </div>
  );
}

type InvoicesPageClientProps = {
  initialTenantRecords?: TenantRecord[];
  initialSubtenantRecords?: SubtenantRecord[];
  initialBillings?: BillingRecord[];
  initialTenantId?: string | null;
};

export default function InvoicesPageClient({
  initialTenantRecords = [],
  initialSubtenantRecords = [],
  initialBillings = [],
  initialTenantId = null,
}: InvoicesPageClientProps) {
  const { currentUser } = useAuth();
  const normalizedInitialBillings = useMemo(
    () => initialBillings.map((record) => normalizeBillingRecord(record as BillingLikeRecord)),
    [initialBillings],
  );
  const [tenants, setTenants] = useState<TenantRecord[]>(initialTenantRecords);
  const [subtenants, setSubtenants] = useState<SubtenantRecord[]>(initialSubtenantRecords);
  const [records, setRecords] = useState<BillingRecord[]>(normalizedInitialBillings);
  const [loading, setLoading] = useState(initialBillings.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [activeTenantIdx, setActiveTenantIdx] = useState(
    Math.max(0, initialTenantRecords.findIndex((tenant) => tenant.id === initialTenantId)),
  );
  const [activeSubtenantIdx, setActiveSubtenantIdx] = useState(-1);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (initialTenantRecords.length > 0 || initialSubtenantRecords.length > 0) {
      return;
    }

    let active = true;

    const loadStaticData = async () => {
      try {
        const [tenantsPayload, subtenantsPayload] = await Promise.all([
          readJson<{ data: TenantRecord[] }>(await fetch('/api/tenants', { cache: 'no-store' })),
          readJson<{ data: SubtenantRecord[] }>(await fetch('/api/subtenants', { cache: 'no-store' })),
        ]);

        if (!active) {
          return;
        }

        setTenants(tenantsPayload.data ?? []);
        setSubtenants(subtenantsPayload.data ?? []);
        setActiveTenantIdx(0);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : '빌링 화면 데이터를 불러오지 못했습니다.');
      }
    };

    void loadStaticData();

    return () => {
      active = false;
    };
  }, [initialSubtenantRecords.length, initialTenantRecords.length]);

  const selectedTenant = tenants[activeTenantIdx] ?? null;

  const loadBillings = async (tenantId: string) => {
    setLoading(true);
    setError(null);

    try {
      const payload = await readJson<{ data: BillingRecord[] }>(
        await fetch(`/api/billings?tenantId=${tenantId}`, { cache: 'no-store' }),
      );
      setRecords((payload.data ?? []).map((record) => normalizeBillingRecord(record as BillingLikeRecord)));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '빌링 목록을 불러오지 못했습니다.');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedTenant?.id) {
      setRecords([]);
      setLoading(false);
      return;
    }

    if (selectedTenant.id === initialTenantId && normalizedInitialBillings.length > 0) {
      setRecords(normalizedInitialBillings);
      setLoading(false);
      return;
    }

    void loadBillings(selectedTenant.id);
  }, [initialTenantId, normalizedInitialBillings, selectedTenant?.id]);

  const tenantSubtenants = useMemo(() => {
    if (!selectedTenant) {
      return [];
    }

    let items = subtenants.filter((subtenant) => subtenant.tenant_id === selectedTenant.id);

    if (currentUser?.role === 'subtenant_member') {
      items = items.filter((subtenant) => subtenant.id === currentUser.subtenantId);
    }

    return items;
  }, [currentUser?.role, currentUser?.subtenantId, selectedTenant, subtenants]);

  useEffect(() => {
    setActiveSubtenantIdx(-1);
    setExpandedRow(null);
  }, [selectedTenant?.id]);

  const selectedSubtenant = activeSubtenantIdx >= 0 ? (tenantSubtenants[activeSubtenantIdx] ?? null) : null;
  const allPeriods = useMemo(() => {
    const periods = Array.from(new Set(records.map((record) => periodKey(record.periodStart)).filter(Boolean)));
    return periods.sort().reverse();
  }, [records]);
  const selectedPeriod = allPeriods[0] ?? '';
  const periodRecords = selectedPeriod ? records.filter((record) => periodKey(record.periodStart) === selectedPeriod) : records;
  const visibleRecords = selectedSubtenant
    ? periodRecords.filter((record) => record.subtenantId === selectedSubtenant.id)
    : periodRecords;

  const totalAmount = periodRecords.reduce((sum, record) => sum + record.totalFee, 0);
  const billingCount = periodRecords.length;
  const unregisteredSubtenants = tenantSubtenants.filter(
    (subtenant) => !periodRecords.some((record) => record.subtenantId === subtenant.id),
  ).length;

  const handleTenantClick = (idx: number) => {
    if (currentUser?.role === 'tenant_admin' || currentUser?.role === 'subtenant_member') {
      return;
    }

    setActiveTenantIdx(idx);
  };

  const companyItems = tenants.map((tenant) => ({
    id: tenant.id,
    name: tenant.name,
    subCount: subtenants.filter((subtenant) => subtenant.tenant_id === tenant.id).length,
  }));

  return (
    <div className="flex h-auto min-h-0 flex-col gap-6 text-gray-900 md:flex-row md:h-[calc(100vh-112px)] lg:gap-7">
      {isModalOpen && selectedTenant && selectedSubtenant ? (
        <BillingRegistrationModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (input) => {
            const response = await fetch('/api/billings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                tenantId: selectedTenant.id,
                subtenantId: selectedSubtenant.id,
                ...input,
              }),
            });

            const payload = (await response.json().catch(() => ({}))) as { error?: string };

            if (!response.ok) {
              throw new Error(payload.error ?? '빌링 등록에 실패했습니다.');
            }

            setIsModalOpen(false);
            await loadBillings(selectedTenant.id);
          }}
          subtenant={selectedSubtenant}
          tenant={selectedTenant}
        />
      ) : null}

      <CompanyListPanel companies={companyItems} activeIndex={Math.min(activeTenantIdx, Math.max(0, tenants.length - 1))} onCompanyClick={handleTenantClick} />

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="mb-5 flex-none shrink-0">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4 lg:gap-5">
            <div className="rounded-[10px] border border-gray-200 bg-white p-5 text-left shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] lg:rounded-[12px] lg:p-6 lg:shadow-[0_10px_30px_-18px_rgba(15,23,42,0.18)]">
              <div className="mb-2 text-sm font-bold text-gray-500">{selectedTenant?.name ?? '-'} 총 청구 금액</div>
              <div className="mt-1 font-mono text-[24px] font-extrabold tracking-tight text-gray-900 md:text-[28px]">₩ {formatNumber(totalAmount)}</div>
              <div className="mt-4 text-[12px] font-semibold text-gray-400">{selectedPeriod || '-'} 기준</div>
            </div>
            <div className="rounded-[10px] border border-gray-200 bg-white p-5 text-left shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] lg:rounded-[12px] lg:p-6 lg:shadow-[0_10px_30px_-18px_rgba(15,23,42,0.18)]">
              <div className="mb-2 text-sm font-bold text-gray-500">빌링 등록 건수</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-[24px] font-bold tracking-tight text-primary-600 md:text-[28px]">{billingCount}</span>
                <span className="text-sm font-medium text-gray-500">건</span>
              </div>
              <div className="mt-4 text-[12px] font-semibold text-gray-400">{selectedPeriod || '-'} 완료 건수</div>
            </div>
            <div className="rounded-[10px] border border-gray-200 bg-white p-5 text-left shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] lg:rounded-[12px] lg:p-6 lg:shadow-[0_10px_30px_-18px_rgba(15,23,42,0.18)]">
              <div className="mb-2 text-sm font-bold text-gray-500">미등록 Subtenant</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-[24px] font-bold tracking-tight text-amber-500 md:text-[28px]">{unregisteredSubtenants}</span>
                <span className="text-sm font-medium text-gray-500">개</span>
              </div>
              <div className="mt-4 text-[12px] font-semibold text-gray-400">{selectedPeriod || '-'} 등록 대기</div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:mt-6">
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveSubtenantIdx(-1)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-[13px] font-bold transition-all outline-none ${
                  activeSubtenantIdx === -1
                    ? 'bg-gray-800 text-white shadow-sm ring-2 ring-gray-800 ring-offset-2'
                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
                }`}
                type="button"
              >
                전체
              </button>
              {tenantSubtenants.map((subtenant, index) => {
                const hasRecords = periodRecords.some((record) => record.subtenantId === subtenant.id);
                return (
                  <button
                    key={subtenant.id}
                    onClick={() => setActiveSubtenantIdx(index)}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-[13px] font-bold transition-all outline-none ${
                      activeSubtenantIdx === index
                        ? 'bg-gray-800 text-white shadow-sm ring-2 ring-gray-800 ring-offset-2'
                        : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                    type="button"
                  >
                    <Building2 className={activeSubtenantIdx === index ? 'text-gray-300' : 'text-gray-400'} size={14} />
                    {subtenant.name}
                    {!hasRecords ? <span className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-500" /> : null}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-4 py-2 text-[13px] font-bold text-gray-600 shadow-sm transition-all hover:bg-gray-50"
                onClick={() =>
                  downloadCsv(
                    `${selectedTenant?.name ?? 'billing'}-${selectedSubtenant?.name ?? 'all'}-${selectedPeriod || 'all'}.csv`,
                    visibleRecords.map((record) => ({
                      period_start: record.periodStart,
                      period_end: record.periodEnd,
                      gpu_fee: record.gpuFee,
                      cpu_fee: record.cpuFee,
                      storage_fee: record.storageFee,
                      network_fee: record.networkFee,
                      credit_deduction: record.creditDeduction,
                      total_fee: record.totalFee,
                      registered_at: record.registeredAt,
                    })),
                  )
                }
                type="button"
              >
                <Download size={16} />
                CSV 다운로드
              </button>
              {isAdmin && selectedSubtenant ? (
                <button
                  className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-600 px-4 py-2 text-[13px] font-bold text-white shadow-sm transition-all hover:bg-primary-700"
                  onClick={() => setIsModalOpen(true)}
                  type="button"
                >
                  <Plus size={16} />
                  빌링 등록
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] lg:rounded-[12px] lg:shadow-[0_10px_30px_-18px_rgba(15,23,42,0.18)]">
          <div className="flex-1 overflow-x-auto overflow-y-auto">
            {loading ? (
              <div className="px-6 py-16 text-center text-[14px] text-gray-400">빌링 목록을 불러오는 중입니다.</div>
            ) : error ? (
              <div className="px-6 py-16 text-center text-[14px] text-rose-500">{error}</div>
            ) : (
              <table className="min-w-[900px] w-full border-collapse text-left">
                <thead className="hidden md:table-header-group">
                  <tr className="border-b border-gray-200 bg-[#FAFAFA]">
                    <th className="min-w-[120px] whitespace-nowrap px-6 py-4 text-[12px] font-extrabold uppercase tracking-widest text-gray-500">청구 기간</th>
                    <th className="min-w-[120px] whitespace-nowrap px-6 py-4 text-right text-[12px] font-extrabold uppercase tracking-widest text-gray-500">청구 금액</th>
                    <th className="min-w-[100px] whitespace-nowrap px-6 py-4 text-[12px] font-extrabold uppercase tracking-widest text-gray-500">크레딧 차감</th>
                    <th className="min-w-[120px] whitespace-nowrap px-6 py-4 text-[12px] font-extrabold uppercase tracking-widest text-gray-500">등록일</th>
                    <th className="min-w-[120px] whitespace-nowrap px-6 py-4 text-[12px] font-extrabold uppercase tracking-widest text-gray-500">다운로드</th>
                    {isAdmin ? <th className="min-w-[80px] whitespace-nowrap px-6 py-4 text-center text-[12px] font-extrabold uppercase tracking-widest text-gray-500">관리</th> : null}
                  </tr>
                </thead>
                <tbody className="flex flex-col gap-4 p-4 md:table-row-group md:p-0">
                  {visibleRecords.length === 0 ? (
                    <tr className="md:table-row">
                      <td className="px-6 py-16 text-center text-[14px] text-gray-400" colSpan={isAdmin ? 6 : 5}>
                        해당 Subtenant에 등록된 빌링 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    visibleRecords.map((record) => (
                      <React.Fragment key={record.id}>
                        <tr
                          className={`group flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors md:table-row md:rounded-none md:border-0 md:border-b md:p-0 md:shadow-none ${
                            expandedRow === record.id ? 'border-primary-100 bg-primary-50/30 ring-2 ring-primary-500/20 md:ring-0' : 'border-gray-100 hover:bg-gray-50/50'
                          }`}
                          onClick={() => setExpandedRow(expandedRow === record.id ? null : record.id)}
                        >
                          <td className="mb-3 border-b border-gray-50 px-0 py-1 pb-2 font-mono text-[15px] font-bold text-gray-700 whitespace-nowrap md:mb-0 md:border-0 md:px-6 md:py-4 md:text-[14px]">
                            {formatPeriod(record.periodStart, record.periodEnd)}
                          </td>
                          <td className="px-0 py-1 text-left font-mono text-[18px] font-extrabold text-gray-900 whitespace-nowrap md:px-6 md:py-4 md:text-right md:text-[15px]">
                            {formatCurrency(record.totalFee)}
                          </td>
                          <td className="px-0 py-1 font-mono font-semibold text-red-500 whitespace-nowrap md:px-6 md:py-4">
                            {(record.creditDeduction ?? 0) !== 0 ? `-₩ ${formatNumber(record.creditDeduction)}` : <span className="text-gray-300">—</span>}
                          </td>
                          <td className="px-0 py-1 text-[13px] font-medium text-gray-500 whitespace-nowrap md:px-6 md:py-4">
                            {record.registeredAt ? record.registeredAt.slice(0, 10) : '-'}
                          </td>
                          <td className="mt-2 border-t border-gray-50 px-0 py-3 md:mt-0 md:border-0 md:px-6 md:py-4" onClick={(event) => event.stopPropagation()}>
                            <div className="flex gap-2">
                              <button className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-2 text-[11px] font-bold text-gray-600 shadow-sm hover:bg-gray-50 md:flex-none md:py-1.5">
                                <FileText className={record.invoiceUrl ? 'text-primary-500' : 'text-gray-400'} size={14} />
                                인보이스
                              </button>
                              <button
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-2 text-[11px] font-bold text-gray-600 shadow-sm hover:bg-gray-50 md:flex-none md:py-1.5"
                                onClick={() =>
                                  downloadCsv(`billing-${record.id}.csv`, [
                                    {
                                      period_start: record.periodStart,
                                      period_end: record.periodEnd,
                                      gpu_fee: record.gpuFee,
                                      cpu_fee: record.cpuFee,
                                      storage_fee: record.storageFee,
                                      network_fee: record.networkFee,
                                      credit_deduction: record.creditDeduction,
                                      total_fee: record.totalFee,
                                    },
                                  ])
                                }
                                type="button"
                              >
                                <Download className="text-emerald-500" size={14} />
                                CSV
                              </button>
                            </div>
                          </td>
                          {isAdmin ? (
                            <td className="absolute right-5 top-5 px-0 text-center md:static md:px-6 md:py-4" onClick={(event) => event.stopPropagation()}>
                              <button
                                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-800"
                                onClick={async () => {
                                  if (!window.confirm('이 빌링 내역을 삭제하시겠습니까?')) {
                                    return;
                                  }

                                  await fetch(`/api/billings/${record.id}`, { method: 'DELETE' });
                                  if (selectedTenant?.id) {
                                    await loadBillings(selectedTenant.id);
                                  }
                                }}
                                type="button"
                              >
                                <MoreVertical size={16} />
                              </button>
                            </td>
                          ) : null}
                        </tr>
                        {expandedRow === record.id ? (
                          <tr className="mx-1 -mt-4 block overflow-hidden rounded-b-xl bg-[#FCFCFC] shadow-inner md:mx-0 md:mt-0 md:table-row">
                            <td className="p-0" colSpan={isAdmin ? 6 : 5}>
                              <div className="flex flex-col gap-6 px-6 py-6 md:flex-row md:px-16 md:py-8">
                                <div className="flex-1 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                  <h4 className="mb-4 border-l-4 border-gray-800 pl-2 text-[13px] font-extrabold text-gray-800">청구 항목 상세</h4>
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-2"><span className="text-[13px] font-semibold text-gray-500">GPU 요금</span><span className="font-mono text-[14px] font-bold text-gray-700">{formatCurrency(record.gpuFee)}</span></div>
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-2"><span className="text-[13px] font-semibold text-gray-500">CPU 요금</span><span className="font-mono text-[14px] font-bold text-gray-700">{formatCurrency(record.cpuFee)}</span></div>
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-2"><span className="text-[13px] font-semibold text-gray-500">스토리지 요금</span><span className="font-mono text-[14px] font-bold text-gray-700">{formatCurrency(record.storageFee)}</span></div>
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-2"><span className="text-[13px] font-semibold text-gray-500">네트워크 요금</span><span className="font-mono text-[14px] font-bold text-gray-700">{formatCurrency(record.networkFee)}</span></div>
                                    <div className="flex items-center justify-between pt-2"><span className="flex items-center gap-1.5 text-[13px] font-bold text-red-600"><AlertTriangle size={14} />크레딧 차감액</span><span className="font-mono text-[14px] font-bold text-red-600">-₩ {formatNumber(record.creditDeduction)}</span></div>
                                    <div className="mt-2 flex items-end justify-between border-t-2 border-gray-800 pt-4"><span className="text-[14px] font-extrabold text-gray-900">최종 금액</span><span className="font-mono text-[20px] font-extrabold text-primary-600">{formatCurrency(record.totalFee)}</span></div>
                                  </div>
                                </div>
                                <div className="flex w-full max-w-full flex-col gap-4 md:max-w-[300px]">
                                  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                    <h4 className="mb-2 text-[12px] font-bold uppercase text-gray-500">인보이스 파일</h4>
                                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                                      <FileText className="shrink-0 text-red-400" size={20} />
                                      <span className="truncate text-[12px] font-medium text-gray-700">{record.invoiceUrl || '첨부 파일 없음'}</span>
                                    </div>
                                  </div>
                                  <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                    <h4 className="mb-2 text-[12px] font-bold uppercase text-gray-500">특이사항 메모</h4>
                                    <p className="text-[13px] leading-relaxed text-gray-600">{record.memo || '특이사항 없음.'}</p>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </React.Fragment>
                    ))
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
