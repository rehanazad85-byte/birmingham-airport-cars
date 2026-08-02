import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AirportRouteLandingPage } from "@/components/AirportRouteLandingPage";
import { airportRoutes, airportRouteSlugs, isAirportRouteSlug } from "@/lib/airport-routes";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return airportRouteSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isAirportRouteSlug(slug)) return {};
  const route = airportRoutes[slug];
  return { title: route.metaTitle, description: route.metaDescription, alternates: { canonical: `/airport-transfers/${route.slug}` } };
}

export default async function AirportRoutePage({ params }: PageProps) {
  const { slug } = await params;
  if (!isAirportRouteSlug(slug)) notFound();
  return <AirportRouteLandingPage route={airportRoutes[slug]} />;
}
