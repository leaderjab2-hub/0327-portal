import { requireCurrentUser } from "@/lib/auth";
import { getScopedAllocations, getScopedSubtenants, getScopedTenants } from "@/lib/serverPageData";
import ResourcesPageClient from "./ResourcesPageClient";

export default async function Page() {
  const currentUser = await requireCurrentUser();
  const [initialTenants, initialSubtenants, initialAllocations] = await Promise.all([
    getScopedTenants(currentUser),
    getScopedSubtenants(currentUser),
    getScopedAllocations(currentUser),
  ]);

  return (
    <ResourcesPageClient
      initialTenantRecords={initialTenants}
      initialSubtenantRecords={initialSubtenants}
      initialAllocationRecords={initialAllocations}
    />
  );
}
