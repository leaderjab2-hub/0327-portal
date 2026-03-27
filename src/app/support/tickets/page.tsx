import { requireCurrentUser } from "@/lib/auth";
import { getScopedTenants, getTickets } from "@/lib/serverPageData";
import TicketsPageClient from "./TicketsPageClient";

export default async function Page() {
  let initialTenants: Awaited<ReturnType<typeof getScopedTenants>> = [];
  let initialTickets: Awaited<ReturnType<typeof getTickets>> = [];
  let initialTenantId: string | null = null;

  try {
    const currentUser = await requireCurrentUser();
    initialTenants = await getScopedTenants(currentUser);
    initialTenantId = initialTenants[0]?.id ?? null;
    initialTickets = await getTickets(currentUser, initialTenantId ?? undefined);
  } catch (error) {
    console.error("[support/tickets] failed to load page data", error);
  }

  return (
    <TicketsPageClient
      initialTenants={initialTenants}
      initialTickets={initialTickets}
      initialTenantId={initialTenantId}
    />
  );
}
