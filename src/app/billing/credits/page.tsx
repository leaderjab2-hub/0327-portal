import { requireCurrentUser } from "@/lib/auth";
import { getCreditsForTenant, getScopedTenants } from "@/lib/serverPageData";
import CreditsPageClient from "./CreditsPageClient";

export default async function Page() {
  let initialTenants: Awaited<ReturnType<typeof getScopedTenants>> = [];
  let initialItems: Awaited<ReturnType<typeof getCreditsForTenant>>["items"] = [];
  let initialGroups: Awaited<ReturnType<typeof getCreditsForTenant>>["groups"] = [];
  let initialTenantId: string | null = null;

  try {
    const currentUser = await requireCurrentUser();
    initialTenants = await getScopedTenants(currentUser);
    initialTenantId = initialTenants[0]?.id ?? null;
    const initialCredits = initialTenantId
      ? await getCreditsForTenant(currentUser, initialTenantId)
      : { items: [], groups: [] };
    initialItems = initialCredits.items;
    initialGroups = initialCredits.groups;
  } catch (error) {
    console.error("[billing/credits] failed to load page data", error);
  }

  return (
    <CreditsPageClient
      initialTenants={initialTenants}
      initialItems={initialItems}
      initialGroups={initialGroups}
      initialTenantId={initialTenantId}
    />
  );
}
