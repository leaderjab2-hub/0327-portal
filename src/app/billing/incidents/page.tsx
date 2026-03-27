import { requireCurrentUser } from "@/lib/auth";
import {
  getCreditsForTenant,
  getIncidentsForTenant,
  getScopedAllocations,
  getScopedSubtenants,
  getScopedTenants,
} from "@/lib/serverPageData";
import IncidentsPageClient from "./IncidentsPageClient";

export default async function Page() {
  const currentUser = await requireCurrentUser();
  const initialTenants = await getScopedTenants(currentUser);
  const initialTenantId = initialTenants[0]?.id ?? null;
  const [initialSubtenants, initialAllocations, initialIncidents, initialCredits] = initialTenantId
    ? await Promise.all([
        getScopedSubtenants(currentUser, initialTenantId),
        getScopedAllocations(currentUser, initialTenantId),
        getIncidentsForTenant(currentUser, initialTenantId),
        getCreditsForTenant(currentUser, initialTenantId),
      ])
    : [[], [], [], { items: [], groups: [] }];

  return (
    <IncidentsPageClient
      initialTenants={initialTenants}
      initialSubtenants={initialSubtenants}
      initialAllocations={initialAllocations}
      initialIncidents={initialIncidents}
      initialCredits={initialCredits.items}
      initialTenantId={initialTenantId}
    />
  );
}
