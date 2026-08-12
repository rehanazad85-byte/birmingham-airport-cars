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
    return { title: airport.metaTitle, description: airport.metaDescription, alternates: { canonical: `/airport-transfers/${slug}` }, openGraph: { title: airport.metaTitle, description: airport.metaDescription, url: `/airport-transfers/${slug}` } };
  }
  const route = getPublishedRoute(slug);
  if (!route) return {};
  return { title: route.metaTitle, description: route.metaDescription, alternates: { canonical: `/airport-transfers/${route.slug}` }, openGraph: { title: route.metaTitle, description: route.metaDescription, url: `/airport-transfers/${route.slug}` } };
}

export default async function AirportRoutePage({ params }: PageProps) {
  const { slug } = await params;
  if (isAirportHubSlug(slug)) return <AirportHubPage airport={seoAirports[slug]} />;
  if (isAirportRouteSlug(slug)) return <AirportRouteLandingPage route={airportRoutes[slug]} />;
  if (isExpandedRouteSlug(slug)) return <ExpandedAirportRoutePage route={expandedRoutes[slug]} />;
  notFound();
}
