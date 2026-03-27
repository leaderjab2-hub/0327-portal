import { requireCurrentUser } from "@/lib/auth";
import { getMembersForTenant, getScopedSubtenants, getScopedTenants } from "@/lib/serverPageData";
import CustomerListPageClient from "./CustomerListPageClient";

export default async function Page() {
  let initialTenantRecords: Awaited<ReturnType<typeof getScopedTenants>> = [];
  let initialSubtenantRecords: Awaited<ReturnType<typeof getScopedSubtenants>> = [];
  let initialMembers: Awaited<ReturnType<typeof getMembersForTenant>> = [];
  let initialMembersTenantId: string | null = null;

  try {
    const currentUser = await requireCurrentUser();
    [initialTenantRecords, initialSubtenantRecords] = await Promise.all([
      getScopedTenants(currentUser),
      getScopedSubtenants(currentUser),
    ]);
    initialMembersTenantId = initialTenantRecords[0]?.id ?? null;
    initialMembers = initialMembersTenantId
      ? await getMembersForTenant(currentUser, initialMembersTenantId)
      : [];
  } catch (error) {
    console.error("[customers/list] failed to load page data", error);
  }

  return (
    <CustomerListPageClient
      initialTenantRecords={initialTenantRecords}
      initialSubtenantRecords={initialSubtenantRecords}
      initialMembers={initialMembers}
      initialMembersTenantId={initialMembersTenantId}
    />
  );
}
