import { requireCurrentUser } from "@/lib/auth";
import { getScopedTenants, getTickets } from "@/lib/serverPageData";
import TicketsPageClient from "./TicketsPageClient";

export default async function Page() {
  const currentUser = await requireCurrentUser();
  const initialTenants = await getScopedTenants(currentUser);
  const initialTenantId = initialTenants[0]?.id ?? null;
  const initialTickets = await getTickets(currentUser, initialTenantId ?? undefined);

  return (
    <TicketsPageClient
      initialTenants={initialTenants}
      initialTickets={initialTickets}
      initialTenantId={initialTenantId}
    />
  );
}
