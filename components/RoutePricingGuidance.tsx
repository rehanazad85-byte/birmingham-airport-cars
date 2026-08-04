import Link from "next/link";
import type { ApprovedRoutePricing } from "@/lib/route-pricing-examples";
import { calculateCostPerPassenger, formatApprovedMoney } from "@/lib/route-pricing-examples";
import { vehicleCapacities } from "@/lib/vehicle-capacity";

export function RoutePricingGuidance({ pricing }: { pricing: ApprovedRoutePricing | null }) {
  const hasExample = typeof pricing?.approvedExampleFare === "number";
  const hasRange =
    typeof pricing?.approvedTypicalFareMinimum === "number" &&
    typeof pricing?.approvedTypicalFareMaximum === "number";
  const perPassenger = pricing ? calculateCostPerPassenger(pricing) : null;

  return (
    <aside className="rounded-2xl bg-cream p-7">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Pricing guidance</p>
      <h2 className="mt-2 font-serif text-2xl">Quotation for your journey</h2>

      {hasRange ? (
        <p className="mt-4 text-lg font-semibold">
          Typical approved {vehicleCapacities[pricing.vehicleType].label.toLowerCase()} fare guidance: £
          {formatApprovedMoney(pricing.approvedTypicalFareMinimum!)}–£
          {formatApprovedMoney(pricing.approvedTypicalFareMaximum!)}.
        </p>
      ) : null}

      {hasExample ? (
        <p className="mt-3 leading-7 text-black/65">
          Approved representative journey: {pricing.representativePickupName}, {pricing.representativePickupPostcode} to {pricing.destinationTerminal} by {vehicleCapacities[pricing.vehicleType].label.toLowerCase()}, from £{formatApprovedMoney(pricing.approvedExampleFare!)}.
        </p>
      ) : null}

      {perPassenger !== null && pricing?.passengerCount ? (
        <p className="mt-3 text-sm leading-6 text-black/60">
          £{formatApprovedMoney(perPassenger)} per person when the vehicle fare is shared by {pricing.passengerCount} passengers. This is a simple division of the total vehicle fare for comparison; passengers are not charged individually.
        </p>
      ) : null}

      {pricing ? (
        <p className="mt-4 text-sm leading-6 text-black/60">
          {pricing.conditions} The confirmed fare depends on the exact pickup address, selected vehicle and booking requirements, and is provided before booking.
        </p>
      ) : (
        <p className="mt-4 leading-7 text-black/65">
          Prices depend on the exact pickup address, vehicle and journey requirements. Enter your pickup location to receive a confirmed quotation.
        </p>
      )}

      <Link href="/book-now" className="mt-5 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-white">
        Get an exact quote
      </Link>
    </aside>
  );
}
