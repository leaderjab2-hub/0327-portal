import { requireCurrentUser } from "@/lib/auth";
import { getMeteringForTenant, getScopedTenants } from "@/lib/serverPageData";
import MeteringPageClient from "./MeteringPageClient";

export default async function Page() {
  let initialTenants = [];
  let initialTenantId = null;
  let initialMetering = null;

  try {
    const currentUser = await requireCurrentUser();
    initialTenants = await getScopedTenants(currentUser);
    initialTenantId = initialTenants[0]?.id ?? null;
    initialMetering = initialTenantId ? await getMeteringForTenant(currentUser, initialTenantId) : null;
  } catch (error) {
    console.error("[billing/metering] failed to load page data", error);
  }

  return (
    <MeteringPageClient
      initialTenants={initialTenants}
      initialMetering={initialMetering}
      initialTenantId={initialTenantId}
    />
  );
}
