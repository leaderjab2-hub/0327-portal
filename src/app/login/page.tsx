import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <AuthCard
        title="포털 로그인"
        subtitle="Supabase Auth 기반으로 계정을 확인하고 포털에 접근합니다."
      >
        <Suspense fallback={<div className="py-6 text-center text-[14px] text-gray-500">로그인 화면을 준비 중입니다.</div>}>
          <LoginForm />
        </Suspense>
      </AuthCard>
    </div>
  );
}
