export type UserRole = "admin" | "tenant_admin" | "subtenant_member" | "pending";

export type MemberRole = "pm" | "member" | null;

export type CurrentUser = {
  id: string;
  email: string | null;
  role: UserRole;
  tenantId: string | null;
  subtenantId: string | null;
  name: string | null;
  memberRole?: MemberRole;
};

export type UserMetadata = {
  role?: UserRole;
  tenantId?: string | null;
  tenant_id?: string | null;
  subtenantId?: string | null;
  subtenant_id?: string | null;
  name?: string | null;
  full_name?: string | null;
  memberRole?: MemberRole;
  member_role?: MemberRole;
};
