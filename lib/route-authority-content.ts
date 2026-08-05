import { airportRoutes, airportRouteSlugs, type AirportRouteSlug } from "@/lib/airport-routes";
import { airports } from "@/lib/airports";
import { locations } from "@/lib/locations";

export type RouteAuthorityAnswer = { question: string; answer: string };

export type RouteAuthorityContent = {
  localPickupCoverage: string;
  representativePickupQualification: string;
  journeyPlanning: string;
  quotationFactors: string;
  bookingInformation: string;
  returnJourneyGuidance: string;
  childAndSpecialItemGuidance: string;
  businessTravelGuidance: string;
  directAnswerBookingNote: string;
  answers: RouteAuthorityAnswer[];
};

function buildRouteAuthorityContent(slug: AirportRouteSlug): RouteAuthorityContent {
  const route = airportRoutes[slug];
  const location = locations[route.locationSlug];
  const airport = airports[route.destinationAirport];
  const localAreas = location.pickupAreas.join(", ");
  const isHeathrow = route.destinationAirport === "heathrow";

  const localPickupCoverage = `Collection can be requested from the wider ${location.name} area, including ${localAreas}, subject to the exact address supplied. Access notes and a practical meeting point should be provided where stopping is restricted.`;
  const representativePickupQualification = `${route.representativePickup}, ${route.representativePostcode}, is a route-planning reference point only. It does not create a town-wide fixed-fare boundary; the confirmed quotation uses the customer's exact pickup address and booking requirements.`;
  const journeyPlanning = `When planning an outbound ${location.name} to ${airport.name} journey, consider the route distance, likely road and motorway conditions, the terminal, the airline's current check-in guidance and the time needed inside the airport. No single departure time suits every booking.`;
  const quotationFactors = `The confirmed quotation is based on the exact pickup address, destination airport and terminal, vehicle, passenger and luggage totals, requested date and time, drop-off or collection requirements, any additional stops, and accessibility or unusual-item requirements disclosed before booking.`;
  const bookingInformation = `For an accurate quote, provide the complete pickup address or postcode, ${airport.name} and terminal where known, travel date, requested pickup time or flight time, passenger count, large-suitcase count, vehicle preference where relevant, flight number for an airport collection, and separate return details when required.`;
  const returnJourneyGuidance = `A return journey can be requested, but it is not automatically included with a one-way booking. Supply the outbound and return dates, pickup locations, terminals where known, flight details for airport collections, and passenger and luggage requirements for each journey separately.`;
  const childAndSpecialItemGuidance = `Children count towards the passenger total. Include pushchairs and large child-related items in the luggage information. Wheelchairs, mobility equipment and unusual items must be disclosed so vehicle suitability can be confirmed before booking; specialist accessibility is not assumed.`;
  const businessTravelGuidance = `Business travellers can request a one-off transfer or discuss regular staff and guest journeys through the business accounts service, with the same complete pickup, flight, passenger and luggage information required.`;
  const directAnswerBookingNote = isHeathrow
    ? "For a Heathrow collection, supply the flight number and use the agreed terminal meeting instructions; terminal-forecourt pickup is not permitted."
    : "For a Birmingham Airport collection, supply the flight number and use the meeting point confirmed with the booking.";

  const answers: RouteAuthorityAnswer[] = [
    {
      question: `Where can a ${location.name} airport transfer collect me?`,
      answer: `${localPickupCoverage} ${representativePickupQualification}`,
    },
    {
      question: `How should I plan collection for ${location.name} to ${airport.name}?`,
      answer: journeyPlanning,
    },
    {
      question: `What information is needed for a ${location.name} airport-transfer quotation?`,
      answer: bookingInformation,
    },
    {
      question: `How does ${airport.shortName} collection and flight monitoring work?`,
      answer: `${airport.collectionGuidance} ${airport.delayGuidance}`,
    },
    {
      question: `Can I request a return journey between ${location.name} and ${airport.name}?`,
      answer: returnJourneyGuidance,
    },
    {
      question: `Which vehicle should I choose for passengers and luggage?`,
      answer: "A Saloon or Executive carries up to four passengers, but at four passengers it carries no large suitcases. An Estate carries up to four passengers and four large suitcases, an MPV up to six passengers and four large suitcases, and a Large MPV up to eight passengers and eight large suitcases. Enter the complete combination before selecting a vehicle.",
    },
  ];

  return {
    localPickupCoverage,
    representativePickupQualification,
    journeyPlanning,
    quotationFactors,
    bookingInformation,
    returnJourneyGuidance,
    childAndSpecialItemGuidance,
    businessTravelGuidance,
    directAnswerBookingNote,
    answers,
  };
}

export const routeAuthorityContent = Object.fromEntries(
  airportRouteSlugs.map((slug) => [slug, buildRouteAuthorityContent(slug)]),
) as Record<AirportRouteSlug, RouteAuthorityContent>;
