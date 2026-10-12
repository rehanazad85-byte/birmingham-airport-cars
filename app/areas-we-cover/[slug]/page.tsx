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
    title: { absolute: location.metaTitle },
    description: location.metaDescription,
    alternates: {
      canonical: `/areas-we-cover/${location.slug}`,
    },
  };
}

const SITE = "https://birminghamairportcars.co.uk";

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params;

  if (!isLocationSlug(slug)) {
    notFound();
  }

  const location = locations[slug];
  const path = `/areas-we-cover/${slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Areas We Cover", item: `${SITE}/areas-we-cover` },
        { "@type": "ListItem", position: 3, name: location.name, item: `${SITE}${path}` },
      ] },
      { "@type": "WebPage", "@id": `${SITE}${path}#webpage`, url: `${SITE}${path}`, name: location.metaTitle, isPartOf: { "@id": `${SITE}/#website` }, about: { "@id": `${SITE}/#business` } },
    ],
  };

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><LocationLandingPage location={location} /></>;
}
