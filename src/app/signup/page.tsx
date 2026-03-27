import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";
import SignupForm from "@/components/auth/SignupForm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; token_hash?: string; type?: string }>;
}) {
  const params = await searchParams;
  const isInviteMode = Boolean(params.code || (params.token_hash && params.type === "invite"));

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <AuthCard
        title={isInviteMode ? "초대 링크 가입" : "회원가입"}
        subtitle={
          isInviteMode
            ? "초대 링크로 전달된 계정에 이름과 비밀번호를 설정합니다."
            : "가입 시 기본 역할은 pending으로 저장되며, 승인 후 포털 접근이 가능합니다."
        }
      >
        <Suspense fallback={<div className="py-6 text-center text-[14px] text-gray-500">회원가입 화면을 준비 중입니다.</div>}>
          <SignupForm />
        </Suspense>
      </AuthCard>
    </div>
  );
}
