import { airportAccessConfig, type AirportCode } from "@/lib/airport-access";

export const airportHubSlugs = [
  "birmingham-airport",
  "heathrow-airport",
  "gatwick-airport",
  "manchester-airport",
  "east-midlands-airport",
  "luton-airport",
  "stansted-airport",
] as const;

export type AirportHubSlug = (typeof airportHubSlugs)[number];

export type SeoAirport = {
  slug: AirportHubSlug;
  code: AirportCode;
  name: string;
  shortName: string;
  metaTitle: string;
  metaDescription: string;
  overview: string;
  departureGuidance: string;
  collectionGuidance: string;
};

export const seoAirports: Record<AirportHubSlug, SeoAirport> = {
  "birmingham-airport": {
    slug: "birmingham-airport", code: "BHX", name: "Birmingham Airport", shortName: "Birmingham",
    metaTitle: "Birmingham Airport Taxi & BHX Transfers",
    metaDescription: "Pre-book a taxi to or from Birmingham Airport (BHX). Get an exact-address quote, choose free or paid airport access and add a return journey.",
    overview: "Birmingham Airport is the closest major airport for many West Midlands journeys. Exact-address quoting helps account for the different approaches from each town and neighbourhood.",
    departureGuidance: "Customers can choose the free drop-off point, approximately a five-minute walk to the terminal, or the paid Drop & Go option closer to the terminal.",
    collectionGuidance: "For collections, choose the included free pickup point or the paid Drop & Go option closer to the terminal. The paid collection option has a maximum 15-minute waiting period.",
  },
  "heathrow-airport": {
    slug: "heathrow-airport", code: "LHR", name: "Heathrow Airport", shortName: "Heathrow",
    metaTitle: "Heathrow Airport Transfers from the West Midlands",
    metaDescription: "Book private Heathrow Airport transfers from Birmingham and the West Midlands, with terminal-aware planning, exact-address quotes and return options.",
    overview: "Heathrow journeys require the correct terminal and enough time for a longer motorway transfer. The exact pickup address, vehicle and travel details are used for the quotation.",
    departureGuidance: "Confirm the terminal shown by the airline before travel. The applicable Heathrow drop-off charge is incorporated into the quotation.",
    collectionGuidance: "Passenger collection is arranged for the relevant terminal using the confirmed meeting instructions; terminal-forecourt pickup must not be assumed.",
  },
  "gatwick-airport": {
    slug: "gatwick-airport", code: "LGW", name: "Gatwick Airport", shortName: "Gatwick",
    metaTitle: "Gatwick Airport Transfers from the West Midlands",
    metaDescription: "Arrange a private Gatwick Airport transfer from Walsall or the West Midlands with exact-address pricing, suitable vehicles and return booking options.",
    overview: "Gatwick is a long-distance airport transfer from the West Midlands, so the selected terminal, exact address, travel date and vehicle requirements all matter to the quotation.",
    departureGuidance: "Confirm whether the flight uses the North or South Terminal and follow the airport-access arrangement supplied with the booking.",
    collectionGuidance: "Provide the flight number and terminal for a return collection. The appropriate Gatwick pickup charge is incorporated into the quotation.",
  },
  "manchester-airport": {
    slug: "manchester-airport", code: "MAN", name: "Manchester Airport", shortName: "Manchester",
    metaTitle: "Manchester Airport Transfers from the West Midlands",
    metaDescription: "Pre-book Manchester Airport transfers from Walsall and the West Midlands with exact-address quotes, airport access charges and return savings.",
    overview: "Manchester Airport can be a practical choice for routes not available locally. Journey planning uses the exact pickup point and the passenger terminal shown by the airline.",
    departureGuidance: "The current Manchester drop-off access charge is added separately to the underlying transfer fare.",
    collectionGuidance: "For airport pickup, supply the terminal and flight number. The current Manchester pickup access charge is added separately to the journey fare.",
  },
  "east-midlands-airport": {
    slug: "east-midlands-airport", code: "EMA", name: "East Midlands Airport", shortName: "East Midlands",
    metaTitle: "East Midlands Airport Transfers from the West Midlands",
    metaDescription: "Book East Midlands Airport transfers from Walsall and across the West Midlands with live exact-address quotes and return journey options.",
    overview: "East Midlands Airport serves regional and holiday routes that may suit West Midlands passengers. The calculator prices the actual selected addresses rather than a generic town centre.",
    departureGuidance: "The current East Midlands drop-off access charge is added separately to the transfer fare.",
    collectionGuidance: "The airport pickup access charge is incorporated into a return quotation at its full value.",
  },
  "luton-airport": {
    slug: "luton-airport", code: "LTN", name: "Luton Airport", shortName: "Luton",
    metaTitle: "Luton Airport Transfers from the West Midlands",
    metaDescription: "Private Luton Airport transfers from Walsall and the West Midlands, with exact-address fare calculation, vehicle choice and discounted return fare.",
    overview: "Luton Airport transfers are priced from the selected West Midlands address, with the travel date, vehicle and passenger requirements included in the quote process.",
    departureGuidance: "The current Luton drop-off access charge is itemised separately from the underlying transfer fare.",
    collectionGuidance: "The Luton pickup charge remains payable in full when a return journey is calculated.",
  },
  "stansted-airport": {
    slug: "stansted-airport", code: "STN", name: "Stansted Airport", shortName: "Stansted",
    metaTitle: "Stansted Airport Transfers from the West Midlands",
    metaDescription: "Arrange a private Stansted Airport transfer from Walsall or the West Midlands with an exact-address quote and clear return pricing.",
    overview: "Stansted is a longer road journey from the West Midlands. Exact pickup details and a suitable vehicle are important for a useful quotation and practical collection plan.",
    departureGuidance: "The current Stansted drop-off access charge is added after the journey fare is calculated.",
    collectionGuidance: "The Stansted pickup charge is added in full to the return leg; it is not included in the return-fare discount.",
  },
};

export const seoAirportsByCode = Object.fromEntries(
  airportHubSlugs.map((slug) => [seoAirports[slug].code, seoAirports[slug]]),
) as Record<AirportCode, SeoAirport>;

export function isAirportHubSlug(value: string): value is AirportHubSlug {
  return airportHubSlugs.includes(value as AirportHubSlug);
}

export function getAirportAccessSummary(slug: AirportHubSlug) {
  const airport = seoAirports[slug];
  const access = airportAccessConfig[airport.code];
  return { pickupCharge: access.pickupCharge, dropOffCharge: access.dropOffCharge, customerSelection: access.customerSelection };
}
