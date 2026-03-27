import { requireCurrentUser } from "@/lib/auth";
import { getMembersForTenant, getScopedSubtenants, getScopedTenants } from "@/lib/serverPageData";
import CustomerListPageClient from "./CustomerListPageClient";

export default async function Page() {
  const currentUser = await requireCurrentUser();
  const [initialTenants, initialSubtenants] = await Promise.all([
    getScopedTenants(currentUser),
    getScopedSubtenants(currentUser),
  ]);
  const initialMembersTenantId = initialTenants[0]?.id ?? null;
  const initialMembers = initialMembersTenantId
    ? await getMembersForTenant(currentUser, initialMembersTenantId)
    : [];

  return (
    <CustomerListPageClient
      initialTenantRecords={initialTenants}
      initialSubtenantRecords={initialSubtenants}
      initialMembers={initialMembers}
      initialMembersTenantId={initialMembersTenantId}
    />
  );
}
