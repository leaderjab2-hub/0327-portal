'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar, Plus, RotateCcw, Search, Settings, X, Ticket as TicketIcon, Clock, CheckCircle2, MessageSquare, Building2, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type Tenant = { id: string; name: string; };
type TicketStatus = '대기중' | '처리중' | '완료';
type Ticket = { id: number; ticket_number: string; type: string | null; title: string; content: string | null; status: TicketStatus; author_id: string | null; author_name: string | null; tenant_id: string | null; created_at: string | null; updated_at: string | null; };
type TicketLike = Omit<Ticket, 'status'> & { status: string | null; };
type TicketComment = { id: number; ticket_id: number; author_id: string | null; author_name: string | null; content: string | null; created_at: string | null; };
type TicketFormState = { type: string; title: string; content: string; tenantId: string; };

function formatDate(value: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function normalizeTicketStatus(status: string | null | undefined): TicketStatus {
  if (status === '처리중' || status === '완료') return status;
  return '대기중';
}

function normalizeTicket(ticket: TicketLike): Ticket {
  return { ...ticket, status: normalizeTicketStatus(ticket.status) };
}

function TicketModal({ isOpen, tenants, isAdmin, defaultTenantId, saving, onClose, onSubmit }: { isOpen: boolean; tenants: Tenant[]; isAdmin: boolean; defaultTenantId: string; saving: boolean; onClose: () => void; onSubmit: (value: TicketFormState) => Promise<void>; }) {
  const [form, setForm] = useState<TicketFormState>({ type: '기술지원', title: '', content: '', tenantId: defaultTenantId });
  if (!isOpen) return null;
  const isValid = form.title.trim().length > 0 && form.content.trim().length > 0 && form.tenantId.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2 italic"><TicketIcon size={20} className="text-blue-600"/> 티켓 등록</h2>
          <button onClick={onClose} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 transition-colors"><X size={20}/></button>
        </div>
        <div className="p-6 space-y-5 bg-gray-50/50">
           {isAdmin && (
             <div className="space-y-1.5">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">대상 테넌트</span>
               <select className="w-full border border-gray-200 rounded-lg h-11 px-3 text-sm font-bold focus:border-blue-500 outline-none" value={form.tenantId} onChange={e => setForm(p => ({ ...p, tenantId: e.target.value }))}>
                 <option value="">테넌트 선택</option>
                 {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
               </select>
             </div>
           )}
           <div className="space-y-1.5">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">티켓 유형</span>
             <select className="w-full border border-gray-200 rounded-lg h-11 px-3 text-sm font-bold focus:border-blue-500 outline-none" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
               <option value="기술지원">기술지원</option>
               <option value="장애접수">장애접수</option>
               <option value="일반안내">일반안내</option>
             </select>
           </div>
           <div className="space-y-1.5">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">제목</span>
             <input className="w-full border border-gray-200 rounded-lg h-11 px-4 text-sm font-bold focus:border-blue-500 outline-none" placeholder="티켓 제목을 입력하세요" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value.slice(0, 100) }))} />
           </div>
           <div className="space-y-1.5">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">상세 내용</span>
             <textarea className="w-full border border-gray-200 rounded-lg p-4 text-sm font-bold h-40 resize-none focus:border-blue-500 outline-none" placeholder="문의 사항을 상세히 작성해 주세요." value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} />
           </div>
        </div>
        <div className="p-4 bg-white border-t border-gray-100 flex justify-end gap-3">
           <button onClick={onClose} className="px-5 py-2 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors">취소</button>
           <button onClick={() => void onSubmit(form)} disabled={!isValid || saving} className="px-8 py-2 bg-blue-600 rounded-lg text-xs font-black text-white shadow-xl shadow-blue-100 hover:bg-black transition-all active:scale-[0.98]">{saving ? '등록 중...' : '티켓 등록'}</button>
        </div>
      </div>
    </div>
  );
}

