'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Search, RotateCcw, Plus, MoreVertical, X } from 'lucide-react';

type AdminRecord = {
  id: string;
  email: string | null;
  name: string | null;
  adminRole: string | null;
  created_at: string | null;
  last_sign_in_at: string | null;
};

function formatDateTime(value: string | null) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(value));
}

function CreateAdminModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('관리자');

  if (!isOpen) return null;

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const emailError = email.length > 0 && !isValidEmail(email) ? '유효한 이메일 형식이 아닙니다.' : '';
  const isFormValid = name.trim().length > 0 && email.trim().length > 0 && isValidEmail(email) && role.length > 0;

  const handleSubmit = () => {
    if (!isFormValid) return;

    window.alert('관리자 생성 API는 아직 연결되지 않았습니다.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-[16px] bg-white dark:bg-slate-800 shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 p-5 sm:p-8">
          <h2 className="text-[18px] font-extrabold text-gray-900 dark:text-slate-100 sm:text-[20px]">관리자 계정 생성</h2>
          <button onClick={onClose} className="text-gray-400 dark:text-slate-500 transition-all hover:text-gray-900 dark:text-slate-100"><X size={20}/></button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-8">
          <div className="flex flex-col gap-4 sm:gap-5">
            <div>
              <label className="mb-1.5 block text-[12px] font-bold text-gray-700 dark:text-slate-300 sm:text-[13px]">이름 <span className="text-red-500">*</span></label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="이름을 입력하세요" className="w-full rounded-[10px] border border-gray-200 dark:border-slate-700 p-2.5 text-[13px] font-medium text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:text-slate-500 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:p-3" />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-bold text-gray-700 dark:text-slate-300 sm:text-[13px]">이메일 <span className="text-red-500">*</span></label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@skt.com" className={`w-full rounded-[10px] border p-2.5 text-[13px] font-medium text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:text-slate-500 transition-all focus:outline-none sm:p-3 ${emailError ? 'border-red-300 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'}`} />
              {emailError && <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-red-500"><X size={12}/> {emailError}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-bold text-gray-700 dark:text-slate-300 sm:text-[13px]">권한 <span className="text-red-500">*</span></label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full cursor-pointer rounded-[10px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-[13px] font-bold text-gray-900 dark:text-slate-100 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:p-3">
                <option value="관리자">관리자</option>
                <option value="인프라 관리자">인프라 관리자</option>
              </select>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 p-5 sm:p-8">
          <div className="flex justify-end gap-2.5">
            <button onClick={onClose} className="rounded-[10px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-[13px] font-bold text-gray-600 dark:text-slate-400 transition-all hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900">취소</button>
            <button onClick={handleSubmit} disabled={!isFormValid} className={`rounded-[10px] px-6 py-2.5 text-[13px] font-extrabold transition-all outline-none ${isFormValid ? 'bg-gray-900 text-white shadow-lg shadow-black/10 hover:bg-black active:scale-95' : 'cursor-not-allowed bg-gray-200 text-gray-400 dark:text-slate-500'}`}>확인</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Admins() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAdmins = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admins', { cache: 'no-store' });
      const payload = (await response.json().catch(() => ({}))) as { data?: AdminRecord[]; error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? '관리자 목록을 불러오지 못했습니다.');
      }

      setAdmins(payload.data ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '관리자 목록을 불러오지 못했습니다.');
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAdmins();
  }, []);

  const filteredAdmins = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return admins;
    }

    return admins.filter((admin) => {
      return (
        (admin.name ?? '').toLowerCase().includes(keyword) ||
        (admin.email ?? '').toLowerCase().includes(keyword)
      );
    });
  }, [admins, search]);

  return (
    <div className="relative flex h-full flex-col gap-6">
      <CreateAdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="flex h-[48px] shrink-0 items-center justify-between bg-white dark:bg-slate-800 px-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm card-depth">
        <div className="flex items-center gap-3">
          <div className="text-[14px] font-black text-gray-900 dark:text-slate-100 uppercase tracking-tight">
            플랫폼 관리자 <span className="ml-2 text-[11px] font-bold text-gray-400 dark:text-slate-500 italic">TOTAL {filteredAdmins.length}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-gray-400 dark:text-slate-500" size={13} />
            <input
              type="text"
              placeholder="관리자 명 검색"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-[30px] w-40 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-8 text-[12px] font-medium text-gray-900 dark:text-slate-100 transition-all focus:w-56 focus:border-blue-400 focus:outline-none"
            />
          </div>
          <div className="h-4 w-px bg-gray-200 dark:bg-slate-700 mx-1" />
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex h-8 items-center gap-1.5 px-4 bg-primary-600 rounded-full text-[11px] font-black uppercase text-white shadow-sm card-depth hover:bg-black transition-all duration-150 active:scale-[0.98]"
          >
            <Plus size={14} /> 생성
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-[10px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.4)]">
        <div className="h-full overflow-x-auto">
          {/* Mobile Card View */}
          <div className="md:hidden space-y-3 p-4 bg-gray-50 dark:bg-slate-900/50">
            {error ? (
              <div className="py-20 text-center text-xs font-bold text-rose-500 italic">{error}</div>
            ) : loading ? (
              <div className="py-20 text-center text-xs font-bold text-gray-400 dark:text-slate-500 italic">관리자를 불러오는 중...</div>
            ) : filteredAdmins.length === 0 ? (
              <div className="py-20 text-center text-xs font-bold text-gray-400 dark:text-slate-500 italic">등록된 관리자가 없습니다.</div>
            ) : (
              filteredAdmins.map((row) => {
                const roleLabel = row.adminRole ?? '관리자';
                const roleBg = roleLabel === '인프라 관리자' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100';

                return (
                  <div key={row.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm card-depth p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-black text-gray-900 dark:text-slate-100">{row.name ?? '-'}</span>
                        <span className={`w-fit px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${roleBg}`}>
                          {roleLabel}
                        </span>
                      </div>
                      <button className="p-1.5 text-gray-400"><MoreVertical size={16}/></button>
                    </div>
                    
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500 dark:text-slate-400">
                          <span className="w-12 text-gray-400 dark:text-slate-500 font-bold uppercase tracking-tight">Email</span>
                          <span className="text-gray-900 dark:text-slate-100">{row.email ?? '-'}</span>
                       </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 dark:border-slate-700 grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-tight">등록일시</span>
                        <span className="text-[10px] font-mono font-bold text-gray-600 dark:text-slate-400 tabular-nums">{formatDateTime(row.created_at)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-tight">최근로그인</span>
                        <span className="text-[10px] font-mono font-bold text-gray-600 dark:text-slate-400 tabular-nums">{formatDateTime(row.last_sign_in_at)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop Table View */}
          <table className="hidden md:table w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700 bg-[#FAFAFA] dark:bg-slate-900/50">
                <th className="whitespace-nowrap px-[20px] py-4 text-[12px] font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400">관리자 명</th>
                <th className="whitespace-nowrap px-[20px] py-4 text-[12px] font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400">이메일</th>
                <th className="whitespace-nowrap px-[20px] py-4 text-[12px] font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400">등록 일시</th>
                <th className="whitespace-nowrap px-[20px] py-4 text-[12px] font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400">최근 로그인</th>
                <th className="w-10 px-[20px] py-4 text-[12px] font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400"></th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm font-medium text-rose-500">{error}</td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm font-medium text-gray-400 dark:text-slate-500">관리자 목록을 불러오는 중입니다.</td>
                </tr>
              ) : filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-sm font-medium text-gray-400 dark:text-slate-500">등록된 관리자가 없습니다.</td>
                </tr>
              ) : (
                filteredAdmins.map((row) => {
                  const roleLabel = row.adminRole ?? '관리자';
                  const roleBg = roleLabel === '인프라 관리자' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'bg-[#EFF6FF] text-[#2563EB]';

                  return (
                    <tr key={row.id} className="border-b border-gray-100 dark:border-slate-700 transition-all duration-150 hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900/50">
                      <td className="px-[20px] py-4 text-[13px] font-bold text-gray-900 dark:text-slate-100 whitespace-nowrap">
                        {row.name ?? '-'}
                        <span className={`ml-3 rounded-[4px] px-2 py-0.5 text-[10px] font-bold ${roleBg}`}>{roleLabel}</span>
                      </td>
                      <td className="whitespace-nowrap px-[20px] py-4 text-[13px] font-medium text-gray-600 dark:text-slate-400">
                        {row.email ?? '-'}
                      </td>
                      <td className="whitespace-nowrap px-[20px] py-4 font-mono text-[12px] text-gray-500 dark:text-slate-400">
                        {formatDateTime(row.created_at)}
                      </td>
                      <td className="whitespace-nowrap px-[20px] py-4 font-mono text-[12px] text-gray-500 dark:text-slate-400">
                        {formatDateTime(row.last_sign_in_at)}
                      </td>
                      <td className="px-[20px] text-gray-400 dark:text-slate-500 hover:text-gray-900 dark:text-slate-100 cursor-pointer transition-all duration-150">
                        <MoreVertical size={16} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
