import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import sitemap from "../app/sitemap";
import { generateMetadata, generateStaticParams } from "../app/airport-transfers/[slug]/page";
import { AirportHubPage } from "../components/AirportHubPage";
import { ExpandedAirportRoutePage } from "../components/ExpandedAirportRoutePage";
import { airportHubSlugs, seoAirports } from "../lib/seo-airports";
import { expandedRoutes, expandedRouteSlugs, getPublishedRoute, getPublishedRoutesForAirport, getRelatedPublishedRoutes, publishedRoutes, publishedRouteSlugs, routeMatrix } from "../lib/seo-routes";
import { locationSlugs } from "../lib/locations";
import { seoOnlyLocationSlugs } from "../lib/seo-locations";
import LongDistanceTaxiPage, { metadata as longDistanceMetadata } from "../app/long-distance-taxi/page";

const baseUrl = "https://birminghamairportcars.co.uk";
const phase4BWave1Slugs = [
  "coventry-to-heathrow-airport",
  "derby-to-heathrow-airport",
  "nottingham-to-heathrow-airport",
  "birmingham-to-manchester-airport",
  "wolverhampton-to-manchester-airport",
  "nottingham-to-manchester-airport",
  "derby-to-manchester-airport",
] as const;
const phase4BWave2Slugs = [
  "birmingham-to-gatwick-airport",
  "wolverhampton-to-gatwick-airport",
  "nottingham-to-gatwick-airport",
  "wolverhampton-to-luton-airport",
  "leicester-to-stansted-airport",
] as const;

