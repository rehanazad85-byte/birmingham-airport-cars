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
  "coventry-to-heathrow-airport",
  "derby-to-heathrow-airport",
  "nottingham-to-heathrow-airport",
  "birmingham-to-manchester-airport",
  "wolverhampton-to-manchester-airport",
  "nottingham-to-manchester-airport",
  "derby-to-manchester-airport",
  "birmingham-to-gatwick-airport",
  "wolverhampton-to-gatwick-airport",
  "nottingham-to-gatwick-airport",
  "wolverhampton-to-luton-airport",
  "leicester-to-stansted-airport",
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
  "coventry-to-heathrow-airport": expandedRoute("coventry-to-heathrow-airport", "coventry", "heathrow-airport", undefined, "A Heathrow journey from Coventry needs the correct terminal and a collection time planned around the selected address, flight schedule and likely motorway conditions. The page does not assume one journey time for every part of the city.", { supportingParagraphs: ["A return can be arranged from Heathrow to Coventry on the same booking. The inbound flight and terminal details support the collection plan, while the Coventry destination remains the exact address selected by the customer."], routeSpecificFaqs: [
    { question: "Can I book Heathrow Airport back to Coventry?", answer: "Yes. Select a return journey and provide the Heathrow terminal and inbound flight details so the airport collection can be planned for the Coventry address entered." },
    { question: "Is there a fixed Coventry to Heathrow fare?", answer: "No approved fixed fare is published for this route. The existing calculator uses the selected Coventry address and Heathrow terminal destination to calculate the journey." },
    { question: "What Coventry pickup details should I provide?", answer: "Select the full property, hotel, workplace or university-area address and clarify the practical entrance when the collection is confirmed." },
  ] }),
  "derby-to-heathrow-airport": expandedRoute("derby-to-heathrow-airport", "derby", "heathrow-airport", undefined, "Derby to London Heathrow is a pre-booked long-distance airport journey. The selected Derby pickup and correct Heathrow terminal are required before the live system can calculate a useful quotation.", { supportingParagraphs: ["For Heathrow to Derby travel, the return leg reverses the selected journey and retains the terminal and flight information needed for collection. Passenger and luggage totals should cover everyone travelling in both directions."], routeSpecificFaqs: [
    { question: "Can I arrange Heathrow to Derby as the return journey?", answer: "Yes. Add the return date and time, then provide the correct inbound flight and terminal details for the Heathrow collection." },
    { question: "How is the Derby to Heathrow fare calculated?", answer: "No fixed fare is published. The existing live-distance calculator uses the exact Derby pickup, Heathrow destination and selected vehicle, with airport access added separately." },
    { question: "Can the Derby pickup be a hotel or workplace?", answer: "Yes. Select the complete address and identify the property or practical entrance when the booking details are reviewed." },
  ] }),
  "nottingham-to-heathrow-airport": expandedRoute("nottingham-to-heathrow-airport", "nottingham", "heathrow-airport", undefined, "A Nottingham to Heathrow taxi is a pre-booked private airport transfer from the exact Nottingham-area pickup to the terminal confirmed by the airline. The live quotation uses the selected addresses rather than assuming one city-centre starting point, distance or journey time.", { introduction: [
    "A pre-booked Nottingham to Heathrow Airport taxi keeps passengers and luggage together from the selected pickup to the correct Heathrow terminal. No fixed fare is published; the existing live exact-address calculator prices the chosen journey and vehicle, with Heathrow access added separately.",
    "Pickup can be requested from Nottingham city, West Bridgford, Beeston and nearby addresses. Selecting the complete home, hotel or workplace address gives the calculator the correct starting point for the route.",
  ], supportingParagraphs: [
    "When booking a taxi from Nottingham to Heathrow, check whether the airline uses Terminal 2, 3, 4 or 5 and enter the correct airport destination. Passenger and luggage totals should be complete so the existing Saloon, Estate, Executive, MPV or Large MPV capacity guidance can be used when choosing a vehicle.",
    "A Heathrow to Nottingham journey can be added as the return leg on the same booking. Provide the confirmed terminal, inbound flight details and exact Nottingham destination for collection planning; a separate reverse-direction page is not required.",
  ], routeSpecificFaqs: [
    { question: "Can I book a taxi from Nottingham to Heathrow Airport?", answer: "Yes. Select the complete Nottingham pickup and correct Heathrow terminal in the quote form. The service is a pre-booked private transfer rather than a local rank taxi." },
    { question: "Can I book Heathrow Airport back to Nottingham?", answer: "Yes. Add the return date and time, select the exact Nottingham destination and provide the confirmed Heathrow terminal and inbound flight details for collection planning." },
    { question: "How much is a Nottingham to Heathrow taxi?", answer: "There is no approved fixed fare for this route. Use the live exact-address calculator to price the selected Nottingham pickup, Heathrow terminal and vehicle, with airport access handled separately." },
  ] }),
  "birmingham-to-manchester-airport": expandedRoute("birmingham-to-manchester-airport", "birmingham", "manchester-airport", undefined, "Birmingham addresses range from central hotels and businesses to residential districts on different approaches to the motorway network. The exact pickup and Manchester Airport terminal information are therefore used for the quotation.", { supportingParagraphs: ["Manchester Airport to Birmingham can be added as the return leg without creating a second route page. The customer should provide the inbound flight and terminal, then select the precise Birmingham destination for the journey home."], routeSpecificFaqs: [
    { question: "Can I book Manchester Airport back to Birmingham?", answer: "Yes. Add the return journey and provide the Manchester terminal and inbound flight details together with the exact Birmingham destination." },
    { question: "Is there a fixed Birmingham to Manchester Airport fare?", answer: "No approved fixed fare is published for this route. The existing calculator prices the exact selected addresses and vehicle, then adds Manchester Airport access separately." },
    { question: "Can collection start at a Birmingham hotel or business?", answer: "Yes. Select the full address and identify the practical entrance so the collection is based on the correct city location." },
  ] }),
  "wolverhampton-to-manchester-airport": expandedRoute("wolverhampton-to-manchester-airport", "wolverhampton", "manchester-airport", undefined, "A Wolverhampton to Manchester Airport transfer is planned from the selected city, hotel or residential address to the terminal confirmed by the airline. No single city-wide fare or duration is assumed.", { supportingParagraphs: ["Tettenhall, Penn, Wednesfield and other Wolverhampton starting points do not share one identical road approach. The exact-address calculation and complete luggage details help produce a more useful quotation and vehicle choice."], routeSpecificFaqs: [
    { question: "Can Manchester Airport collection return to Wolverhampton?", answer: "Yes. Add the return journey, supply the inbound flight and terminal, and select the complete Wolverhampton destination address." },
    { question: "How is the Wolverhampton to Manchester Airport fare calculated?", answer: "The route has no approved fixed fare. The existing live-distance system uses the selected addresses and vehicle, with Manchester Airport access added separately." },
    { question: "Can the pickup be in Tettenhall, Penn or Wednesfield?", answer: "Yes. Select the complete address so the quotation starts from the actual Wolverhampton-area collection point." },
  ] }),
  "nottingham-to-manchester-airport": expandedRoute("nottingham-to-manchester-airport", "nottingham", "manchester-airport", undefined, "Nottingham to Manchester Airport is offered as a suitable pre-booked long-distance transfer, not as local taxi coverage in either city. The quotation begins with the exact Nottingham-area address and selected airport destination.", { supportingParagraphs: ["Nottingham city, West Bridgford and Beeston pickups can reach the wider road network differently. For a Manchester Airport to Nottingham return, the terminal, flight and precise Nottingham destination should all be supplied."], routeSpecificFaqs: [
    { question: "Can I book Manchester Airport to Nottingham as a return?", answer: "Yes. Add the return leg and provide the inbound flight, terminal and complete Nottingham destination for collection planning." },
    { question: "Can the Nottingham pickup be in West Bridgford or Beeston?", answer: "Yes. Select the complete address so the existing live system calculates from the correct starting point." },
    { question: "Is there a standard Nottingham to Manchester Airport fare?", answer: "No approved fixed fare is published. The quote uses the selected addresses and vehicle, with Manchester Airport access applied separately." },
  ] }),
  "derby-to-manchester-airport": expandedRoute("derby-to-manchester-airport", "derby", "manchester-airport", undefined, "Derby to Manchester Airport is a pre-booked transfer calculated from the selected Derby property, hotel or workplace to the airport destination entered by the customer. No mileage, duration or fixed price is assumed on the route page.", { supportingParagraphs: ["For the reverse Manchester Airport to Derby journey, provide the terminal and flight details and keep the Derby destination precise. Group size, large suitcases and bulky items should be entered before choosing the vehicle."], routeSpecificFaqs: [
    { question: "Can I book Manchester Airport back to Derby?", answer: "Yes. Add the return journey and provide the correct flight, terminal and complete Derby destination address." },
    { question: "How do I get a Derby to Manchester Airport price?", answer: "Use the exact-address calculator. No approved fixed fare is published, so the existing live-distance system prices the selected route and vehicle before airport access is added." },
    { question: "What luggage details are needed for a Derby group?", answer: "Count every passenger and large suitcase and disclose bulky items so the chosen comfort-standard vehicle remains within its capacity." },
  ] }),
  "birmingham-to-gatwick-airport": expandedRoute("birmingham-to-gatwick-airport", "birmingham", "gatwick-airport", undefined, "A Birmingham to Gatwick Airport journey should be planned from the exact city, hotel, business or residential address to the North or South Terminal shown by the airline. The route page does not assume one distance or journey time for every Birmingham pickup.", { supportingParagraphs: ["Central Birmingham collections can require a named building and practical stopping point, while residential districts begin from different parts of the road network. For a Gatwick to Birmingham return, provide the inbound flight, terminal and complete Birmingham destination so the collection can be reviewed as part of the same booking."], routeSpecificFaqs: [
    { question: "Can I book Gatwick Airport back to Birmingham?", answer: "Yes. Add the return journey, supply the inbound flight and North or South Terminal, and select the complete Birmingham destination address." },
    { question: "Can the Birmingham pickup be a city-centre hotel or business?", answer: "Yes. Select the full address and identify the building or practical entrance so the quotation and collection use the correct city location." },
    { question: "How is the Birmingham to Gatwick fare calculated?", answer: "No approved fixed fare is published for this route. The existing live-distance calculator uses the selected Birmingham pickup, Gatwick destination and vehicle, with airport access handled separately." },
  ] }),
  "wolverhampton-to-gatwick-airport": expandedRoute("wolverhampton-to-gatwick-airport", "wolverhampton", "gatwick-airport", undefined, "A pre-booked Wolverhampton to Gatwick Airport transfer uses the complete pickup address and the flight's North or South Terminal. Starting points across the city do not share one assumed route, fare or journey time.", { supportingParagraphs: ["Collections in Tettenhall, Penn, Wednesfield and other Wolverhampton neighbourhoods should use the actual property, hotel or workplace address. A Gatwick to Wolverhampton return can be included by supplying the inbound flight, terminal and precise destination for the journey home."], routeSpecificFaqs: [
    { question: "Can Gatwick Airport collection return to Wolverhampton?", answer: "Yes. Add the return leg and provide the inbound flight, North or South Terminal and full Wolverhampton destination address." },
    { question: "Can collection start in Tettenhall, Penn or Wednesfield?", answer: "Yes. Select the complete address so the live quotation begins at the actual Wolverhampton-area pickup rather than a general city point." },
    { question: "How do I price a Wolverhampton to Gatwick transfer?", answer: "Use the exact-address calculator. This route has no approved fixed fare, so the existing live-distance system prices the selected addresses and vehicle before airport access is added." },
  ] }),
  "nottingham-to-gatwick-airport": expandedRoute("nottingham-to-gatwick-airport", "nottingham", "gatwick-airport", undefined, "Nottingham to Gatwick Airport is offered as a suitable pre-booked long-distance transfer, not as local taxi coverage in Nottingham or at Gatwick. The live quotation uses the exact Nottingham-area pickup and the correct Gatwick terminal.", { supportingParagraphs: ["Nottingham city, West Bridgford and Beeston collections can begin from different sides of the area, so the selected property, hotel or workplace matters. For a Gatwick to Nottingham return, provide the inbound flight, North or South Terminal and complete Nottingham destination rather than creating a separate reverse route."], routeSpecificFaqs: [
    { question: "Can I book Gatwick Airport to Nottingham as the return journey?", answer: "Yes. Add the return leg and provide the inbound flight, Gatwick terminal and exact Nottingham destination for collection planning." },
    { question: "Can the pickup be in West Bridgford or Beeston?", answer: "Yes. Select the full address so the quotation starts from the actual Nottingham-area collection point." },
    { question: "Is there a fixed Nottingham to Gatwick fare?", answer: "No approved fixed fare is published. The existing live-distance calculator prices the selected pickup, Gatwick destination and vehicle, with airport access applied separately." },
  ] }),
  "wolverhampton-to-luton-airport": expandedRoute("wolverhampton-to-luton-airport", "wolverhampton", "luton-airport", undefined, "Wolverhampton to Luton Airport is a pre-booked private airport transfer calculated from the selected city or neighbourhood address to the airport destination entered by the customer. No city-wide fare, mileage or duration is assumed.", { supportingParagraphs: ["For a Luton Airport to Wolverhampton return, provide the inbound flight details and follow the airport meeting instructions confirmed with the booking. The journey home should use the complete Wolverhampton destination and the passenger and luggage totals for that leg."], routeSpecificFaqs: [
    { question: "Can I book Luton Airport back to Wolverhampton?", answer: "Yes. Add the return journey, provide the inbound flight details and select the complete Wolverhampton destination address." },
    { question: "How is the Wolverhampton to Luton fare calculated?", answer: "No approved fixed fare is published for this route. The existing live-distance system uses the selected addresses and vehicle, with Luton Airport access handled separately." },
    { question: "What should I enter for a Wolverhampton group?", answer: "Enter every passenger and large suitcase and disclose bulky items before choosing a vehicle so its capacity remains suitable for the journey." },
  ] }),
  "leicester-to-stansted-airport": expandedRoute("leicester-to-stansted-airport", "leicester", "stansted-airport", undefined, "Leicester to Stansted Airport is a suitable pre-booked long-distance transfer rather than local taxi coverage in Leicester or Stansted. The exact Leicester-area pickup and selected airport destination are used for the live quotation.", { supportingParagraphs: ["A Leicester city address, hotel, Oadby home or Wigston pickup needs its own complete collection details rather than a generic city-centre starting point. For a Stansted to Leicester return, provide the inbound flight information, follow the confirmed airport meeting instructions and select the exact destination for the journey home."], routeSpecificFaqs: [
    { question: "Can I book Stansted Airport back to Leicester?", answer: "Yes. Add the return journey, provide the inbound flight details and select the complete Leicester-area destination address." },
    { question: "Can the pickup be in Oadby or Wigston?", answer: "Yes. Select the full address so the live calculation and collection plan start from the correct Leicester-area location." },
    { question: "How do I get a Leicester to Stansted price?", answer: "Use the exact-address calculator. No approved fixed fare is published, so the existing live-distance system prices the selected route and vehicle before airport access is added." },
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
