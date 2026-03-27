"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthError, EmailOtpType } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { normalizeCurrentUser } from "@/lib/authShared";
import type { CurrentUser, MemberRole, UserRole } from "@/types/auth";

type ApproveUserInput = {
  userId: string;
  role: Exclude<UserRole, "pending">;
  tenantId?: string | null;
  subtenantId?: string | null;
  name?: string | null;
  memberRole?: MemberRole;
};

type InviteUserInput = {
  email: string;
  role: "tenant_admin" | "subtenant_member";
  tenantId: string;
  subtenantId?: string | null;
  memberRole?: MemberRole;
};

type AuthContextValue = {
  currentUser: CurrentUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  logout: () => Promise<{ error: AuthError | null }>;
  signUpPending: (input: {
    name: string;
    email: string;
    password: string;
    tenantName: string;
  }) => Promise<{ error: AuthError | null }>;
  prepareInviteSession: (input: {
    code?: string | null;
    tokenHash?: string | null;
    type?: string | null;
    accessToken?: string | null;
    refreshToken?: string | null;
  }) => Promise<{ error: string | null; email: string | null }>;
  completeInviteSignup: (input: {
    name: string;
    password: string;
  }) => Promise<{ error: string | null }>;
  refreshCurrentUser: () => Promise<void>;
  approveUser: (input: ApproveUserInput) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  inviteUser: (input: InviteUserInput) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function readJson(response: Response) {
  const payload = (await response.json().catch(() => ({}))) as { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed");
  }

  return payload;
}

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: CurrentUser | null;
}) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(initialUser);
  const [loading, setLoading] = useState(initialUser ? false : true);
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const refreshCurrentUser = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setCurrentUser(normalizeCurrentUser(user));
  }, [supabase]);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const normalizedUser = normalizeCurrentUser(user);

      if (mounted) {
        setCurrentUser(normalizedUser);
        setLoading(false);
      }
    };

    void bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) {
        return;
      }

      setCurrentUser(normalizeCurrentUser(session?.user ?? null));
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      loading,
      async login(email, password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error) {
          await refreshCurrentUser();
        }
        return { error };
      },
      async signUpPending({ email, password, name, tenantName }) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: "pending",
              name,
              tenantName,
            },
            emailRedirectTo: `${window.location.origin}/signup`,
          },
        });
        if (!error) {
          await refreshCurrentUser();
        }
        return { error };
      },
      async prepareInviteSession({ code, tokenHash, type, accessToken, refreshToken }) {
        if (code) {
          const exchangeResult = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeResult.error) {
            return { error: exchangeResult.error.message, email: null };
          }

          await refreshCurrentUser();
          return { error: null, email: exchangeResult.data.user?.email ?? null };
        }

        if (tokenHash && type === "invite") {
          const verifyResult = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: "invite" as EmailOtpType,
          });

          if (verifyResult.error) {
            return { error: verifyResult.error.message, email: null };
          }

          await refreshCurrentUser();
          return { error: null, email: verifyResult.data.user?.email ?? null };
        }

        if (accessToken && refreshToken) {
          const sessionResult = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionResult.error) {
            return { error: sessionResult.error.message, email: null };
          }

          await refreshCurrentUser();
          return { error: null, email: sessionResult.data.user?.email ?? null };
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          await refreshCurrentUser();
          return { error: null, email: user.email ?? null };
        }

        return { error: "초대 링크 정보를 확인할 수 없습니다. 초대 링크를 다시 열어 주세요.", email: null };
      },
      async completeInviteSignup({ name, password }) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          return { error: "초대 세션이 만료되었습니다. 초대 링크를 다시 확인해 주세요." };
        }

        const updateResult = await supabase.auth.updateUser({
          password,
          data: {
            ...(user?.user_metadata ?? {}),
            name,
          },
        });

        if (updateResult.error) {
          return { error: updateResult.error.message };
        }

        await supabase.auth.signOut();
        setCurrentUser(null);

        return { error: null };
      },
      async logout() {
        const { error } = await supabase.auth.signOut();
        if (!error) {
          setCurrentUser(null);
        }
        return { error };
      },
      refreshCurrentUser,
      async approveUser(input) {
        await readJson(
          await fetch("/api/approve-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
          }),
        );
      },
      async rejectUser(userId) {
        await readJson(
          await fetch("/api/reject-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          }),
        );
      },
      async inviteUser(input) {
        await readJson(
          await fetch("/api/invite-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
          }),
        );
      },
    }),
    [currentUser, loading, refreshCurrentUser, supabase],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
