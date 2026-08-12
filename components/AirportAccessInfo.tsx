import { formatGBP } from "@/lib/pricing";
import { getAirportAccessSummary, type AirportHubSlug } from "@/lib/seo-airports";
import { seoAirports } from "@/lib/seo-airports";

export function AirportAccessInfo({ airportSlug }: { airportSlug: AirportHubSlug }) {
  const airport = seoAirports[airportSlug];
  const access = getAirportAccessSummary(airportSlug);
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Airport access</p>
        <h2 className="mt-2 font-serif text-3xl">Drop-off and collection at {airport.name}</h2>
        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl bg-white p-7">
            <h3 className="font-serif text-2xl">Airport drop-off</h3>
            <p className="mt-3 leading-7 text-black/65">{airport.departureGuidance}</p>
            <p className="mt-3 font-semibold">{access.customerSelection ? `Free or ${formatGBP(access.dropOffCharge)} Drop & Go` : `${formatGBP(access.dropOffCharge)} access charge`}</p>
          </article>
          <article className="rounded-2xl bg-white p-7">
            <h3 className="font-serif text-2xl">Airport collection</h3>
            <p className="mt-3 leading-7 text-black/65">{airport.collectionGuidance}</p>
            <p className="mt-3 font-semibold">{access.customerSelection ? `Free or ${formatGBP(access.pickupCharge)} Drop & Go` : `${formatGBP(access.pickupCharge)} access charge`}</p>
          </article>
        </div>
        <p className="mt-5 max-w-4xl text-sm leading-6 text-black/60">Airport access is calculated separately from the underlying journey fare. Book both directions together to save 10% on the return journey fare; airport access charges remain payable in full.</p>
      </div>
    </section>
  );
}
