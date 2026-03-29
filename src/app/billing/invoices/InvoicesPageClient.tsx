'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  CreditCard,
  Download,
  FileText,
  MoreVertical,
  Plus,
  Search,
  TrendingUp,
  UploadCloud,
  X,
} from 'lucide-react';

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
  if (!contract || Array.isArray(contract) || typeof contract !== 'object') return {};
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
  if (!start || !end) return '-';
  return `${start} ~ ${end}`;
}

function periodKey(start: string | null) {
  return start ? start.slice(0, 7) : '';
}

async function readJson<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(payload.error ?? '요청을 처리하지 못했습니다.');
  return payload;
}

function downloadCsv(filename: string, rows: Array<Record<string, string | number | null>>) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      headers.map((header) => {
        const value = row[header];
        const text = value == null ? '' : String(value);
        return `"${text.replaceAll('"', '""')}"`;
      }).join(','),
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
  const [periodStart, setPeriodStart] = useState('2026-03-01');
  const [periodEnd, setPeriodEnd] = useState('2026-03-31');
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
        if (active) setCreditBalance(payload.data.balance ?? 0);
      } catch {
        if (active) setCreditBalance(0);
      }
    };
    loadCreditBalance();
    return () => { active = false; };
  }, [subtenant.id, tenant.id]);

  const contract = parseContract(tenant.contract);
  const gpuFee = (contract.gpu?.quantity ?? 0) * (contract.gpu?.unitPrice ?? 0);
  const cpuFee = (contract.cpu?.quantity ?? 0) * (contract.cpu?.unitPrice ?? 0);
  const storageFee = Math.round((mockStorageMetrics[tenant.id]?.usageTB ?? 0) * (contract.storage?.unitPrice ?? 0));
  const networkFee = Math.round((mockNetworkMetrics[tenant.id]?.currentOutboundGB ?? 0) * (contract.network?.unitPrice ?? 0));
  const creditValue = Number(creditDeduction.replace(/[^\d]/g, '')) || 0;
  const expectedBalance = creditBalance - creditValue;
  const totalFee = gpuFee + cpuFee + storageFee + networkFee - creditValue;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-950/45 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">신규 빌링 등록</h2>
          <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 p-6 scroll-smooth bg-gray-50/50">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-l-4 border-blue-500 pl-3">기본 정산 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-black text-gray-500 uppercase tracking-tight">Tenant</label>
                <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-bold text-gray-600">{tenant.name}</div>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-black text-gray-500 uppercase tracking-tight">Subtenant</label>
                <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-bold text-gray-600">{subtenant.name}</div>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-black text-gray-500 uppercase tracking-tight">청구 시작일</label>
                <input className="w-full rounded-lg border border-gray-200 p-2 text-[13px] font-bold focus:border-blue-500 outline-none" type="date" value={periodStart} onChange={e => setPeriodStart(e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-black text-gray-500 uppercase tracking-tight">청구 종료일</label>
                <input className="w-full rounded-lg border border-gray-200 p-2 text-[13px] font-bold focus:border-blue-500 outline-none" type="date" value={periodEnd} onChange={e => setPeriodEnd(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-l-4 border-emerald-500 pl-3">요금 산출 내역</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 px-2">
              <div className="flex justify-between items-end pb-2 border-b border-gray-50"><span className="text-xs text-gray-400 font-bold">GPU (고정)</span><span className="text-sm font-mono font-black text-gray-800">{formatCurrency(gpuFee)}</span></div>
              <div className="flex justify-between items-end pb-2 border-b border-gray-50"><span className="text-xs text-gray-400 font-bold">CPU (고정)</span><span className="text-sm font-mono font-black text-gray-800">{formatCurrency(cpuFee)}</span></div>
              <div className="flex justify-between items-end pb-2 border-b border-gray-50"><span className="text-xs text-gray-400 font-bold">Storage (변동)</span><span className="text-sm font-mono font-black text-gray-800">{formatCurrency(storageFee)}</span></div>
              <div className="flex justify-between items-end pb-2 border-b border-gray-50"><span className="text-xs text-gray-400 font-bold">Network (변동)</span><span className="text-sm font-mono font-black text-gray-800">{formatCurrency(networkFee)}</span></div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-black text-orange-700 uppercase tracking-tight"><AlertTriangle size={14} />크레딧 차감 적용</span>
                <span className="text-[10px] font-bold text-orange-600 opacity-60">잔액: ₩ {formatNumber(creditBalance)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[11px] font-bold text-gray-500">차감 후 잔액: <span className="font-mono text-gray-700">₩ {formatNumber(expectedBalance)}</span></span>
                <div className="flex items-center gap-1.5">
                   <span className="font-mono text-sm font-black text-orange-600">-₩</span>
                   <input className="w-32 rounded-lg border border-orange-200 bg-white px-3 py-1.5 text-right font-mono text-sm font-black text-orange-600 focus:border-orange-400 outline-none" value={creditDeduction} onChange={e => setCreditDeduction(e.target.value.replace(/[^\d]/g, ''))} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 shadow-xl flex justify-between items-center transition-transform active:scale-[0.99]">
             <span className="text-[13px] font-black text-gray-400 uppercase tracking-widest">청구 집계 금액</span>
             <span className="text-2xl font-black text-white font-mono">{formatCurrency(totalFee)}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-3">
               <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><UploadCloud size={14} /> 인보이스 링크</label>
               <input className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-blue-500 outline-none" placeholder="https://cloud-portal.com/invoice/..." value={invoiceUrl} onChange={e => setInvoiceUrl(e.target.value)} />
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-3">
               <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><FileText size={14} /> 특이사항 메모</label>
               <textarea className="w-full rounded-lg border border-gray-200 p-2.5 text-xs h-20 resize-none focus:border-blue-500 outline-none" placeholder="비정기 할인 적용 등..." value={memo} onChange={e => setMemo(e.target.value)} />
            </div>
          </div>

          {error && <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-xs font-bold text-red-600">{error}</div>}
        </div>

        <div className="flex justify-end gap-3 bg-white border-t border-gray-100 px-8 py-5">
           <button className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors" onClick={onClose}>취소</button>
           <button className="px-10 py-2.5 rounded-lg bg-gray-900 text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-gray-200 hover:bg-black transition-all active:scale-[0.98] disabled:bg-gray-300" disabled={saving} onClick={async () => {
             setSaving(true);
             try { await onSubmit({ periodStart, periodEnd, gpuFee, cpuFee, storageFee, networkFee, creditDeduction: creditValue, totalFee, invoiceUrl: invoiceUrl || null, memo: memo || null }); } catch (err) { setError(err instanceof Error ? err.message : '실패'); } finally { setSaving(false); }
           }}>
             {saving ? '정산 등록 중...' : '빌링 확정 완료'}
           </button>
        </div>
      </div>
    </div>
  );
}

type InvoicesPageClientProps = {
  initialTenantRecords?: TenantRecord[];
  initialSubtenantRecords?: SubtenantRecord[];
  initialBillings?: unknown[];
  initialTenantId?: string | null;
};

export default function InvoicesPageClient({
  initialTenantRecords = [],
  initialSubtenantRecords = [],
  initialBillings = [],
  initialTenantId = null,
}: InvoicesPageClientProps) {
  const { currentUser } = useAuth();
  const normalizedInitialBillings = useMemo(() => initialBillings.map((r: unknown) => normalizeBillingRecord(r as BillingLikeRecord)), [initialBillings]);
  const [tenants, setTenants] = useState<TenantRecord[]>(initialTenantRecords);
  const [subtenants, setSubtenants] = useState<SubtenantRecord[]>(initialSubtenantRecords);
  const [records, setRecords] = useState<BillingRecord[]>(normalizedInitialBillings);
  const [loading, setLoading] = useState(initialBillings.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [activeTenantIdx, setActiveTenantIdx] = useState(Math.max(0, initialTenantRecords.findIndex((t: TenantRecord) => t.id === initialTenantId)));
  const [activeSubtenantIdx, setActiveSubtenantIdx] = useState(-1);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tenantSearchTerm, setTenantSearchTerm] = useState('');

  const isAdmin = currentUser?.role === 'admin';
  const filteredTenants = useMemo(() => {
    if (!tenantSearchTerm) return tenants;
    return tenants.filter(t => t.name.toLowerCase().includes(tenantSearchTerm.toLowerCase()));
  }, [tenants, tenantSearchTerm]);

  useEffect(() => {
    if (initialTenantRecords.length > 0) return;
    let active = true;
    const loadStaticData = async () => {
      try {
        const [tp, sp] = await Promise.all([
          readJson<{ data: TenantRecord[] }>(await fetch('/api/tenants', { cache: 'no-store' })),
          readJson<{ data: SubtenantRecord[] }>(await fetch('/api/subtenants', { cache: 'no-store' })),
        ]);
        if (active) { setTenants(tp.data ?? []); setSubtenants(sp.data ?? []); setActiveTenantIdx(0); }
      } catch (err) { if (active) setError(err instanceof Error ? err.message : '데이터 로드 실패'); }
    };
    loadStaticData();
    return () => { active = false; };
  }, [initialTenantRecords.length]);

  const selectedTenant = tenants[activeTenantIdx] ?? null;

  const loadBillings = async (tenantId: string) => {
    setLoading(true); setError(null);
    try {
      const p = await readJson<{ data: BillingRecord[] }>(await fetch(`/api/billings?tenantId=${tenantId}`, { cache: 'no-store' }));
      setRecords((p.data ?? []).map(r => normalizeBillingRecord(r as BillingLikeRecord)));
    } catch (err) { setError(err instanceof Error ? err.message : '실패'); setRecords([]); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!selectedTenant?.id) { setRecords([]); setLoading(false); return; }
    if (selectedTenant.id === initialTenantId && normalizedInitialBillings.length > 0) { setRecords(normalizedInitialBillings); setLoading(false); return; }
    loadBillings(selectedTenant.id);
  }, [selectedTenant?.id, initialTenantId, normalizedInitialBillings]);

  const tenantSubtenants = useMemo(() => {
    if (!selectedTenant) return [];
    let items = subtenants.filter(s => s.tenant_id === selectedTenant.id);
    if (currentUser?.role === 'subtenant_member') items = items.filter(s => s.id === currentUser.subtenantId);
    return items;
  }, [selectedTenant, subtenants, currentUser]);

  useEffect(() => { setActiveSubtenantIdx(-1); setExpandedRow(null); }, [selectedTenant?.id]);

  const selectedSubtenant = activeSubtenantIdx >= 0 ? tenantSubtenants[activeSubtenantIdx] : null;
  const allPeriods = useMemo(() => Array.from(new Set(records.map(r => periodKey(r.periodStart)).filter(Boolean))).sort().reverse(), [records]);
  const selectedPeriod = allPeriods[0] ?? '2026.03';
  const periodRecords = records.filter(r => periodKey(r.periodStart) === selectedPeriod);
  const visibleRecords = selectedSubtenant ? periodRecords.filter(r => r.subtenantId === selectedSubtenant.id) : periodRecords;

  const totalAmount = useMemo(() => visibleRecords.reduce((sum, r) => sum + r.totalFee, 0), [visibleRecords]);
  const unregisteredCount = tenantSubtenants.filter(s => !periodRecords.some(r => r.subtenantId === s.id)).length;

  return (
    <div className="flex h-full flex-col bg-[#F8FAFC]">
      <div className="flex-1 overflow-y-auto w-full">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-8 space-y-6">
          <div className="flex h-[48px] shrink-0 items-center justify-between bg-white px-4 rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 min-w-0 flex-1">
              {filteredTenants.map((t, idx) => {
                const originalIdx = tenants.findIndex(at => at.id === t.id);
                const isSelected = activeTenantIdx === originalIdx;
                return (
                  <button key={t.id} onClick={() => setActiveTenantIdx(originalIdx)} className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold transition-all ${isSelected ? 'bg-primary-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                    {t.name}
                  </button>
                );
              })}
            </div>
            <div className="hidden md:flex items-center gap-4 pl-4 shrink-0">
              <div className="h-4 w-px bg-gray-200 shrink-0" />
              <div className="relative shrink-0">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                <input className="h-[30px] w-36 rounded-full border border-gray-200 bg-white pl-8 pr-4 text-[12px] transition-all focus:w-48 focus:border-blue-300 focus:outline-none" placeholder="테넌트 검색" value={tenantSearchTerm} onChange={e => setTenantSearchTerm(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
             <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
               <button onClick={() => setActiveSubtenantIdx(-1)} className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all ${activeSubtenantIdx === -1 ? 'bg-gray-900 text-white shadow-lg shadow-gray-200' : 'text-gray-500 hover:bg-gray-100'}`}>전체</button>
               {tenantSubtenants.map((s, i) => (
                 <button key={s.id} onClick={() => setActiveSubtenantIdx(i)} className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-wider transition-all border ${activeSubtenantIdx === i ? 'bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-200' : 'text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
                   {s.name} {!periodRecords.some(r => r.subtenantId === s.id) && <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                 </button>
               ))}
             </div>
             <div className="flex items-center gap-3">
               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[11px] font-black uppercase tracking-wider text-gray-600 hover:bg-gray-50 transition-all active:scale-[0.98]" onClick={() => downloadCsv(`billing-${selectedTenant?.name}.csv`, visibleRecords)}>
                  <Download size={14} /> CSV 출력
               </button>
               {isAdmin && selectedSubtenant && (
                 <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-[11px] font-black uppercase tracking-wider text-white shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]" onClick={() => setIsModalOpen(true)}>
                    <Plus size={14} /> 빌링 등록
                 </button>
               )}
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition-all hover:shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><CreditCard size={16} className="text-blue-500" /></div>
                <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">총 정산 금액</span>
              </div>
              <p className="text-2xl font-black text-gray-900 tabular-nums">₩ {formatNumber(totalAmount)}</p>
              <p className="text-xs text-gray-400 mt-1">{selectedPeriod} 귀속 청구 총액</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition-all hover:shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><TrendingUp size={16} className="text-emerald-500" /></div>
                <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">확정 건수</span>
              </div>
              <p className="text-2xl font-black text-emerald-600 tabular-nums">{visibleRecords.length}<span className="text-sm ml-1 text-gray-400">건</span></p>
              <p className="text-xs text-gray-400 mt-1">인보이스 발행 완료 건수</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition-all hover:shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><AlertTriangle size={16} className="text-amber-500" /></div>
                <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">미등록 파트너</span>
              </div>
              <p className="text-2xl font-black text-amber-600 tabular-nums">{unregisteredCount}<span className="text-sm ml-1 text-gray-400">개</span></p>
              <p className="text-xs text-gray-400 mt-1">당월 정산 대기 데이터</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
               <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2"><FileText size={16} className="text-blue-500" /> 청구 명세서 리스트</h3>
               <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">선택 기간: {selectedPeriod}</div>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex h-[200px] items-center justify-center text-sm text-gray-400 italic">로딩 중...</div>
              ) : (
                <>
                  <div className="md:hidden space-y-3 p-4 bg-gray-50/50">
                    {visibleRecords.length === 0 ? (
                      <div className="py-12 text-center text-sm text-gray-400 italic">정산 내역이 존재하지 않습니다.</div>
                    ) : (
                      visibleRecords.map(r => (
                        <div key={r.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4" onClick={() => setExpandedRow(expandedRow === r.id ? null : r.id)}>
                          <div className="flex justify-between items-start">
                             <p className="text-sm font-black text-gray-900">{formatPeriod(r.periodStart, r.periodEnd)}</p>
                             <div className="text-right">
                                <p className="text-sm font-black text-gray-900">{formatCurrency(r.totalFee)}</p>
                                {r.creditDeduction > 0 && <p className="text-[10px] font-bold text-red-500">- ₩{formatNumber(r.creditDeduction)}</p>}
                             </div>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{r.registeredAt?.slice(0, 10) || '-'}</span>
                             <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                <button className="p-2 rounded-lg bg-gray-50 text-gray-500"><FileText size={14} /></button>
                                <button className="p-2 rounded-lg bg-gray-50 text-gray-500" onClick={() => downloadCsv(`billing-${r.id}.csv`, [r])}><Download size={14} /></button>
                             </div>
                          </div>
                          {expandedRow === r.id && (
                            <div className="pt-4 border-t border-gray-100 space-y-4">
                               <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-gray-500">
                                  <div className="flex justify-between"><span>GPU</span><span>{formatCurrency(r.gpuFee)}</span></div>
                                  <div className="flex justify-between"><span>CPU</span><span>{formatCurrency(r.cpuFee)}</span></div>
                                  <div className="flex justify-between"><span>Storage</span><span>{formatCurrency(r.storageFee)}</span></div>
                                  <div className="flex justify-between"><span>Network</span><span>{formatCurrency(r.networkFee)}</span></div>
                               </div>
                               {r.memo && (
                                 <div className="p-3 bg-gray-50 rounded-lg text-[10px] text-gray-600 italic leading-relaxed">
                                    {r.memo}
                                 </div>
                               )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  <table className="hidden md:table w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-left bg-gray-50/50">청구 기간</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right bg-gray-50/50">청구 총액</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-left bg-gray-50/50">감면 혜택</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-left bg-gray-50/50">발행일</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-left bg-gray-50/50">문서</th>
                        {isAdmin && <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center bg-gray-50/50">관리</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {visibleRecords.length === 0 ? (
                        <tr><td colSpan={isAdmin ? 6 : 5} className="py-20 text-center text-sm text-gray-400 italic">정산 내역이 존재하지 않습니다.</td></tr>
                      ) : (
                        visibleRecords.map(r => (
                          <React.Fragment key={r.id}>
                            <tr className={`hover:bg-gray-50 transition-colors cursor-pointer ${expandedRow === r.id ? 'bg-blue-50/30' : ''}`} onClick={() => setExpandedRow(expandedRow === r.id ? null : r.id)}>
                              <td className="px-6 py-4 font-bold text-gray-900 text-sm tabular-nums">{formatPeriod(r.periodStart, r.periodEnd)}</td>
                              <td className="px-6 py-4 text-right font-black text-gray-900 tabular-nums">{formatCurrency(r.totalFee)}</td>
                              <td className="px-6 py-4">
                                {r.creditDeduction > 0 ? <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-black border border-red-100">- ₩{formatNumber(r.creditDeduction)}</span> : <span className="text-gray-300">—</span>}
                              </td>
                              <td className="px-6 py-4 text-[11px] font-bold text-gray-500 tabular-nums">{r.registeredAt?.slice(0, 10) || '-'}</td>
                              <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                 <div className="flex gap-2">
                                   <button className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-100 transition-all active:scale-[0.95]"><FileText size={15} /></button>
                                   <button className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-emerald-600 hover:border-emerald-100 transition-all active:scale-[0.95]" onClick={() => downloadCsv(`billing-${r.id}.csv`, [r])}><Download size={15} /></button>
                                 </div>
                              </td>
                              {isAdmin && (
                                <td className="px-6 py-4 text-center" onClick={e => e.stopPropagation()}>
                                   <button className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all" onClick={async () => { if(confirm('정말 삭제할까요?')) { await fetch(`/api/billings/${r.id}`, {method:'DELETE'}); loadBillings(selectedTenant!.id); }}}><MoreVertical size={16} /></button>
                                </td>
                              )}
                            </tr>
                            {expandedRow === r.id && (
                              <tr>
                                <td colSpan={isAdmin ? 6 : 5} className="bg-gray-50/50 p-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
                                       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-4 border-blue-500 pl-3">상세 과금 항목</h4>
                                       <div className="space-y-2 px-1">
                                         <div className="flex justify-between items-center text-[12px] font-bold"><span className="text-gray-500">GPU 인프라 비용</span><span className="text-gray-900 font-mono">{formatCurrency(r.gpuFee)}</span></div>
                                         <div className="flex justify-between items-center text-[12px] font-bold"><span className="text-gray-500">CPU 연산 비용</span><span className="text-gray-900 font-mono">{formatCurrency(r.cpuFee)}</span></div>
                                         <div className="flex justify-between items-center text-[12px] font-bold"><span className="text-gray-500">스토리지 할당 비용</span><span className="text-gray-900 font-mono">{formatCurrency(r.storageFee)}</span></div>
                                         <div className="flex justify-between items-center text-[12px] font-bold border-b border-gray-50 pb-2"><span className="text-gray-500">네트워크 트래픽 비용</span><span className="text-gray-900 font-mono">{formatCurrency(r.networkFee)}</span></div>
                                         <div className="flex justify-between items-center text-[12px] font-black pt-1 text-red-600"><span>크레딧 결제 차감</span><span className="font-mono">- {formatCurrency(r.creditDeduction)}</span></div>
                                       </div>
                                    </div>
                                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
                                       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-4 border-gray-400 pl-3">정산 특이사항</h4>
                                       <div className="p-3 bg-gray-50 rounded-lg text-xs font-semibold text-gray-600 min-h-[80px] leading-relaxed italic">{r.memo || '저장된 메모 내용이 없습니다.'}</div>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && selectedTenant && selectedSubtenant && (
        <BillingRegistrationModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={async (input) => {
            const resp = await fetch('/api/billings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tenantId: selectedTenant.id, subtenantId: selectedSubtenant.id, ...input }) });
            if (!resp.ok) throw new Error('등록 실패');
            setIsModalOpen(false); await loadBillings(selectedTenant.id);
          }}
          subtenant={selectedSubtenant}
          tenant={selectedTenant}
        />
      )}
    </div>
  );
}
