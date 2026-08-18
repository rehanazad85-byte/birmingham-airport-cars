import type { MetadataRoute } from "next";
import { locationSlugs } from "@/lib/locations";
import { airportRouteSlugs } from "@/lib/airport-routes";
import { airportHubSlugs } from "@/lib/seo-airports";
import { expandedRouteSlugs } from "@/lib/seo-routes";

const baseUrl = "https://birminghamairportcars.co.uk";

const publicRoutes = [
  "",
  "/airport-taxi-faqs",
  "/airport-transfers",
  "/areas-we-cover",
  "/book-now",
  "/business-accounts",
  "/contact",
  "/long-distance-taxi",
  "/privacy-policy",
  "/terms",
  "/terms-and-conditions",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const existingPages = publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
  }));

  const townPages = locationSlugs.map((slug) => ({
    url: `${baseUrl}/areas-we-cover/${slug}`,
  }));

  const airportRoutePages = airportRouteSlugs.map((slug) => ({
    url: `${baseUrl}/airport-transfers/${slug}`,
  }));

  const expandedRoutePages = expandedRouteSlugs.map((slug) => ({
    url: `${baseUrl}/airport-transfers/${slug}`,
  }));

  const airportHubPages = airportHubSlugs.map((slug) => ({
    url: `${baseUrl}/airport-transfers/${slug}`,
  }));

  return [...existingPages, ...townPages, ...airportHubPages, ...airportRoutePages, ...expandedRoutePages];
}
