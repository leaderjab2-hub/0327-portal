import { requireCurrentUser } from "@/lib/auth";
import { getMeteringForTenant, getScopedTenants } from "@/lib/serverPageData";
import MeteringPageClient from "./MeteringPageClient";

export default async function Page() {
  const currentUser = await requireCurrentUser();
  const initialTenants = await getScopedTenants(currentUser);
  const initialTenantId = initialTenants[0]?.id ?? null;
  const initialMetering = initialTenantId ? await getMeteringForTenant(currentUser, initialTenantId) : null;

  return (
    <MeteringPageClient
      initialTenants={initialTenants}
      initialMetering={initialMetering}
      initialTenantId={initialTenantId}
    />
  );
}
