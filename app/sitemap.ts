import type { MetadataRoute } from "next";
import { locationSlugs } from "@/lib/locations";
import { airportRouteSlugs } from "@/lib/airport-routes";

const baseUrl = "https://birminghamairportcars.co.uk";

const publicRoutes = [
  "",
  "/airport-taxi-faqs",
  "/areas-we-cover",
  "/book-now",
  "/business-accounts",
  "/contact",
  "/privacy-policy",
  "/terms",
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

  return [...existingPages, ...townPages, ...airportRoutePages];
}
