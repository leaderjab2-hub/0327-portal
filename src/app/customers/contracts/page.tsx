import { requireCurrentUser } from "@/lib/auth";
import { getScopedSubtenants, getScopedTenants } from "@/lib/serverPageData";
import ContractsPageClient from "./ContractsPageClient";

export default async function Page() {
  let initialTenantRecords: Awaited<ReturnType<typeof getScopedTenants>> = [];
  let initialSubtenantRecords: Awaited<ReturnType<typeof getScopedSubtenants>> = [];

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
