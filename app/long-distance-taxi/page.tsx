import type { Metadata } from "next";
import Link from "next/link";
import { CarFront, MapPinned, Plane, UsersRound } from "lucide-react";

const baseUrl = "https://birminghamairportcars.co.uk";

export const metadata: Metadata = {
  title: "Long Distance Taxi Service | Pre-booked UK Journeys",
  description: "Request a pre-booked long-distance taxi quote for suitable UK journeys, with door-to-door travel, vehicle choice and exact-address pricing.",
  alternates: { canonical: "/long-distance-taxi" },
  openGraph: { title: "Long Distance Taxi Service | Birmingham Airport Cars", description: "Pre-book suitable long-distance private-hire journeys with exact-address pricing and vehicle options.", url: "/long-distance-taxi" },
};

const faqs = [
  ["How are long-distance taxi prices calculated?", "Select the actual pickup and destination in the quote form. The existing pricing system uses an approved fixed fare where configured or live driving-distance pricing where available, then applies the selected vehicle and any relevant airport access charges."],
  ["Is this a nationwide local taxi service?", "No. Birmingham Airport Cars quotes suitable pre-booked long-distance journeys. Availability and journey details are reviewed before a booking is confirmed."],
  ["Can I book an airport journey?", "Yes. Long-distance airport transfers can be quoted to supported airports, with the correct terminal, passenger, luggage and flight details supplied for planning."],
  ["Can I arrange a return journey?", "Yes. Book both directions together and save 10% on the return journey fare. The discount applies to the second leg’s journey fare only; airport access charges remain payable in full."],
  ["Which vehicle should I choose?", "Choose a comfort-standard vehicle that can carry the complete passenger and large-suitcase totals. Mention bulky or unusual items before booking."],
] as const;

export default function LongDistanceTaxiPage() {
  const canonical = `${baseUrl}/long-distance-taxi`;
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
    { "@type": "ListItem", position: 2, name: "Long Distance Taxi", item: canonical },
  ] };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    <nav aria-label="Breadcrumb" className="border-b bg-cream"><ol className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-4 text-sm text-black/60 lg:px-8"><li><Link href="/">Home</Link></li><li aria-hidden="true">/</li><li aria-current="page" className="text-black">Long Distance Taxi</li></ol></nav>
    <section className="bg-ink text-white"><div className="mx-auto max-w-7xl px-4 py-20 lg:px-8"><p className="text-xs font-semibold uppercase tracking-[.28em] text-gold-400">Pre-booked door-to-door travel</p><h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold sm:text-5xl">Long Distance Taxi Service</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">Request a private-hire quote for a suitable long-distance UK journey, with collection from the selected address, a comfort-standard vehicle and clear journey details.</p><Link href="/book-now" className="mt-8 inline-block rounded-full bg-gold-500 px-7 py-4 font-semibold text-black">Get an exact-address quote</Link></div></section>
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1fr_.7fr] lg:px-8"><article><p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Planned longer journeys</p><h2 className="mt-2 font-serif text-3xl">When a long-distance taxi can make sense</h2><div className="mt-5 space-y-4 leading-7 text-black/65"><p>A pre-booked long-range taxi can suit passengers who want one door-to-door journey rather than station changes, separate luggage handling or multiple local connections. It may be useful for airport travel, business appointments, family visits and other appropriate journeys agreed in advance.</p><p>This is not a claim to operate as a local taxi company in every UK town. The service quotes suitable journeys from the selected pickup to the selected destination, subject to availability and booking review.</p></div></article><aside className="rounded-2xl bg-cream p-7"><MapPinned className="text-gold-500"/><h2 className="mt-4 font-serif text-3xl">Exact-address pricing</h2><p className="mt-4 leading-7 text-black/65">Enter and select both real addresses. Where no approved fixed fare exists, the current live-distance engine calculates the route; no example fare is invented for this page.</p><Link href="/book-now" className="mt-5 inline-block font-semibold underline">Calculate your journey</Link></aside></section>
    <section className="bg-cream"><div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 md:grid-cols-3 lg:px-8"><article className="rounded-2xl bg-white p-7"><CarFront className="text-gold-500"/><h2 className="mt-4 font-serif text-2xl">Comfort and luggage</h2><p className="mt-3 leading-7 text-black/65">Select a vehicle within its passenger and luggage limits, and disclose bulky items before confirmation.</p></article><article className="rounded-2xl bg-white p-7"><Plane className="text-gold-500"/><h2 className="mt-4 font-serif text-2xl">Airport journeys</h2><p className="mt-3 leading-7 text-black/65">Long-distance airport travel is planned using the selected terminal, flight details and applicable airport access arrangement.</p></article><article className="rounded-2xl bg-white p-7"><UsersRound className="text-gold-500"/><h2 className="mt-4 font-serif text-2xl">Return journeys</h2><p className="mt-3 leading-7 text-black/65">Book both directions together and save 10% on the return journey fare; airport charges are not discounted.</p></article></div></section>
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8"><h2 className="font-serif text-3xl">Long-distance airport routes</h2><p className="mt-4 max-w-3xl leading-7 text-black/65">Explore detailed journey guidance for selected longer routes, or use the live calculator for another suitable address combination.</p><div className="mt-6 flex flex-wrap gap-3"><Link className="rounded-full border px-5 py-2.5 font-semibold" href="/airport-transfers/birmingham-to-heathrow-airport">Birmingham to Heathrow</Link><Link className="rounded-full border px-5 py-2.5 font-semibold" href="/airport-transfers/wolverhampton-to-heathrow-airport">Wolverhampton to Heathrow</Link><Link className="rounded-full border px-5 py-2.5 font-semibold" href="/airport-transfers/walsall-to-gatwick-airport">Walsall to Gatwick</Link></div></section>
    <section className="bg-ink text-white"><div className="mx-auto max-w-4xl px-4 py-16 lg:px-8"><p className="text-sm font-semibold uppercase tracking-widest text-gold-400">Useful answers</p><h2 className="mt-2 font-serif text-3xl">Long-distance taxi FAQs</h2><div className="mt-8 space-y-4">{faqs.map(([question, answer]) => <article className="rounded-xl border border-white/10 bg-white/5 p-6" key={question}><h3 className="font-semibold">{question}</h3><p className="mt-3 leading-7 text-white/65">{answer}</p></article>)}</div></div></section>
  </>;
}
