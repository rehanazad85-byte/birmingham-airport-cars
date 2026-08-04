import Link from "next/link";
import type { AirportRoute } from "@/lib/airport-routes";
import type { Airport } from "@/lib/airports";

export function RoutePricingGuidance({
  route,
  airport,
}: {
  route: AirportRoute;
  airport: Airport;
}) {
  const hasApprovedFare = Boolean(route.typicalFareRange) || typeof route.exampleSaloonFare === "number";

  return (
    <aside className="rounded-2xl bg-cream p-7">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">
        Pricing guidance
      </p>
      <h2 className="mt-2 font-serif text-2xl">Fixed quotation for your journey</h2>
      {route.typicalFareRange ? (
        <p className="mt-4 text-lg font-semibold">
          Typical saloon fare: £{route.typicalFareRange.minimum}–£{route.typicalFareRange.maximum}
        </p>
      ) : null}
      {typeof route.exampleSaloonFare === "number" ? (
        <p className="mt-3 leading-7 text-black/65">
          Example: {route.representativePostcode} {route.representativePickup} to {airport.name} from £
          {route.exampleSaloonFare}.
        </p>
      ) : null}
      {hasApprovedFare ? (
        <p className="mt-4 text-sm leading-6 text-black/60">
          The example is based on the named representative pickup. Your confirmed fare depends on the
          exact address, selected vehicle and booking requirements.
        </p>
      ) : (
        <p className="mt-4 leading-7 text-black/65">
          Enter your exact pickup location for a confirmed fixed quotation.
        </p>
      )}
      <Link href="/book-now" className="mt-5 inline-block font-semibold underline">
        Get an exact quote
      </Link>
    </aside>
  );
}