export default function TicketsPageClient({ initialTenants = [], initialTickets = [], initialTenantId = null }: { initialTenants?: Tenant[]; initialTickets?: TicketLike[]; initialTenantId?: string | null; }) {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const canCreateTicket = Boolean(currentUser);
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets.map(normalizeTicket));
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [commentDraft, setCommentDraft] = useState('');
  const [loading, setLoading] = useState(initialTickets.length === 0);
  const [saving, setSaving] = useState(false);
  const [commentSaving, setCommentSaving] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<string>(currentUser?.role === 'admin' ? 'all' : initialTenantId ?? 'all');
  const [statusFilter, setStatusFilter] = useState<'전체' | TicketStatus>('전체');
  const [typeFilter, setTypeFilter] = useState<'전체' | '기술지원' | '장애접수' | '일반안내'>('전체');
  const [search, setSearch] = useState('');

  const fetchTenants = async () => {
    const response = await fetch('/api/tenants');
    const payload = (await response.json()) as { data?: Tenant[]; error?: string };
    if (!response.ok) throw new Error(payload.error ?? 'Error');
    const items = payload.data ?? [];
    setTenants(items);
    if (!selectedTenantId || selectedTenantId === 'all') {
      if (currentUser?.role === 'admin') setSelectedTenantId('all');
      else if (items[0]?.id) setSelectedTenantId(items[0].id);
    }
  };

  const fetchTickets = async () => {
    setLoading(true); setErrorMessage(null);
    try {
      const params = new URLSearchParams();
      if (selectedTenantId && selectedTenantId !== 'all') params.set('tenantId', selectedTenantId);
      if (statusFilter !== '전체') params.set('status', statusFilter);
      const response = await fetch(`/api/tickets${params.size > 0 ? `?${params.toString()}` : ''}`);
      const payload = (await response.json()) as { data?: TicketLike[]; error?: string };
      if (!response.ok) throw new Error(payload.error ?? 'Error');
      setTickets((payload.data ?? []).map(normalizeTicket));
    } catch (error) { setErrorMessage("로드 실패"); setTickets([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (initialTenants.length === 0) fetchTenants(); }, [initialTenants.length]);
  useEffect(() => {
    if (initialTickets.length > 0 && selectedTenantId === (initialTenantId ?? 'all') && statusFilter === '전체') {
      setTickets(initialTickets.map(normalizeTicket));
      setLoading(false);
      return;
    }
    fetchTickets();
  }, [initialTenantId, selectedTenantId, statusFilter]);

  const filteredTickets = useMemo(() => {
    const kw = search.trim().toLowerCase();
    return tickets.filter(t => (typeFilter === '전체' || t.type === typeFilter) && (!kw || [t.ticket_number, t.title, t.content ?? '', t.author_name ?? ''].join(' ').toLowerCase().includes(kw)));
  }, [search, tickets, typeFilter]);

  const kpi = useMemo(() => {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return {
      waiting: filteredTickets.filter(t => t.status === '대기중').length,
      processing: filteredTickets.filter(t => t.status === '처리중').length,
      completed: filteredTickets.filter(t => t.status === '완료').length
    };
  }, [filteredTickets]);

  const loadComments = async (ticketId: number) => {
    const r = await fetch(`/api/tickets/${ticketId}/comments`);
    const p = await r.json();
    if (!r.ok) throw new Error(p.error || 'Error');
    setComments(p.data ?? []);
  };

  const handleSelectTicket = async (ticket: Ticket) => {
    setSelectedTicket(ticket); setCommentDraft('');
    try { await loadComments(ticket.id); } catch(e) { setComments([]); }
  };

  const handleStatusChange = async (status: TicketStatus) => {
    if (!selectedTicket) return;
    setStatusSaving(true);
    try {
      const r = await fetch(`/api/tickets/${selectedTicket.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      const p = await r.json();
      if (!r.ok) throw new Error(p.error);
      if (p.data) setSelectedTicket(p.data);
      await fetchTickets();
    } finally { setStatusSaving(false); }
  };

  const handleCommentSubmit = async () => {
    if (!selectedTicket || !commentDraft.trim()) return;
    setCommentSaving(true);
    try {
      const r = await fetch(`/api/tickets/${selectedTicket.id}/comments`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ content:commentDraft }) });
      if (!r.ok) throw new Error('Failed');
      setCommentDraft(''); await loadComments(selectedTicket.id); await fetchTickets();
    } finally { setCommentSaving(false); }
  };

  const defaultTenantId = currentUser?.role === 'admin' ? tenants[0]?.id ?? '' : currentUser?.tenantId ?? tenants[0]?.id ?? '';

  return (
    <div className="flex h-full flex-col bg-[#F8FAFC]">
      <TicketModal isOpen={modalOpen} tenants={tenants} isAdmin={isAdmin} defaultTenantId={defaultTenantId} saving={saving} onClose={() => setModalOpen(false)} onSubmit={async f => { setSaving(true); try { const r = await fetch('/api/tickets', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(f) }); const p = await r.json(); if(r.ok) { setModalOpen(false); await fetchTickets(); if(p.data) handleSelectTicket(p.data); } } finally { setSaving(false); } }} />

      <div className="flex-1 overflow-y-auto w-full">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-8 space-y-6">
          {selectedTicket ? (
            <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-8 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <button onClick={() => setSelectedTicket(null)} className="mb-6 self-start rounded-full border border-gray-100 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all">&larr; 목록으로 돌아가기</button>
              <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-6">
                <div className="flex items-center gap-4">
                  <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-black text-blue-600 border border-blue-100 uppercase italic whitespace-nowrap">{selectedTicket.type ?? '기술지원'}</span>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">{selectedTicket.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  {isAdmin ? (
                    <select value={selectedTicket.status} onChange={e => handleStatusChange(e.target.value as TicketStatus)} disabled={statusSaving} className={`h-9 rounded-full border-none px-4 text-[11px] font-black uppercase tracking-wider outline-none cursor-pointer focus:ring-2 focus:ring-blue-100 ${selectedTicket.status==='완료'?'bg-emerald-50 text-emerald-700':selectedTicket.status==='처리중'?'bg-blue-50 text-blue-700':'bg-amber-50 text-amber-700'}`}>
                      <option value="대기중">대기중</option>
                      <option value="처리중">처리중</option>
                      <option value="완료">완료</option>
                    </select>
                  ) : (
                    <span className={`rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-wider ${selectedTicket.status==='완료'?'bg-emerald-50 text-emerald-700':selectedTicket.status==='처리중'?'bg-blue-50 text-blue-700':'bg-amber-50 text-amber-700'}`}>{selectedTicket.status}</span>
                  )}
                </div>
              </div>
              <div className="mb-8 flex flex-wrap items-center gap-6 text-[11px] font-bold text-gray-400 tracking-tight uppercase">
                <div className="flex items-center gap-1.5"><TicketIcon size={14}/><span className="text-gray-900 font-mono font-black">{selectedTicket.ticket_number}</span></div>
                <div className="flex items-center gap-1.5"><User size={14}/><span className="text-gray-900">{selectedTicket.author_name}</span></div>
                <div className="flex items-center gap-1.5"><Clock size={14}/><span className="font-mono">{formatDate(selectedTicket.created_at)}</span></div>
              </div>
              <div className="mb-8 min-h-[220px] rounded-xl border border-gray-100 bg-gray-50/50 p-8 text-[14px] leading-relaxed text-gray-800 whitespace-pre-wrap font-medium">{selectedTicket.content}</div>
              <div className="border-t border-gray-100 pt-8">
                <h3 className="mb-6 text-[13px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">댓글 <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-400">{comments.length}</span></h3>
                <div className="mb-8 space-y-4">
                  {comments.length === 0 ? <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-xs font-bold text-gray-400 italic">등록된 댓글이 없습니다.</div> : comments.map(c => (
                    <div key={c.id} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-blue-50 text-[11px] font-black text-blue-600 flex items-center justify-center border border-blue-100 uppercase">{(c.author_name||'?')[0]}</div><span className="text-[12px] font-black text-gray-900">{c.author_name}</span></div>
                        <span className="text-[10px] font-mono font-bold text-gray-400">{formatDate(c.created_at)}</span>
                      </div>
                      <p className="pl-10 text-[13px] font-medium text-gray-700 leading-relaxed">{c.content}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
                  <textarea value={commentDraft} onChange={e => setCommentDraft(e.target.value)} placeholder="답변 내용을 입력하세요..." className="mb-4 h-24 w-full rounded-xl border border-gray-200 bg-white p-4 text-sm font-medium focus:border-blue-500 outline-none transition-all shadow-inner" />
                  <div className="flex justify-end"><button onClick={handleCommentSubmit} disabled={!commentDraft.trim() || commentSaving} className="px-8 py-2.5 bg-blue-600 rounded-lg text-xs font-black text-white hover:bg-black transition-all shadow-xl shadow-blue-100 active:scale-[0.98]">{commentSaving ? '등록 중...' : '댓글 등록'}</button></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"><div className="flex items-center gap-2 mb-3"><div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><Clock size={16} className="text-amber-500" /></div><span className="text-sm font-bold text-gray-500 uppercase tracking-wider">대기중</span></div><p className="text-2xl font-black text-gray-900 font-mono tracking-tighter">{kpi.waiting}</p></div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"><div className="flex items-center gap-2 mb-3"><div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><MessageSquare size={16} className="text-blue-500" /></div><span className="text-sm font-bold text-gray-500 uppercase tracking-wider">처리중</span></div><p className="text-2xl font-black text-gray-900 font-mono tracking-tighter">{kpi.processing}</p></div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"><div className="flex items-center gap-2 mb-3"><div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><CheckCircle2 size={16} className="text-emerald-500" /></div><span className="text-sm font-bold text-gray-500 uppercase tracking-wider">완료</span></div><p className="text-2xl font-black text-gray-900 font-mono tracking-tighter">{kpi.completed}</p></div>
              </div>

              <div className="flex h-[48px] shrink-0 items-center justify-between bg-white px-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                   {isAdmin && (
                     <select value={selectedTenantId} onChange={e => setSelectedTenantId(e.target.value)} className="h-8 rounded-full border border-gray-200 bg-white px-3 text-[11px] font-black text-gray-600 outline-none w-32 focus:w-44 transition-all">
                       <option value="all">전체 회사</option>
                       {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                     </select>
                   )}
                   <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)} className="h-8 rounded-full border border-gray-200 bg-white px-3 text-[11px] font-black text-gray-600 outline-none w-28">
                     <option value="전체">전체 유형</option>
                     <option value="기술지원">기술지원</option>
                     <option value="장애접수">장애접수</option>
                     <option value="일반안내">일반안내</option>
                   </select>
                   <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="h-8 rounded-full border border-gray-200 bg-white px-3 text-[11px] font-black text-gray-600 outline-none w-28">
                     <option value="전체">전체 상태</option>
                     <option value="대기중">대기중</option>
                     <option value="처리중">처리중</option>
                     <option value="완료">완료</option>
                   </select>
                </div>
                <div className="flex items-center gap-3 pl-4">
                  <Search size={14} className="text-gray-400" />
                  <input className="h-8 w-32 rounded-full border border-gray-200 bg-white px-3 text-[11px] font-black tracking-tight transition-all focus:w-56 focus:border-blue-300 outline-none" placeholder="제목 검색..." value={search} onChange={e => setSearch(e.target.value)} />
                  <div className="h-4 w-px bg-gray-200 mx-1" />
                  <button onClick={() => { setSearch(''); setTypeFilter('전체'); setStatusFilter('전체'); setSelectedTenantId(isAdmin ? 'all' : currentUser?.tenantId ?? 'all'); fetchTickets(); }} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"><RotateCcw size={16}/></button>
                  {canCreateTicket && (
                    <button onClick={() => setModalOpen(true)} className="flex h-8 items-center gap-1.5 px-4 bg-blue-600 rounded-full text-[10px] font-black uppercase text-white shadow-lg shadow-blue-100 hover:bg-black transition-all">
                      <Plus size={14}/> 티켓 등록
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
                   <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2"><TicketIcon size={14} className="text-blue-500" /> 티켓 목록</h3>
                   <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter italic">총 티켓 수: {filteredTickets.length}</div>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-left bg-gray-50/50">유형</th>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-left bg-gray-50/50">티켓 ID</th>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-left bg-gray-50/50">제목</th>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-left bg-gray-50/50">상태</th>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-left bg-gray-50/50">작성자</th>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right bg-gray-50/50">등록일시</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {loading ? <tr><td colSpan={6} className="py-20 text-center text-xs font-bold text-gray-400 italic">티켓을 불러오는 중...</td></tr> : filteredTickets.length === 0 ? <tr><td colSpan={6} className="py-20 text-center text-xs font-bold text-gray-400 italic">표시할 티켓이 없습니다.</td></tr> : filteredTickets.map(t => (
                          <tr key={t.id} onClick={() => handleSelectTicket(t)} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                             <td className="px-6 py-4"><span className="text-[11px] font-black text-gray-900 uppercase italic">{t.type ?? 'Default'}</span></td>
                             <td className="px-6 py-4 font-mono text-[11px] font-black text-gray-400">{t.ticket_number}</td>
                             <td className="px-6 py-4 text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{t.title}</td>
                             <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${t.status==='완료'?'bg-emerald-50 text-emerald-700 border-emerald-100':t.status==='처리중'?'bg-blue-50 text-blue-700 border-blue-100':'bg-amber-50 text-amber-700 border-amber-100'}`}>{t.status}</span></td>
                             <td className="px-6 py-4 text-xs font-bold text-gray-500">{t.author_name}</td>
                             <td className="px-6 py-4 text-right font-mono text-[11px] font-bold text-gray-400">{formatDate(t.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
