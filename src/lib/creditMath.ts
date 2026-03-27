export const GPU_CREDIT_PER_MINUTE = 1000 / 60;

export function calculateDurationMinutes(occurredAt: string, recoveredAt: string) {
  const start = new Date(occurredAt).getTime();
  const end = new Date(recoveredAt).getTime();

  if (Number.isNaN(start) || Number.isNaN(end) || end < start) {
    throw new Error("복구 시간은 발생 시간보다 이후여야 합니다.");
  }

  return Math.round((end - start) / (1000 * 60));
}

export function calculateCreditAmount(type: string, durationMinutes: number, gpuCount: number) {
  if (type === "regular_pm") {
    return 0;
  }

  const baseAmount = durationMinutes * gpuCount * GPU_CREDIT_PER_MINUTE;

  if (type === "urgent_pm") {
    return Math.round(baseAmount * 0.5);
  }

  return Math.round(baseAmount);
}
