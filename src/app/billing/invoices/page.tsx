import { requireCurrentUser } from "@/lib/auth";
import { getBillingsForTenant, getScopedSubtenants, getScopedTenants } from "@/lib/serverPageData";
import type { Database } from "@/types/database";
import InvoicesPageClient from "./InvoicesPageClient";

type BillingRow = Database["public"]["Tables"]["billings"]["Row"] & {
  credit_deduct?: number | null;
};

function toBillingRecord(row: BillingRow) {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    subtenantId: row.subtenant_id,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    gpuFee: row.gpu_fee ?? 0,
    cpuFee: row.cpu_fee ?? 0,
    storageFee: row.storage_fee ?? 0,
    networkFee: row.network_fee ?? 0,
    creditDeduction: row.credit_deduction ?? row.credit_deduct ?? 0,
    totalFee: row.total_fee ?? 0,
    invoiceUrl: row.invoice_url,
    memo: row.memo,
    registeredAt: row.registered_at,
  };
}

export default async function Page() {
  const currentUser = await requireCurrentUser();
  const [initialTenants, initialSubtenants] = await Promise.all([
    getScopedTenants(currentUser),
    getScopedSubtenants(currentUser),
  ]);
  const initialTenantId = initialTenants[0]?.id ?? null;
  const initialBillings = initialTenantId
    ? (await getBillingsForTenant(currentUser, initialTenantId)).map((row) => toBillingRecord(row as BillingRow))
    : [];

  return (
    <InvoicesPageClient
      initialTenantRecords={initialTenants}
      initialSubtenantRecords={initialSubtenants}
      initialBillings={initialBillings}
      initialTenantId={initialTenantId}
    />
  );
}
