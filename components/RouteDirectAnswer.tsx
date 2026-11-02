import Link from "next/link";
import type { Airport } from "@/lib/airports";
import type { AirportRoute } from "@/lib/airport-routes";
import type { Location } from "@/lib/locations";
import type { ApprovedRoutePricing } from "@/lib/route-pricing-examples";
import { formatApprovedMoney } from "@/lib/route-pricing-examples";
import { vehicleCapacities } from "@/lib/vehicle-capacity";
import type { RouteAuthorityContent } from "@/lib/route-authority-content";

export function RouteDirectAnswer({
  route,
  airport,
  location,
  pricing,
  authorityContent,
}: {
  route: AirportRoute;
  airport: Airport;
  location: Location;
  pricing: ApprovedRoutePricing | null;
  authorityContent: RouteAuthorityContent;
}) {
  const hasExample = typeof pricing?.approvedExampleFare === "number";
  const hasRange =
    typeof pricing?.approvedTypicalFareMinimum === "number" &&
    typeof pricing?.approvedTypicalFareMaximum === "number";
  const vehicleLabel = pricing ? vehicleCapacities[pricing.vehicleType].label.toLowerCase() : null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-12 lg:px-8" aria-labelledby="route-answer-heading">
      <div className="rounded-2xl border border-gold-500/30 bg-white p-7">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Quick route answer</p>
        <h2 id="route-answer-heading" className="mt-2 font-serif text-3xl">
          How much is a taxi from {location.name} to {airport.name}?
        </h2>

        {hasExample ? (
          <p className="mt-4 max-w-5xl text-lg leading-8 text-black/70">
            For a representative journey from {pricing.representativePickupName} ({pricing.representativePickupPostcode}) to {pricing.destinationTerminal}, the {vehicleLabel} fare is <strong>£{formatApprovedMoney(pricing.approvedExampleFare!)}</strong>, before any applicable airport access charges. Your exact fare depends on your pickup address, vehicle and journey details.
          </p>
        ) : (
          <p className="mt-4 max-w-5xl text-lg leading-8 text-black/70">
            Birmingham Airport Cars provides pre-booked transfers from {location.name} to {airport.name}. Enter the exact pickup address, passenger and luggage requirements to receive a confirmed quotation before travel.
          </p>
        )}

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-cream p-4">
            <dt className="text-sm font-semibold text-black/60">Representative pickup</dt>
            <dd className="mt-1 font-semibold">{route.representativePickup}, {route.representativePostcode}</dd>
          </div>
          <div className="rounded-xl bg-cream p-4">
            <dt className="text-sm font-semibold text-black/60">Distance guidance</dt>
            <dd className="mt-1 font-semibold">{route.distanceRange}</dd>
          </div>
          <div className="rounded-xl bg-cream p-4">
            <dt className="text-sm font-semibold text-black/60">Journey-time guidance</dt>
            <dd className="mt-1 font-semibold">{route.journeyTimeRange}</dd>
          </div>
          <div className="rounded-xl bg-cream p-4">
            <dt className="text-sm font-semibold text-black/60">Largest vehicle option</dt>
            <dd className="mt-1 font-semibold">Up to 8 passengers / 8 large cases</dd>
          </div>
        </dl>

        {hasRange ? (
          <p className="mt-4 font-semibold">
            Typical approved {vehicleLabel} fare guidance: £{formatApprovedMoney(pricing.approvedTypicalFareMinimum!)}–£{formatApprovedMoney(pricing.approvedTypicalFareMaximum!)}.
          </p>
        ) : null}

        <p className="mt-5 max-w-5xl leading-7 text-black/65">
          Vehicle choice depends on the complete passenger and luggage combination. Saloon and Executive vehicles have more restricted luggage capacity at four passengers; Estate, MPV and Large MPV options provide additional capacity.
        </p>
        <p className="mt-3 max-w-5xl leading-7 text-black/65">{authorityContent.directAnswerBookingNote}</p>
        <Link href="/book-now" className="mt-5 inline-block font-semibold underline">Get an exact quote</Link>
      </div>
    </section>
  );
}
