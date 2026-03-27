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
  let initialTenants = [];
  let initialSubtenants = [];
  let initialAllocations = [];
  let initialIncidents = [];
  let initialCredits = [];
  let initialTenantId = null;

  try {
    const currentUser = await requireCurrentUser();
    initialTenants = await getScopedTenants(currentUser);
    initialTenantId = initialTenants[0]?.id ?? null;
    const creditsPayload = initialTenantId
      ? await Promise.all([
          getScopedSubtenants(currentUser, initialTenantId),
          getScopedAllocations(currentUser, initialTenantId),
          getIncidentsForTenant(currentUser, initialTenantId),
          getCreditsForTenant(currentUser, initialTenantId),
        ])
      : [[], [], [], { items: [], groups: [] }];
    initialSubtenants = creditsPayload[0];
    initialAllocations = creditsPayload[1];
    initialIncidents = creditsPayload[2];
    initialCredits = creditsPayload[3].items;
  } catch (error) {
    console.error("[billing/incidents] failed to load page data", error);
  }

  return (
    <IncidentsPageClient
      initialTenants={initialTenants}
      initialSubtenants={initialSubtenants}
      initialAllocations={initialAllocations}
      initialIncidents={initialIncidents}
      initialCredits={initialCredits}
      initialTenantId={initialTenantId}
    />
  );
}
