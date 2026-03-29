'use client';

import { useEffect, useMemo, useState } from 'react';
import { MoreVertical, Pencil, Plus, RotateCcw, Search, Settings, Trash2, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type NoticeType = '일반' | '점검' | '업데이트';

type Notice = {
  id: number;
  type: NoticeType;
  title: string;
  content: string | null;
  author_id: string | null;
  author_name: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type NoticeLike = Omit<Notice, 'type'> & {
  type: string | null;
};

type NoticeFormState = {
  type: NoticeType;
  title: string;
  content: string;
};

const PAGE_SIZE = 10;

function normalizeNoticeType(type: string | null | undefined): NoticeType {
  if (type === '점검' || type === '업데이트') {
    return type;
  }

  return '일반';
}

function normalizeNotice(notice: NoticeLike): Notice {
  return {
    ...notice,
    type: normalizeNoticeType(notice.type),
  };
}

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

function getTypeBadgeClass(type: string) {
  if (type === '점검') {
    return 'bg-[#FFFBEB] text-[#D97706]';
  }

  if (type === '업데이트') {
    return 'bg-primary-50 text-primary-600';
  }

  return 'bg-[#F3F4F6] text-gray-600 dark:bg-slate-600 dark:text-slate-100';
}

function NoticeModal({
  isOpen,
  mode,
  initialValue,
  onClose,
  onSubmit,
  saving,
}: {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialValue: NoticeFormState;
  onClose: () => void;
  onSubmit: (value: NoticeFormState) => Promise<void>;
  saving: boolean;
}) {
  const [form, setForm] = useState<NoticeFormState>(initialValue);

  useEffect(() => {
    setForm(initialValue);
  }, [initialValue]);

  if (!isOpen) {
    return null;
  }

  const isValid = form.title.trim().length > 0 && form.content.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[16px] bg-white dark:bg-slate-800 p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between sm:mb-6">
          <h2 className="text-[18px] font-extrabold text-gray-900 dark:text-slate-100 sm:text-[20px]">
            {mode === 'create' ? '공지사항 작성' : '공지사항 수정'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900 hover:text-gray-700 dark:text-slate-300">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-bold text-gray-700 dark:text-slate-300">유형</label>
            <select
              value={form.type}
              onChange={(event) => setForm((previous) => ({ ...previous, type: event.target.value as NoticeType }))}
              className="w-full rounded-[10px] border border-gray-200 dark:border-slate-700 p-3 text-[13px] font-medium text-gray-900 dark:text-slate-100 focus:border-primary-500 focus:outline-none"
            >
              <option value="일반">일반</option>
              <option value="점검">점검</option>
              <option value="업데이트">업데이트</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-bold text-gray-700 dark:text-slate-300">제목</label>
            <input
              value={form.title}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, title: event.target.value.slice(0, 100) }))
              }
              className="w-full rounded-[10px] border border-gray-200 dark:border-slate-700 p-3 text-[13px] font-medium text-gray-900 dark:text-slate-100 focus:border-primary-500 focus:outline-none"
              placeholder="제목을 입력하세요"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-bold text-gray-700 dark:text-slate-300">내용</label>
            <textarea
              value={form.content}
              onChange={(event) => setForm((previous) => ({ ...previous, content: event.target.value }))}
              className="h-[200px] w-full resize-none rounded-[10px] border border-gray-200 dark:border-slate-700 p-3 text-[13px] font-medium text-gray-900 dark:text-slate-100 focus:border-primary-500 focus:outline-none sm:h-[240px] sm:p-4"
              placeholder="공지 내용을 입력하세요"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2.5 border-t border-gray-100 dark:border-slate-700 pt-4 sm:mt-6 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-[10px] border border-gray-200 dark:border-slate-700 px-5 py-2.5 text-[13px] font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900"
          >
            취소
          </button>
          <button
            onClick={() => void onSubmit(form)}
            disabled={!isValid || saving}
            className="rounded-[10px] bg-primary-600 px-6 py-2.5 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 dark:text-slate-500"
          >
            {saving ? '저장 중...' : mode === 'create' ? '공지 등록' : '수정 저장'}
          </button>
        </div>
      </div>
    </div>
  );
}

