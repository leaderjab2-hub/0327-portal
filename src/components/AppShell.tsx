"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import MobileHeader from "@/components/MobileHeader";

const AUTH_LAYOUT_ROUTES = ["/login", "/signup", "/pending"];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem("sidebar-collapsed") === "true";
  });
  const isAuthRoute = AUTH_LAYOUT_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isAuthRoute) {
    return <div className="min-h-screen bg-[#F5F7FB]">{children}</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        collapsed={isSidebarCollapsed}
        onToggle={() => {
          setIsSidebarCollapsed((prev) => {
            const next = !prev;
            window.localStorage.setItem("sidebar-collapsed", String(next));
            return next;
          });
        }}
      />
      <div className={`flex min-w-0 flex-1 flex-col ${isSidebarCollapsed ? "md:ml-16" : "md:ml-[240px]"}`}>
        <MobileHeader />
        <Topbar />
        <div className="min-w-0 flex-1 overflow-auto bg-[#F9FAFB]">
          <main className="mx-auto w-full min-w-0 max-w-full px-3 py-3 md:px-6 md:py-6 xl:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
