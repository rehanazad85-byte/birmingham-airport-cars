import {
  BriefcaseBusiness,
  CarFront,
  CheckCircle2,
  Clock3,
  Plane,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import type { Location } from "@/lib/locations";
import { locations } from "@/lib/locations";
import { getPublishedRoutesForArea } from "@/lib/seo-routes";
import { seoAirports } from "@/lib/seo-airports";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Price confirmed in advance",
    copy: "Your journey details are checked before a fixed price is confirmed, so the booked fare is clear before collection.",
  },
  {
    icon: Plane,
    title: "Flight monitoring",
    copy: "For airport pickups, the supplied flight details help the service follow current arrival information.",
  },
  {
    icon: CarFront,
    title: "A vehicle for the journey",
    copy: "Choose from vehicle options designed for individual travellers, families, business passengers and larger groups.",
  },
  {
    icon: Clock3,
    title: "Planned collections",
    copy: "Pre-booking allows the pickup to be organised around your departure or arrival rather than left until the day.",
  },
] as const;

export function LocationLandingPage({ location }: { location: Location }) {
  const publishedRoutes = getPublishedRoutesForArea(location.slug);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://birminghamairportcars.co.uk/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Areas We Cover",
        item: "https://birminghamairportcars.co.uk/areas-we-cover",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: location.name,
        item: `https://birminghamairportcars.co.uk/areas-we-cover/${location.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="border-b bg-cream">
        <ol className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-4 text-sm text-black/60 lg:px-8">
          <li><Link className="hover:text-gold-600" href="/">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link className="hover:text-gold-600" href="/areas-we-cover">Areas We Cover</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-black">{location.name}</li>
        </ol>
      </nav>

      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[.28em] text-gold-400">
            West Midlands airport travel
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold sm:text-5xl">
            Airport Transfers from {location.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">{location.heroIntro}</p>
          <Link
            href="/book-now"
            className="mt-8 inline-block rounded-full bg-gold-500 px-7 py-4 font-semibold text-black hover:bg-gold-400"
          >
            Request an airport transfer quote
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Route guides</p>
        <h2 className="mt-2 font-serif text-3xl">Published airport routes from {location.name}</h2>
        <p className="mt-4 max-w-3xl leading-7 text-black/65">Use a commercial route guide for airport access information, route-specific planning and a direct link to the exact-address calculator.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {publishedRoutes.map((route) => <article className="rounded-2xl border p-6" key={route.slug}><h3 className="font-serif text-2xl">{location.name} to {seoAirports[route.airportSlug].name}</h3>{route.fixedSaloonFare ? <p className="mt-3 font-semibold">Approved Saloon journey fare: £{route.fixedSaloonFare}</p> : <p className="mt-3 text-sm text-black/60">Enter the exact address for a live estimated fare.</p>}<Link className="mt-4 inline-block font-semibold underline" href={`/airport-transfers/${route.slug}`}>View route guide</Link></article>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_.72fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Local service</p>
            <h2 className="mt-2 font-serif text-3xl">Airport travel from {location.name}</h2>
            <div className="mt-5 space-y-4 leading-7 text-black/65">
              {location.localIntro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
          <aside className="rounded-2xl bg-cream p-7">
            <h2 className="font-serif text-2xl">Local pickup areas</h2>
            <p className="mt-3 text-sm leading-6 text-black/60">
              Collections can be requested from these and surrounding {location.name} areas:
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {location.pickupAreas.map((area) => (
                <li className="flex items-center gap-2 text-sm" key={area}>
                  <CheckCircle2 className="shrink-0 text-gold-600" size={17} />
                  {area}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:px-8">
          <article className="rounded-2xl bg-white p-7 shadow-sm">
            <Plane className="text-gold-500" />
            <h2 className="mt-5 font-serif text-3xl">{location.name} to Birmingham Airport</h2>
            <div className="mt-4 space-y-4 leading-7 text-black/65">
              {location.birminghamAirport.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <Link className="mt-5 inline-block font-semibold underline" href={`/airport-transfers/${location.slug}-to-birmingham-airport`}>
              View the {location.name} to Birmingham Airport guide
            </Link>
          </article>
          <article className="rounded-2xl bg-white p-7 shadow-sm">
            <BriefcaseBusiness className="text-gold-500" />
            <h2 className="mt-5 font-serif text-3xl">Transfers to other UK airports</h2>
            <p className="mt-4 leading-7 text-black/65">{location.otherAirports.introduction}</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {location.otherAirports.airports.map((airport) => (
                <li className="flex items-center gap-2 text-sm" key={airport}>
                  <CheckCircle2 className="shrink-0 text-gold-600" size={17} />
                  {airport}
                </li>
              ))}
            </ul>
            <Link
              className="mt-5 inline-block font-semibold underline"
              href={`/airport-transfers/${location.slug}-to-heathrow-airport`}
            >
              View the {location.name} to Heathrow Airport guide
            </Link>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Why pre-book</p>
          <h2 className="mt-2 font-serif text-3xl">A clear, practical airport-transfer service</h2>
          <p className="mt-4 leading-7 text-black/65">
            Fixed-price confirmation and flight monitoring are designed to make airport travel easier
            to plan. Full passenger and luggage details help identify a suitable vehicle before the journey.
          </p>
        </div>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, copy }) => (
            <article className="rounded-2xl border p-6" key={title}>
              <Icon className="text-gold-500" />
              <h3 className="mt-4 font-serif text-xl">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-black/60">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-400">Useful answers</p>
          <h2 className="mt-2 font-serif text-3xl">{location.name} airport transfer FAQs</h2>
          <div className="mt-8 space-y-4">
            {location.faqs.map(({ question, answer }) => (
              <article className="rounded-xl border border-white/10 bg-white/5 p-6" key={question}>
                <h3 className="font-semibold">{question}</h3>
                <p className="mt-3 leading-7 text-white/65">{answer}</p>
              </article>
            ))}
          </div>
          <p className="mt-7 text-white/65">
            More general booking guidance is available in our{" "}
            <Link className="text-gold-400 underline" href="/airport-taxi-faqs">airport taxi FAQs</Link>.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl">Nearby airport transfer areas</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {location.nearbySlugs.map((slug) => (
                <Link
                  className="rounded-full border px-5 py-2.5 text-sm font-semibold hover:border-gold-500"
                  href={`/areas-we-cover/${slug}`}
                  key={slug}
                >
                  {locations[slug].name}
                </Link>
              ))}
            </div>
            <p className="mt-6 text-sm text-black/60">
              See the complete <Link className="font-semibold text-black underline" href="/areas-we-cover">West Midlands coverage list</Link>.
            </p>
          </div>
          <div className="rounded-2xl bg-cream p-7">
            <h2 className="font-serif text-3xl">Planning regular business travel?</h2>
            <p className="mt-3 leading-7 text-black/65">
              Companies arranging airport journeys for staff and guests can learn more about our planned
              account service.
            </p>
            <Link className="mt-5 inline-block font-semibold underline" href="/business-accounts">
              Explore business accounts
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:flex-row sm:items-center lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Plan your transfer</p>
            <h2 className="mt-2 font-serif text-3xl">Travelling from {location.name}?</h2>
          </div>
          <Link href="/book-now" className="rounded-full bg-ink px-7 py-4 font-semibold text-white">
            Request an airport transfer quote
          </Link>
        </div>
      </section>
    </>
  );
}
