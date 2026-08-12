import { airportRoutes, airportRouteSlugs } from "@/lib/airport-routes";
import { locationSlugs, locations, type LocationSlug } from "@/lib/locations";
import { airportHubSlugs, seoAirports, seoAirportsByCode, type AirportHubSlug } from "@/lib/seo-airports";

export const expandedRouteSlugs = [
  "walsall-to-gatwick-airport",
  "walsall-to-manchester-airport",
  "walsall-to-east-midlands-airport",
  "walsall-to-luton-airport",
  "walsall-to-stansted-airport",
] as const;

export type ExpandedRouteSlug = (typeof expandedRouteSlugs)[number];

export type PublishedRouteSummary = {
  slug: string;
  locationSlug: LocationSlug;
  airportSlug: AirportHubSlug;
  title: string;
  metaTitle: string;
  metaDescription: string;
  fixedSaloonFare?: number;
};

export type ExpandedRoute = PublishedRouteSummary & {
  slug: ExpandedRouteSlug;
  introduction: [string, string];
  routeConsiderations: string;
  faqs: Array<{ question: string; answer: string }>;
};

const walsallRoute = (
  slug: ExpandedRouteSlug,
  airportSlug: AirportHubSlug,
  fixedSaloonFare: number,
  routeConsiderations: string,
): ExpandedRoute => {
  const airport = seoAirports[airportSlug];
  return {
    slug, locationSlug: "walsall", airportSlug, fixedSaloonFare,
    title: `Walsall to ${airport.name} Taxi`,
    metaTitle: `Walsall to ${airport.name} Taxi & Airport Transfer`,
    metaDescription: `Book a private Walsall to ${airport.name} transfer. Saloon journey fare £${fixedSaloonFare} before airport access charges, with exact-address quotes and return savings.`,
    introduction: [
      `A pre-booked transfer from Walsall to ${airport.name} keeps passengers and luggage together from the chosen address to the airport. The £${fixedSaloonFare} approved Saloon fare is the underlying transfer fare; airport access is added separately by the live calculator.`,
      `Collections can be arranged across Walsall, including Aldridge, Bloxwich, Pelsall and Willenhall. Entering the actual address provides the detail needed for a useful quotation and collection plan.`,
    ],
    routeConsiderations,
    faqs: [
      { question: `How much is a taxi from Walsall to ${airport.name}?`, answer: `The approved underlying Saloon transfer fare is £${fixedSaloonFare}. The applicable airport access charge is added separately, and other vehicle options use the existing vehicle pricing.` },
      { question: "Can I get an exact fare from my address?", answer: "Yes. Select the complete pickup and airport addresses in the quote form so the live calculator can show the estimated total, including applicable airport access." },
      { question: "Can I book a return journey?", answer: "Yes. Add the return date and time when calculating the quote. Each direction is priced independently." },
      { question: "Is there a return-booking discount?", answer: "Book both directions together and the return journey fare receives a 10% discount. Airport access charges remain payable in full." },
      { question: `Where will I meet my driver at ${airport.shortName}?`, answer: `${airport.collectionGuidance} The confirmed booking will provide the relevant meeting instructions.` },
      { question: "Which vehicle should I choose?", answer: "Choose using the complete passenger and large-suitcase totals. Comfort-standard Saloon, Estate, Executive, MPV and Large MPV options have different capacity limits." },
    ],
  };
};

export const expandedRoutes: Record<ExpandedRouteSlug, ExpandedRoute> = {
  "walsall-to-gatwick-airport": walsallRoute("walsall-to-gatwick-airport", "gatwick-airport", 225, "This longer airport journey should be planned around the exact Walsall pickup, the flight's North or South Terminal and likely motorway conditions."),
  "walsall-to-manchester-airport": walsallRoute("walsall-to-manchester-airport", "manchester-airport", 120, "Manchester Airport has multiple terminals. Check the terminal shown by the airline and allow for conditions on the northbound motorway journey."),
  "walsall-to-east-midlands-airport": walsallRoute("walsall-to-east-midlands-airport", "east-midlands-airport", 85, "The practical road route depends on the Walsall starting address and conditions around the regional motorway network, so no unvalidated journey time is published."),
  "walsall-to-luton-airport": walsallRoute("walsall-to-luton-airport", "luton-airport", 158, "Luton is a longer transfer from Walsall. Flight timing, road conditions and the precise collection address should all be considered before the pickup time is confirmed."),
  "walsall-to-stansted-airport": walsallRoute("walsall-to-stansted-airport", "stansted-airport", 200, "Stansted requires a longer cross-country road journey. The live quotation and booking review use the actual address and requested travel time rather than an invented town-centre duration."),
};

const existingAirportSlug = (destinationAirport: "birmingham" | "heathrow"): AirportHubSlug =>
  destinationAirport === "birmingham" ? "birmingham-airport" : "heathrow-airport";

const existingSummaries: PublishedRouteSummary[] = airportRouteSlugs.map((slug) => {
  const route = airportRoutes[slug];
  const airportSlug = existingAirportSlug(route.destinationAirport);
  const fixed = route.locationSlug === "walsall" ? (route.destinationAirport === "birmingham" ? 47 : 185) : undefined;
  return {
    slug, locationSlug: route.locationSlug, airportSlug,
    title: `${locations[route.locationSlug].name} to ${seoAirports[airportSlug].name} Taxi`,
    metaTitle: route.metaTitle,
    metaDescription: route.metaDescription,
    fixedSaloonFare: fixed,
  };
});

export const publishedRoutes: PublishedRouteSummary[] = [
  ...existingSummaries,
  ...expandedRouteSlugs.map((slug) => expandedRoutes[slug]),
];

export const publishedRouteSlugs = publishedRoutes.map((route) => route.slug);

export const routeMatrix = locationSlugs.flatMap((locationSlug) =>
  airportHubSlugs.map((airportSlug) => {
    const slug = `${locationSlug}-to-${airportSlug}`;
    return { locationSlug, airportSlug, slug, published: publishedRouteSlugs.includes(slug) };
  }),
);

export function getPublishedRoutesForArea(locationSlug: LocationSlug) {
  return publishedRoutes.filter((route) => route.locationSlug === locationSlug);
}

export function getPublishedRoutesForAirport(airportSlug: AirportHubSlug) {
  return publishedRoutes.filter((route) => route.airportSlug === airportSlug);
}

export function getPublishedRoute(slug: string) {
  return publishedRoutes.find((route) => route.slug === slug);
}

export function isExpandedRouteSlug(value: string): value is ExpandedRouteSlug {
  return expandedRouteSlugs.includes(value as ExpandedRouteSlug);
}

export function getRelatedPublishedRoutes(route: PublishedRouteSummary, limit = 4) {
  const sameArea = publishedRoutes.filter((candidate) => candidate.locationSlug === route.locationSlug && candidate.slug !== route.slug);
  const sameAirport = publishedRoutes.filter((candidate) => candidate.airportSlug === route.airportSlug && candidate.slug !== route.slug && !sameArea.some((item) => item.slug === candidate.slug));
  return [...sameArea, ...sameAirport].slice(0, limit);
}

export function getAirportForRoute(route: PublishedRouteSummary) {
  return seoAirports[route.airportSlug] ?? seoAirportsByCode.BHX;
}
