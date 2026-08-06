import Link from "next/link";
import type { AirportKnowledge as AirportKnowledgeData } from "@/lib/airport-knowledge";
import type { Airport } from "@/lib/airports";

export function AirportKnowledge({ airport, knowledge }: { airport: Airport; knowledge: AirportKnowledgeData }) {
  return (
    <section className="bg-cream" aria-labelledby={`${knowledge.airportId}-knowledge-heading`}>
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Airport knowledge</p>
        <h2 id={`${knowledge.airportId}-knowledge-heading`} className="mt-2 font-serif text-3xl">Planning travel to and from {airport.name}</h2>
        <p className="mt-4 max-w-4xl leading-7 text-black/65">{knowledge.overview}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl bg-white p-7"><h3 className="font-serif text-2xl">Terminals and departures</h3><p className="mt-3 leading-7 text-black/65">{knowledge.terminalOverview}</p><p className="mt-3 leading-7 text-black/65">{knowledge.departurePlanning}</p><p className="mt-3 text-sm leading-6 text-black/60">{knowledge.checkInReminder}</p></article>
          <article className="rounded-2xl bg-white p-7"><h3 className="font-serif text-2xl">Drop-off and collection</h3><p className="mt-3 leading-7 text-black/65">{knowledge.dropOffGuidance}</p><p className="mt-3 leading-7 text-black/65">{knowledge.collectionGuidance}</p></article>
          <article className="rounded-2xl bg-white p-7"><h3 className="font-serif text-2xl">Flight and journey details</h3><p className="mt-3 leading-7 text-black/65">{knowledge.flightNumberGuidance}</p><p className="mt-3 leading-7 text-black/65">{knowledge.delayedFlightGuidance}</p></article>
        </div>
        <div className="mt-8 space-y-4">{knowledge.answers.map(({ question, answer }) => <details className="rounded-xl border bg-white p-5" key={question}><summary className="cursor-pointer font-semibold">{question}</summary><p className="mt-3 leading-7 text-black/65">{answer}</p></details>)}</div>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold"><Link className="underline" href="/airport-taxi-faqs">Read the airport taxi FAQs</Link><Link className="underline" href="/book-now">Request an airport transfer quote</Link><Link className="underline" href="/business-accounts">Explore business airport travel</Link></div>
      </div>
    </section>
  );
}
