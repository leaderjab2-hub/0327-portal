'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Activity, 
  Users, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  List,
  ChevronDown,
  ChevronRight,
  Server,
  Database
} from 'lucide-react';
import Image from 'next/image';

const menus = [
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
      { name: '탈퇴회원 조회', href: '/customers/withdrawn' }
    ]
  },
  {
    name: '정산 관리',
    icon: CreditCard,
    submenus: [
      { name: '미터링', href: '/billing/metering' },
      { name: '빌링', href: '/billing/invoices' },
      { name: '크레딧 관리', href: '/billing/credits' },
      { name: '장애 등록', href: '/billing/incidents' }
    ]
  },
  { name: '관리자 관리', href: '/admins', icon: Settings },
  {
    name: '고객 지원',
    icon: HelpCircle,
    submenus: [
      { name: '공지사항', href: '/support/notices' },
      { name: '티켓', href: '/support/tickets' }
    ]
  },
  { name: '활동 내역 관리', href: '/activities', icon: List }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    '모니터링': true,
    '고객 관리': true,
    '정산 관리': true,
    '고객 지원': true
  });

  const toggleMenu = (name: string) => {
    setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="hidden md:flex w-[240px] h-screen bg-white border-r border-[#E5E7EB] flex-col fixed left-0 top-0">
      <div className="h-[64px] border-b border-[#E5E7EB] flex items-center justify-center">
        <Link href="/">
          <Image src="/logo1.svg" alt="Logo" width={140} height={40} className="cursor-pointer" />
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        {menus.map((menu) => {
          const isActive = pathname === menu.href || (menu.submenus && menu.submenus.some(s => pathname === s.href));
          
          if (menu.submenus) {
            return (
              <div key={menu.name} className="mb-1">
                <button
                  onClick={() => toggleMenu(menu.name)}
                  className={`w-full flex items-center justify-between px-4 py-2 hover:bg-[#F9FAFB] text-[13px] ${
                    isActive ? 'text-primary-600 font-semibold' : 'text-gray-900'
                  }`}
                  style={{ height: '36px' }}
                >
                  <div className="flex items-center gap-2">
                    <menu.icon size={16} />
                    <span>{menu.name}</span>
                  </div>
                  {openMenus[menu.name] ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                </button>
                {openMenus[menu.name] && (
                  <div className="mt-1">
                    {menu.submenus.map((sub) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          href={sub.href}
                          key={sub.name}
                          className={`block pl-[36px] py-[8px] text-[12px] hover:bg-[#F9FAFB] ${
                            isSubActive 
                              ? 'text-primary-600 font-semibold bg-primary-50 border-l-[2px] border-primary-500' 
                              : 'text-gray-600 border-l-[2px] border-transparent'
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
              className={`flex items-center gap-2 px-4 hover:bg-[#F9FAFB] text-[13px] mb-1 ${
                isActive 
                  ? 'text-primary-600 font-semibold bg-primary-50 border-l-[2px] border-primary-500' 
                  : 'text-gray-900 border-l-[2px] border-transparent'
              }`}
              style={{ height: '36px' }}
            >
              <menu.icon size={16} />
              <span>{menu.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
