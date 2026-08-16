import { airportRoutes, airportRouteSlugs } from "@/lib/airport-routes";
import { locations } from "@/lib/locations";
import { seoLocationSlugs, seoLocations, type SeoLocationSlug } from "@/lib/seo-locations";
import { airportHubSlugs, seoAirports, seoAirportsByCode, type AirportHubSlug } from "@/lib/seo-airports";

export const expandedRouteSlugs = [
  "walsall-to-gatwick-airport",
  "walsall-to-manchester-airport",
  "walsall-to-east-midlands-airport",
  "walsall-to-luton-airport",
  "walsall-to-stansted-airport",
  "leicester-to-birmingham-airport",
  "coventry-to-birmingham-airport",
  "nottingham-to-birmingham-airport",
  "derby-to-birmingham-airport",
] as const;

export type ExpandedRouteSlug = (typeof expandedRouteSlugs)[number];

export type PublishedRouteSummary = {
  slug: string;
  locationSlug: SeoLocationSlug;
  airportSlug: AirportHubSlug;
  title: string;
  metaTitle: string;
  metaDescription: string;
  fixedSaloonFare?: number;
};

export type ExpandedRoute = PublishedRouteSummary & {
  slug: ExpandedRouteSlug;
  introduction: readonly [string, string];
  routeConsiderations: string;
  supportingParagraphs: readonly string[];
  faqs: Array<{ question: string; answer: string }>;
};

type ExpandedRouteDetails = {
  introduction?: readonly [string, string];
  supportingParagraphs?: readonly string[];
  routeSpecificFaqs?: Array<{ question: string; answer: string }>;
};

const expandedRoute = (
  slug: ExpandedRouteSlug,
  locationSlug: SeoLocationSlug,
  airportSlug: AirportHubSlug,
  fixedSaloonFare: number | undefined,
  routeConsiderations: string,
  details: ExpandedRouteDetails = {},
): ExpandedRoute => {
  const airport = seoAirports[airportSlug];
  const location = seoLocations[locationSlug];
  const fixedFareCopy = fixedSaloonFare === undefined ? "Live exact-address pricing is available through the existing calculator." : `The £${fixedSaloonFare} approved Saloon fare is the underlying transfer fare; airport access is added separately by the live calculator.`;
  return {
    slug, locationSlug, airportSlug, fixedSaloonFare,
    title: `${location.name} to ${airport.name} Taxi`,
    metaTitle: `${location.name} to ${airport.name} Taxi & Airport Transfer`,
    metaDescription: fixedSaloonFare === undefined
      ? `Book a private ${location.name} to ${airport.name} taxi. Get a live exact-address fare, choose a suitable vehicle and add a discounted return journey.`
      : `Book a private ${location.name} to ${airport.name} transfer. Saloon journey fare £${fixedSaloonFare} before airport access charges, with exact-address quotes and return savings.`,
    introduction: details.introduction ?? [
      `A pre-booked transfer from ${location.name} to ${airport.name} keeps passengers and luggage together from the selected address to the airport. ${fixedFareCopy}`,
      location.collectionContext,
    ],
    routeConsiderations,
    supportingParagraphs: details.supportingParagraphs ?? [],
    faqs: details.routeSpecificFaqs ? [
      ...details.routeSpecificFaqs,
      { question: `How much is a taxi from ${location.name} to ${airport.name}?`, answer: fixedSaloonFare === undefined ? "Enter and select the exact pickup and airport addresses in the quote form. The existing live-distance pricing engine calculates the journey and adds the applicable airport access charge separately." : `The approved underlying Saloon transfer fare is £${fixedSaloonFare}. The applicable airport access charge is added separately, and other vehicle options use the existing vehicle pricing.` },
      { question: "Can I book a return journey?", answer: "Yes. Add the return date and time when calculating the quote. Each direction is priced independently." },
      { question: "Which vehicle should I choose?", answer: "Choose using the complete passenger and large-suitcase totals. Comfort-standard Saloon, Estate, Executive, MPV and Large MPV options have different capacity limits." },
    ] : [
      { question: `How much is a taxi from ${location.name} to ${airport.name}?`, answer: fixedSaloonFare === undefined ? "Enter and select the exact pickup and airport addresses in the quote form. The existing live-distance pricing engine calculates the journey and adds the applicable airport access charge separately." : `The approved underlying Saloon transfer fare is £${fixedSaloonFare}. The applicable airport access charge is added separately, and other vehicle options use the existing vehicle pricing.` },
      { question: "Can I get an exact fare from my address?", answer: "Yes. Select the complete pickup and airport addresses in the quote form so the live calculator can show the estimated total, including applicable airport access." },
      { question: "Can I book a return journey?", answer: "Yes. Add the return date and time when calculating the quote. Each direction is priced independently." },
      { question: "Is there a return-booking discount?", answer: "Book both directions together and the return journey fare receives a 10% discount. Airport access charges remain payable in full." },
      { question: `Where will I meet my driver at ${airport.shortName}?`, answer: `${airport.collectionGuidance} The confirmed booking will provide the relevant meeting instructions.` },
      { question: "Which vehicle should I choose?", answer: "Choose using the complete passenger and large-suitcase totals. Comfort-standard Saloon, Estate, Executive, MPV and Large MPV options have different capacity limits." },
    ],
  };
};

