import "server-only";

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizeCurrentUser } from "@/lib/authShared";
import type { CurrentUser, UserRole } from "@/types/auth";

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return normalizeCurrentUser(user);
}

export async function requireCurrentUser() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("UNAUTHORIZED");
  }

  if (currentUser.role === "pending") {
    throw new Error("PENDING");
  }

  return currentUser;
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function canAccessTenant(currentUser: CurrentUser, tenantId: string | null | undefined) {
  if (currentUser.role === "admin") {
    return true;
  }

  if (!tenantId) {
    return false;
  }

  return currentUser.tenantId === tenantId;
}

export function canManageSubtenant(
  currentUser: CurrentUser,
  tenantId: string | null | undefined,
  subtenantId?: string | null,
) {
  if (currentUser.role === "admin") {
    return true;
  }

  if (currentUser.role === "tenant_admin") {
    return currentUser.tenantId === tenantId;
  }

  if (currentUser.role === "subtenant_member") {
    return currentUser.tenantId === tenantId && currentUser.subtenantId === subtenantId;
  }

  return false;
}

export function assertRole(currentUser: CurrentUser, roles: UserRole[]) {
  if (!roles.includes(currentUser.role)) {
    throw new Error("FORBIDDEN");
  }
}

export async function getAuthUserById(userId: string) {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

  if (error) {
    throw error;
  }

  return data.user;
}

export function handleAuthError(error: unknown) {
  if (!(error instanceof Error)) {
    return jsonError("Unexpected error", 500);
  }

  if (error.message === "UNAUTHORIZED") {
    return jsonError("Authentication required", 401);
  }

  if (error.message === "PENDING") {
    return jsonError("Approval pending", 403);
  }

  if (error.message === "FORBIDDEN") {
    return jsonError("Forbidden", 403);
  }

  return jsonError(error.message || "Unexpected error", 500);
}
