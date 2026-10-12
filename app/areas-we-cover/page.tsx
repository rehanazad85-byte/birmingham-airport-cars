import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { locations, locationSlugs } from "@/lib/locations";

export const metadata: Metadata = {
  title: { absolute: "Airport Taxi Coverage Across the West Midlands" },
  description: "Fixed-price airport taxis from Walsall, Wolverhampton, Sutton Coldfield, Solihull and across the West Midlands. 24/7 service. Call 07474 234244.",
  alternates: { canonical: "/areas-we-cover" },
};

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Local coverage" title="Airport transfers across the West Midlands">
        <p>Fixed price airport taxis and transfers from towns across the West Midlands, including Walsall, Wolverhampton, Sutton Coldfield and Solihull. Pick your town for local pickup details and a quote.</p>
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
                <h2 className="font-serif text-2xl group-hover:text-gold-600">{location.name}</h2>
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
    </>
  );
}
