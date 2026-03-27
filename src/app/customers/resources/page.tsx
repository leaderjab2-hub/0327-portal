import { requireCurrentUser } from "@/lib/auth";
import { getScopedAllocations, getScopedSubtenants, getScopedTenants } from "@/lib/serverPageData";
import ResourcesPageClient from "./ResourcesPageClient";

export default async function Page() {
  let initialTenantRecords = [];
  let initialSubtenantRecords = [];
  let initialAllocationRecords = [];

  try {
    const currentUser = await requireCurrentUser();
    [initialTenantRecords, initialSubtenantRecords, initialAllocationRecords] = await Promise.all([
      getScopedTenants(currentUser),
      getScopedSubtenants(currentUser),
      getScopedAllocations(currentUser),
    ]);
  } catch (error) {
    console.error("[customers/resources] failed to load page data", error);
  }

  return (
    <ResourcesPageClient
      initialTenantRecords={initialTenantRecords}
      initialSubtenantRecords={initialSubtenantRecords}
      initialAllocationRecords={initialAllocationRecords}
    />
  );
}
