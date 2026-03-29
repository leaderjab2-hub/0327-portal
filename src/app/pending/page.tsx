"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import { useAuth } from "@/contexts/AuthContext";

export default function PendingPage() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <AuthCard
        title="승인 대기 중"
        subtitle="관리자 승인 후 이용 가능합니다. 승인 완료 전까지는 포털 주요 기능에 접근할 수 없습니다."
      >
        <div className="space-y-4 text-[14px] leading-6 text-gray-600 dark:text-slate-400">
          <p>계정은 생성되었지만 아직 역할이 확정되지 않았습니다.</p>
          <p>운영 관리자가 승인하면 일반 포털 화면으로 정상 진입할 수 있습니다.</p>
          <div className="flex gap-3 pt-2">
            <button
              className="h-11 rounded-[10px] bg-primary-600 px-5 text-[14px] font-semibold text-white"
              onClick={() => router.refresh()}
              type="button"
            >
              상태 새로고침
            </button>
            <button
              className="h-11 rounded-[10px] border border-gray-200 dark:border-slate-700 px-5 text-[14px] font-semibold text-gray-700 dark:text-slate-300"
              onClick={async () => {
                await logout();
                router.replace("/login");
                router.refresh();
              }}
              type="button"
            >
              로그아웃
            </button>
          </div>
          <Link className="inline-block text-[13px] font-semibold text-primary-600" href="/login">
            로그인 화면으로 이동
          </Link>
        </div>
      </AuthCard>
    </div>
  );
}
