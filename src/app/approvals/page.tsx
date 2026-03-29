"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ShieldCheck, Trash2, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import type { MemberRole } from "@/types/auth";

type PendingUser = {
  id: string;
  email: string | null;
  name: string | null;
  tenantName: string | null;
  createdAt: string | null;
};

type Subtenant = {
  id: string;
  tenant_id: string | null;
  name: string;
};

type Tenant = {
  id: string;
  name: string;
};

type ApprovalTargetOption = {
  label: string;
  role: "tenant_admin" | "subtenant_member";
  tenantId: string;
  subtenantId: string | null;
};

type ApprovalModalState = {
  open: boolean;
  user: PendingUser | null;
  tenantId: string | null;
  selectedTarget: string;
  memberRole: MemberRole;
  options: ApprovalTargetOption[];
  loadingTargets: boolean;
};

async function readJson<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => ({}))) as T & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "요청에 실패했습니다.");
  }

  return payload;
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

const defaultModalState: ApprovalModalState = {
  open: false,
  user: null,
  tenantId: null,
  selectedTarget: "",
  memberRole: "member",
  options: [],
  loadingTargets: false,
};

export default function ApprovalsPage() {
  const router = useRouter();
  const { approveUser, currentUser, loading, rejectUser } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ApprovalModalState>(defaultModalState);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (currentUser?.role === "subtenant_member") {
      router.replace("/");
      return;
    }

    if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "tenant_admin")) {
      return;
    }

    const load = async () => {
      setPageLoading(true);
      setError(null);

      try {
        const pendingPayload = await readJson<{ data: PendingUser[] }>(
          await fetch("/api/pending-users", { cache: "no-store" }),
        );
        setPendingUsers(pendingPayload.data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "가입 승인 데이터를 불러오지 못했습니다.");
      } finally {
        setPageLoading(false);
      }
    };

    void load();
  }, [currentUser, loading, router]);

  const selectedOption = useMemo(() => {
    return modal.options.find((option) => option.label === modal.selectedTarget) ?? null;
  }, [modal.options, modal.selectedTarget]);

  const openApprovalModal = async (user: PendingUser) => {
    setError(null);
    setModal({
      open: true,
      user,
      tenantId: null,
      selectedTarget: "",
      memberRole: "member",
      options: [],
      loadingTargets: true,
    });

    try {
      const tenantsPayload = await readJson<{ data: Tenant[] }>(
        await fetch("/api/tenants", { cache: "no-store" }),
      );
      const matchedTenant = tenantsPayload.data.find((tenant) => tenant.name === user.tenantName);

      if (!matchedTenant) {
        throw new Error("가입한 소속 회사와 일치하는 Tenant를 찾지 못했습니다.");
      }

      const subtenantsPayload = await readJson<{ data: Subtenant[] }>(
        await fetch(`/api/subtenants?tenantId=${matchedTenant.id}`, { cache: "no-store" }),
      );

      const nextOptions: ApprovalTargetOption[] = [
        {
          label: `${matchedTenant.name} 관리자`,
          role: "tenant_admin",
          tenantId: matchedTenant.id,
          subtenantId: null,
        },
        ...subtenantsPayload.data.map((subtenant) => ({
          label: subtenant.name,
          role: "subtenant_member" as const,
          tenantId: matchedTenant.id,
          subtenantId: subtenant.id,
        })),
      ];

      setModal((prev) => ({
        ...prev,
        tenantId: matchedTenant.id,
        selectedTarget: nextOptions[0]?.label ?? "",
        options: nextOptions,
        loadingTargets: false,
      }));
    } catch (loadError) {
      setModal((prev) => ({
        ...prev,
        tenantId: null,
        selectedTarget: "",
        options: [],
        loadingTargets: false,
      }));
      setError(loadError instanceof Error ? loadError.message : "승인 옵션을 불러오지 못했습니다.");
    }
  };

  if (loading || pageLoading) {
    return (
      <div className="rounded-[14px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 text-[14px] text-gray-500 dark:text-slate-400">
        가입 승인 목록을 불러오는 중입니다...
      </div>
    );
  }

  if (currentUser?.role === "subtenant_member") {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      {error ? (
        <div className="rounded-[14px] border border-rose-200 bg-rose-50 px-4 py-4 text-[14px] text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="rounded-[14px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-[20px] font-bold text-gray-900 dark:text-slate-100">
              <ShieldCheck size={20} className="text-primary-600" />
              가입 승인
            </h1>
            <p className="mt-1 text-[13px] text-gray-500 dark:text-slate-400">
              pending 상태 사용자 계정을 검토하고 권한을 부여합니다.
            </p>
          </div>
          <div className="rounded-full border border-gray-200 dark:border-slate-700 px-3 py-1 text-[12px] font-semibold text-gray-500 dark:text-slate-400">
            Total {pendingUsers.length}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[14px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-[#FAFAFA] dark:bg-slate-900/50">
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="whitespace-nowrap px-5 py-4 text-[12px] font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400">이메일</th>
                <th className="whitespace-nowrap px-5 py-4 text-[12px] font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400">이름</th>
                <th className="whitespace-nowrap px-5 py-4 text-[12px] font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400">소속 회사</th>
                <th className="whitespace-nowrap px-5 py-4 text-[12px] font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400">가입 일시</th>
                <th className="whitespace-nowrap px-5 py-4 text-[12px] font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400">액션</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.length === 0 ? (
                <tr>
                  <td className="px-5 py-14 text-center text-[14px] text-gray-400 dark:text-slate-500" colSpan={5}>
                    승인 대기 중인 사용자가 없습니다.
                  </td>
                </tr>
              ) : (
                pendingUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 dark:border-slate-700">
                    <td className="px-5 py-4 text-[13px] font-medium text-gray-900 dark:text-slate-100">{user.email ?? "-"}</td>
                    <td className="px-5 py-4 text-[13px] text-gray-700 dark:text-slate-300">{user.name ?? "-"}</td>
                    <td className="px-5 py-4 text-[13px] text-gray-700 dark:text-slate-300">{user.tenantName ?? "-"}</td>
                    <td className="px-5 py-4 text-[13px] text-gray-500 dark:text-slate-400">{formatDateTime(user.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          className="inline-flex items-center gap-1 rounded-[8px] bg-primary-600 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-primary-700"
                          onClick={() => void openApprovalModal(user)}
                          type="button"
                        >
                          <CheckCircle2 size={14} />
                          승인
                        </button>
                        <button
                          className="inline-flex items-center gap-1 rounded-[8px] border border-rose-200 px-3 py-1.5 text-[12px] font-semibold text-rose-600 transition hover:bg-rose-50"
                          onClick={async () => {
                            const confirmed = window.confirm("이 사용자의 가입 요청을 거절할까요?");

                            if (!confirmed) {
                              return;
                            }

                            setSubmitting(true);
                            setError(null);

                            try {
                              await rejectUser(user.id);
                              setPendingUsers((prev) => prev.filter((item) => item.id !== user.id));
                            } catch (rejectError) {
                              setError(rejectError instanceof Error ? rejectError.message : "가입 거절에 실패했습니다.");
                            } finally {
                              setSubmitting(false);
                            }
                          }}
                          type="button"
                        >
                          <Trash2 size={14} />
                          거절
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal.open && modal.user ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-2xl overflow-hidden rounded-[16px] bg-white dark:bg-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 px-6 py-4">
              <h2 className="text-[18px] font-bold text-gray-900 dark:text-slate-100">가입 승인</h2>
              <button
                className="text-gray-400 dark:text-slate-500 transition hover:text-gray-900 dark:text-slate-100"
                onClick={() => setModal(defaultModalState)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div className="grid gap-4">
                <label className="block">
                  <span className="mb-1 block text-[12px] font-semibold text-gray-500 dark:text-slate-400">이메일</span>
                  <input className="bg-white dark:bg-slate-900 h-11 w-full rounded-[10px] border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 px-4 text-[14px]" readOnly value={modal.user.email ?? ""} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[12px] font-semibold text-gray-500 dark:text-slate-400">이름</span>
                  <input className="bg-white dark:bg-slate-900 h-11 w-full rounded-[10px] border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 px-4 text-[14px]" readOnly value={modal.user.name ?? ""} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[12px] font-semibold text-gray-500 dark:text-slate-400">소속 회사</span>
                  <input className="bg-white dark:bg-slate-900 h-11 w-full rounded-[10px] border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 px-4 text-[14px]" readOnly value={modal.user.tenantName ?? ""} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[12px] font-semibold text-gray-500 dark:text-slate-400">승인 대상</span>
                  <select
                    className="h-11 w-full rounded-[10px] border border-gray-200 dark:border-slate-700 px-4 text-[14px]"
                    disabled={modal.loadingTargets}
                    onChange={(event) =>
                      setModal((prev) => ({
                        ...prev,
                        selectedTarget: event.target.value,
                        memberRole:
                          prev.options.find((option) => option.label === event.target.value)?.role === "subtenant_member"
                            ? prev.memberRole
                            : null,
                      }))
                    }
                    value={modal.selectedTarget}
                  >
                    {modal.loadingTargets ? <option value="">불러오는 중...</option> : null}
                    {!modal.loadingTargets && modal.options.length === 0 ? <option value="">선택 가능한 항목이 없습니다</option> : null}
                    {modal.options.map((option) => (
                      <option key={option.label} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                {selectedOption?.role === "subtenant_member" ? (
                  <label className="block">
                    <span className="mb-1 block text-[12px] font-semibold text-gray-500 dark:text-slate-400">구성원 역할</span>
                    <select
                      className="h-11 w-full rounded-[10px] border border-gray-200 dark:border-slate-700 px-4 text-[14px]"
                      onChange={(event) =>
                        setModal((prev) => ({
                          ...prev,
                          memberRole: event.target.value as Exclude<MemberRole, null>,
                        }))
                      }
                      value={modal.memberRole ?? "member"}
                    >
                      <option value="pm">PM</option>
                      <option value="member">멤버</option>
                    </select>
                  </label>
                ) : null}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/70 px-6 py-4">
              <button
                className="rounded-[10px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-[13px] font-semibold text-gray-600 dark:text-slate-400"
                onClick={() => setModal(defaultModalState)}
                type="button"
              >
                취소
              </button>
              <button
                className="rounded-[10px] bg-primary-600 px-5 py-2 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                disabled={submitting || modal.loadingTargets || !selectedOption || (selectedOption.role === "subtenant_member" && !modal.memberRole)}
                onClick={async () => {
                  if (!modal.user || !selectedOption) {
                    return;
                  }

                  setSubmitting(true);
                  setError(null);

                  try {
                    await approveUser({
                      userId: modal.user.id,
                      role: selectedOption.role,
                      tenantId: selectedOption.tenantId,
                      subtenantId: selectedOption.subtenantId,
                      name: modal.user.name,
                      memberRole: selectedOption.role === "subtenant_member" ? modal.memberRole : null,
                    });

                    setPendingUsers((prev) => prev.filter((user) => user.id !== modal.user?.id));
                    setModal(defaultModalState);
                  } catch (approveError) {
                    setError(approveError instanceof Error ? approveError.message : "가입 승인에 실패했습니다.");
                  } finally {
                    setSubmitting(false);
                  }
                }}
                type="button"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="rounded-[14px] border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 text-[13px] text-gray-500 dark:text-slate-400">
        <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-slate-300">
          <Users size={16} className="text-primary-600" />
          권한 규칙
        </div>
        <p className="mt-2">일반 회원가입자는 선택한 tenantName 기준으로 승인 대상을 자동 매핑합니다.</p>
      </div>
    </div>
  );
}
