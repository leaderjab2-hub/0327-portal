import { requireCurrentUser } from "@/lib/auth";
import { getScopedSubtenants, getScopedTenants } from "@/lib/serverPageData";
import ContractsPageClient from "./ContractsPageClient";

export default async function Page() {
  let initialTenantRecords = [];
  let initialSubtenantRecords = [];

  try {
    const currentUser = await requireCurrentUser();
    [initialTenantRecords, initialSubtenantRecords] = await Promise.all([
      getScopedTenants(currentUser),
      getScopedSubtenants(currentUser),
    ]);
  } catch (error) {
    console.error("[customers/contracts] failed to load page data", error);
  }

  return (
    <ContractsPageClient
      initialTenantRecords={initialTenantRecords}
      initialSubtenantRecords={initialSubtenantRecords}
    />
  );
}
