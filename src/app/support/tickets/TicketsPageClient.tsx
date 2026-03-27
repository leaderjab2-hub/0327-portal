'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar, Plus, RotateCcw, Search, Settings, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type Tenant = {
  id: string;
  name: string;
};

type TicketStatus = '대기중' | '처리중' | '완료';

type Ticket = {
  id: number;
  ticket_number: string;
  type: string | null;
  title: string;
  content: string | null;
  status: TicketStatus;
  author_id: string | null;
  author_name: string | null;
  tenant_id: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type TicketComment = {
  id: number;
  ticket_id: number;
  author_id: string | null;
  author_name: string | null;
  content: string | null;
  created_at: string | null;
};

type TicketFormState = {
  type: string;
  title: string;
  content: string;
  tenantId: string;
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

function getStatusBadgeClass(status: string | null) {
  if (status === '처리중') {
    return 'bg-primary-50 text-primary-600';
  }

  if (status === '완료') {
    return 'bg-[#ECFDF5] text-[#059669]';
  }

  return 'bg-[#FFFBEB] text-[#D97706]';
}

function TicketModal({
  isOpen,
  tenants,
  isAdmin,
  defaultTenantId,
  saving,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  tenants: Tenant[];
  isAdmin: boolean;
  defaultTenantId: string;
  saving: boolean;
  onClose: () => void;
  onSubmit: (value: TicketFormState) => Promise<void>;
}) {
  const [form, setForm] = useState<TicketFormState>({
    type: '기술지원',
    title: '',
    content: '',
    tenantId: defaultTenantId,
  });

  if (!isOpen) {
    return null;
  }

  const isValid = form.title.trim().length > 0 && form.content.trim().length > 0 && form.tenantId.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[16px] bg-white p-4 shadow-2xl sm:p-6">
        <div className="mb-5 flex items-center justify-between sm:mb-6">
          <h2 className="text-[18px] font-extrabold text-gray-900 sm:text-[20px]">티켓 등록</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {isAdmin ? (
            <div>
              <label className="mb-1.5 block text-[13px] font-bold text-gray-700">회사</label>
              <select
                value={form.tenantId}
                onChange={(event) => setForm((previous) => ({ ...previous, tenantId: event.target.value }))}
                className="w-full rounded-[10px] border border-gray-200 p-3 text-[13px] font-medium text-gray-900 focus:border-primary-500 focus:outline-none"
              >
                <option value="">회사 선택</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div>
            <label className="mb-1.5 block text-[13px] font-bold text-gray-700">유형</label>
            <select
              value={form.type}
              onChange={(event) => setForm((previous) => ({ ...previous, type: event.target.value }))}
              className="w-full rounded-[10px] border border-gray-200 p-3 text-[13px] font-medium text-gray-900 focus:border-primary-500 focus:outline-none"
            >
              <option value="기술지원">기술지원</option>
              <option value="장애접수">장애접수</option>
              <option value="일반안내">일반안내</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-bold text-gray-700">제목</label>
            <input
              value={form.title}
              onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value.slice(0, 100) }))}
              className="w-full rounded-[10px] border border-gray-200 p-3 text-[13px] font-medium text-gray-900 focus:border-primary-500 focus:outline-none"
              placeholder="제목을 입력하세요"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-bold text-gray-700">내용</label>
            <textarea
              value={form.content}
              onChange={(event) => setForm((previous) => ({ ...previous, content: event.target.value }))}
              className="h-[160px] w-full resize-none rounded-[10px] border border-gray-200 p-3 text-[13px] font-medium text-gray-900 focus:border-primary-500 focus:outline-none sm:h-[180px] sm:p-4"
              placeholder="문의 또는 지원이 필요한 내용을 입력하세요"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2.5 border-t border-gray-100 pt-4 sm:mt-6 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-[10px] border border-gray-200 px-5 py-2.5 text-[13px] font-bold text-gray-600 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={() => void onSubmit(form)}
            disabled={!isValid || saving}
            className="rounded-[10px] bg-primary-600 px-6 py-2.5 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            {saving ? '등록 중...' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
}

