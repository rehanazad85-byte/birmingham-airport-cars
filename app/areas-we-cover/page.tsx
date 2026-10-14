import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { locations, locationSlugs } from "@/lib/locations";

export const metadata: Metadata = {
  title: { absolute: "Airport Taxi Coverage Across the West Midlands" },
  description: "Fixed-price airport taxis from Walsall, Wolverhampton, Sutton Coldfield, Solihull and across the West Midlands. 24/7 service. Call 07474 234244.",
  alternates: { canonical: "/areas-we-cover" },
};

const areasFaqs:Array<[string,string]>=[["Which towns do you cover?","Walsall, Wolverhampton, Sutton Coldfield, West Bromwich, Dudley, Solihull and Cannock, plus the wider West Midlands."],["Can you pick up from my home address?","Yes. We quote and collect from your exact address, not just a town centre point."],["How far ahead should I book?","Book as early as you can for early morning flights so the pickup is confirmed, though we take later bookings when drivers are free."]];
const areasFaqSchema={"@context":"https://schema.org","@type":"FAQPage","@id":"https://birminghamairportcars.co.uk/areas-we-cover#faq",mainEntity:areasFaqs.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))};

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Local coverage" title="Airport transfers across the West Midlands">
        <p>Fixed price airport taxis from towns across the West Midlands. Pick your town for local pickup details and a quote.</p>
      </PageHero>
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {locationSlugs.map((slug) => {
            const location = locations[slug];
            return (
              <Link
                className="group rounded-xl border p-6 transition hover:border-gold-500 hover:shadow-sm"
                href={`/areas-we-cover/${slug}`}
                key={slug}
              >
                <h3 className="font-serif text-2xl group-hover:text-gold-600">{location.name}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">
                  Local pickup information, airport coverage and useful transfer FAQs.
                </p>
                <span className="mt-4 inline-block text-sm font-semibold">View area guide →</span>
              </Link>
            );
          })}
        </div>
        <Link href="/book-now" className="mt-10 inline-block rounded-lg bg-gold-500 px-6 py-3 font-semibold">
          Check a fare
        </Link>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="font-serif text-3xl">Local airport taxis from your town</h2>
          <p className="mt-4 leading-7 text-black/65">We cover Walsall, Wolverhampton, Sutton Coldfield, West Bromwich, Dudley, Solihull and Cannock, with pickup from your exact home, hotel or work address rather than a town centre point. Each town has its own guide with local pickup notes and how the fare is worked out.</p>
          <p className="mt-4 leading-7 text-black/65">Birmingham Airport (BHX) is the closest run for most of these towns, and the fare is fixed and quoted from your address. Open your town to get started, or call <a className="font-semibold underline" href="tel:07474234244">07474 234244</a>.</p>
        </div>
      </section>
      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
          <h2 className="font-serif text-3xl">Local coverage FAQs</h2>
          <div className="mt-6 space-y-4">
            {areasFaqs.map(([q, a]) => (
              <details className="rounded-xl border p-5" key={q}><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-3 leading-7 text-black/65">{a}</p></details>
            ))}
          </div>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(areasFaqSchema) }} />
        </div>
      </section>
    </>
  );
}
