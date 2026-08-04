import Link from "next/link";
import type { Airport } from "@/lib/airports";
import type { AirportRoute } from "@/lib/airport-routes";
import type { Location } from "@/lib/locations";
import type { ApprovedRoutePricing } from "@/lib/route-pricing-examples";
import { formatApprovedMoney } from "@/lib/route-pricing-examples";
import { vehicleCapacities } from "@/lib/vehicle-capacity";

export function RouteDirectAnswer({
  route,
  airport,
  location,
  pricing,
}: {
  route: AirportRoute;
  airport: Airport;
  location: Location;
  pricing: ApprovedRoutePricing | null;
}) {
  const hasExample = typeof pricing?.approvedExampleFare === "number";
  const hasRange =
    typeof pricing?.approvedTypicalFareMinimum === "number" &&
    typeof pricing?.approvedTypicalFareMaximum === "number";

  return (
    <section className="mx-auto max-w-7xl px-4 pt-12 lg:px-8" aria-labelledby="route-answer-heading">
      <div className="rounded-2xl border border-gold-500/30 bg-white p-7">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Quick route answer</p>
        <h2 id="route-answer-heading" className="mt-2 font-serif text-3xl">
          {location.name} to {airport.name}: fare, time and vehicle guidance
        </h2>
        <p className="mt-4 max-w-5xl leading-7 text-black/65">
          The representative pickup is {route.representativePickup}, {route.representativePostcode}. Distance guidance is {route.distanceRange.toLowerCase()}. Journey-time guidance is {route.journeyTimeRange.toLowerCase()}.
        </p>
        {hasExample ? (
          <p className="mt-3 max-w-5xl leading-7 text-black/65">
            An approved example {vehicleCapacities[pricing.vehicleType].label.toLowerCase()} fare from {pricing.representativePickupName}, {pricing.representativePickupPostcode} to {pricing.destinationTerminal} is from £{formatApprovedMoney(pricing.approvedExampleFare!)}. The confirmed fare depends on the exact pickup address, vehicle and booking requirements.
          </p>
        ) : null}
        {hasRange ? (
          <p className="mt-3 font-semibold">
            Typical approved {vehicleCapacities[pricing.vehicleType].label.toLowerCase()} fare guidance: £{formatApprovedMoney(pricing.approvedTypicalFareMinimum!)}–£{formatApprovedMoney(pricing.approvedTypicalFareMaximum!)}.
          </p>
        ) : null}
        {!pricing ? (
          <p className="mt-3 max-w-5xl leading-7 text-black/65">
            Prices depend on the exact pickup address, vehicle and journey requirements. Enter your pickup location to receive a confirmed quotation.
          </p>
        ) : null}
        <p className="mt-3 max-w-5xl leading-7 text-black/65">
          Choose a vehicle for the complete passenger and large-suitcase totals. Saloon and Executive combinations are more restricted at four passengers; Estate, MPV and Large MPV options provide different capacities.
        </p>
        <Link href="/book-now" className="mt-5 inline-block font-semibold underline">Check your exact journey</Link>
      </div>
    </section>
  );
}
