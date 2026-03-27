import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <AuthCard
        title="포털 로그인"
        subtitle="Supabase Auth 기반으로 계정을 확인하고 포털에 접근합니다."
      >
        <LoginForm />
      </AuthCard>
    </div>
  );
}
