"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import MobileHeader from "@/components/MobileHeader";
import { useAuth } from "@/contexts/AuthContext";

const AUTH_LAYOUT_ROUTES = ["/login", "/signup", "/pending"];

export default function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, loading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem("sidebar-collapsed") === "true";
  });
  const isAuthRoute = AUTH_LAYOUT_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  useEffect(() => {
    if (isAuthRoute || loading) {
      return;
    }

    if (!currentUser) {
      const next = pathname && pathname !== "/" ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${next}`);
      return;
    }

    if (currentUser.role === "pending" && pathname !== "/pending") {
      router.replace("/pending");
    }
  }, [currentUser, isAuthRoute, loading, pathname, router]);

  if (isAuthRoute) {
    return <div className="min-h-screen bg-gray-50 dark:bg-slate-900 dark:bg-slate-900 transition-all">{children}</div>;
  }

  if (loading || !currentUser) {
    return <div className="min-h-screen bg-gray-50 dark:bg-slate-900 dark:bg-slate-900 transition-all" />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900 dark:bg-slate-900 transition-all">
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
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <MobileHeader />
        <Topbar />
        <div className="min-w-0 flex-1 overflow-auto bg-gray-50 dark:bg-slate-900 dark:bg-slate-900 transition-all">
          <main className="mx-auto w-full min-w-0 max-w-full px-3 pt-3 pb-6 md:px-6 md:pt-4 md:pb-8 xl:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
