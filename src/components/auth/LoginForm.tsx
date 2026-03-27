"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { normalizeCurrentUser } from "@/lib/authShared";

const REMEMBER_EMAIL_KEY = "portal.rememberedEmail";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, refreshCurrentUser } = useAuth();
  const [email, setEmail] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return window.localStorage.getItem(REMEMBER_EMAIL_KEY) ?? "";
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return Boolean(window.localStorage.getItem(REMEMBER_EMAIL_KEY));
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: signInError } = await login(email, password);

    if (signInError) {
      setError(signInError.message);
      setSubmitting(false);
      return;
    }

    if (rememberEmail) {
      window.localStorage.setItem(REMEMBER_EMAIL_KEY, email);
    } else {
      window.localStorage.removeItem(REMEMBER_EMAIL_KEY);
    }

    await refreshCurrentUser();
    const {
      data: { user },
    } = await getSupabaseBrowserClient().auth.getUser();
    const nextUser = normalizeCurrentUser(user);
    const nextPath = searchParams.get("next");
    router.replace(nextUser?.role === "pending" ? "/pending" : nextPath || "/");
    router.refresh();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block">
        <span className="mb-2 block text-[13px] font-medium text-gray-700">이메일</span>
        <input
          className="h-11 w-full rounded-[10px] border border-gray-200 px-4 text-[14px] outline-none transition focus:border-primary-500"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-[13px] font-medium text-gray-700">비밀번호</span>
        <div className="relative">
          <input
            className="h-11 w-full rounded-[10px] border border-gray-200 px-4 pr-12 text-[14px] outline-none transition focus:border-primary-500"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-gray-400 transition hover:text-gray-700"
            onClick={() => setShowPassword((prev) => !prev)}
            type="button"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </label>

      <label className="flex items-center gap-2 text-[13px] text-gray-600">
        <input
          checked={rememberEmail}
          className="h-4 w-4 rounded border-gray-300"
          onChange={(event) => setRememberEmail(event.target.checked)}
          type="checkbox"
        />
        <span>이메일 기억하기</span>
      </label>

      {error ? (
        <p className="rounded-[10px] border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-[#BE123C]">
          {error}
        </p>
      ) : null}

      <button
        className="h-11 w-full rounded-[10px] bg-primary-600 text-[14px] font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={submitting}
        type="submit"
      >
        {submitting ? "로그인 중..." : "로그인"}
      </button>

      <p className="text-center text-[13px] text-gray-500">
        아직 계정이 없나요?{" "}
        <Link className="font-semibold text-primary-600" href="/signup">
          회원가입
        </Link>
      </p>
    </form>
  );
}