type NoticesPageClientProps = {
  initialNotices?: NoticeLike[];
};

export default function NoticesPageClient({ initialNotices = [] }: NoticesPageClientProps) {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  const [notices, setNotices] = useState<Notice[]>(initialNotices.map(normalizeNotice));
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(initialNotices.length === 0);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'전체' | NoticeType>('전체');
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchNotices = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const params = new URLSearchParams();

      if (typeFilter !== '전체') {
        params.set('type', typeFilter);
      }

      const response = await fetch(`/api/notices${params.size > 0 ? `?${params.toString()}` : ''}`);
      const payload = (await response.json()) as { data?: NoticeLike[]; error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? '공지사항을 불러오지 못했습니다.');
      }

      setNotices((payload.data ?? []).map(normalizeNotice));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '공지사항을 불러오지 못했습니다.');
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeFilter === '전체' && initialNotices.length > 0) {
      return;
    }

    void fetchNotices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialNotices.length, typeFilter]);

  const filteredNotices = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return notices;
    }

    return notices.filter((notice) => {
      return [notice.title, notice.content ?? '', notice.author_name ?? '']
        .join(' ')
        .toLowerCase()
        .includes(keyword);
    });
  }, [notices, search]);

  const totalPages = Math.max(1, Math.ceil(filteredNotices.length / PAGE_SIZE));
  const pagedNotices = filteredNotices.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, notices.length]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const openCreateModal = () => {
    setModalMode('create');
    setEditingNotice(null);
    setModalOpen(true);
  };

  const openEditModal = (notice: Notice) => {
    setModalMode('edit');
    setEditingNotice(notice);
    setModalOpen(true);
  };

  const handleSubmit = async (form: NoticeFormState) => {
    setSaving(true);

    try {
      const response = await fetch(modalMode === 'create' ? '/api/notices' : `/api/notices/${editingNotice?.id ?? ''}`, {
        method: modalMode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { data?: Notice; error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? '저장에 실패했습니다.');
      }

      await fetchNotices();
      setModalOpen(false);

      if (payload.data) {
        setSelectedNotice(payload.data);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (noticeId: number) => {
    if (!window.confirm('이 공지사항을 삭제할까요?')) {
      return;
    }

    try {
      const response = await fetch(`/api/notices/${noticeId}`, { method: 'DELETE' });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? '삭제에 실패했습니다.');
      }

      if (selectedNotice?.id === noticeId) {
        setSelectedNotice(null);
      }

      await fetchNotices();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '삭제에 실패했습니다.');
    }
  };

  const modalValue: NoticeFormState = editingNotice
    ? {
        type: editingNotice.type,
        title: editingNotice.title,
        content: editingNotice.content ?? '',
      }
    : {
        type: '일반',
        title: '',
        content: '',
      };

  return (
    <div className="flex h-full flex-col gap-6">
      <NoticeModal
        isOpen={modalOpen}
        mode={modalMode}
        initialValue={modalValue}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        saving={saving}
      />

      {selectedNotice ? (
        <div className="flex flex-1 flex-col rounded-[12px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setSelectedNotice(null)}
              className="rounded-lg border border-gray-200 dark:border-slate-700 px-4 py-2 text-[13px] font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900"
            >
              &larr; 목록으로 돌아가기
            </button>
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(selectedNotice)}
                  className="rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 text-[13px] font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900"
                >
                  수정
                </button>
                <button
                  onClick={() => void handleDelete(selectedNotice.id)}
                  className="rounded-lg border border-rose-200 px-3 py-2 text-[13px] font-bold text-rose-600 hover:bg-rose-50"
                >
                  삭제
                </button>
              </div>
            ) : null}
          </div>

          <div className="mb-4 flex items-center gap-3">
            <span className={`rounded-[6px] px-2.5 py-1 text-[12px] font-bold ${getTypeBadgeClass(selectedNotice.type)}`}>
              {selectedNotice.type}
            </span>
            <h2 className="text-[24px] font-extrabold text-gray-900 dark:text-slate-100">{selectedNotice.title}</h2>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-gray-200 dark:border-slate-700 pb-6 text-[13px] font-medium text-gray-500 dark:text-slate-400">
            <span>등록 일시: <span className="font-mono">{formatDate(selectedNotice.created_at)}</span></span>
            <div className="h-[12px] w-[1px] bg-gray-300" />
            <span>작성자: {selectedNotice.author_name ?? '-'}</span>
          </div>

          <div className="flex-1 rounded-[10px] border border-gray-100 dark:border-slate-700 bg-[#FAFAFA] dark:bg-slate-900/50 p-6 text-[14px] leading-relaxed text-gray-800 whitespace-pre-wrap">
            {selectedNotice.content || '상세 내용이 없습니다.'}
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-[14px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center justify-between md:border-r md:border-gray-200 dark:border-slate-700 md:pr-5">
                <div className="text-[14px] font-bold text-gray-900 dark:text-slate-100">
                  공지사항 <span className="ml-2 font-normal text-gray-400 dark:text-slate-500">Total {filteredNotices.length}</span>
                </div>
                <button className="md:hidden rounded-[7px] p-2 text-gray-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900 hover:text-gray-900 dark:text-slate-100">
                  <Settings size={18} />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-3 md:flex-row md:px-5">
                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value as '전체' | NoticeType)}
                  className="h-[36px] rounded-[8px] border border-gray-200 dark:border-slate-700 px-3 text-[13px] focus:border-primary-500 focus:outline-none md:w-[140px]"
                >
                  <option value="전체">전체 유형</option>
                  <option value="일반">일반</option>
                  <option value="점검">점검</option>
                  <option value="업데이트">업데이트</option>
                </select>
                <div className="relative flex-1 md:max-w-[320px]">
                  <Search size={14} className="absolute left-3 top-[11px] text-gray-400 dark:text-slate-500" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="제목 검색"
                    className="h-[36px] w-full rounded-[8px] border border-gray-200 dark:border-slate-700 pl-8 pr-3 text-[13px] focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-gray-50 pt-3 md:border-none md:pt-0">
                <button
                  onClick={() => {
                    setSearch('');
                    setTypeFilter('전체');
                    void fetchNotices();
                  }}
                  className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900"
                >
                  <RotateCcw size={14} />
                </button>
                {isAdmin ? (
                  <button
                    onClick={openCreateModal}
                    className="flex h-[36px] items-center justify-center gap-1.5 whitespace-nowrap rounded-[8px] bg-primary-600 px-4 text-[13px] font-bold text-white hover:bg-primary-700"
                  >
                    <Plus size={14} />
                    작성
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-4 text-[13px] text-rose-600">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex-1 overflow-hidden rounded-[10px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.4)] transition-all">
            <div className="h-full overflow-x-auto">
              {/* Mobile Card View */}
              <div className="md:hidden space-y-3 p-4 bg-gray-50 dark:bg-slate-900/50">
                {loading ? (
                  <div className="py-20 text-center text-xs font-bold text-gray-400 dark:text-slate-500 italic">공지사항을 불러오는 중...</div>
                ) : pagedNotices.length === 0 ? (
                  <div className="py-20 text-center text-xs font-bold text-gray-400 dark:text-slate-500 italic">표시할 공지사항이 없습니다.</div>
                ) : (
                  pagedNotices.map((notice) => (
                    <div key={notice.id} onClick={() => setSelectedNotice(notice)} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm card-depth p-4 space-y-4 cursor-pointer active:scale-[0.98] transition-all">
                      <div className="flex justify-between items-start">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getTypeBadgeClass(notice.type)}`}>
                          {notice.type}
                        </span>
                        {isAdmin && (
                           <div className="flex gap-2">
                             <button onClick={(e) => { e.stopPropagation(); openEditModal(notice); }} className="p-1.5 text-gray-400 hover:text-blue-600"><Pencil size={14}/></button>
                             <button onClick={(e) => { e.stopPropagation(); void handleDelete(notice.id); }} className="p-1.5 text-gray-400 hover:text-rose-600"><Trash2 size={14}/></button>
                           </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-gray-900 dark:text-slate-100 leading-snug line-clamp-2">{notice.title}</h4>
                      </div>
                      <div className="pt-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-slate-900 flex items-center justify-center text-[9px] font-black text-gray-400 dark:text-slate-500 border border-gray-100 dark:border-slate-700">{(notice.author_name || '?')[0]}</div>
                          <span className="text-[11px] font-bold text-gray-600 dark:text-slate-400">{notice.author_name}</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-gray-400 dark:text-slate-500 tabular-nums">{formatDate(notice.created_at)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Table View */}
              <table className="hidden md:table w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700 bg-[#FAFAFA] dark:bg-slate-900/50">
                    <th className="whitespace-nowrap px-[20px] py-[14px] text-[12px] font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400">유형</th>
                    <th className="whitespace-nowrap px-[20px] py-[14px] text-[12px] font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400">제목</th>
                    <th className="whitespace-nowrap px-[20px] py-[14px] text-[12px] font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400">작성자</th>
                    <th className="whitespace-nowrap px-[20px] py-[14px] text-[12px] font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400">등록 일시</th>
                    <th className="w-10 px-[20px] py-[14px] text-[12px] font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400" />
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-14 text-center text-[13px] text-gray-400 dark:text-slate-500">
                        공지사항을 불러오는 중입니다.
                      </td>
                    </tr>
                  ) : pagedNotices.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-14 text-center text-[13px] text-gray-400 dark:text-slate-500">
                        표시할 공지사항이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    pagedNotices.map((notice) => (
                      <tr key={notice.id} className="border-b border-gray-100 dark:border-slate-700 transition-all hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900/60">
                        <td className="px-[20px] py-[16px]">
                          <span className={`rounded-[4px] px-2 py-0.5 text-[11px] font-bold ${getTypeBadgeClass(notice.type)}`}>
                            {notice.type}
                          </span>
                        </td>
                        <td
                          onClick={() => setSelectedNotice(notice)}
                          className="cursor-pointer whitespace-nowrap px-[20px] py-[16px] text-[13px] font-bold text-gray-900 dark:text-slate-100 hover:text-primary-600"
                        >
                          {notice.title}
                        </td>
                        <td className="px-[20px] py-[16px] text-[13px] font-medium text-gray-600 dark:text-slate-400 whitespace-nowrap">
                          {notice.author_name ?? '-'}
                        </td>
                        <td className="px-[20px] py-[16px] text-[12px] font-mono text-gray-500 dark:text-slate-400 whitespace-nowrap">
                          {formatDate(notice.created_at)}
                        </td>
                        <td className="px-[20px] py-[16px] text-right text-gray-400 dark:text-slate-500">
                          {isAdmin ? (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => openEditModal(notice)} className="hover:text-gray-700 dark:text-slate-300">
                                <Pencil size={15} />
                              </button>
                              <button onClick={() => void handleDelete(notice.id)} className="hover:text-rose-600">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          ) : (
                            <MoreVertical size={16} />
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex h-[60px] items-center justify-center gap-1.5 border-t border-gray-100 dark:border-slate-700 bg-[#FAFAFA] dark:bg-slate-900/50">
              <button
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                disabled={page === 1}
                className="h-[32px] w-[32px] rounded-[6px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-gray-600 dark:text-slate-400 disabled:text-gray-300"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 5).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`h-[32px] w-[32px] rounded-[6px] border text-[13px] font-bold ${
                    pageNumber === page
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
                disabled={page === totalPages}
                className="h-[32px] w-[32px] rounded-[6px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-gray-600 dark:text-slate-400 disabled:text-gray-300"
              >
                &gt;
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
