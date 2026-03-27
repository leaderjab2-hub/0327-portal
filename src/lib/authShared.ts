import type { User } from "@supabase/supabase-js";
import type { CurrentUser, UserMetadata } from "@/types/auth";

export const AUTH_ROUTES = ["/login", "/signup", "/pending"] as const;

export function normalizeCurrentUser(user: User | null): CurrentUser | null {
  if (!user) {
    return null;
  }

  const metadata = (user.user_metadata ?? {}) as UserMetadata;

  return {
    id: user.id,
    email: user.email ?? null,
    role: metadata.role ?? "pending",
    tenantId: metadata.tenantId ?? metadata.tenant_id ?? null,
    subtenantId: metadata.subtenantId ?? metadata.subtenant_id ?? null,
    name: metadata.name ?? metadata.full_name ?? null,
    memberRole: metadata.memberRole ?? metadata.member_role ?? null,
  };
}
