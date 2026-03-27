import { requireCurrentUser } from "@/lib/auth";
import { getScopedSubtenants, getScopedTenants } from "@/lib/serverPageData";
import ContractsPageClient from "./ContractsPageClient";

export default async function Page() {
  const currentUser = await requireCurrentUser();
  const [initialTenants, initialSubtenants] = await Promise.all([
    getScopedTenants(currentUser),
    getScopedSubtenants(currentUser),
  ]);

  return (
    <ContractsPageClient
      initialTenantRecords={initialTenants}
      initialSubtenantRecords={initialSubtenants}
    />
  );
}
