import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocationLandingPage } from "@/components/LocationLandingPage";
import { isLocationSlug, locations, locationSlugs } from "@/lib/locations";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return locationSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isLocationSlug(slug)) {
    return {};
  }

  const location = locations[slug];

  return {
    title: location.metaTitle,
    description: location.metaDescription,
    alternates: {
      canonical: `/areas-we-cover/${location.slug}`,
    },
  };
}

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params;

  if (!isLocationSlug(slug)) {
    notFound();
  }

  return <LocationLandingPage location={locations[slug]} />;
}