describe("Phase 4A SEO route architecture", () => {
  it("represents the expanded 12 by 7 matrix but publishes only researched routes", () => {
    expect(routeMatrix).toHaveLength(84);
    expect(publishedRoutes).toHaveLength(37);
    expect(routeMatrix.filter((route) => route.published)).toHaveLength(37);
  });

  it("preserves all existing URLs and adds five approved Walsall routes", () => {
    expect(expandedRouteSlugs).toHaveLength(21);
    expect(getPublishedRoute("walsall-to-birmingham-airport")?.fixedSaloonFare).toBe(47);
    expect(getPublishedRoute("walsall-to-heathrow-airport")?.fixedSaloonFare).toBe(185);
    expect(getPublishedRoute("walsall-to-gatwick-airport")?.fixedSaloonFare).toBe(225);
    expect(getPublishedRoute("solihull-to-gatwick-airport")).toBeUndefined();
  });

  it("publishes only the seven approved Phase 4B Wave 1 live-distance routes", async () => {
    for (const slug of phase4BWave1Slugs) {
      const route = expandedRoutes[slug];
      expect(route).toBeDefined();
      expect(route.fixedSaloonFare).toBeUndefined();
      expect(route.supportingParagraphs.length).toBeGreaterThanOrEqual(1);
      expect(route.faqs.length).toBeGreaterThanOrEqual(6);
      const metadata = await generateMetadata({ params: Promise.resolve({ slug }) });
      expect(metadata.alternates?.canonical).toBe(`/airport-transfers/${slug}`);
      const html = renderToStaticMarkup(<ExpandedAirportRoutePage route={route} />);
      expect(html).toContain("Calculate your live fare");
      expect(html).toContain("No fixed fare is published");
      expect(html).not.toMatch(/£\d+ Saloon journey fare/);
    }
    for (const draft of ["oxford-to-heathrow-airport", "telford-to-manchester-airport", "bristol-to-heathrow-airport", "sutton-coldfield-to-manchester-airport", "birmingham-to-east-midlands-airport", "coventry-to-manchester-airport", "derby-to-east-midlands-airport", "leicester-to-heathrow-airport"]) {
      expect(getPublishedRoute(draft)).toBeUndefined();
      expect(await generateMetadata({ params: Promise.resolve({ slug: draft }) })).toEqual({});
    }
  });

  it("publishes exactly the five approved Phase 4B Wave 2 live-distance routes", async () => {
    const routeSpecificTerms = {
      "birmingham-to-gatwick-airport": ["city-centre hotel or business", "North or South Terminal", "Gatwick Airport back to Birmingham"],
      "wolverhampton-to-gatwick-airport": ["Tettenhall", "Penn", "Wednesfield"],
      "nottingham-to-gatwick-airport": ["West Bridgford", "Beeston", "not as local taxi coverage"],
      "wolverhampton-to-luton-airport": ["Luton Airport to Wolverhampton return", "inbound flight details", "No city-wide fare"],
      "leicester-to-stansted-airport": ["Oadby", "Wigston", "rather than local taxi coverage"],
    } as const;

    for (const slug of phase4BWave2Slugs) {
      const route = expandedRoutes[slug];
      expect(route.fixedSaloonFare).toBeUndefined();
      expect(route.supportingParagraphs).toHaveLength(1);
      expect(route.faqs).toHaveLength(6);
      const metadata = await generateMetadata({ params: Promise.resolve({ slug }) });
      expect(metadata.alternates?.canonical).toBe(`/airport-transfers/${slug}`);
      const html = renderToStaticMarkup(<ExpandedAirportRoutePage route={route} />);
      expect(html).toContain("Calculate your live fare");
      expect(html).toContain("No fixed fare is published");
      expect(html).not.toMatch(/£\d+ Saloon journey fare/);
      for (const term of routeSpecificTerms[slug]) expect(html).toContain(term);
    }

    expect(renderToStaticMarkup(<ExpandedAirportRoutePage route={expandedRoutes["nottingham-to-gatwick-airport"]} />)).not.toContain("/areas-we-cover/nottingham");
    expect(renderToStaticMarkup(<ExpandedAirportRoutePage route={expandedRoutes["leicester-to-stansted-airport"]} />)).not.toContain("/areas-we-cover/leicester");
    expect(locationSlugs).toHaveLength(8);
    expect(seoOnlyLocationSlugs).toEqual(["leicester", "coventry", "nottingham", "derby"]);
  });

  it("uses each expanded route's actual destination airport throughout rendered guidance", () => {
    const destinations = {
      "coventry-to-heathrow-airport": "Heathrow Airport",
      "derby-to-heathrow-airport": "Heathrow Airport",
      "nottingham-to-heathrow-airport": "Heathrow Airport",
      "birmingham-to-manchester-airport": "Manchester Airport",
      "wolverhampton-to-manchester-airport": "Manchester Airport",
      "nottingham-to-manchester-airport": "Manchester Airport",
      "derby-to-manchester-airport": "Manchester Airport",
      "birmingham-to-gatwick-airport": "Gatwick Airport",
      "wolverhampton-to-gatwick-airport": "Gatwick Airport",
      "nottingham-to-gatwick-airport": "Gatwick Airport",
      "wolverhampton-to-luton-airport": "Luton Airport",
      "leicester-to-stansted-airport": "Stansted Airport",
    } as const;

    for (const [slug, airport] of Object.entries(destinations)) {
      const route = expandedRoutes[slug as keyof typeof destinations];
      const html = renderToStaticMarkup(<ExpandedAirportRoutePage route={route} />);
      expect(html).toContain(`exact pickup and ${airport} destination`);
      expect(html).not.toContain("exact pickup and Birmingham Airport destination");
      expect(html).not.toContain("routing towards Birmingham Airport");
      expect(html).not.toContain("driving route to Birmingham Airport");
    }

    for (const slug of ["leicester-to-birmingham-airport", "coventry-to-birmingham-airport", "nottingham-to-birmingham-airport", "derby-to-birmingham-airport"] as const) {
      const html = renderToStaticMarkup(<ExpandedAirportRoutePage route={expandedRoutes[slug]} />);
      expect(html).toContain("exact pickup and Birmingham Airport destination");
    }
  });

  it("strengthens Nottingham to Heathrow taxi intent without changing route authority", async () => {
    const slug = "nottingham-to-heathrow-airport";
    const route = expandedRoutes[slug];
    const html = renderToStaticMarkup(<ExpandedAirportRoutePage route={route} />);
    const metadata = await generateMetadata({ params: Promise.resolve({ slug }) });

    expect(route.title).toBe("Nottingham to Heathrow Airport Taxi");
    expect(route.fixedSaloonFare).toBeUndefined();
    expect(metadata.alternates?.canonical).toBe(`/airport-transfers/${slug}`);
    for (const phrase of ["Nottingham to Heathrow taxi", "taxi from Nottingham to Heathrow", "Nottingham city", "West Bridgford", "Beeston", "Terminal 2, 3, 4 or 5", "live exact-address calculator", "Heathrow to Nottingham journey"]) {
      expect(html).toContain(phrase);
    }
    expect(html).toContain("Calculate your live fare");
    expect(html).not.toMatch(/£\d+ Saloon journey fare/);
    expect(renderToStaticMarkup(<ExpandedAirportRoutePage route={expandedRoutes["coventry-to-heathrow-airport"]} />)).not.toContain("taxi from Nottingham to Heathrow");
    expect(renderToStaticMarkup(<ExpandedAirportRoutePage route={expandedRoutes["derby-to-heathrow-airport"]} />)).not.toContain("taxi from Nottingham to Heathrow");
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

  it("aligns the visible expanded-route breadcrumb with its structured data", () => {
    const html = renderToStaticMarkup(<ExpandedAirportRoutePage route={expandedRoutes["birmingham-to-gatwick-airport"]} />);
    expect(html).toContain('"name":"Birmingham to Gatwick Airport"');
    expect(html).toContain('aria-current="page" class="text-black">Birmingham to Gatwick Airport</li>');
    expect(html).not.toContain('aria-current="page" class="text-black">Birmingham</li>');
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

  it("exposes the new routes from the Heathrow and Manchester hubs", () => {
    const heathrow = renderToStaticMarkup(<AirportHubPage airport={seoAirports["heathrow-airport"]} />);
    const manchester = renderToStaticMarkup(<AirportHubPage airport={seoAirports["manchester-airport"]} />);
    for (const slug of phase4BWave1Slugs.filter((slug) => slug.endsWith("heathrow-airport"))) expect(heathrow).toContain(`/airport-transfers/${slug}`);
    for (const slug of phase4BWave1Slugs.filter((slug) => slug.endsWith("manchester-airport"))) expect(manchester).toContain(`/airport-transfers/${slug}`);
    expect(heathrow).toContain("Coventry, Derby and Nottingham");
    expect(manchester).toContain("suitable pre-booked airport transfers");
  });

  it("strengthens the Gatwick, Luton and Stansted hubs with only approved Wave 2 routes", () => {
    const gatwick = renderToStaticMarkup(<AirportHubPage airport={seoAirports["gatwick-airport"]} />);
    const luton = renderToStaticMarkup(<AirportHubPage airport={seoAirports["luton-airport"]} />);
    const stansted = renderToStaticMarkup(<AirportHubPage airport={seoAirports["stansted-airport"]} />);
    for (const slug of ["walsall-to-gatwick-airport", ...phase4BWave2Slugs.filter((item) => item.endsWith("gatwick-airport"))]) expect(gatwick).toContain(`/airport-transfers/${slug}`);
    for (const slug of ["walsall-to-luton-airport", "wolverhampton-to-luton-airport"]) expect(luton).toContain(`/airport-transfers/${slug}`);
    for (const slug of ["walsall-to-stansted-airport", "leicester-to-stansted-airport"]) expect(stansted).toContain(`/airport-transfers/${slug}`);
    expect(gatwick).toContain("Walsall, Birmingham, Wolverhampton and Nottingham");
    expect(luton).toContain("Walsall and Wolverhampton");
    expect(stansted).toContain("Walsall and Leicester");
  });

  it("includes hubs and published routes in the sitemap while excluding drafts", () => {
    const urls = sitemap().map((entry) => entry.url);
    for (const slug of airportHubSlugs) expect(urls).toContain(`${baseUrl}/airport-transfers/${slug}`);
    for (const route of publishedRoutes) expect(urls).toContain(`${baseUrl}/airport-transfers/${route.slug}`);
    expect(urls).not.toContain(`${baseUrl}/airport-transfers/solihull-to-gatwick-airport`);
    expect(urls).not.toContain(`${baseUrl}/api/route-distance`);
    expect(new Set(urls).size).toBe(urls.length);
    for (const slug of phase4BWave1Slugs) expect(urls).toContain(`${baseUrl}/airport-transfers/${slug}`);
    for (const slug of phase4BWave2Slugs) expect(urls).toContain(`${baseUrl}/airport-transfers/${slug}`);
    for (const reverse of ["gatwick-airport-to-birmingham", "gatwick-airport-to-nottingham", "luton-airport-to-wolverhampton", "stansted-airport-to-leicester"]) expect(urls).not.toContain(`${baseUrl}/airport-transfers/${reverse}`);
    for (const held of ["oxford-to-heathrow-airport", "telford-to-manchester-airport", "bristol-to-heathrow-airport", "sutton-coldfield-to-manchester-airport", "birmingham-to-east-midlands-airport", "coventry-to-manchester-airport", "derby-to-east-midlands-airport", "leicester-to-heathrow-airport"]) expect(urls).not.toContain(`${baseUrl}/airport-transfers/${held}`);
  });

  it("generates unique route and hub metadata with canonical URLs", async () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(44);
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

  it("keeps every related route link inside the controlled published set", () => {
    for (const route of publishedRoutes) {
      for (const related of getRelatedPublishedRoutes(route)) expect(publishedRouteSlugs).toContain(related.slug);
    }
    expect(new Set(publishedRouteSlugs).size).toBe(publishedRouteSlugs.length);
    const expectedRelationships = {
      "birmingham-to-gatwick-airport": ["birmingham-to-birmingham-airport", "birmingham-to-heathrow-airport", "birmingham-to-manchester-airport"],
      "wolverhampton-to-gatwick-airport": ["wolverhampton-to-birmingham-airport", "wolverhampton-to-heathrow-airport", "wolverhampton-to-manchester-airport"],
      "nottingham-to-gatwick-airport": ["nottingham-to-birmingham-airport", "nottingham-to-heathrow-airport", "nottingham-to-manchester-airport"],
      "wolverhampton-to-luton-airport": ["wolverhampton-to-birmingham-airport", "wolverhampton-to-heathrow-airport", "wolverhampton-to-manchester-airport"],
      "leicester-to-stansted-airport": ["leicester-to-birmingham-airport", "walsall-to-stansted-airport"],
    } as const;
    for (const [slug, expected] of Object.entries(expectedRelationships)) {
      const related = getRelatedPublishedRoutes(expandedRoutes[slug as keyof typeof expectedRelationships]).map((route) => route.slug);
      for (const routeSlug of expected) expect(related).toContain(routeSlug);
    }
  });

  it("preserves every approved Walsall fixed fare", () => {
    expect(Object.fromEntries(["birmingham", "heathrow", "gatwick", "manchester", "east-midlands", "luton", "stansted"].map((airport) => [airport, getPublishedRoute(`walsall-to-${airport}-airport`)?.fixedSaloonFare]))).toEqual({
      birmingham: 47,
      heathrow: 185,
      gatwick: 225,
      manchester: 120,
      "east-midlands": 85,
      luton: 158,
      stansted: 200,
    });
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
    expect(html).toContain("/airport-transfers/birmingham-to-heathrow-airport");
    expect(html).toContain("/airport-transfers/nottingham-to-heathrow-airport");
    expect(html).toContain("/airport-transfers/derby-to-manchester-airport");
    expect(html).toContain("/airport-transfers/birmingham-to-gatwick-airport");
    expect(html).toContain("/airport-transfers/wolverhampton-to-luton-airport");
    expect(html).toContain("/airport-transfers/leicester-to-stansted-airport");
    expect(html).not.toMatch(/£\d/);
    expect(sitemap().map((entry) => entry.url)).toContain(`${baseUrl}/long-distance-taxi`);
  });
});
