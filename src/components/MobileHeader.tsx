'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Activity, Users, CreditCard, Settings, HelpCircle, List,
  Menu, X, ChevronDown, ChevronRight
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

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    '모니터링': true,
    '고객 관리': true,
    '정산 관리': true,
    '고객 지원': true
  });
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleMenu = (name: string) => {
    setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="md:hidden">
      {/* Mobile Topbar */}
      <div className="h-[52px] w-full bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 sticky top-0 z-30">
        <Link href="/" className="flex items-center">
          <Image src="/logo1.svg" alt="Logo" width={100} height={30} className="object-contain" />
        </Link>
        <button onClick={toggleSidebar} className="p-2 -mr-2 text-gray-700">
          <Menu size={24} />
        </button>
      </div>

      {/* Overlay & Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 transition-opacity" onClick={toggleSidebar}>
          <div 
            className="fixed inset-y-0 right-0 w-[240px] bg-white shadow-xl flex flex-col p-0 z-50 transform transition-transform duration-300 ease-in-out"
            onClick={e => e.stopPropagation()}
          >
            <div className="h-[52px] border-b border-[#E5E7EB] flex items-center justify-between px-4 shrink-0">
              <span className="font-semibold text-[15px]">전체 메뉴</span>
              <button onClick={toggleSidebar} className="p-1 -mr-1 text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-2">
              {menus.map((menu) => {
                const isActive = pathname === menu.href || (menu.submenus && menu.submenus.some(s => pathname === s.href));
                
                if (menu.submenus) {
                  return (
                    <div key={menu.name} className="mb-1">
                      <button
                        onClick={() => toggleMenu(menu.name)}
                        className={`w-full flex items-center justify-between px-4 py-3 hover:bg-[#F9FAFB] text-[14px] ${
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
                        <div className="bg-gray-50 border-y border-gray-100 py-1">
                          {menu.submenus.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <Link
                                href={sub.href}
                                key={sub.name}
                                onClick={toggleSidebar}
                                className={`block pl-[42px] py-[10px] text-[13px] ${
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
                    className={`flex items-center gap-2 px-4 py-3 hover:bg-[#F9FAFB] text-[14px] mb-1 ${
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
          </div>
        </div>
      )}
    </div>
  );
}
