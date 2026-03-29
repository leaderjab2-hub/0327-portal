'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Plus, RotateCcw, Search, Server, Settings, Trash2, X, Calendar, Activity, TrendingUp } from 'lucide-react';
import { calculateCreditAmount, calculateDurationMinutes } from '@/lib/creditMath';
import { useAuth } from '@/contexts/AuthContext';

type Tenant = {
  id: string;
  name: string;
};

type Subtenant = {
  id: string;
  tenant_id: string | null;
  name: string;
};

type AllocationNode = {
  id: string;
  label: string;
};

type Allocation = {
  id: number;
  tenant_id: string | null;
  subtenant_id: string | null;
  node_id: string;
  node?: AllocationNode | null;
};

type IncidentCustomer = {
  id: number;
  tenantId: string | null;
  subtenantId: string | null;
  gpuCount: number;
  creditAmount: number;
};

type IncidentRecord = {
  id: number;
  type: string | null;
  occurredAt: string | null;
  recoveredAt: string | null;
  durationMinutes: number;
  nodeType: string | null;
  nodeId: string | null;
  instanceName: string | null;
  registeredBy: string | null;
  memo: string | null;
  recoveryNote: string | null;
  createdAt: string | null;
  customers: IncidentCustomer[];
  totalCreditAmount: number;
};

type CreditItem = {
  id: number;
  amount: number;
  createdAt: string | null;
};

type FormState = {
  type: 'incident' | 'urgent_pm' | 'regular_pm';
  occurredAt: string;
  recoveredAt: string;
  nodeType: string;
  nodeId: string;
  memo: string;
  recoveryNote: string;
};

