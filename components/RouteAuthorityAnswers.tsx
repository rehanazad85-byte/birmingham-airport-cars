import Link from "next/link";
import type { Airport } from "@/lib/airports";
import type { Location } from "@/lib/locations";
import type { RouteAuthorityContent } from "@/lib/route-authority-content";

export function RouteAuthorityAnswers({
  airport,
  location,
  content,
}: {
  airport: Airport;
  location: Location;
  content: RouteAuthorityContent;
}) {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Plan with the full details</p>
        <h2 className="mt-2 font-serif text-3xl">Planning and booking your {location.name} airport transfer</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border p-7"><h3 className="font-serif text-2xl">Local collection and route planning</h3><p className="mt-3 leading-7 text-black/65">{content.localPickupCoverage}</p><p className="mt-3 leading-7 text-black/65">{content.representativePickupQualification}</p><p className="mt-3 leading-7 text-black/65">{content.journeyPlanning}</p></article>
          <article className="rounded-2xl border p-7"><h3 className="font-serif text-2xl">What your quotation needs</h3><p className="mt-3 leading-7 text-black/65">{content.quotationFactors}</p><p className="mt-3 leading-7 text-black/65">{content.bookingInformation}</p><Link className="mt-5 inline-block font-semibold underline" href="/book-now">Request an exact airport-transfer quote</Link></article>
          <article className="rounded-2xl border p-7"><h3 className="font-serif text-2xl">Outbound and return journeys</h3><p className="mt-3 leading-7 text-black/65">{airport.outboundGuidance}</p><p className="mt-3 leading-7 text-black/65">{content.returnJourneyGuidance}</p></article>
          <article className="rounded-2xl border p-7"><h3 className="font-serif text-2xl">Children and additional requirements</h3><p className="mt-3 leading-7 text-black/65">{content.childAndSpecialItemGuidance}</p><p className="mt-3 leading-7 text-black/65">{content.businessTravelGuidance} <Link className="font-semibold underline" href="/business-accounts">View business accounts</Link>.</p></article>
        </div>
      </section>

      <section className="bg-ink text-white"><div className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold-400">Planning and booking answers</p>
        <h2 className="mt-2 font-serif text-3xl">Useful answers for {location.name} to {airport.name}</h2>
        <div className="mt-8 space-y-4">{content.answers.map(({ question, answer }) => <article className="rounded-xl border border-white/10 bg-white/5 p-6" key={question}><h3 className="font-semibold">{question}</h3><p className="mt-3 leading-7 text-white/65">{answer}</p></article>)}</div>
        <p className="mt-7 text-white/65">For general booking questions, read the <Link className="text-gold-400 underline" href="/airport-taxi-faqs">airport taxi FAQs</Link>.</p>
      </div></section>
    </>
  );
}
