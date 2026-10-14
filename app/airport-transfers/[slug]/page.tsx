import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AirportRouteLandingPage } from "@/components/AirportRouteLandingPage";
import { AirportHubPage } from "@/components/AirportHubPage";
import { ExpandedAirportRoutePage } from "@/components/ExpandedAirportRoutePage";
import { airportRoutes, airportRouteSlugs, isAirportRouteSlug } from "@/lib/airport-routes";
import { airportHubSlugs, isAirportHubSlug, seoAirports } from "@/lib/seo-airports";
import { expandedRoutes, expandedRouteSlugs, getPublishedRoute, isExpandedRouteSlug } from "@/lib/seo-routes";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [...airportHubSlugs, ...airportRouteSlugs, ...expandedRouteSlugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (isAirportHubSlug(slug)) {
    const airport = seoAirports[slug];
    return { title: { absolute: airport.metaTitle }, description: airport.metaDescription, alternates: { canonical: `/airport-transfers/${slug}` }, openGraph: { title: airport.metaTitle, description: airport.metaDescription, url: `/airport-transfers/${slug}` } };
  }
  const route = getPublishedRoute(slug);
  if (!route) return {};
  return { title: { absolute: route.title }, description: route.metaDescription, alternates: { canonical: `/airport-transfers/${route.slug}` }, openGraph: { title: route.title, description: route.metaDescription, url: `/airport-transfers/${route.slug}` } };
}

const SITE = "https://birminghamairportcars.co.uk";

type Faq = { question: string; answer: string };

function pageGraph(opts: { path: string; name: string; crumbs: Array<{ name: string; item: string }>; faqs?: Faq[] }) {
  const graph: Record<string, unknown>[] = [
    { "@type": "BreadcrumbList", itemListElement: opts.crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.item })) },
    { "@type": "WebPage", "@id": `${SITE}${opts.path}#webpage`, url: `${SITE}${opts.path}`, name: opts.name, isPartOf: { "@id": `${SITE}/#website` }, about: { "@id": `${SITE}/#business` } },
  ];
  if (opts.faqs && opts.faqs.length) {
    graph.push({ "@type": "FAQPage", "@id": `${SITE}${opts.path}#faq`, mainEntity: opts.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default async function AirportRoutePage({ params }: PageProps) {
  const { slug } = await params;
  const transfersCrumb = { name: "Airport Transfers", item: `${SITE}/airport-transfers` };
  const homeCrumb = { name: "Home", item: SITE };
  if (isAirportHubSlug(slug)) {
    const airport = seoAirports[slug];
    const schema = pageGraph({ path: `/airport-transfers/${slug}`, name: airport.metaTitle, crumbs: [homeCrumb, transfersCrumb, { name: `${airport.shortName} transfers`, item: `${SITE}/airport-transfers/${slug}` }] });
    return <><JsonLd data={schema} /><AirportHubPage airport={airport} /></>;
  }
  if (isAirportRouteSlug(slug)) {
    const route = airportRoutes[slug];
    const title = getPublishedRoute(slug)?.title ?? slug;
    const schema = pageGraph({ path: `/airport-transfers/${slug}`, name: title, faqs: route.faqs, crumbs: [homeCrumb, transfersCrumb, { name: title, item: `${SITE}/airport-transfers/${slug}` }] });
    return <><JsonLd data={schema} /><AirportRouteLandingPage route={route} /></>;
  }
  if (isExpandedRouteSlug(slug)) {
    const route = expandedRoutes[slug];
    const schema = pageGraph({ path: `/airport-transfers/${slug}`, name: route.title, faqs: route.faqs, crumbs: [homeCrumb, transfersCrumb, { name: route.title, item: `${SITE}/airport-transfers/${slug}` }] });
    return <><JsonLd data={schema} /><ExpandedAirportRoutePage route={route} /></>;
  }
  notFound();
}
