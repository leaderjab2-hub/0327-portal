'use client';

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Calendar, FileText, Search, CreditCard, TrendingUp, Filter } from 'lucide-react';
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

function formatSourceType(sourceType: string | null) {
  const map: Record<string, string> = {
    'billing_deduction': '빌링 차감',
    'urgent_pm': '긴급 PM',
    'regular_pm': '정기 PM',
    'incident': '장애 보상'
  };
  return map[sourceType ?? ''] || '기타';
}

export default function CreditsPageClient({
  initialTenants = [],
  initialItems = [],
  initialGroups = [],
  initialTenantId = null,
}: {
  initialTenants?: Tenant[];
  initialItems?: CreditItem[];
  initialGroups?: CreditGroup[];
  initialTenantId?: string | null;
}) {
  const { currentUser } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [activeTenantIdx, setActiveTenantIdx] = useState(Math.max(0, initialTenants.findIndex(t => t.id === initialTenantId)));
  const [groups, setGroups] = useState<CreditGroup[]>(initialGroups);
  const [items, setItems] = useState<CreditItem[]>(initialItems);
  const [loading, setLoading] = useState(initialTenants.length === 0);
  const [tenantSearchTerm, setTenantSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const filteredTenants = useMemo(() => {
    if (!tenantSearchTerm) return tenants;
    return tenants.filter(t => t.name.toLowerCase().includes(tenantSearchTerm.toLowerCase()));
  }, [tenants, tenantSearchTerm]);

  const activeTenant = tenants[activeTenantIdx] ?? null;

  const loadCredits = useCallback(async (tenantId: string) => {
    setLoading(true); setError(null);
    try {
      const resp = await fetch(`/api/credits?tenantId=${tenantId}`);
      const payload = await resp.json();
      if (!resp.ok) throw new Error(payload.error || '실패');
      setItems(payload.data?.items ?? []);
      setGroups(payload.data?.groups ?? []);
    } catch (err) { setError(err instanceof Error ? err.message : '실패'); setItems([]); setGroups([]); }
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
    if (activeTenant.id === initialTenantId && initialItems.length > 0) {
      setItems(initialItems);
      setGroups(initialGroups);
      setLoading(false);
      return;
    }
    loadCredits(activeTenant.id);
  }, [activeTenant?.id, initialItems.length, initialTenantId, loadCredits]);

  const summary = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyItems = items.filter(i => (i.createdAt ?? '').startsWith(currentMonth));
    const generated = monthlyItems.filter(i => i.amount > 0).reduce((sum, i) => sum + i.amount, 0);
    const deducted = monthlyItems.filter(i => i.amount < 0).reduce((sum, i) => sum + i.amount, 0);
    const balance = items.reduce((sum, i) => sum + i.amount, 0);
    return { balance, generated, deducted };
  }, [items]);

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
             <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm card-depth p-2.5 sm:p-5 transition-all hover:shadow-md">
              <div className="flex items-center gap-1.5 mb-1.5 sm:mb-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"><CreditCard size={12} className="sm:size-[16px] text-blue-500" /></div>
                <span className="text-[9px] sm:text-sm text-gray-500 dark:text-slate-400 font-bold uppercase tracking-tight truncate">가용 잔액</span>
              </div>
              <p className={`text-[11px] sm:text-2xl font-black tabular-nums truncate ${summary.balance >= 0 ? 'text-gray-900 dark:text-slate-100' : 'text-red-600'}`}>
                {summary.balance >= 0 ? '₩' : '-₩'}{Math.abs(summary.balance).toLocaleString()}
              </p>
              <p className="hidden sm:block text-xs text-gray-400 dark:text-slate-500 mt-1">발생액 - 차감액 누계</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm card-depth p-2.5 sm:p-5 transition-all hover:shadow-md">
              <div className="flex items-center gap-1.5 mb-1.5 sm:mb-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center"><TrendingUp size={12} className="sm:size-[16px] text-emerald-500" /></div>
                <span className="text-[9px] sm:text-sm text-gray-500 dark:text-slate-400 font-bold uppercase tracking-tight truncate">당월 발생</span>
              </div>
              <p className="text-[11px] sm:text-2xl font-black text-emerald-600 tabular-nums truncate">+ ₩{summary.generated.toLocaleString()}</p>
              <p className="hidden sm:block text-xs text-gray-400 dark:text-slate-500 mt-1">보상 및 프로모션</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm card-depth p-2.5 sm:p-5 transition-all hover:shadow-md">
              <div className="flex items-center gap-1.5 mb-1.5 sm:mb-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center"><AlertTriangle size={12} className="sm:size-[16px] text-red-500" /></div>
                <span className="text-[9px] sm:text-sm text-gray-500 dark:text-slate-400 font-bold uppercase tracking-tight truncate">당월 차감</span>
              </div>
              <p className="text-[11px] sm:text-2xl font-black text-red-600 tabular-nums truncate">- ₩{Math.abs(summary.deducted).toLocaleString()}</p>
              <p className="hidden sm:block text-xs text-gray-400 dark:text-slate-500 mt-1">빌링 소진 크레딧</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm card-depth overflow-hidden min-h-[500px]">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 p-4 flex justify-between items-center">
               <h3 className="text-sm font-black text-gray-900 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2"><Filter size={16} className="text-blue-500" /> 크레딧 트랜잭션 기록</h3>
               <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-800/50 italic">{activeTenant?.name || '로딩 중...'}</div>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex h-[200px] items-center justify-center text-sm text-gray-400 dark:text-slate-500 italic">로딩 중...</div>
              ) : groups.length === 0 ? (
                <div className="flex h-[200px] items-center justify-center text-sm text-gray-400 dark:text-slate-500 italic">등록된 내역이 없습니다.</div>
              ) : (
                <>
                  <div className="md:hidden space-y-3 p-4 bg-gray-50 dark:bg-slate-900/50">
                    {groups.flatMap(g => g.items).map(i => (
                      <div key={i.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm card-depth p-4 space-y-3">
                        <div className="flex justify-between items-start">
                           <p className="text-sm font-black text-gray-900 dark:text-slate-100">{formatSourceType(i.sourceType)}</p>
                           <p className={`text-sm font-black ${i.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                             {i.amount >= 0 ? '+' : ''}{i.amount.toLocaleString()}
                           </p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">거래 일시</p>
                           <p className="text-xs text-gray-600 dark:text-slate-400 tabular-nums">{formatDate(i.createdAt)}</p>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-lg text-[11px] text-gray-600 dark:text-slate-400 leading-relaxed">
                           {i.note || '내용 없음'}
                        </div>
                      </div>
                    ))}
                  </div>
                  <table className="hidden md:table w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-slate-700">
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider text-left bg-gray-50 dark:bg-slate-900">파트너사</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider text-left bg-gray-50 dark:bg-slate-900">유형</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider text-left bg-gray-50 dark:bg-slate-900">내용</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider text-left bg-gray-50 dark:bg-slate-900">일시</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider text-right bg-gray-50 dark:bg-slate-900">거래 금액</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                      {groups.map(g => {
                        const gb = g.items.reduce((s, i) => s + i.amount, 0);
                        return (
                          <Fragment key={g.subtenantId || 'na'}>
                             <tr className="bg-slate-50 dark:bg-slate-700 border-y border-slate-100 dark:border-slate-600">
                               <td colSpan={5} className="px-6 py-2.5">
                                  <div className="flex items-center gap-3">
                                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                     <span className="text-[12px] font-black text-gray-900 dark:text-slate-100 uppercase tracking-tight">{g.subtenantName || '미지정 파트너'}</span>
                                     <span className="text-xs font-bold text-gray-400 dark:text-slate-500">|</span>
                                     <span className="text-[11px] font-bold text-gray-500 dark:text-slate-400">{g.items.length} Transactions</span>
                                     <div className="ml-auto text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500">Subtotal: <span className={gb >= 0 ? 'text-emerald-600' : 'text-red-600'}>{gb >= 0 ? '₩ ' : '- ₩ '}{Math.abs(gb).toLocaleString()}</span></div>
                                  </div>
                               </td>
                             </tr>
                             {g.items.map(i => (
                               <tr key={i.id} className="group hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900 transition-all">
                                 <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-slate-100">{g.subtenantName || '미지정'}</td>
                                 <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${i.amount >= 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                      {formatSourceType(i.sourceType)}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4 text-xs font-bold text-gray-700 dark:text-slate-300">{i.note || '-'}</td>
                                 <td className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-slate-400 tabular-nums">{formatDate(i.createdAt)}</td>
                                 <td className={`px-6 py-4 text-right font-black text-sm tabular-nums ${i.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                   {i.amount >= 0 ? '+ ₩ ' : '- ₩ '}{Math.abs(i.amount).toLocaleString()}
                                 </td>
                               </tr>
                             ))}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
