'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bell, HelpCircle, Clock, LogOut, ChevronDown } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Basic breadcrumb generation
  const paths = pathname.split('/').filter(p => p);
  const breadcrumb = paths.length === 0 ? '홈' : paths.map(p => {
    switch(p) {
      case 'monitoring': return '모니터링';
      case 'gpu': return '노드 모니터링';
      case 'storage': return 'AI 스토리지';
      case 'customers': return '고객 관리';
      case 'contracts': return '계약 관리';
      case 'list': return '고객 조회';
      case 'withdrawn': return '탈퇴회원 조회';
      case 'billing': return '정산 관리';
      case 'metering': return '미터링';
      case 'invoices': return '빌링';
      case 'credits': return '크레딧 관리';
      case 'incidents': return '장애 등록';
      case 'admins': return '관리자 관리';
      case 'approvals': return '가입 승인';
      case 'support': return '고객 지원';
      case 'notices': return '공지사항';
      case 'tickets': return '티켓';
      case 'activities': return '활동 내역 관리';
      default: return p;
    }
  }).join(' > ');

  const badgeLabel = currentUser?.name?.slice(0, 2).toUpperCase() || currentUser?.email?.slice(0, 2).toUpperCase() || 'SK';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="hidden md:flex h-[52px] w-full bg-white border-b border-[#E5E7EB] items-center justify-between px-6 sticky top-0 z-10">
      <div className="text-[13px] font-semibold text-gray-900">
        {breadcrumb}
      </div>

      <div className="flex items-center gap-4 text-gray-600">
        <button className="flex items-center gap-1 text-[13px] hover:text-gray-900">
          <HelpCircle size={16} />
          <span>이용 가이드</span>
        </button>
        <button className="relative hover:text-gray-900">
          <Bell size={16} />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-danger"></span>
        </button>
        <div className="flex items-center gap-1 text-[13px]">
          <Clock size={16} />
          <span className="font-mono">59:59</span>
        </div>
        <div className="relative ml-2" ref={menuRef}>
          <button
            className="flex items-center gap-2 rounded-full px-1 py-1 transition hover:bg-gray-50"
            onClick={() => setMenuOpen((prev) => !prev)}
            type="button"
          >
            <div className="w-8 h-8 rounded-full bg-primary-500 font-bold text-white text-[12px] flex items-center justify-center">
              {badgeLabel}
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {menuOpen ? (
            <div className="absolute right-0 top-[calc(100%+8px)] w-[200px] rounded-[12px] border border-gray-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
              <div className="px-3 py-2 border-b border-gray-100">
                <div className="text-[13px] font-semibold text-gray-900">{currentUser?.name ?? "사용자"}</div>
                <div className="text-[12px] text-gray-500">{currentUser?.email ?? "-"}</div>
              </div>
              <button
                className="mt-2 flex w-full items-center gap-2 rounded-[10px] px-3 py-2 text-[13px] font-semibold text-rose-600 transition hover:bg-rose-50"
                onClick={async () => {
                  await logout();
                  setMenuOpen(false);
                  router.replace('/login');
                  router.refresh();
                }}
                type="button"
              >
                <LogOut size={14} />
                로그아웃
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
