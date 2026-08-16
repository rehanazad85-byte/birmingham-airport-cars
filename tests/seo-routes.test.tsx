import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import sitemap from "../app/sitemap";
import { generateMetadata, generateStaticParams } from "../app/airport-transfers/[slug]/page";
import { AirportHubPage } from "../components/AirportHubPage";
import { ExpandedAirportRoutePage } from "../components/ExpandedAirportRoutePage";
import { airportHubSlugs, seoAirports } from "../lib/seo-airports";
import { expandedRoutes, expandedRouteSlugs, getPublishedRoute, getPublishedRoutesForAirport, publishedRoutes, routeMatrix } from "../lib/seo-routes";
import { locationSlugs } from "../lib/locations";
import LongDistanceTaxiPage, { metadata as longDistanceMetadata } from "../app/long-distance-taxi/page";

const baseUrl = "https://birminghamairportcars.co.uk";

describe("Phase 4A SEO route architecture", () => {
  it("represents the expanded 12 by 7 matrix but publishes only researched routes", () => {
    expect(routeMatrix).toHaveLength(84);
    expect(publishedRoutes).toHaveLength(25);
    expect(routeMatrix.filter((route) => route.published)).toHaveLength(25);
  });

  it("preserves all existing URLs and adds five approved Walsall routes", () => {
    expect(expandedRouteSlugs).toHaveLength(9);
    expect(getPublishedRoute("walsall-to-birmingham-airport")?.fixedSaloonFare).toBe(47);
    expect(getPublishedRoute("walsall-to-heathrow-airport")?.fixedSaloonFare).toBe(185);
    expect(getPublishedRoute("walsall-to-gatwick-airport")?.fixedSaloonFare).toBe(225);
    expect(getPublishedRoute("solihull-to-gatwick-airport")).toBeUndefined();
  });

  it("publishes four Wave 1 BHX routes with live pricing and no invented fixed fares", () => {
    const slugs = ["leicester", "coventry", "nottingham", "derby"] as const;
    const routeSpecificTerms = {
      leicester: ["Oadby", "Wigston", "Leicester city-centre hotel"],
      coventry: ["university-area", "ring road", "Coventry city centre"],
      nottingham: ["West Bridgford", "Beeston", "cross-region airport journey"],
      derby: ["Derby hotel or business address", "residential development", "Derby group"],
    } as const;
    for (const location of slugs) {
      const slug = `${location}-to-birmingham-airport` as keyof typeof expandedRoutes;
      const route = expandedRoutes[slug];
      expect(getPublishedRoute(slug)?.fixedSaloonFare).toBeUndefined();
      expect(route.supportingParagraphs).toHaveLength(1);
      expect(route.faqs.slice(0, 3).filter((faq) => faq.question.toLowerCase().includes(location) || faq.answer.toLowerCase().includes(location)).length).toBeGreaterThanOrEqual(2);
      const html = renderToStaticMarkup(<ExpandedAirportRoutePage route={route} />);
      expect(html).toContain("Calculate your live fare");
      expect(html).toContain("No fixed fare is published");
      expect(html).not.toContain(`/areas-we-cover/${location}`);
      for (const term of routeSpecificTerms[location]) expect(html).toContain(term);
    }
    expect(locationSlugs).toHaveLength(8);
  });

  it("renders fixed fare, canonical breadcrumb hierarchy, access and return wording", () => {
    const html = renderToStaticMarkup(<ExpandedAirportRoutePage route={expandedRoutes["walsall-to-manchester-airport"]} />);
    expect(html).toContain("£120 Saloon journey fare");
    expect(html).toContain("£5.50 access charge");
    expect(html).toContain("£6.60 access charge");
    expect(html).toContain("save 10% on the return journey fare");
    expect(html).toContain(`${baseUrl}/airport-transfers/manchester-airport`);
    expect(html).not.toContain("AggregateRating");
  });

  it("renders every airport hub with only published route links", () => {
    expect(airportHubSlugs).toHaveLength(7);
    for (const slug of airportHubSlugs) {
      const html = renderToStaticMarkup(<AirportHubPage airport={seoAirports[slug]} />);
      expect(html).toContain(seoAirports[slug].name);
      expect(html).toContain("BreadcrumbList");
      expect(html).toContain("Areas we cover");
      expect((html.match(/View route guide/g) ?? []).length).toBe(getPublishedRoutesForAirport(slug).length);
    }
  });

  it("includes hubs and published routes in the sitemap while excluding drafts", () => {
    const urls = sitemap().map((entry) => entry.url);
    for (const slug of airportHubSlugs) expect(urls).toContain(`${baseUrl}/airport-transfers/${slug}`);
    for (const route of publishedRoutes) expect(urls).toContain(`${baseUrl}/airport-transfers/${route.slug}`);
    expect(urls).not.toContain(`${baseUrl}/airport-transfers/solihull-to-gatwick-airport`);
    expect(urls).not.toContain(`${baseUrl}/api/route-distance`);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("generates unique route and hub metadata with canonical URLs", async () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(32);
    const routeMetadata = await generateMetadata({ params: Promise.resolve({ slug: "walsall-to-luton-airport" }) });
    const hubMetadata = await generateMetadata({ params: Promise.resolve({ slug: "luton-airport" }) });
    expect(routeMetadata.title).toContain("Walsall to Luton Airport");
    expect(routeMetadata.alternates?.canonical).toBe("/airport-transfers/walsall-to-luton-airport");
    expect(routeMetadata.openGraph?.url).toBe("/airport-transfers/walsall-to-luton-airport");
    expect(hubMetadata.title).toContain("Luton Airport Transfers");
    expect(hubMetadata.alternates?.canonical).toBe("/airport-transfers/luton-airport");
    expect(new Set(publishedRoutes.map((route) => route.metaTitle)).size).toBe(publishedRoutes.length);
    expect(new Set(publishedRoutes.map((route) => route.metaDescription)).size).toBe(publishedRoutes.length);
  });

  it("strengthens the single BHX hub and links all Wave 1 routes", () => {
    const html = renderToStaticMarkup(<AirportHubPage airport={seoAirports["birmingham-airport"]} />);
    expect(html).toContain("Pre-booked Birmingham Airport taxis");
    expect(html).toContain("Birmingham Airport Taxi &amp; Transfers");
    expect(html).toContain("complete estimated fare");
    expect(html).not.toContain("unsupported");
    expect(html).not.toContain("published only when useful route content is available");
    for (const location of ["leicester", "coventry", "nottingham", "derby"]) {
      expect(html).toContain(`/airport-transfers/${location}-to-birmingham-airport`);
    }
  });

  it("publishes a canonical long-distance service page without fake fares", () => {
    const html = renderToStaticMarkup(<LongDistanceTaxiPage />);
    expect(longDistanceMetadata.alternates?.canonical).toBe("/long-distance-taxi");
    expect(html).toContain("Long Distance Taxi Service");
    expect(html).toContain("Birmingham to Heathrow");
    expect(html).not.toMatch(/£\d/);
    expect(sitemap().map((entry) => entry.url)).toContain(`${baseUrl}/long-distance-taxi`);
  });
});