export const expandedRoutes: Record<ExpandedRouteSlug, ExpandedRoute> = {
  "walsall-to-gatwick-airport": expandedRoute("walsall-to-gatwick-airport", "walsall", "gatwick-airport", 225, "This longer airport journey should be planned around the exact Walsall pickup, the flight's North or South Terminal and likely motorway conditions."),
  "walsall-to-manchester-airport": expandedRoute("walsall-to-manchester-airport", "walsall", "manchester-airport", 120, "Manchester Airport has multiple terminals. Check the terminal shown by the airline and allow for conditions on the northbound motorway journey."),
  "walsall-to-east-midlands-airport": expandedRoute("walsall-to-east-midlands-airport", "walsall", "east-midlands-airport", 85, "The practical road route depends on the Walsall starting address and conditions around the regional motorway network, so no unvalidated journey time is published."),
  "walsall-to-luton-airport": expandedRoute("walsall-to-luton-airport", "walsall", "luton-airport", 158, "Luton is a longer transfer from Walsall. Flight timing, road conditions and the precise collection address should all be considered before the pickup time is confirmed."),
  "walsall-to-stansted-airport": expandedRoute("walsall-to-stansted-airport", "walsall", "stansted-airport", 200, "Stansted requires a longer cross-country road journey. The live quotation and booking review use the actual address and requested travel time rather than an invented town-centre duration."),
  "leicester-to-birmingham-airport": expandedRoute("leicester-to-birmingham-airport", "leicester", "birmingham-airport", undefined, "The road approach depends on the selected Leicester or Leicestershire pickup and conditions on the regional motorway network. The calculator uses the selected addresses rather than publishing an unverified town-centre distance or time.", { supportingParagraphs: ["A city-centre hotel collection requires different stopping instructions from a home pickup in Oadby or Wigston. Supplying the complete address helps the driver identify the practical entrance and allows the live route to begin at the correct point."], routeSpecificFaqs: [
    { question: "Can the journey start in Oadby or Wigston?", answer: "Yes. Select the complete Oadby, Wigston or other nearby Leicestershire address so the quotation and collection plan use the correct starting point." },
    { question: "Can you collect from a Leicester city-centre hotel?", answer: "A hotel can be selected as the pickup. Provide its full address and use the booking details to clarify the practical entrance or meeting point." },
    { question: "How should I plan a Leicester departure for Birmingham Airport?", answer: "Use the exact pickup, flight schedule and airline check-in guidance when requesting the journey. No single town-centre travel time is assumed for every Leicester-area address." },
  ] }),
  "coventry-to-birmingham-airport": expandedRoute("coventry-to-birmingham-airport", "coventry", "birmingham-airport", undefined, "Coventry addresses vary from the city centre to neighbourhoods on different sides of the ring road. The exact collection point and chosen Birmingham Airport access option determine the useful quotation.", { supportingParagraphs: ["For city-centre, university-area or large residential developments, a building name and practical entrance can be as important as the postcode. Clear collection information avoids treating Coventry as one generic pickup point."], routeSpecificFaqs: [
    { question: "Can I book from Coventry city centre or a university-area address?", answer: "Yes. Select the full address and identify the building or suitable entrance when the collection details are confirmed." },
    { question: "Does every Coventry pickup use the same route to BHX?", answer: "No. Starting points on different sides of Coventry can join the road network differently, so the live calculation uses the actual selected address." },
    { question: "Can I choose Birmingham Airport’s free access option?", answer: "Yes. The quotation offers the applicable Birmingham Airport free or paid access choice separately from the live-distance journey fare." },
  ] }),
  "nottingham-to-birmingham-airport": expandedRoute("nottingham-to-birmingham-airport", "nottingham", "birmingham-airport", undefined, "This cross-region airport journey should be planned using the complete Nottingham pickup, flight details and current road conditions. No generic duration or distance is presented as a promise.", { supportingParagraphs: ["A pickup in central Nottingham is not interchangeable with one in West Bridgford or Beeston. Selecting the actual property, hotel or workplace gives the calculator and later collection process the location detail they need."], routeSpecificFaqs: [
    { question: "Can the pickup be in West Bridgford or Beeston?", answer: "Yes. Select the complete address so the live route and quotation start from the correct side of the Nottingham area." },
    { question: "Is there one standard Nottingham to Birmingham Airport fare?", answer: "No fixed fare is published for this route. The existing calculator prices the selected addresses and adds the chosen Birmingham Airport access arrangement." },
    { question: "What details help plan this cross-region airport journey?", answer: "Provide the exact pickup, flight schedule, passenger total and luggage requirements so the journey and suitable vehicle can be reviewed together." },
  ] }),
  "derby-to-birmingham-airport": expandedRoute("derby-to-birmingham-airport", "derby", "birmingham-airport", undefined, "The live route calculation uses the selected Derby address and Birmingham Airport destination. Flight check-in needs and likely conditions should be considered when confirming collection time.", { supportingParagraphs: ["Derby pickups may begin at a city address, residential development, hotel or business location. Naming the property and selecting the full address helps distinguish the required entrance from a general Derby meeting point."], routeSpecificFaqs: [
    { question: "Can you collect from a Derby hotel or business address?", answer: "Yes. Select the full address and provide the property name or practical entrance when the booking details are confirmed." },
    { question: "How is a Derby to Birmingham Airport fare calculated?", answer: "The route has no published fixed fare. The existing live-distance system uses the selected Derby pickup and airport destination, with airport access handled separately." },
    { question: "What should a Derby group enter for luggage?", answer: "Count every passenger and large suitcase, and mention bulky items separately so the selected vehicle remains within its capacity." },
  ] }),
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

export const routeMatrix = seoLocationSlugs.flatMap((locationSlug) =>
  airportHubSlugs.map((airportSlug) => {
    const slug = `${locationSlug}-to-${airportSlug}`;
    return { locationSlug, airportSlug, slug, published: publishedRouteSlugs.includes(slug) };
  }),
);

export function getPublishedRoutesForArea(locationSlug: SeoLocationSlug) {
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
