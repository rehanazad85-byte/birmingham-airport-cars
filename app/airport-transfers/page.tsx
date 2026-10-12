import type { Metadata } from "next";
import Link from "next/link";
import { airportHubSlugs, seoAirports } from "@/lib/seo-airports";

export const metadata: Metadata = {
  title: { absolute: "Birmingham Airport Transfers | Fixed-Price Taxis" },
  description: "Fixed-price airport transfers from Birmingham and the West Midlands to BHX, Heathrow, Gatwick, Manchester and more. 24/7, flight monitoring.",
  alternates: { canonical: "/airport-transfers" },
};

export default function AirportTransfersPage() {
  return <>
    <section className="bg-ink text-white"><div className="mx-auto max-w-7xl px-4 py-20 lg:px-8"><p className="text-xs font-semibold uppercase tracking-[.28em] text-gold-400">West Midlands airport specialists</p><h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold sm:text-5xl">Birmingham Airport Transfers</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">Fixed price transfers from Birmingham and the West Midlands to BHX, Heathrow, Gatwick, Manchester and more. Pick an airport for route guides, access details and a quote from your exact address.</p><Link href="/book-now" className="mt-8 inline-block rounded-full bg-gold-500 px-7 py-4 font-semibold text-black">Get an instant fare</Link></div></section>
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8"><h2 className="font-serif text-3xl">Supported airport hubs</h2><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{airportHubSlugs.map((slug)=>{const airport=seoAirports[slug];return <article className="rounded-2xl border p-7" key={slug}><h3 className="font-serif text-2xl">{airport.name}</h3><p className="mt-3 text-sm leading-6 text-black/60">{airport.overview}</p><Link className="mt-5 inline-block font-semibold underline" href={`/airport-transfers/${slug}`}>View {airport.shortName} transfers</Link></article>})}</div></section>
  </>;
}