function formatDate(value: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDuration(minutes: number) {
  if (!minutes) return '0분';
  const hours = Math.floor(minutes / 60);
  const remains = minutes % 60;
  if (hours === 0) return `${remains}분`;
  if (remains === 0) return `${hours}시간`;
  return `${hours}시간 ${remains}분`;
}

function getTypeLabel(type: string | null) {
  if (type === 'urgent_pm') return '긴급 PM';
  if (type === 'regular_pm') return '정기 PM';
  return '장애';
}

function getTypeBadgeClass(type: string | null) {
  if (type === 'urgent_pm') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (type === 'regular_pm') return 'bg-blue-50 text-blue-700 border-blue-200';
  return 'bg-red-50 text-red-700 border-red-200';
}

function IncidentModal({
  isOpen,
  form,
  allocations,
  tenantId,
  subtenantNameById,
  saving,
  onClose,
  onChange,
  onSubmit,
}: {
  isOpen: boolean;
  form: FormState;
  allocations: Allocation[];
  tenantId: string;
  subtenantNameById: Record<string, string>;
  saving: boolean;
  onClose: () => void;
  onChange: (next: Partial<FormState>) => void;
  onSubmit: () => Promise<void>;
}) {
  if (!isOpen) return null;

  const selectedAllocation = allocations.find(a => a.node_id === form.nodeId) ?? null;
  const mappedCustomer = selectedAllocation?.subtenant_id ? {
    tenantId,
    subtenantId: selectedAllocation.subtenant_id,
    gpuCount: 1,
    subtenantName: subtenantNameById[selectedAllocation.subtenant_id] ?? selectedAllocation.subtenant_id,
  } : null;

  let durationMinutes = 0;
  let durationText = '자동 계산';
  let expectedCredit = 0;
  let hasDurationError = false;

  if (form.occurredAt && form.recoveredAt) {
    try {
      durationMinutes = calculateDurationMinutes(form.occurredAt, form.recoveredAt);
      durationText = formatDuration(durationMinutes);
      expectedCredit = mappedCustomer ? calculateCreditAmount(form.type, durationMinutes, mappedCustomer.gpuCount) : 0;
    } catch {
      hasDurationError = true;
      durationText = '시간 정보 오류';
    }
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-950/45 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 px-6 py-4 shrink-0">
          <h2 className="text-xl font-black text-gray-900 dark:text-slate-100 tracking-tight flex items-center gap-2"><AlertTriangle className="text-red-500" size={20} /> 장애/PM 등록</h2>
          <button className="rounded-full p-2 text-gray-400 dark:text-slate-500 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-100 transition-all" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 p-4 sm:p-6 scroll-smooth bg-gray-50 dark:bg-slate-900/50">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm card-depth space-y-4">
            <h3 className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest border-l-4 border-blue-500 pl-3">상세 유형 및 시간</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-tight">구분</label>
                <select className="bg-white dark:bg-slate-900 w-full rounded-lg border border-gray-200 dark:border-slate-700 p-2 text-[13px] font-bold focus:border-blue-500 outline-none" value={form.type} onChange={e => onChange({ type: e.target.value as FormState['type'] })}>
                  <option value="incident">장애</option>
                  <option value="urgent_pm">긴급 PM</option>
                  <option value="regular_pm">정기 PM</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-tight">노드 유형</label>
                <select className="bg-white dark:bg-slate-900 w-full rounded-lg border border-gray-200 dark:border-slate-700 p-2 text-[13px] font-bold focus:border-blue-500 outline-none" value={form.nodeType} onChange={e => onChange({ nodeType: e.target.value })}>
                  <option value="GPU">GPU</option>
                  <option value="CPU">CPU</option>
                  <option value="Storage">Storage</option>
                  <option value="NW">NW</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-tight">발생 시점</label>
                <input className="bg-white dark:bg-slate-900 w-full rounded-lg border border-gray-200 dark:border-slate-700 p-2 text-[13px] font-bold focus:border-blue-500 outline-none" type="datetime-local" value={form.occurredAt} onChange={e => onChange({ occurredAt: e.target.value })} />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-tight">복구 시점</label>
                <input className="bg-white dark:bg-slate-900 w-full rounded-lg border border-gray-200 dark:border-slate-700 p-2 text-[13px] font-bold focus:border-blue-500 outline-none" type="datetime-local" value={form.recoveredAt} onChange={e => onChange({ recoveredAt: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm card-depth space-y-4">
             <h3 className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest border-l-4 border-emerald-500 pl-3">인스턴스 및 고객사 매핑</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="mb-1.5 block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-tight">인스턴스 선택</label>
                  <select className="bg-white dark:bg-slate-900 w-full rounded-lg border border-gray-200 dark:border-slate-700 p-2 text-[13px] font-bold focus:border-blue-500 outline-none" value={form.nodeId} onChange={e => onChange({ nodeId: e.target.value })}>
                    <option value="">인스턴스 선택</option>
                    {allocations.map(a => <option key={a.id} value={a.node_id}>{a.node?.label || a.node_id}</option>)}
                  </select>
               </div>
               <div>
                  <label className="mb-1.5 block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-tight">총 소요 시간</label>
                  <div className={`rounded-lg p-2 text-[13px] font-black tabular-nums border ${hasDurationError ? 'bg-red-50 border-red-100 text-red-600' : 'bg-gray-50 dark:bg-slate-900 border-gray-100 dark:border-slate-700 text-gray-700 dark:text-slate-300'}`}>{durationText}</div>
               </div>
             </div>
             {mappedCustomer ? (
               <div className="mt-3 p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                 <div className="space-y-0.5">
                   <p className="text-[11px] font-black text-blue-800 uppercase tracking-tight">자동 매핑 고객사</p>
                   <p className="text-[14px] font-black text-blue-900">{mappedCustomer.subtenantName}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] font-bold text-blue-500">할당 가중치</p>
                   <p className="text-[12px] font-black text-blue-700">GPU {mappedCustomer.gpuCount}대 기준</p>
                 </div>
               </div>
             ) : (
               <div className="mt-3 p-8 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-white dark:bg-slate-800">
                  <Server className="text-gray-300 mb-2" size={32} />
                  <p className="text-xs font-bold text-gray-400 dark:text-slate-500 italic">노드를 선택하면 고객사 정보가 매핑됩니다.</p>
               </div>
             )}
          </div>

          <div className="bg-emerald-600 rounded-xl p-6 shadow-xl flex justify-between items-center text-white transition-transform active:scale-[0.99]">
             <span className="text-[11px] font-black uppercase tracking-widest opacity-80">예상 크레딧 보상액</span>
             <span className="text-2xl font-black font-mono">+ ₩ {expectedCredit.toLocaleString()}</span>
          </div>

          <div className="space-y-4">
             <div>
                <label className="mb-1.5 block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-tight">상세 장애 메모</label>
                <textarea className="bg-white dark:bg-slate-900 w-full rounded-xl border border-gray-200 dark:border-slate-700 p-3 text-sm h-24 resize-none transition-all focus:border-blue-500 outline-none" placeholder="장애 발생 원인, 증상 등..." value={form.memo} onChange={e => onChange({ memo: e.target.value })} />
             </div>
             <div>
                <label className="mb-1.5 block text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-tight">복구 조치 내역</label>
                <textarea className="bg-white dark:bg-slate-900 w-full rounded-xl border border-gray-200 dark:border-slate-700 p-3 text-sm h-24 resize-none transition-all focus:border-blue-500 outline-none" placeholder="조치 사항 및 재발 방지 대책..." value={form.recoveryNote} onChange={e => onChange({ recoveryNote: e.target.value })} />
             </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 px-6 sm:px-8 py-4 sm:py-5 shrink-0">
           <button className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900 transition-all" onClick={onClose}>취소</button>
           <button className="px-10 py-2.5 rounded-lg bg-red-600 text-sm font-black uppercase tracking-wider text-white shadow-sm card-depth hover:bg-black transition-all active:scale-[0.98] disabled:bg-gray-200" disabled={!mappedCustomer || !form.occurredAt || !form.recoveredAt || !form.nodeId || saving || hasDurationError} onClick={onSubmit}>
             {saving ? '등록 중...' : '장애 확정 등록'}
           </button>
        </div>
      </div>
    </div>
  );
}

export default function IncidentsPageClient({
  initialTenants = [],
  initialSubtenants = [],
  initialIncidents = [],
  initialCredits = [],
  initialAllocations = [],
  initialTenantId = null,
}: {
  initialTenants?: Tenant[];
  initialSubtenants?: Subtenant[];
  initialIncidents?: IncidentRecord[];
  initialCredits?: CreditItem[];
  initialAllocations?: Allocation[];
  initialTenantId?: string | null;
}) {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [activeTenantIdx, setActiveTenantIdx] = useState(Math.max(0, initialTenants.findIndex(t => t.id === initialTenantId)));
  const [subtenants, setSubtenants] = useState<Subtenant[]>(initialSubtenants);
  const [incidents, setIncidents] = useState<IncidentRecord[]>(initialIncidents);
  const [credits, setCredits] = useState<CreditItem[]>(initialCredits);
  const [allocations, setAllocations] = useState<Allocation[]>(initialAllocations);
  const [loading, setLoading] = useState(initialTenants.length === 0);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ type: 'incident', occurredAt: '', recoveredAt: '', nodeType: 'GPU', nodeId: '', memo: '', recoveryNote: '' });
  const [tenantSearchTerm, setTenantSearchTerm] = useState('');

  const filteredTenants = useMemo(() => {
    if (!tenantSearchTerm) return tenants;
    return tenants.filter(t => t.name.toLowerCase().includes(tenantSearchTerm.toLowerCase()));
  }, [tenants, tenantSearchTerm]);

  const activeTenant = tenants[activeTenantIdx] ?? null;

  const loadTenantData = useCallback(async (tid: string) => {
    setLoading(true); setError(null);
    try {
      const [s, i, c, a] = await Promise.all([
        fetch(`/api/subtenants?tenantId=${tid}`).then(r => r.json()),
        fetch(`/api/incidents?tenantId=${tid}`).then(r => r.json()),
        fetch(`/api/credits?tenantId=${tid}`).then(r => r.json()),
        fetch(`/api/node-allocations?tenantId=${tid}`).then(r => r.json()),
      ]);
      setSubtenants(s.data ?? []);
      setIncidents(i.data ?? []);
      setCredits(c.data?.items ?? []);
      setAllocations((a.data ?? []).filter((node: Allocation) => !!node.subtenant_id));
    } catch (err) { setError('데이터 갱신 실패'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (initialTenants.length > 0) return;
    const fetchTenants = async () => {
      try {
        const r = await fetch('/api/tenants');
        const p = await r.json();
        setTenants(p.data ?? []);
      } catch (err) { setError('Tenant 로드 실패'); }
    };
    fetchTenants();
  }, [initialTenants.length]);

  useEffect(() => {
    if (!activeTenant?.id) return;
    if (activeTenant.id === initialTenantId && initialIncidents.length > 0) {
      setSubtenants(initialSubtenants);
      setIncidents(initialIncidents);
      setCredits(initialCredits);
      setAllocations(initialAllocations.filter((node: Allocation) => !!node.subtenant_id));
      setLoading(false);
      return;
    }
    loadTenantData(activeTenant.id);
  }, [activeTenant?.id, initialIncidents.length, initialTenantId, loadTenantData]);

  const subtenantNameById = useMemo(() => subtenants.reduce<Record<string, string>>((acc, s) => { acc[s.id] = s.name; return acc; }, {}), [subtenants]);

  const summary = useMemo(() => {
    const cur = new Date().toISOString().slice(0, 7);
    return {
      total: incidents.length,
      incident: incidents.filter(i => i.type === 'incident').length,
      pm: incidents.filter(i => i.type !== 'incident').length,
      credits: credits.filter(c => c.amount > 0).reduce((s, c) => s + c.amount, 0),
      monthly: incidents.filter(i => (i.occurredAt || '').startsWith(cur)).length
    };
  }, [credits, incidents]);

  const handleCreate = async () => {
    if (!activeTenant?.id) return;
    const sa = allocations.find(a => a.node_id === form.nodeId);
    if (!sa?.subtenant_id) { setError('매핑 정보 없음'); return; }
    setSaving(true);
    try {
      const resp = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, instanceName: sa.node?.label || sa.node_id, customers: [{ tenantId: activeTenant.id, subtenantId: sa.subtenant_id, gpuCount: 1 }] })
      });
      if (!resp.ok) throw new Error('저장 실패');
      await loadTenantData(activeTenant.id);
      setIsModalOpen(false); setForm({ type: 'incident', occurredAt: '', recoveredAt: '', nodeType: 'GPU', nodeId: '', memo: '', recoveryNote: '' });
    } catch (err) { setError(err instanceof Error ? err.message : '실패'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!isAdmin || !confirm('삭제할까요?')) return;
    try {
      const resp = await fetch(`/api/incidents/${id}`, { method: 'DELETE' });
      if (!resp.ok) throw new Error('삭제 실패');
      await loadTenantData(activeTenant!.id);
    } catch (err) { setError('삭제 중 오류'); }
  };

  return (
    <div className="flex h-full flex-col bg-[#F8FAFC] dark:bg-slate-900">
      <div className="flex-1 overflow-y-auto w-full">
        <div className="mx-auto w-full max-w-[1400px] px-6 pb-8 space-y-6">
          <div className="flex h-[48px] shrink-0 items-center justify-between bg-white dark:bg-slate-800 px-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm card-depth overflow-hidden">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 min-w-0 flex-1">
              {filteredTenants.map((t, idx) => {
                const originalIdx = tenants.findIndex(at => at.id === t.id);
                const isSelected = activeTenantIdx === originalIdx;
                return (
                  <button key={t.id} onClick={() => setActiveTenantIdx(originalIdx)} className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[12px] font-bold transition-all ${isSelected ? 'bg-primary-50 text-blue-600' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900'}`}>
                    {t.name}
                  </button>
                );
              })}
            </div>
            <div className="hidden md:flex items-center gap-4 pl-4 shrink-0">
              <div className="h-4 w-px bg-gray-200 shrink-0" />
              <div className="relative shrink-0">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={13} />
                <input className="bg-white dark:bg-slate-900 h-[30px] w-36 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-4 text-[12px] transition-all focus:w-48 focus:border-blue-300 focus:outline-none" placeholder="테넌트 검색" value={tenantSearchTerm} onChange={e => setTenantSearchTerm(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 md:grid-cols-3 md:gap-4">
             <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm card-depth p-2.5 sm:p-5 transition-all hover:shadow-md min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-red-100/50 dark:bg-red-900/20 flex items-center justify-center shrink-0"><AlertTriangle size={12} className="sm:size-[16px] text-red-500" /></div>
                <span className="text-[9px] sm:text-sm text-gray-500 dark:text-slate-400 font-bold uppercase tracking-tight truncate">전체 등록</span>
              </div>
              <p className="text-[13px] sm:text-2xl font-black text-gray-900 dark:text-slate-100 tabular-nums truncate">{summary.total}<span className="text-[10px] sm:text-sm ml-0.5 text-gray-400 dark:text-slate-500 font-bold italic">건</span></p>
              <div className="mt-1.5 sm:mt-2 hidden sm:flex gap-2">
                 <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 shrink-0">장애 {summary.incident}</span>
                 <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 shrink-0">PM {summary.pm}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm card-depth p-2.5 sm:p-5 transition-all hover:shadow-md min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-emerald-100/50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0"><Activity size={12} className="sm:size-[16px] text-emerald-500" /></div>
                <span className="text-[9px] sm:text-sm text-gray-500 dark:text-slate-400 font-bold uppercase tracking-tight truncate">누적 보상</span>
              </div>
              <p className="text-[11px] sm:text-2xl font-black text-emerald-600 tabular-nums truncate">+ ₩{summary.credits.toLocaleString()}</p>
              <p className="hidden sm:block text-[11px] text-gray-400 dark:text-slate-500 mt-1 truncate">SLA 준수 보상 합계</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm card-depth p-2.5 sm:p-5 transition-all hover:shadow-md min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-amber-100/50 dark:bg-amber-900/20 flex items-center justify-center shrink-0"><TrendingUp size={12} className="sm:size-[16px] text-amber-500" /></div>
                <span className="text-[9px] sm:text-sm text-gray-500 dark:text-slate-400 font-bold uppercase tracking-tight truncate">당월 신규</span>
              </div>
              <p className="text-[13px] sm:text-2xl font-black text-amber-600 tabular-nums truncate">{summary.monthly}<span className="text-[10px] sm:text-sm ml-0.5 text-gray-400 dark:text-slate-500 font-bold italic">건</span></p>
              <p className="hidden sm:block text-[11px] text-gray-400 dark:text-slate-500 mt-1 truncate">30일 이내 발생 건수</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm card-depth overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/30 flex justify-between items-center">
               <h3 className="text-sm font-black text-gray-900 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2"><RotateCcw size={16} className="text-blue-500" /> 장애 및 점검 내역</h3>
               <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:text-blue-600 transition-all active:scale-[0.95]" onClick={() => loadTenantData(activeTenant!.id)}><RotateCcw size={14} /></button>
                  {isAdmin && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg text-[11px] font-black uppercase tracking-wider text-white shadow-sm card-depth hover:bg-black transition-all active:scale-[0.98]" onClick={() => setIsModalOpen(true)}>
                      <Plus size={14} /> 장애 등록
                    </button>
                  )}
               </div>
            </div>
            <div className="overflow-x-auto">
              {loading ? <div className="p-20 text-center text-sm text-gray-400 dark:text-slate-500 italic">데이터 로딩 중...</div> : (
                <>
                  <div className="md:hidden space-y-3 p-4 bg-gray-50 dark:bg-slate-900/50">
                    {incidents.length === 0 ? (
                      <div className="py-12 text-center text-sm text-gray-400 dark:text-slate-500 italic">등록된 내역이 없습니다.</div>
                    ) : (
                      incidents.map(i => (
                        <div key={i.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm card-depth p-4 space-y-4">
                          <div className="flex justify-between items-start">
                             <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getTypeBadgeClass(i.type)}`}>{getTypeLabel(i.type)}</span>
                             <span className="text-sm font-black text-emerald-600 font-mono">+ ₩ {i.totalCreditAmount.toLocaleString()}</span>
                          </div>
                          <div className="space-y-3">
                             <div className="flex items-center justify-between">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">발생 시점</p>
                                <p className="text-xs font-bold text-gray-600 dark:text-slate-400 tabular-nums">{formatDate(i.occurredAt)}</p>
                             </div>
                             <div className="flex items-center justify-between">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">소요 시간</p>
                                <p className="text-xs font-black text-gray-900 dark:text-slate-100">{formatDuration(i.durationMinutes)}</p>
                             </div>
                             <div className="pt-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700">
                                   <Server size={12} className="text-gray-400 dark:text-slate-500" />
                                   <span className="text-[11px] font-bold text-gray-600 dark:text-slate-400">{i.instanceName || i.nodeId}</span>
                                </div>
                                {isAdmin && (
                                  <button className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all" onClick={() => handleDelete(i.id)}><Trash2 size={15}/></button>
                                )}
                             </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <table className="hidden md:table w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-slate-700">
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider text-left bg-gray-50 dark:bg-slate-900/50">유형</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider text-left bg-gray-50 dark:bg-slate-900/50">발생 시점</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider text-left bg-gray-50 dark:bg-slate-900/50">소요</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider text-left bg-gray-50 dark:bg-slate-900/50">관련 인스턴스</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider text-left bg-gray-50 dark:bg-slate-900/50">고객사</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider text-right bg-gray-50 dark:bg-slate-900/50">보상액</th>
                        {isAdmin && <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider text-center bg-gray-50 dark:bg-slate-900/50">관리</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {incidents.length === 0 ? <tr><td colSpan={isAdmin ? 7 : 6} className="py-20 text-center text-sm text-gray-400 dark:text-slate-500 italic">등록된 내역이 없습니다.</td></tr> :
                        incidents.map(i => (
                          <tr key={i.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900 transition-all">
                            <td className="px-6 py-4 shrink-0">
                               <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getTypeBadgeClass(i.type)}`}>{getTypeLabel(i.type)}</span>
                            </td>
                            <td className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-slate-400 tabular-nums">{formatDate(i.occurredAt)}</td>
                            <td className="px-6 py-4 text-xs font-black text-gray-900 dark:text-slate-100">{formatDuration(i.durationMinutes)}</td>
                            <td className="px-6 py-4 shrink-0">
                               <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-100 border border-gray-200 dark:bg-slate-600 dark:border-slate-500 w-fit">
                                  <Server size={12} className="text-gray-400 dark:text-slate-500" />
                                  <span className="text-[11px] font-bold text-gray-600 dark:text-slate-400">{i.instanceName || i.nodeId}</span>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-xs font-bold text-gray-700 dark:text-slate-300">
                               {i.customers.map(c => subtenantNameById[c.subtenantId || ''] || c.subtenantId).join(', ')}
                            </td>
                            <td className="px-6 py-4 text-right">
                               <span className="text-sm font-black text-emerald-600 font-mono">+ ₩ {i.totalCreditAmount.toLocaleString()}</span>
                            </td>
                            {isAdmin && (
                              <td className="px-6 py-4 text-center">
                                 <button className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all" onClick={() => handleDelete(i.id)}><Trash2 size={15}/></button>
                              </td>
                            )}
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <IncidentModal isOpen={isModalOpen} form={form} allocations={allocations} tenantId={activeTenant?.id || ''} subtenantNameById={subtenantNameById} saving={saving} onClose={() => { setIsModalOpen(false); setForm({ type: 'incident', occurredAt: '', recoveredAt: '', nodeType: 'GPU', nodeId: '', memo: '', recoveryNote: '' }); }} onChange={n => setForm(p => ({ ...p, ...n }))} onSubmit={handleCreate} />
    </div>
  );
}