type TicketsPageClientProps = {
  initialTenants?: Tenant[];
  initialTickets?: Ticket[];
  initialTenantId?: string | null;
};

export default function TicketsPageClient({
  initialTenants = [],
  initialTickets = [],
  initialTenantId = null,
}: TicketsPageClientProps) {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const canCreateTicket = Boolean(currentUser);

  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [commentDraft, setCommentDraft] = useState('');
  const [loading, setLoading] = useState(initialTickets.length === 0);
  const [saving, setSaving] = useState(false);
  const [commentSaving, setCommentSaving] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<string>(
    currentUser?.role === 'admin' ? 'all' : initialTenantId ?? 'all',
  );
  const [statusFilter, setStatusFilter] = useState<'전체' | TicketStatus>('전체');
  const [typeFilter, setTypeFilter] = useState<'전체' | '기술지원' | '장애접수' | '일반안내'>('전체');
  const [search, setSearch] = useState('');

  const fetchTenants = async () => {
    const response = await fetch('/api/tenants');
    const payload = (await response.json()) as { data?: Tenant[]; error?: string };

    if (!response.ok) {
      throw new Error(payload.error ?? '회사 목록을 불러오지 못했습니다.');
    }

    const items = payload.data ?? [];
    setTenants(items);

    if (!selectedTenantId || selectedTenantId === 'all') {
      if (currentUser?.role === 'admin') {
        setSelectedTenantId('all');
      } else if (items[0]?.id) {
        setSelectedTenantId(items[0].id);
      }
    }
  };

  const fetchTickets = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const params = new URLSearchParams();

      if (selectedTenantId && selectedTenantId !== 'all') {
        params.set('tenantId', selectedTenantId);
      }

      if (statusFilter !== '전체') {
        params.set('status', statusFilter);
      }

      const response = await fetch(`/api/tickets${params.size > 0 ? `?${params.toString()}` : ''}`);
      const payload = (await response.json()) as { data?: Ticket[]; error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? '티켓을 불러오지 못했습니다.');
      }

      setTickets(payload.data ?? []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '티켓을 불러오지 못했습니다.');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTenants.length > 0) {
      return;
    }

    void fetchTenants().catch((error: unknown) => {
      setErrorMessage(error instanceof Error ? error.message : '회사 목록을 불러오지 못했습니다.');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTenants.length]);

  useEffect(() => {
    if (
      initialTickets.length > 0 &&
      (selectedTenantId === (initialTenantId ?? 'all') || (currentUser?.role === 'admin' && selectedTenantId === 'all')) &&
      statusFilter === '전체'
    ) {
      return;
    }

    void fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.role, initialTenantId, initialTickets.length, selectedTenantId, statusFilter]);

  const filteredTickets = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesType = typeFilter === '전체' || ticket.type === typeFilter;
      const matchesSearch = !keyword
        || [ticket.ticket_number, ticket.title, ticket.content ?? '', ticket.author_name ?? '']
          .join(' ')
          .toLowerCase()
          .includes(keyword);

      return matchesType && matchesSearch;
    });
  }, [search, tickets, typeFilter]);

  const kpi = useMemo(() => {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    return {
      waiting: filteredTickets.filter((ticket) => ticket.status === '대기중').length,
      processing: filteredTickets.filter((ticket) => ticket.status === '처리중').length,
      completedRecently: filteredTickets.filter((ticket) => {
        return ticket.status === '완료' && ticket.updated_at && now - new Date(ticket.updated_at).getTime() <= sevenDays;
      }).length,
    };
  }, [filteredTickets]);

  const loadComments = async (ticketId: number) => {
    const response = await fetch(`/api/tickets/${ticketId}/comments`);
    const payload = (await response.json()) as { data?: TicketComment[]; error?: string };

    if (!response.ok) {
      throw new Error(payload.error ?? '댓글을 불러오지 못했습니다.');
    }

    setComments(payload.data ?? []);
  };

  const handleSelectTicket = async (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setCommentDraft('');

    try {
      await loadComments(ticket.id);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '댓글을 불러오지 못했습니다.');
      setComments([]);
    }
  };

  const handleCreateTicket = async (form: TicketFormState) => {
    setSaving(true);

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = (await response.json()) as { data?: Ticket; error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? '티켓 등록에 실패했습니다.');
      }

      setModalOpen(false);
      await fetchTickets();

      if (payload.data) {
        await handleSelectTicket(payload.data);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '티켓 등록에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!selectedTicket || !commentDraft.trim()) {
      return;
    }

    setCommentSaving(true);

    try {
      const response = await fetch(`/api/tickets/${selectedTicket.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentDraft }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? '댓글 등록에 실패했습니다.');
      }

      setCommentDraft('');
      await loadComments(selectedTicket.id);
      await fetchTickets();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '댓글 등록에 실패했습니다.');
    } finally {
      setCommentSaving(false);
    }
  };

  const handleStatusChange = async (status: TicketStatus) => {
    if (!selectedTicket) {
      return;
    }

    setStatusSaving(true);

    try {
      const response = await fetch(`/api/tickets/${selectedTicket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const payload = (await response.json()) as { data?: Ticket; error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? '상태 변경에 실패했습니다.');
      }

      if (payload.data) {
        setSelectedTicket(payload.data);
      }

      await fetchTickets();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '상태 변경에 실패했습니다.');
    } finally {
      setStatusSaving(false);
    }
  };

  const defaultTenantId =
    currentUser?.role === 'admin'
      ? tenants[0]?.id ?? ''
      : currentUser?.tenantId ?? tenants[0]?.id ?? '';

  return (
    <div className="flex h-full flex-col gap-6">
      <TicketModal
        key={`${modalOpen ? 'open' : 'closed'}-${defaultTenantId}`}
        isOpen={modalOpen}
        tenants={tenants}
        isAdmin={isAdmin}
        defaultTenantId={defaultTenantId}
        saving={saving}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateTicket}
      />

      {selectedTicket ? (
        <div className="flex flex-1 flex-col rounded-[12px] border border-gray-200 bg-white p-8 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
          <button
            onClick={() => setSelectedTicket(null)}
            className="mb-6 self-start rounded-lg border border-gray-200 px-4 py-2 text-[13px] font-bold text-gray-600 hover:bg-gray-50"
          >
            &larr; 목록으로 돌아가기
          </button>

          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="rounded-[6px] bg-gray-100 px-2.5 py-1 text-[12px] font-bold text-gray-600">
                {selectedTicket.type ?? '기술지원'}
              </span>
              <h2 className="text-[24px] font-extrabold text-gray-900">{selectedTicket.title}</h2>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <select
                  value={selectedTicket.status}
                  onChange={(event) => void handleStatusChange(event.target.value as TicketStatus)}
                  disabled={statusSaving}
                  className={`h-[36px] rounded-[8px] border-none px-3 text-[13px] font-bold outline-none ${getStatusBadgeClass(selectedTicket.status)}`}
                >
                  <option value="대기중">대기중</option>
                  <option value="처리중">처리중</option>
                  <option value="완료">완료</option>
                </select>
              ) : (
                <span className={`rounded-[6px] px-3 py-1.5 text-[13px] font-bold ${getStatusBadgeClass(selectedTicket.status)}`}>
                  {selectedTicket.status}
                </span>
              )}
            </div>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-gray-200 pb-6 text-[13px] font-medium text-gray-500">
            <span>티켓 ID: <span className="font-mono font-bold text-gray-900">{selectedTicket.ticket_number}</span></span>
            <div className="h-[12px] w-[1px] bg-gray-300" />
            <span>작성자: <span className="text-gray-900">{selectedTicket.author_name ?? '-'}</span></span>
            <div className="h-[12px] w-[1px] bg-gray-300" />
            <span>등록 일시: <span className="font-mono">{formatDate(selectedTicket.created_at)}</span></span>
          </div>

          <div className="mb-8 min-h-[220px] rounded-[8px] border border-gray-100 bg-[#FAFAFA] p-6 text-[14px] leading-relaxed text-gray-800 whitespace-pre-wrap">
            {selectedTicket.content || '상세 내용이 없습니다.'}
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h3 className="mb-5 text-[14px] font-bold text-gray-900">
              댓글 <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[12px] text-gray-600">{comments.length}</span>
            </h3>

            <div className="mb-6 space-y-4">
              {comments.length === 0 ? (
                <div className="rounded-[10px] border border-dashed border-gray-200 px-4 py-8 text-center text-[13px] text-gray-400">
                  등록된 댓글이 없습니다.
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="rounded-[12px] border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-[12px] font-bold text-primary-600">
                          {(comment.author_name ?? '?').slice(0, 1)}
                        </div>
                        <span className="text-[13px] font-bold text-gray-900">{comment.author_name ?? '-'}</span>
                      </div>
                      <span className="text-[11px] font-mono text-gray-400">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="pl-10 text-[13px] leading-relaxed text-gray-700">{comment.content ?? ''}</p>
                  </div>
                ))
              )}
            </div>

            <div className="rounded-[12px] border border-gray-200 bg-gray-50 p-5">
              <textarea
                value={commentDraft}
                onChange={(event) => setCommentDraft(event.target.value)}
                placeholder="댓글을 입력하세요"
                className="mb-3 h-[100px] w-full resize-none rounded-[8px] border border-gray-200 bg-white p-4 text-[13px] text-gray-900 focus:border-primary-500 focus:outline-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => void handleCommentSubmit()}
                  disabled={!commentDraft.trim() || commentSaving}
                  className="rounded-[8px] bg-primary-600 px-6 py-2.5 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                >
                  {commentSaving ? '등록 중...' : '댓글 등록'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between rounded-[10px] border border-gray-200 bg-white p-[16px_20px] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wide text-gray-500">대기중</h3>
                <p className="mt-1 text-[12px] font-medium text-gray-400">접수 후 대기중 티켓</p>
              </div>
              <div className="font-mono text-[32px] font-extrabold text-amber-500">{kpi.waiting}</div>
            </div>
            <div className="flex items-center justify-between rounded-[10px] border border-gray-200 bg-white p-[16px_20px] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wide text-gray-500">처리중</h3>
                <p className="mt-1 text-[12px] font-medium text-gray-400">진행중인 티켓</p>
              </div>
              <div className="font-mono text-[32px] font-extrabold text-primary-600">{kpi.processing}</div>
            </div>
            <div className="flex items-center justify-between rounded-[10px] border border-gray-200 bg-white p-[16px_20px] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wide text-gray-500">완료</h3>
                <p className="mt-1 text-[12px] font-medium text-gray-400">최근 7일 기준 완료</p>
              </div>
              <div className="font-mono text-[32px] font-extrabold text-emerald-600">{kpi.completedRecently}</div>
            </div>
          </div>

          <div className="rounded-[14px] border border-gray-200 bg-white p-4 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center justify-between md:border-r md:border-gray-200 md:pr-5">
                <div className="text-[14px] font-bold text-gray-900">
                  티켓 목록 <span className="ml-2 font-normal text-gray-400">Total {filteredTickets.length}</span>
                </div>
                <button className="md:hidden rounded-[7px] p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-900">
                  <Settings size={18} />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-3 md:px-5">
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-4">
                  {isAdmin ? (
                    <select
                      value={selectedTenantId}
                      onChange={(event) => setSelectedTenantId(event.target.value)}
                      className="h-[36px] rounded-[8px] border border-gray-200 px-3 text-[13px] focus:border-primary-500 focus:outline-none"
                    >
                      <option value="all">전체 회사</option>
                      {tenants.map((tenant) => (
                        <option key={tenant.id} value={tenant.id}>
                          {tenant.name}
                        </option>
                      ))}
                    </select>
                  ) : null}

                  <select
                    value={typeFilter}
                    onChange={(event) => setTypeFilter(event.target.value as typeof typeFilter)}
                    className="h-[36px] rounded-[8px] border border-gray-200 px-3 text-[13px] focus:border-primary-500 focus:outline-none"
                  >
                    <option value="전체">전체 유형</option>
                    <option value="기술지원">기술지원</option>
                    <option value="장애접수">장애접수</option>
                    <option value="일반안내">일반안내</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value as '전체' | TicketStatus)}
                    className="h-[36px] rounded-[8px] border border-gray-200 px-3 text-[13px] focus:border-primary-500 focus:outline-none"
                  >
                    <option value="전체">전체 상태</option>
                    <option value="대기중">대기중</option>
                    <option value="처리중">처리중</option>
                    <option value="완료">완료</option>
                  </select>

                  <div className="flex items-center gap-2 rounded-[8px] border border-gray-200 bg-white px-3 h-[36px]">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="truncate text-[12px] font-mono text-gray-500">최근 순 정렬</span>
                  </div>
                </div>

                <div className="relative md:max-w-[260px]">
                  <Search size={14} className="absolute left-3 top-[11px] text-gray-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="제목 검색"
                    className="h-[36px] w-full rounded-[8px] border border-gray-200 pl-8 pr-3 text-[13px] focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-gray-50 pt-3 md:border-none md:pt-0">
                <button
                  onClick={() => {
                    setSearch('');
                    setTypeFilter('전체');
                    setStatusFilter('전체');
                    setSelectedTenantId(isAdmin ? 'all' : currentUser?.tenantId ?? 'all');
                    void fetchTickets();
                  }}
                  className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-gray-200 text-gray-500 hover:bg-gray-50"
                >
                  <RotateCcw size={14} />
                </button>
                {canCreateTicket ? (
                  <button
                    onClick={() => setModalOpen(true)}
                    className="flex h-[36px] items-center justify-center gap-1.5 whitespace-nowrap rounded-[8px] bg-primary-600 px-4 text-[13px] font-bold text-white hover:bg-primary-700"
                  >
                    <Plus size={14} />
                    티켓 등록
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-600">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex h-full flex-col overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
            <div className="overflow-x-auto">
              <table className="min-w-[880px] w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-[#FAFAFA]">
                    <th className="px-[20px] py-[14px] text-[12px] font-bold uppercase tracking-wide text-gray-500 whitespace-nowrap">유형</th>
                    <th className="px-[20px] py-[14px] text-[12px] font-bold uppercase tracking-wide text-gray-500 whitespace-nowrap">티켓 ID</th>
                    <th className="min-w-[220px] whitespace-nowrap px-[20px] py-[14px] text-[12px] font-bold uppercase tracking-wide text-gray-500">제목</th>
                    <th className="px-[20px] py-[14px] text-[12px] font-bold uppercase tracking-wide text-gray-500 whitespace-nowrap">상태</th>
                    <th className="px-[20px] py-[14px] text-[12px] font-bold uppercase tracking-wide text-gray-500 whitespace-nowrap">작성자</th>
                    <th className="px-[20px] py-[14px] text-[12px] font-bold uppercase tracking-wide text-gray-500 whitespace-nowrap">등록 일시</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-14 text-center text-[13px] text-gray-400">
                        티켓을 불러오는 중입니다.
                      </td>
                    </tr>
                  ) : filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-14 text-center text-[13px] text-gray-400">
                        표시할 티켓이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        onClick={() => void handleSelectTicket(ticket)}
                        className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50/60"
                      >
                        <td className="px-[20px] py-[16px] text-[13px] font-bold text-gray-900 whitespace-nowrap">
                          {ticket.type ?? '-'}
                        </td>
                        <td className="px-[20px] py-[16px] font-mono text-[12px] text-gray-500 whitespace-nowrap">
                          {ticket.ticket_number}
                        </td>
                        <td className="px-[20px] py-[16px] text-[13px] font-bold text-gray-900 whitespace-nowrap">
                          {ticket.title}
                        </td>
                        <td className="px-[20px] py-[16px] whitespace-nowrap">
                          <span className={`rounded-[5px] px-2.5 py-1 text-[11px] font-bold ${getStatusBadgeClass(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-[20px] py-[16px] text-[13px] font-medium text-gray-600 whitespace-nowrap">
                          {ticket.author_name ?? '-'}
                        </td>
                        <td className="px-[20px] py-[16px] font-mono text-[12px] text-gray-500 whitespace-nowrap">
                          {formatDate(ticket.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
