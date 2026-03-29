'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  Activity,
  Users,
  CreditCard,
  Settings,
  HelpCircle,
  List,
  UserCheck,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
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

type FlatMenuItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const topMenus: MenuItem[] = [
  { name: '홈', href: '/', icon: Home },
  {
    name: '모니터링',
    icon: Activity,
    submenus: [
      { name: '노드 모니터링', href: '/monitoring/gpu' },
      { name: 'AI 스토리지', href: '/monitoring/storage' },
    ],
  },
  {
    name: '고객 관리',
    icon: Users,
    submenus: [
      { name: '계약 관리', href: '/customers/contracts' },
      { name: '고객 조회', href: '/customers/list' },
      { name: '리소스 할당', href: '/customers/resources' },
      { name: '탈퇴회원 조회', href: '/customers/withdrawn', roles: ['admin'] },
    ],
  },
  {
    name: '정산 관리',
    icon: CreditCard,
    submenus: [
      { name: '미터링', href: '/billing/metering' },
      { name: '빌링', href: '/billing/invoices' },
      { name: '크레딧 관리', href: '/billing/credits' },
      { name: '장애 등록', href: '/billing/incidents', roles: ['admin'] },
    ],
  },
  { name: '관리자 관리', href: '/admins', icon: Settings, roles: ['admin'] },
  {
    name: '고객 지원',
    icon: HelpCircle,
    submenus: [
      { name: '공지사항', href: '/support/notices' },
      { name: '티켓', href: '/support/tickets' },
    ],
  },
];

function Tooltip({ label }: { label: string }) {
  return (
    <div className="pointer-events-none absolute left-full top-1/2 z-[80] ml-2 -translate-y-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
      {label}
    </div>
  );
}

export default function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const currentRole = currentUser?.role;
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    모니터링: true,
    '고객 관리': true,
    '정산 관리': true,
    '고객 지원': true,
  });

  const bottomMenus: FlatMenuItem[] = [
    ...(currentUser?.role === 'admin' || currentUser?.role === 'tenant_admin'
      ? [{ name: '가입 승인', href: '/approvals', icon: UserCheck }]
      : []),
    ...(currentUser?.role === 'admin'
      ? [{ name: '활동 내역 관리', href: '/activities', icon: List }]
      : []),
  ];

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
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

  const collapsedMenus: FlatMenuItem[] = [
    ...visibleTopMenus.map((menu) => ({
        name: menu.name,
        href: menu.href ?? menu.submenus?.[0]?.href ?? '/',
        icon: menu.icon,
      })),
    ...bottomMenus,
  ];

  return (
    <aside
      className={`relative z-40 hidden h-screen flex-col overflow-visible border-r border-[#E5E7EB] bg-white transition-[width] duration-200 md:flex ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div
        className={`flex h-16 shrink-0 items-center border-b border-[#E5E7EB] ${
          collapsed ? 'justify-center px-2' : 'justify-between px-4'
        }`}
      >
        {collapsed ? (
          <div className="group relative">
            <button
              type="button"
              onClick={onToggle}
              className="flex h-10 w-10 items-center justify-center rounded-md text-gray-500 transition hover:bg-[#F9FAFB] hover:text-gray-700"
              aria-label="사이드바 열기"
            >
              <Image
                src="/logo2.svg"
                alt="SKT Enterprise GPUaaS"
                width={28}
                height={28}
                className="block group-hover:hidden"
              />
              <PanelLeftOpen size={18} className="hidden group-hover:block" />
            </button>
            <Tooltip label="사이드바 열기" />
          </div>
        ) : (
          <>
            <Link href="/">
              <Image
                src="/logo1.svg"
                alt="SKT Enterprise GPUaaS"
                width={140}
                height={40}
                className="cursor-pointer"
              />
            </Link>
            <button
              type="button"
              onClick={onToggle}
              className="rounded-md p-1.5 text-gray-400 transition hover:bg-[#F9FAFB] hover:text-gray-700"
              aria-label="사이드바 접기"
              title="사이드바 접기"
            >
              <PanelLeftClose size={18} />
            </button>
          </>
        )}
      </div>

      <nav className={`min-h-0 flex-1 py-4 ${collapsed ? 'overflow-visible' : 'overflow-y-auto'}`}>
        {collapsed
          ? collapsedMenus.map((menu) => {
              const isActive = pathname === menu.href;

              return (
                <div key={menu.name} className="group relative mb-1">
                  <Link
                    href={menu.href}
                    className={`mx-auto flex h-9 w-12 items-center justify-center rounded-md text-[13px] ${
                      isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-900 hover:bg-[#F9FAFB]'
                    }`}
                    title={menu.name}
                  >
                    <menu.icon size={16} />
                  </Link>
                  <Tooltip label={menu.name} />
                </div>
              );
            })
          : visibleTopMenus.map((menu) => {
              const isActive =
                pathname === menu.href || (menu.submenus && menu.submenus.some((submenu) => pathname === submenu.href));

              if (menu.submenus) {
                return (
                  <div key={menu.name} className="relative mb-1">
                    <button
                      onClick={() => toggleMenu(menu.name)}
                      className={`flex h-9 w-full items-center justify-between px-4 py-2 text-[13px] hover:bg-[#F9FAFB] ${
                        isActive ? 'font-semibold text-primary-600' : 'text-gray-900'
                      }`}
                      type="button"
                    >
                      <div className="flex items-center gap-2">
                        <menu.icon size={16} />
                        <span>{menu.name}</span>
                      </div>
                      {openMenus[menu.name] ? (
                        <ChevronDown size={14} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={14} className="text-gray-400" />
                      )}
                    </button>
                    {openMenus[menu.name] ? (
                      <div className="mt-1">
                        {menu.submenus.map((submenu) => {
                          const isSubActive = pathname === submenu.href;

                          return (
                            <Link
                              href={submenu.href}
                              key={submenu.name}
                              className={`block border-l-[2px] py-[8px] pl-[36px] text-[12px] hover:bg-[#F9FAFB] ${
                                isSubActive
                                  ? 'border-primary-500 bg-primary-50 font-semibold text-primary-600'
                                  : 'border-transparent text-gray-600'
                              }`}
                            >
                              {submenu.name}
                            </Link>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              }

              return (
                <Link
                  href={menu.href as string}
                  key={menu.name}
                  className={`mb-1 flex h-9 items-center gap-2 border-l-[2px] px-4 text-[13px] hover:bg-[#F9FAFB] ${
                    isActive
                      ? 'border-primary-500 bg-primary-50 font-semibold text-primary-600'
                      : 'border-transparent text-gray-900'
                  }`}
                >
                  <menu.icon size={16} />
                  <span>{menu.name}</span>
                </Link>
              );
            })}
      </nav>

      {!collapsed ? (
        <div className="flex-shrink-0 border-t border-[#E5E7EB] py-3">
          {bottomMenus.map((menu) => {
            const isActive = pathname === menu.href;

            return (
              <Link
                href={menu.href}
                key={menu.name}
                className={`flex items-center gap-2 border-l-[2px] px-4 py-2 text-[13px] ${
                  isActive
                    ? 'border-primary-500 bg-primary-50 font-semibold text-primary-600'
                    : 'border-transparent text-gray-900 hover:bg-[#F9FAFB]'
                }`}
              >
                <menu.icon size={16} />
                <span>{menu.name}</span>
              </Link>
            );
          })}
        </div>
      ) : null}
    </aside>
  );
}
