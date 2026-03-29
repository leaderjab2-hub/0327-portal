"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { tenants } from "@/lib/mockData";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeInviteSignup, currentUser, prepareInviteSession, signUpPending } = useAuth();
  const [codeReady, setCodeReady] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [preparedInviteEmail, setPreparedInviteEmail] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tenantName, setTenantName] = useState(() => tenants[0]?.name ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inviteCode = searchParams.get("code");
  const inviteTokenHash = searchParams.get("token_hash");
  const inviteType = searchParams.get("type");
  const hashInviteParams = useMemo<{
    accessToken: string | null;
    refreshToken: string | null;
    type: string | null;
  }>(() => {
    if (typeof window === "undefined") {
      return {
        accessToken: null,
        refreshToken: null,
        type: null,
      };
    }

    const hash = window.location.hash;

    if (!hash || !hash.includes("access_token")) {
      return {
        accessToken: null,
        refreshToken: null,
        type: null,
      };
    }

    const parsedHash = new URLSearchParams(hash.replace(/^#/, ""));

    return {
      accessToken: parsedHash.get("access_token"),
      refreshToken: parsedHash.get("refresh_token"),
      type: parsedHash.get("type"),
    };
  }, []);
  const isInviteMode = Boolean(
    inviteCode ||
      (inviteTokenHash && inviteType === "invite") ||
      (hashInviteParams.accessToken && hashInviteParams.refreshToken),
  );
  const inviteEmail = preparedInviteEmail || currentUser?.email || "";
  const tenantOptions = useMemo(() => tenants.map((tenant) => tenant.name), []);

  useEffect(() => {
    if (
      !inviteCode &&
      !(inviteTokenHash && inviteType === "invite") &&
      !(hashInviteParams.accessToken && hashInviteParams.refreshToken)
    ) {
      return;
    }

    let active = true;

    const prepareInvite = async () => {
      const { error: inviteError, email: preparedEmail } = await prepareInviteSession({
        code: inviteCode,
        tokenHash: inviteTokenHash,
        type: hashInviteParams.type ?? inviteType,
        accessToken: hashInviteParams.accessToken,
        refreshToken: hashInviteParams.refreshToken,
      });

      if (!active) {
        return;
      }

      if (inviteError) {
        setCodeError(inviteError);
        setCodeReady(false);
        return;
      }

      setCodeError(null);
      setCodeReady(true);
      setPreparedInviteEmail(preparedEmail ?? "");
    };

    void prepareInvite();

    return () => {
      active = false;
    };
  }, [hashInviteParams.accessToken, hashInviteParams.refreshToken, hashInviteParams.type, inviteCode, inviteTokenHash, inviteType, prepareInviteSession]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    if (password !== confirmPassword && isInviteMode) {
      setError("비밀번호 확인이 일치하지 않습니다.");
      setSubmitting(false);
      return;
    }

    if (isInviteMode) {
      if (!codeReady) {
        setError("초대 링크 세션 준비가 아직 완료되지 않았습니다.");
        setSubmitting(false);
        return;
      }

      const { error: inviteError } = await completeInviteSignup({ name, password });

      if (inviteError) {
        setError(inviteError);
        setSubmitting(false);
        return;
      }

      router.replace("/login");
      router.refresh();
      return;
    }

    const { error: signUpError } = await signUpPending({
      name,
      email,
      password,
      tenantName,
    });

    if (signUpError) {
      setError(signUpError.message);
      setSubmitting(false);
      return;
    }

    router.replace("/pending");
    router.refresh();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {isInviteMode ? (
        <div className="rounded-[10px] border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
          초대 링크를 통해 가입 중입니다. 이름과 비밀번호를 설정하면 계정 활성화가 완료됩니다.
        </div>
      ) : null}

      {codeError ? (
        <div className="rounded-[10px] border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-[#BE123C]">
          {codeError}
        </div>
      ) : null}

      {!isInviteMode ? (
        <>
          <label className="block">
            <span className="mb-2 block text-[13px] font-medium text-gray-700 dark:text-slate-300">소속 회사</span>
            <select
              className="h-11 w-full rounded-[10px] border border-gray-200 dark:border-slate-700 px-4 text-[14px] outline-none transition focus:border-primary-500"
              value={tenantName}
              onChange={(event) => setTenantName(event.target.value)}
              required
            >
              {tenantOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-[13px] font-medium text-gray-700 dark:text-slate-300">이름</span>
            <input
              className="h-11 w-full rounded-[10px] border border-gray-200 dark:border-slate-700 px-4 text-[14px] outline-none transition focus:border-primary-500"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[13px] font-medium text-gray-700 dark:text-slate-300">이메일</span>
            <input
              className="h-11 w-full rounded-[10px] border border-gray-200 dark:border-slate-700 px-4 text-[14px] outline-none transition focus:border-primary-500"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
        </>
      ) : null}

      {isInviteMode ? (
        <>
          <label className="block">
            <span className="mb-2 block text-[13px] font-medium text-gray-700 dark:text-slate-300">이름</span>
            <input
              className="h-11 w-full rounded-[10px] border border-gray-200 dark:border-slate-700 px-4 text-[14px] outline-none transition focus:border-primary-500"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[13px] font-medium text-gray-700 dark:text-slate-300">이메일</span>
            <input
              className="h-11 w-full rounded-[10px] border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 px-4 text-[14px] text-gray-500 dark:text-slate-400 outline-none"
              type="email"
              value={inviteEmail}
              readOnly
            />
          </label>
        </>
      ) : null}

      <label className="block">
        <span className="mb-2 block text-[13px] font-medium text-gray-700 dark:text-slate-300">비밀번호</span>
        <div className="relative">
          <input
            className="h-11 w-full rounded-[10px] border border-gray-200 dark:border-slate-700 px-4 pr-12 text-[14px] outline-none transition focus:border-primary-500"
            type={showPassword ? "text" : "password"}
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-gray-400 dark:text-slate-500 transition hover:text-gray-700 dark:text-slate-300"
            onClick={() => setShowPassword((prev) => !prev)}
            type="button"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </label>

      {isInviteMode ? (
        <label className="block">
          <span className="mb-2 block text-[13px] font-medium text-gray-700 dark:text-slate-300">비밀번호 확인</span>
          <div className="relative">
            <input
              className="h-11 w-full rounded-[10px] border border-gray-200 dark:border-slate-700 px-4 pr-12 text-[14px] outline-none transition focus:border-primary-500"
              type={showConfirmPassword ? "text" : "password"}
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
            <button
              aria-label={showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-gray-400 dark:text-slate-500 transition hover:text-gray-700 dark:text-slate-300"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              type="button"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>
      ) : null}

      {error ? (
        <p className="rounded-[10px] border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-[#BE123C]">
          {error}
        </p>
      ) : null}

      <button
        className="h-11 w-full rounded-[10px] bg-primary-600 text-[14px] font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={submitting || (isInviteMode && !codeReady)}
        type="submit"
      >
        {submitting ? "처리 중..." : isInviteMode ? "가입 완료" : "회원가입"}
      </button>

      <p className="text-center text-[13px] text-gray-500 dark:text-slate-400">
        이미 계정이 있나요?{" "}
        <Link className="font-semibold text-primary-600" href="/login">
          로그인
        </Link>
      </p>
    </form>
  );
}
