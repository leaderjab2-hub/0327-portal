'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, Activity, Users, CreditCard, Settings, HelpCircle, List, UserCheck,
  Menu, X, ChevronDown, ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import type { UserRole } from '@/types/auth';

type MenuItem = {
  name: string;
  href?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  roles?: UserRole[];
  submenus?: Array<{
    name: string;
    href: string;
    roles?: UserRole[];
  }>;
};

const topMenus: MenuItem[] = [
  { name: '홈', href: '/', icon: Home },
  { 
    name: '모니터링', 
    icon: Activity,
    submenus: [
      { name: '노드 모니터링', href: '/monitoring/gpu' },
      { name: 'AI 스토리지', href: '/monitoring/storage' },
    ]
  },
  {
    name: '고객 관리',
    icon: Users,
    submenus: [
      { name: '계약 관리', href: '/customers/contracts' },
      { name: '고객 조회', href: '/customers/list' },
      { name: '리소스 할당', href: '/customers/resources' },
      { name: '탈퇴회원 조회', href: '/customers/withdrawn', roles: ['admin'] }
    ]
  },
  {
    name: '정산 관리',
    icon: CreditCard,
    submenus: [
      { name: '미터링', href: '/billing/metering' },
      { name: '빌링', href: '/billing/invoices' },
      { name: '크레딧 관리', href: '/billing/credits' },
      { name: '장애 등록', href: '/billing/incidents', roles: ['admin'] }
    ]
  },
  { name: '관리자 관리', href: '/admins', icon: Settings, roles: ['admin'] },
  {
    name: '고객 지원',
    icon: HelpCircle,
    submenus: [
      { name: '공지사항', href: '/support/notices' },
      { name: '티켓', href: '/support/tickets' }
    ]
  }
];

export default function MobileHeader() {
  const { currentUser } = useAuth();
  const currentRole = currentUser?.role;
  const [isOpen, setIsOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    '모니터링': true,
    '고객 관리': true,
    '정산 관리': true,
    '고객 지원': true
  });
  const pathname = usePathname();
  const bottomMenus = [
    ...(currentUser?.role === 'admin' || currentUser?.role === 'tenant_admin'
      ? [{ name: '가입 승인', href: '/approvals', icon: UserCheck }]
      : []),
    ...(currentUser?.role === 'admin'
      ? [{ name: '활동 내역 관리', href: '/activities', icon: List }]
      : []),
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleMenu = (name: string) => {
    setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const visibleTopMenus = topMenus
    .map((menu) => {
      if (menu.roles && (!currentRole || !menu.roles.includes(currentRole))) {
        return null;
      }

      if (!menu.submenus) {
        return menu;
      }

      const visibleSubmenus = menu.submenus.filter((submenu) => {
        return !submenu.roles || (currentRole ? submenu.roles.includes(currentRole) : false);
      });

      if (visibleSubmenus.length === 0) {
        return null;
      }

      return { ...menu, submenus: visibleSubmenus };
    })
    .filter((menu): menu is MenuItem => Boolean(menu));

  return (
    <div className="md:hidden">
      {/* Mobile Topbar */}
      <div className="sticky top-0 z-30 flex h-[52px] w-full items-center justify-between border-b border-[#E5E7EB] bg-white/95 px-3 backdrop-blur-sm">
        <button onClick={toggleSidebar} className="rounded-lg p-2 text-gray-700 active:bg-gray-100">
          <Menu size={24} />
        </button>
        <Link href="/" className="flex items-center absolute left-1/2 -translate-x-1/2">
          <Image src="/logo1.svg" alt="Logo" width={96} height={28} className="object-contain" />
        </Link>
        <div className="w-10" /> {/* Spacer to balance the Menu button */}
      </div>

      {/* Overlay & Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 transition-opacity" onClick={toggleSidebar}>
          <div 
            className="fixed inset-y-0 left-0 z-50 flex w-[86vw] max-w-[320px] flex-col bg-white p-0 shadow-xl transition-transform duration-300 ease-in-out"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-[#E5E7EB] px-4">
              <span className="font-semibold text-[15px]">전체 메뉴</span>
              <button onClick={toggleSidebar} className="rounded-lg p-1 text-gray-700 active:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-2 py-2 pb-4">
              {visibleTopMenus.map((menu) => {
                const isActive = pathname === menu.href || (menu.submenus && menu.submenus.some(s => pathname === s.href));
                
                if (menu.submenus) {
                  return (
                    <div key={menu.name} className="mb-1">
                      <button
                        onClick={() => toggleMenu(menu.name)}
                        className={`flex w-full items-center justify-between rounded-[10px] px-3 py-3 text-[14px] hover:bg-[#F9FAFB] ${
                          isActive ? 'text-primary-600 font-semibold' : 'text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <menu.icon size={18} />
                          <span>{menu.name}</span>
                        </div>
                        {openMenus[menu.name] ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                      </button>
                      {openMenus[menu.name] && (
                        <div className="mx-1 rounded-[10px] bg-gray-50 py-1">
                          {menu.submenus.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <Link
                                href={sub.href}
                                key={sub.name}
                                onClick={toggleSidebar}
                                className={`block rounded-[8px] py-[10px] pl-[38px] text-[13px] ${
                                  isSubActive 
                                    ? 'text-primary-600 font-semibold' 
                                    : 'text-gray-600'
                                }`}
                              >
                                {sub.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    href={menu.href as string}
                    key={menu.name}
                    onClick={toggleSidebar}
                    className={`mb-1 flex items-center gap-2 rounded-[10px] px-3 py-3 text-[14px] hover:bg-[#F9FAFB] ${
                      isActive 
                        ? 'text-primary-600 font-semibold' 
                        : 'text-gray-900'
                    }`}
                  >
                    <menu.icon size={18} />
                    <span>{menu.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="shrink-0 border-t border-[#E5E7EB] px-2 py-2 pb-[max(8px,env(safe-area-inset-bottom))]">
              {bottomMenus.map((menu) => {
                const isActive = pathname === menu.href;

                return (
                  <Link
                    href={menu.href}
                    key={menu.name}
                    onClick={toggleSidebar}
                    className={`flex items-center gap-2 rounded-[10px] px-3 py-3 text-[14px] ${
                      isActive ? 'text-primary-600 font-semibold' : 'text-gray-900'
                    }`}
                  >
                    <menu.icon size={18} />
                    <span>{menu.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
