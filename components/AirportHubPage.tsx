import Link from "next/link";
import { AirportAccessInfo } from "@/components/AirportAccessInfo";
import { locations } from "@/lib/locations";
import { getPublishedRoutesForAirport } from "@/lib/seo-routes";
import type { SeoAirport } from "@/lib/seo-airports";

const baseUrl = "https://birminghamairportcars.co.uk";

export function AirportHubPage({ airport }: { airport: SeoAirport }) {
  const routes = getPublishedRoutesForAirport(airport.slug);
  const canonical = `${baseUrl}/airport-transfers/${airport.slug}`;
  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Airport Transfers", item: `${baseUrl}/airport-transfers` },
      { "@type": "ListItem", position: 3, name: airport.name, item: canonical },
    ],
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    <nav aria-label="Breadcrumb" className="border-b bg-cream"><ol className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-4 text-sm text-black/60 lg:px-8"><li><Link href="/">Home</Link></li><li aria-hidden="true">/</li><li><Link href="/airport-transfers">Airport Transfers</Link></li><li aria-hidden="true">/</li><li aria-current="page" className="text-black">{airport.name}</li></ol></nav>
    <section className="bg-ink text-white"><div className="mx-auto max-w-7xl px-4 py-20 lg:px-8"><p className="text-xs font-semibold uppercase tracking-[.28em] text-gold-400">Private airport transfers</p><h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold sm:text-5xl">{airport.name} Transfers</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">{airport.overview} Travel in a comfort-standard private vehicle with passenger and luggage capacity selected for your party.</p><Link href="/book-now" className="mt-8 inline-block rounded-full bg-gold-500 px-7 py-4 font-semibold text-black">Get an exact-address quote</Link></div></section>
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8"><p className="text-sm font-semibold uppercase tracking-widest text-gold-600">West Midlands coverage</p><h2 className="mt-2 font-serif text-3xl">Published routes to {airport.shortName}</h2><p className="mt-4 max-w-3xl leading-7 text-black/65">Choose a route guide for local pickup information, pricing guidance and airport-specific booking details. Additional combinations will be published only when useful route content is available.</p><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{routes.map((route)=><article className="rounded-2xl border p-6" key={route.slug}><h3 className="font-serif text-2xl">{locations[route.locationSlug].name} to {airport.name}</h3><p className="mt-3 text-sm leading-6 text-black/60">Private pre-booked transfer with an exact-address quotation and vehicle capacity checks.</p><Link className="mt-4 inline-block font-semibold underline" href={`/airport-transfers/${route.slug}`}>View route guide</Link></article>)}</div></section>
    <AirportAccessInfo airportSlug={airport.slug} />
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-2 lg:px-8"><article className="rounded-2xl border p-7"><h2 className="font-serif text-3xl">Return airport transfers</h2><p className="mt-4 leading-7 text-black/65">Book your return journey together and save 10% on the return journey fare. The discount applies to the second leg’s journey fare only; airport access charges remain payable in full.</p><Link href="/book-now" className="mt-5 inline-block font-semibold underline">Calculate a return quote</Link></article><article className="rounded-2xl border p-7"><h2 className="font-serif text-3xl">Areas we cover</h2><p className="mt-4 leading-7 text-black/65">Read local pickup guidance for Walsall, Birmingham, Wolverhampton, Sutton Coldfield and the wider service area.</p><Link href="/areas-we-cover" className="mt-5 inline-block font-semibold underline">Explore all area guides</Link></article></section>
  </>;
}
