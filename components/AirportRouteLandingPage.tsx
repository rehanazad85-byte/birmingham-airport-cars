import { BriefcaseBusiness, CarFront, Plane, Radar, UsersRound } from "lucide-react";
import Link from "next/link";
import { RoutePricingGuidance } from "@/components/RoutePricingGuidance";
import { airports } from "@/lib/airports";
import type { AirportRoute } from "@/lib/airport-routes";
import { airportRoutes } from "@/lib/airport-routes";
import { locations } from "@/lib/locations";

const vehicleOptions = [
  ["Saloon", "For up to four passengers, subject to the luggage combination."],
  ["Estate", "Extra case capacity for up to four passengers."],
  ["Executive", "A premium option for business or personal travel."],
  ["MPV", "Group travel for up to six passengers, within luggage limits."],
  ["Large MPV", "The largest option, for up to eight passengers and eight large cases."],
] as const;

export function AirportRouteLandingPage({ route }: { route: AirportRoute }) {
  const location = locations[route.locationSlug];
  const airport = airports[route.destinationAirport];
  const isHeathrowRoute = route.destinationAirport === "heathrow";
  const canonical = `https://birminghamairportcars.co.uk/airport-transfers/${route.slug}`;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://birminghamairportcars.co.uk/" },
      { "@type": "ListItem", position: 2, name: "Areas We Cover", item: "https://birminghamairportcars.co.uk/areas-we-cover" },
      { "@type": "ListItem", position: 3, name: `${location.name} to ${airport.name}`, item: canonical },
    ],
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    <nav aria-label="Breadcrumb" className="border-b bg-cream">
      <ol className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-4 text-sm text-black/60 lg:px-8">
        <li><Link className="hover:text-gold-600" href="/">Home</Link></li><li aria-hidden="true">/</li>
        <li><Link className="hover:text-gold-600" href="/areas-we-cover">Areas We Cover</Link></li><li aria-hidden="true">/</li>
        <li aria-current="page" className="text-black">{location.name} to {airport.name}</li>
      </ol>
    </nav>

    <section className="bg-ink text-white"><div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[.28em] text-gold-400">Direct airport travel</p>
      <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold sm:text-5xl">{location.name} to {airport.name} Transfers</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
        {isHeathrowRoute
          ? `Pre-book a direct journey from ${location.name} to ${airport.name}, with a confirmed quote, a suitable vehicle and collection planned around your flight details.`
          : "Pre-book a door-to-terminal journey with a confirmed price, a vehicle suited to the party and collection planned around your flight."}
      </p>
      <Link href="/book-now" className="mt-8 inline-block rounded-full bg-gold-500 px-7 py-4 font-semibold text-black hover:bg-gold-400">Get an airport transfer quote</Link>
    </div></section>

    <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 lg:grid-cols-[1fr_.72fr] lg:px-8">
      <article><p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Route guide</p><h2 className="mt-2 font-serif text-3xl">A planned transfer from {location.name}</h2>
        <div className="mt-5 space-y-4 leading-7 text-black/65">{route.introduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <p className="mt-4 leading-7 text-black/65">{route.routeContext}</p>
      </article>
      {isHeathrowRoute ? <RoutePricingGuidance route={route} airport={airport} /> :
        <aside className="rounded-2xl bg-cream p-7"><Plane className="text-gold-500"/><h2 className="mt-4 font-serif text-2xl">Fixed-price booking</h2>
          <p className="mt-3 leading-7 text-black/65">The pickup, Birmingham Airport destination and requested details are checked before a fixed price is confirmed. The agreed journey is not priced by a running meter.</p>
          <Link href="/book-now" className="mt-5 inline-block font-semibold underline">Check your journey</Link>
        </aside>}
    </section>

    {isHeathrowRoute ? <section className="bg-cream"><div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 md:grid-cols-3 lg:px-8">
      <article className="rounded-2xl bg-white p-7"><h2 className="font-serif text-2xl">Representative pickup</h2><p className="mt-3 leading-7 text-black/65">{route.representativePickup}, {route.representativePostcode}</p><p className="mt-3 text-sm leading-6 text-black/60">This reference point helps explain the route only. Your quote and collection use the exact address entered.</p></article>
      <article className="rounded-2xl bg-white p-7"><h2 className="font-serif text-2xl">Approximate distance</h2><p className="mt-3 leading-7 text-black/65">{route.distanceRange}</p><p className="mt-3 text-sm leading-6 text-black/60">The actual distance depends on the pickup address, terminal and route used.</p></article>
      <article className="rounded-2xl bg-white p-7"><h2 className="font-serif text-2xl">Typical road time</h2><p className="mt-3 leading-7 text-black/65">{route.journeyTimeRange}</p><p className="mt-3 text-sm leading-6 text-black/60">This is a planning range, not a guaranteed journey time.</p></article>
    </div></section> : null}

    <section className="bg-cream"><div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Choose suitable space</p><h2 className="mt-2 font-serif text-3xl">Vehicle options for passengers and luggage</h2>
      <p className="mt-4 max-w-3xl leading-7 text-black/65">Enter every passenger and large suitcase when checking a fare. Capacity limits apply to the selected vehicle, and some four-passenger options cannot also carry large suitcases.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{vehicleOptions.map(([name, copy]) => <article className="rounded-2xl bg-white p-6" key={name}><CarFront className="text-gold-500"/><h3 className="mt-4 font-serif text-xl">{name}</h3><p className="mt-3 text-sm leading-6 text-black/60">{copy}</p></article>)}</div>
    </div></section>

    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 md:grid-cols-3 lg:px-8">
      <article className="rounded-2xl border p-7"><Radar className="text-gold-500"/><h2 className="mt-4 font-serif text-2xl">Flight monitoring</h2><p className="mt-3 leading-7 text-black/65">For a booked airport pickup, the correct flight number allows current arrival information to be followed if the schedule changes.</p></article>
      <article className="rounded-2xl border p-7"><Plane className="text-gold-500"/><h2 className="mt-4 font-serif text-2xl">Pickup and drop-off</h2><p className="mt-3 leading-7 text-black/65">{route.pickupGuidance} {airport.terminalSummary}</p></article>
      <article className="rounded-2xl border p-7"><UsersRound className="text-gold-500"/><h2 className="mt-4 font-serif text-2xl">Passenger guidance</h2><p className="mt-3 leading-7 text-black/65">Include children in the passenger total and count every large suitcase. Mention wheelchairs, pushchairs or unusual items before the vehicle is confirmed.</p></article>
    </section>

    <section className="bg-ink text-white"><div className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold-400">Useful answers</p><h2 className="mt-2 font-serif text-3xl">{location.name} to {airport.name} FAQs</h2>
      <div className="mt-8 space-y-4">{route.faqs.map(({ question, answer }) => <article className="rounded-xl border border-white/10 bg-white/5 p-6" key={question}><h3 className="font-semibold">{question}</h3><p className="mt-3 leading-7 text-white/65">{answer}</p></article>)}</div>
      <p className="mt-7 text-white/65">Find broader answers in the <Link className="text-gold-400 underline" href="/airport-taxi-faqs">airport taxi FAQs</Link>.</p>
    </div></section>

    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:px-8">
      <div><h2 className="font-serif text-3xl">Nearby {airport.name} routes</h2><div className="mt-5 flex flex-wrap gap-3">{route.nearbyRouteSlugs.map((slug) => { const nearbyRoute = airportRoutes[slug]; const nearby = locations[nearbyRoute.locationSlug]; return <Link className="rounded-full border px-5 py-2.5 text-sm font-semibold hover:border-gold-500" href={`/airport-transfers/${slug}`} key={slug}>{nearby.name} to {airports[nearbyRoute.destinationAirport].name}</Link>; })}</div>
        <p className="mt-6 text-sm text-black/60">Read the full <Link className="font-semibold text-black underline" href={`/areas-we-cover/${location.slug}`}>{location.name} airport transfer area guide</Link> or view <Link className="font-semibold text-black underline" href="/areas-we-cover">all areas</Link>.</p>
        {isHeathrowRoute ? <p className="mt-4 text-sm text-black/60">For regional departures, see the <Link className="font-semibold text-black underline" href={`/airport-transfers/${location.slug}-to-birmingham-airport`}>{location.name} to Birmingham Airport route</Link>.</p> : null}
      </div>
      <aside className="rounded-2xl bg-cream p-7"><BriefcaseBusiness className="text-gold-500"/><h2 className="mt-4 font-serif text-3xl">Business airport travel</h2><p className="mt-3 leading-7 text-black/65">Companies arranging regular travel for staff or guests can discuss planned account requirements.</p><Link className="mt-5 inline-block font-semibold underline" href="/business-accounts">Explore business accounts</Link></aside>
    </section>

    {isHeathrowRoute ? <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8"><article className="rounded-2xl border p-7"><Plane className="text-gold-500"/><h2 className="mt-4 font-serif text-3xl">Heathrow terminals and collection</h2><p className="mt-3 leading-7 text-black/65">{airport.terminalSummary}</p><p className="mt-4 leading-7 text-black/65">{airport.collectionGuidance}</p></article></section> : null}

    <section className="bg-cream"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:flex-row sm:items-center lg:px-8"><div><p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Request your journey</p><h2 className="mt-2 font-serif text-3xl">Travelling from {location.name} to {airport.name}?</h2></div><Link href="/book-now" className="rounded-full bg-ink px-7 py-4 font-semibold text-white">Get a quote</Link></div></section>
  </>;
}
