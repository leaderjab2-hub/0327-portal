import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, LogOut, ChevronDown, Search, Moon, Sun, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';
import SearchModal from '@/components/SearchModal';

export default function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const notificationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard shortcut for search
  // ... (useEffect for search remain)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const loadNotifications = useCallback(async () => {
    if (!currentUser || currentUser.role === 'subtenant_member' || currentUser.role === 'pending') {
      return;
    }
    try {
      const resp = await fetch('/api/notifications');
      const { data } = await resp.json();
      const readIds = JSON.parse(localStorage.getItem('read_notifications') || '[]');
      const results = (data || []).map((n: any) => ({
        ...n,
        read: readIds.includes(n.id)
      }));
      setNotifications(results);
    } catch (err) {
      console.error(err);
    }
  }, [currentUser]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAllAsRead = () => {
    const ids = notifications.map(n => n.id);
    localStorage.setItem('read_notifications', JSON.stringify(ids));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    const readIds = JSON.parse(localStorage.getItem('read_notifications') || '[]');
    if (!readIds.includes(id)) {
      const next = [...readIds, id];
      localStorage.setItem('read_notifications', JSON.stringify(next));
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (!notificationRef.current?.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="hidden md:flex h-16 w-full bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 items-center justify-between px-6 sticky top-0 z-10 transition-all">
      <div className="flex items-center gap-6">
        <div className="text-[13px] font-bold text-gray-400 dark:text-slate-500 dark:text-slate-500 uppercase tracking-widest min-w-[120px]">
          {breadcrumb}
        </div>

        {/* Global Search Bar Trigger */}
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-3 px-3 py-1.5 w-[320px] bg-gray-50 dark:bg-slate-900 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 dark:border-slate-700 rounded-lg text-gray-400 dark:text-slate-500 hover:border-primary-400 dark:hover:border-primary-500 transition-all group"
        >
          <Search size={14} className="group-hover:text-primary-500" />
          <span className="text-[12px] flex-1 text-left">Search everything...</span>
          <div className="flex items-center gap-0.5 text-[10px] font-bold opacity-60">
            <span className="border border-gray-300 dark:border-slate-600 rounded px-1 px-1">⌘</span>
            <span className="border border-gray-300 dark:border-slate-600 rounded px-1 px-1">K</span>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-4 text-gray-600 dark:text-slate-400">
        {/* Notifications and Theme */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button 
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-all text-gray-400 dark:text-slate-500 hover:text-primary-500"
          >
            {mounted && (resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />)}
          </button>

          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 relative hover:text-gray-900 dark:text-slate-100 dark:hover:text-slate-200 transition-all text-gray-400"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl card-depth border border-gray-200 dark:border-slate-700 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-slate-700">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-slate-100">알림</h3>
                  <button onClick={markAllAsRead} className="text-[11px] font-bold text-blue-500 hover:text-blue-600 transition-all">모두 읽음</button>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-xs text-gray-400 dark:text-slate-500">알림이 없습니다.</div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className="flex gap-3 px-4 py-4 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer border-b border-gray-50 dark:border-slate-700 last:border-none transition-all"
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? 'bg-transparent' : 'bg-blue-500 animate-pulse'}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] leading-snug ${n.read ? 'text-gray-500 dark:text-slate-400' : 'text-gray-900 dark:text-slate-100 font-medium'}`}>
                            {n.message}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-1 italic">{new Date(n.time).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'})}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="relative ml-2" ref={menuRef}>
          <button
            className="flex items-center gap-3 transition-all px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-700 border border-gray-100 dark:border-slate-700"
            onClick={() => setMenuOpen((prev) => !prev)}
            type="button"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 dark:text-slate-100 leading-tight">
                {currentUser?.name ?? "사용자"}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold mt-0.5 uppercase tracking-tighter">
                {currentUser?.role === 'admin' ? '전체 관리자' : 
                 currentUser?.role === 'tenant_admin' ? 'Tenant 관리자' : '멤버'}
              </p>
            </div>
            <ChevronDown size={14} className="text-gray-400 dark:text-slate-500" />
          </button>

          {menuOpen ? (
            <div className="absolute right-0 top-[calc(100%+12px)] w-[220px] rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2 shadow-lg dark:shadow-slate-900 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-4 border-b border-gray-100 dark:border-slate-700">
                <div className="text-[13px] font-bold text-gray-900 dark:text-slate-100">{currentUser?.name ?? "사용자"}</div>
                <div className="text-[11px] font-medium text-gray-500 dark:text-slate-400 mt-0.5">{currentUser?.email ?? "-"}</div>
              </div>
              <div className="mt-1 p-1">
                <button
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-bold text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-900/10"
                  onClick={async () => {
                    await logout();
                    setMenuOpen(false);
                    router.replace('/login');
                    router.refresh();
                  }}
                  type="button"
                >
                  <LogOut size={16} />
                  로그아웃
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
