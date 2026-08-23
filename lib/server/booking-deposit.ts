export interface BookingDepositPolicy {
  percentage: number;
  minimumDepositPence: number;
}

export const defaultBookingDepositPolicy: BookingDepositPolicy = {
  percentage: 25,
  minimumDepositPence: 0,
};

export function getBookingDepositPolicy(environment: Partial<NodeJS.ProcessEnv> = process.env): BookingDepositPolicy {
  const percentage = environment.BOOKING_DEPOSIT_PERCENTAGE ? Number(environment.BOOKING_DEPOSIT_PERCENTAGE) : defaultBookingDepositPolicy.percentage;
  const minimumDepositPence = environment.BOOKING_MINIMUM_DEPOSIT_PENCE ? Number(environment.BOOKING_MINIMUM_DEPOSIT_PENCE) : defaultBookingDepositPolicy.minimumDepositPence;
  if (!Number.isInteger(percentage) || percentage < 0 || percentage > 100 || !Number.isInteger(minimumDepositPence) || minimumDepositPence < 0) {
    throw new Error("Invalid server-side booking deposit configuration.");
  }
  return { percentage, minimumDepositPence };
}

export function calculateBookingDeposit(totalPence: number, policy: BookingDepositPolicy = getBookingDepositPolicy()) {
  if (!Number.isSafeInteger(totalPence) || totalPence < 0 || !Number.isInteger(policy.percentage) || policy.percentage < 0 || policy.percentage > 100 || !Number.isInteger(policy.minimumDepositPence) || policy.minimumDepositPence < 0) {
    throw new RangeError("The booking total or deposit policy is invalid.");
  }
  const percentageDeposit = Math.round(totalPence * policy.percentage / 100);
  const depositPence = Math.min(totalPence, Math.max(percentageDeposit, policy.minimumDepositPence));
  return { depositPercentage: policy.percentage, depositPence, balancePence: totalPence - depositPence };
}
