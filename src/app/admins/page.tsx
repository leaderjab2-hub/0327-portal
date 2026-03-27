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
      <div className="fixed inset-0 z-[100] mx-4 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-[16px] bg-white shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-8">
          <h2 className="text-[18px] font-extrabold text-gray-900 sm:text-[20px]">관리자 계정 생성</h2>
          <button onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-900"><X size={20}/></button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-8">
          <div className="flex flex-col gap-4 sm:gap-5">
            <div>
              <label className="mb-1.5 block text-[12px] font-bold text-gray-700 sm:text-[13px]">이름 <span className="text-red-500">*</span></label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="이름을 입력하세요" className="w-full rounded-[10px] border border-gray-200 p-2.5 text-[13px] font-medium text-gray-900 placeholder:text-gray-400 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:p-3" />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-bold text-gray-700 sm:text-[13px]">이메일 <span className="text-red-500">*</span></label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@skt.com" className={`w-full rounded-[10px] border p-2.5 text-[13px] font-medium text-gray-900 placeholder:text-gray-400 transition-all focus:outline-none sm:p-3 ${emailError ? 'border-red-300 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'}`} />
              {emailError && <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-red-500"><X size={12}/> {emailError}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-bold text-gray-700 sm:text-[13px]">권한 <span className="text-red-500">*</span></label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full cursor-pointer rounded-[10px] border border-gray-200 bg-white p-2.5 text-[13px] font-bold text-gray-900 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:p-3">
                <option value="관리자">관리자</option>
                <option value="인프라 관리자">인프라 관리자</option>
              </select>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-gray-100 bg-gray-50/50 p-5 sm:p-8">
          <div className="flex justify-end gap-2.5">
            <button onClick={onClose} className="flex-1 rounded-[10px] border border-gray-200 bg-white px-5 py-2.5 text-[13px] font-bold text-gray-600 transition-colors hover:bg-gray-50 sm:flex-none">취소</button>
            <button onClick={handleSubmit} disabled={!isFormValid} className={`flex-1 rounded-[10px] px-6 py-2.5 text-[13px] font-extrabold transition-all outline-none sm:flex-none ${isFormValid ? 'bg-gray-900 text-white shadow-lg shadow-black/10 hover:bg-black active:scale-95' : 'cursor-not-allowed bg-gray-200 text-gray-400'}`}>확인</button>
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

      <div className="flex flex-col gap-4 rounded-[14px] border border-gray-200 bg-white p-4 text-left shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between md:border-r md:border-gray-200 md:pr-5">
          <div className="text-[14px] font-bold text-gray-900">플랫폼 관리자 <span className="ml-2 font-normal text-gray-400">Total {filteredAdmins.length}</span></div>
        </div>

        <div className="flex flex-1 flex-col items-stretch gap-3 md:px-5 sm:flex-row md:items-center">
          <div className="relative flex-1 sm:max-w-[320px]">
            <input
              type="text"
              placeholder="관리자 명 검색"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-[36px] w-full rounded-[8px] border border-gray-200 bg-white px-3 pl-8 text-[13px] shadow-sm transition-all focus:border-primary-500 focus:outline-none"
            />
            <Search size={14} className="absolute left-3 top-[11px] text-gray-400" />
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-gray-50 pt-3 md:border-none md:pt-0">
          <button onClick={() => void loadAdmins()} className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50">
            <RotateCcw size={14} />
          </button>
          <button className="flex h-[36px] items-center justify-center whitespace-nowrap rounded-[8px] bg-gray-100 px-4 text-[13px] font-bold text-gray-700 transition-colors hover:bg-gray-200">
            검색
          </button>
          <div className="mx-1 h-[16px] w-[1px] bg-gray-200"></div>
          <button onClick={() => setIsModalOpen(true)} className="flex h-[36px] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-[8px] bg-primary-600 px-4 text-[13px] font-bold text-white shadow-sm shadow-primary-500/10 transition-all hover:bg-primary-700 active:scale-[0.98] md:flex-none">
            <Plus size={14} /> <span>생성</span>
          </button>
        </div>
      </div>

      <div className="scrollbar-thin flex h-full flex-col overflow-x-auto overflow-y-auto rounded-[10px] border border-gray-200 bg-white shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
        <table className="min-w-[1000px] w-full flex-1 border-collapse text-left">
          <thead className="hidden md:table-header-group">
            <tr className="border-b border-gray-200 bg-[#FAFAFA]">
              <th className="whitespace-nowrap px-[20px] py-[14px] text-[12px] font-bold uppercase tracking-wide text-gray-500">관리자 명</th>
              <th className="whitespace-nowrap px-[20px] py-[14px] text-[12px] font-bold uppercase tracking-wide text-gray-500">이메일</th>
              <th className="whitespace-nowrap px-[20px] py-[14px] text-[12px] font-bold uppercase tracking-wide text-gray-500">권한</th>
              <th className="whitespace-nowrap px-[20px] py-[14px] text-[12px] font-bold uppercase tracking-wide text-gray-500">등록 일시</th>
              <th className="whitespace-nowrap px-[20px] py-[14px] text-[12px] font-bold uppercase tracking-wide text-gray-500">최근 로그인</th>
              <th className="w-10 px-[20px] py-[14px] text-[12px] font-bold uppercase tracking-wide text-gray-500"></th>
            </tr>
          </thead>
          <tbody className="flex flex-col gap-4 p-4 md:table-row-group md:p-0">
            {error ? (
              <tr className="md:table-row">
                <td colSpan={6} className="py-10 text-center text-sm font-medium text-rose-500">{error}</td>
              </tr>
            ) : loading ? (
              <tr className="md:table-row">
                <td colSpan={6} className="py-10 text-center text-sm font-medium text-gray-400">관리자 목록을 불러오는 중입니다.</td>
              </tr>
            ) : filteredAdmins.length === 0 ? (
              <tr className="md:table-row">
                <td colSpan={6} className="py-10 text-center text-sm font-medium text-gray-400">등록된 관리자가 없습니다.</td>
              </tr>
            ) : (
              filteredAdmins.map((row) => {
                const roleLabel = row.adminRole ?? '관리자';
                const roleBg = roleLabel === '인프라 관리자' ? 'bg-[#F5F3FF] text-[#7C3AED]' : 'bg-[#EFF6FF] text-[#2563EB]';

                return (
                  <tr key={row.id} className="relative flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:bg-gray-50/50 md:table-row md:rounded-none md:border-0 md:border-b md:border-gray-100 md:p-0 md:shadow-none">
                    <td className="mb-3 border-b border-gray-50 px-0 py-1 pb-2 font-bold text-primary-600 md:mb-0 md:border-0 md:px-[20px] md:py-[14px] md:pb-0 md:text-[13px] md:text-gray-900 whitespace-nowrap">
                      <span className="mb-0.5 block text-[10px] font-normal text-gray-400 md:hidden">관리자 명</span>
                      {row.name ?? '-'}
                      <div className="absolute right-12 top-5 md:static md:ml-3 md:inline-block">
                        <span className={`rounded-[4px] px-2 py-0.5 text-[10px] font-bold ${roleBg}`}>{roleLabel}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-0 py-1 md:px-[20px] md:py-[14px]">
                      <span className="mb-0.5 block text-[10px] font-normal text-gray-400 md:hidden">이메일</span>
                      <span className="font-medium text-gray-600 md:text-[13px]">{row.email ?? '-'}</span>
                    </td>
                    <td className="hidden px-[20px] md:table-cell" />
                    <td className="whitespace-nowrap px-0 py-1 font-mono text-[12px] text-gray-500 md:px-[20px] md:py-[14px]">
                      <span className="mb-0.5 block text-[10px] font-normal text-gray-400 md:hidden">등록 일시</span>
                      {formatDateTime(row.created_at)}
                    </td>
                    <td className="whitespace-nowrap px-0 py-1 font-mono text-[12px] text-gray-500 md:px-[20px] md:py-[14px]">
                      <span className="mb-0.5 block text-[10px] font-normal text-gray-400 md:hidden">최근 로그인</span>
                      {formatDateTime(row.last_sign_in_at)}
                    </td>
                    <td className="absolute right-5 top-5 cursor-pointer px-0 text-gray-400 hover:text-gray-900 md:static md:px-[20px]">
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
  );
}
