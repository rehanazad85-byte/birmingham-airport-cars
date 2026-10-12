import type { Metadata } from "next";
import Link from "next/link";
import { airportHubSlugs, seoAirports } from "@/lib/seo-airports";

export const metadata: Metadata = {
  title: { absolute: "Birmingham Airport Transfers | Fixed-Price Taxis" },
  description: "Fixed-price airport transfers from Birmingham and the West Midlands to BHX, Heathrow, Gatwick, Manchester and more. 24/7, flight monitoring.",
  alternates: { canonical: "/airport-transfers" },
};

const transfersFaqs:Array<[string,string]>=[["Which airports do you cover?","Birmingham (BHX), Heathrow, Gatwick, Manchester, East Midlands, Luton and Stansted, from Birmingham and the West Midlands."],["Is the transfer price fixed?","Yes. It is quoted from your exact pickup and drop off and does not change with traffic or demand."],["Do you handle long distance airport runs?","Yes. Heathrow, Gatwick, Luton and Stansted are longer motorway journeys we book every day."],["Can I book a return?","Yes. Add the return date and time with your quote, and each direction is priced on its own."]];
const transfersFaqSchema={"@context":"https://schema.org","@type":"FAQPage","@id":"https://birminghamairportcars.co.uk/airport-transfers#faq",mainEntity:transfersFaqs.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))};

export default function AirportTransfersPage() {
  return <>
    <section className="bg-ink text-white"><div className="mx-auto max-w-7xl px-4 py-20 lg:px-8"><p className="text-xs font-semibold uppercase tracking-[.28em] text-gold-400">West Midlands airport specialists</p><h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold sm:text-5xl">Birmingham Airport Transfers</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">Fixed price transfers from Birmingham and the West Midlands to BHX, Heathrow, Gatwick and more. Pick an airport for a quote.</p><Link href="/book-now" className="mt-8 inline-block rounded-full bg-gold-500 px-7 py-4 font-semibold text-black">Get an instant fare</Link></div></section>
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8"><h2 className="font-serif text-3xl">Supported airport hubs</h2><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{airportHubSlugs.map((slug)=>{const airport=seoAirports[slug];return <article className="rounded-2xl border p-7" key={slug}><h3 className="font-serif text-2xl">{airport.name}</h3><p className="mt-3 text-sm leading-6 text-black/60">{airport.overview}</p><Link className="mt-5 inline-block font-semibold underline" href={`/airport-transfers/${slug}`}>View {airport.shortName} transfers</Link></article>})}</div></section>
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8"><div className="max-w-3xl"><h2 className="font-serif text-3xl">Transfers to every major UK airport</h2><p className="mt-4 leading-7 text-black/65">Birmingham Airport (BHX) is the shortest run for most West Midlands journeys. For the longer trips we also cover Heathrow, Gatwick, Manchester, East Midlands, Luton and Stansted, with the terminal and airport charges built into one fixed price.</p><p className="mt-4 leading-7 text-black/65">Every transfer is quoted from your exact address, so there is no surge pricing. Pick the airport you are flying from for its route guide and a quote, or call <a className="font-semibold underline" href="tel:07474234244">07474 234244</a> to book by phone.</p></div></section>
    <section className="bg-cream"><div className="mx-auto max-w-4xl px-4 py-16 lg:px-8"><h2 className="font-serif text-3xl">Airport transfer FAQs</h2><div className="mt-6 space-y-4">{transfersFaqs.map(([q,a])=><details className="rounded-xl border p-5" key={q}><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-3 leading-7 text-black/65">{a}</p></details>)}</div><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(transfersFaqSchema)}}/></div></section>
  </>;
}
