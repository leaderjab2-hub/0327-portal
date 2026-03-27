import { requireCurrentUser } from "@/lib/auth";
import { getCreditsForTenant, getScopedTenants } from "@/lib/serverPageData";
import CreditsPageClient from "./CreditsPageClient";

export default async function Page() {
  const currentUser = await requireCurrentUser();
  const initialTenants = await getScopedTenants(currentUser);
  const initialTenantId = initialTenants[0]?.id ?? null;
  const initialCredits = initialTenantId
    ? await getCreditsForTenant(currentUser, initialTenantId)
    : { items: [], groups: [] };

  return (
    <CreditsPageClient
      initialTenants={initialTenants}
      initialItems={initialCredits.items}
      initialGroups={initialCredits.groups}
      initialTenantId={initialTenantId}
    />
  );
}
