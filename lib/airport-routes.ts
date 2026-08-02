import type { LocationSlug } from "@/lib/locations";

export const airportRouteSlugs = [
  "walsall-to-birmingham-airport",
  "sutton-coldfield-to-birmingham-airport",
  "wolverhampton-to-birmingham-airport",
  "west-bromwich-to-birmingham-airport",
  "dudley-to-birmingham-airport",
  "birmingham-to-birmingham-airport",
  "solihull-to-birmingham-airport",
  "cannock-to-birmingham-airport",
] as const;

export type AirportRouteSlug = (typeof airportRouteSlugs)[number];

type RouteFaq = { question: string; answer: string };

export type AirportRoute = {
  slug: AirportRouteSlug;
  locationSlug: LocationSlug;
  metaTitle: string;
  metaDescription: string;
  introduction: string[];
  pickupGuidance: string;
  routeContext: string;
  nearbyRouteSlugs: AirportRouteSlug[];
  faqs: RouteFaq[];
};

export const airportRoutes: Record<AirportRouteSlug, AirportRoute> = {
  "walsall-to-birmingham-airport": {
    slug: "walsall-to-birmingham-airport", locationSlug: "walsall",
    metaTitle: "Walsall to Birmingham Airport Transfers",
    metaDescription: "Pre-book a fixed-price transfer from Walsall to Birmingham Airport, with vehicle options, flight monitoring and door-to-terminal collection.",
    introduction: [
      "Travelling from Walsall to Birmingham Airport often means coordinating an early start, holiday cases and the needs of everyone in the party. A pre-booked transfer collects from the agreed Walsall address and takes passengers directly to the terminal.",
      "Collections can begin in the town centre or neighbourhoods such as Aldridge, Bloxwich, Pelsall and Willenhall. Your quote is based on the actual pickup and journey details rather than a generic town-centre starting point.",
    ],
    pickupGuidance: "Please be ready at the agreed Walsall address and tell us about access restrictions, gated entrances or a pickup point that may be difficult to stop beside.",
    routeContext: "The route commonly uses the regional motorway network, but collection planning still depends on the exact part of Walsall, flight time and expected road conditions.",
    nearbyRouteSlugs: ["west-bromwich-to-birmingham-airport", "wolverhampton-to-birmingham-airport", "sutton-coldfield-to-birmingham-airport"],
    faqs: [
      { question: "Can I book from Aldridge or Bloxwich to Birmingham Airport?", answer: "Yes. The Walsall service covers the wider borough, including Aldridge, Bloxwich, Pelsall and Willenhall." },
      { question: "Is my Walsall transfer price fixed?", answer: "Once the collection, destination and requested journey details are checked, the price is confirmed before travel." },
      { question: "Can you collect us for an early-morning flight?", answer: "Yes. Advance booking allows a pickup time to be planned around the flight and airline check-in guidance." },
      { question: "What happens if my return flight is delayed?", answer: "Supply the correct flight number so current arrival information can be monitored for the booked airport collection." },
    ],
  },
  "sutton-coldfield-to-birmingham-airport": {
    slug: "sutton-coldfield-to-birmingham-airport", locationSlug: "sutton-coldfield",
    metaTitle: "Sutton Coldfield to Birmingham Airport Transfers",
    metaDescription: "Direct fixed-price transfers from Sutton Coldfield to Birmingham Airport, with planned pickups, flight monitoring and suitable vehicle choices.",
    introduction: [
      "A Sutton Coldfield to Birmingham Airport transfer gives households and business passengers a direct alternative to taking luggage through local connections. Collection is arranged from the address supplied, whether that is near the town centre, Sutton Park or an outlying neighbourhood.",
      "Four Oaks, Mere Green, Boldmere, Walmley and Wylde Green each have different approaches to the main road network. Providing the full address helps the pickup time and quote reflect the real journey.",
    ],
    pickupGuidance: "For residential collections, wait at the agreed entrance with luggage ready. Hotel and business pickups should include the venue name and the entrance where the driver can safely meet you.",
    routeContext: "Road options vary between the eastern and western sides of Sutton Coldfield, so the planned collection accounts for the starting neighbourhood rather than assuming one route for the whole town.",
    nearbyRouteSlugs: ["birmingham-to-birmingham-airport", "walsall-to-birmingham-airport", "solihull-to-birmingham-airport"],
    faqs: [
      { question: "Do you pick up in Four Oaks and Mere Green?", answer: "Yes. These and other Sutton Coldfield neighbourhoods can be selected as the collection area." },
      { question: "Can my company arrange the journey?", answer: "Yes. One-off business travel can be quoted, while regular requirements can be discussed through business accounts." },
      { question: "Will you choose a vehicle for our cases?", answer: "State every passenger and large suitcase. You can then select an option that stays within the published capacity guidance." },
      { question: "Can I request a return transfer?", answer: "Yes. Include the inbound flight details so the airport pickup can be planned and monitored." },
    ],
  },
  "wolverhampton-to-birmingham-airport": {
    slug: "wolverhampton-to-birmingham-airport", locationSlug: "wolverhampton",
    metaTitle: "Wolverhampton to Birmingham Airport Transfers",
    metaDescription: "Book a direct Wolverhampton to Birmingham Airport transfer with fixed-price confirmation, vehicle choice and return-flight monitoring.",
    introduction: [
      "Passengers leaving Wolverhampton for Birmingham Airport can avoid travelling into central Birmingham and changing onto another service. A booked vehicle collects the party and luggage together for the journey to the terminal.",
      "The starting point may be the city centre, Tettenhall, Penn, Wednesfield, Bilston or another nearby community. Because those locations sit on different sides of the city, the exact address is used when planning the transfer.",
    ],
    pickupGuidance: "City-centre passengers should identify a practical entrance or hotel pickup point. At residential addresses, be ready at the booked time with all cases and travel documents.",
    routeContext: "The airport lies beyond Birmingham from Wolverhampton, making road conditions and departure time important parts of pickup planning, particularly for weekday flights.",
    nearbyRouteSlugs: ["dudley-to-birmingham-airport", "walsall-to-birmingham-airport", "west-bromwich-to-birmingham-airport"],
    faqs: [
      { question: "Can you collect outside Wolverhampton city centre?", answer: "Yes. Tettenhall, Penn, Wednesfield, Bilston and other surrounding areas can be covered." },
      { question: "How is the pickup time decided?", answer: "It is agreed using your address and flight details together with airline check-in guidance and reasonable travel planning." },
      { question: "Is a larger vehicle available for a group?", answer: "Yes. MPV options are available, subject to the passenger and large-suitcase capacity shown in the quote form." },
      { question: "Where will I be dropped at Birmingham Airport?", answer: "The requested terminal drop-off arrangement is confirmed with the booking, including any applicable airport access option." },
    ],
  },
  "west-bromwich-to-birmingham-airport": {
    slug: "west-bromwich-to-birmingham-airport", locationSlug: "west-bromwich",
    metaTitle: "West Bromwich to Birmingham Airport Transfers",
    metaDescription: "Fixed-price airport transfers from West Bromwich and nearby Sandwell areas to Birmingham Airport, pre-booked for your flight.",
    introduction: [
      "A West Bromwich to Birmingham Airport car keeps families and groups together from collection to terminal. It removes the need to take cases across local connections before starting the airport leg of the journey.",
      "Pickups can be arranged in central West Bromwich and nearby Sandwell areas such as Stone Cross, Hateley Heath, Oldbury and Tipton. Full address details ensure the quote and collection are based on the right starting point.",
    ],
    pickupGuidance: "If your address is in a busy commercial area or apartment development, specify a safe meeting point and entrance. Passengers should be ready before the agreed collection time.",
    routeContext: "West Bromwich has several possible approaches towards the airport. The practical route depends on the collection area and conditions around Birmingham at the time of travel.",
    nearbyRouteSlugs: ["birmingham-to-birmingham-airport", "walsall-to-birmingham-airport", "dudley-to-birmingham-airport"],
    faqs: [
      { question: "Do you collect from nearby Sandwell areas?", answer: "Yes. The service can include Oldbury, Tipton, Stone Cross and other communities around West Bromwich." },
      { question: "Will the booked price change in traffic?", answer: "The agreed transfer price is fixed for the confirmed journey details, rather than running on a meter during normal traffic." },
      { question: "Can you carry child travel equipment?", answer: "Describe all cases and additional items when requesting the quote so the required space can be assessed before booking." },
      { question: "Is flight monitoring used for departures?", answer: "Flight monitoring is especially relevant to airport pickups. Departure collection times are planned using your supplied flight and check-in information." },
    ],
  },
  "dudley-to-birmingham-airport": {
    slug: "dudley-to-birmingham-airport", locationSlug: "dudley",
    metaTitle: "Dudley to Birmingham Airport Transfers",
    metaDescription: "Pre-book a Dudley to Birmingham Airport transfer with fixed-price confirmation, door-to-terminal travel and vehicle options for your group.",
    introduction: [
      "Dudley borough covers a wide part of the Black Country, and reaching the airport by public transport can involve different local connections depending on where the journey begins. A pre-booked transfer starts at the supplied address and travels directly to Birmingham Airport.",
      "Dudley town, Sedgley, Gornal, Brierley Hill and Kingswinford are spread across the borough. The full pickup location, rather than Dudley as a general label, is therefore central to planning the quote and collection.",
    ],
    pickupGuidance: "Provide the house, hotel or workplace entrance and flag any narrow access or parking restrictions. Have the full party and luggage ready at the booked time.",
    routeContext: "Journeys from the western side of the borough differ from those beginning nearer Dudley town, so route and timing are considered only after the collection point is known.",
    nearbyRouteSlugs: ["wolverhampton-to-birmingham-airport", "west-bromwich-to-birmingham-airport", "birmingham-to-birmingham-airport"],
    faqs: [
      { question: "Can you collect from Brierley Hill or Kingswinford?", answer: "Yes. These and other communities across Dudley borough can be used as the pickup location." },
      { question: "Can a family travel with several cases?", answer: "Yes, provided the chosen vehicle is within its passenger and luggage limits. Enter accurate totals when checking the journey." },
      { question: "Can I pre-book the journey home as well?", answer: "Yes. A return airport collection can be requested using the correct inbound flight details." },
      { question: "Is the transfer door to terminal?", answer: "The service collects from the agreed Dudley address and drops passengers according to the confirmed Birmingham Airport arrangement." },
    ],
  },
  "birmingham-to-birmingham-airport": {
    slug: "birmingham-to-birmingham-airport", locationSlug: "birmingham",
    metaTitle: "Birmingham to Birmingham Airport Transfers",
    metaDescription: "Book a fixed-price transfer from Birmingham city neighbourhoods, hotels and businesses to Birmingham Airport with planned collection.",
    introduction: [
      "Birmingham Airport is outside the city centre beside the NEC and Birmingham International. A pre-booked transfer gives residents, hotel guests and business travellers a direct trip from their chosen Birmingham address to the airport.",
      "Collections can be requested in the city centre, Jewellery Quarter, Edgbaston, Harborne, Moseley and many other districts. Central streets, apartment entrances and hotel forecourts can be busy, so clear meeting instructions are especially useful.",
    ],
    pickupGuidance: "For a hotel, give its full name and agreed entrance. For an apartment or office, identify where the driver can safely stop and keep your phone available near collection time.",
    routeContext: "The distance to the airport varies significantly across Birmingham. City-centre traffic, the starting district and flight time all affect sensible pickup planning, so no single journey time applies city-wide.",
    nearbyRouteSlugs: ["solihull-to-birmingham-airport", "sutton-coldfield-to-birmingham-airport", "west-bromwich-to-birmingham-airport"],
    faqs: [
      { question: "Do you collect from Birmingham hotels?", answer: "Yes. Give the hotel name, address and entrance so the meeting point can be agreed." },
      { question: "Is Birmingham Airport in the city centre?", answer: "No. It is east of central Birmingham beside the NEC and Birmingham International." },
      { question: "Can colleagues share one business transfer?", answer: "Yes. Confirm the complete passenger and luggage totals and select a vehicle that can accommodate them." },
      { question: "Can you collect from different Birmingham districts?", answer: "The service covers neighbourhoods across the city, with each quote based on the actual pickup address." },
    ],
  },
  "solihull-to-birmingham-airport": {
    slug: "solihull-to-birmingham-airport", locationSlug: "solihull",
    metaTitle: "Solihull to Birmingham Airport Transfers",
    metaDescription: "Direct fixed-price transfers from Solihull, Shirley and surrounding villages to Birmingham Airport, planned around your flight.",
    introduction: [
      "Birmingham Airport is close to parts of Solihull borough, yet a direct car remains useful when passengers have holiday luggage, young children, an early departure or no convenient station connection. Collection begins at the address agreed in the booking.",
      "Solihull town centre, Shirley, Knowle, Dorridge and Hockley Heath sit in different directions from the terminal. Supplying the precise location ensures that a nearby address is not mistaken for a universal Solihull journey.",
    ],
    pickupGuidance: "Be ready at the agreed home, hotel or workplace entrance. For village properties with unclear access, include directions or a recognisable meeting point when arranging collection.",
    routeContext: "Some Solihull neighbourhoods are close to the airport while others lie much farther south or west. The quote and collection plan therefore use the real address and do not assume a standard distance.",
    nearbyRouteSlugs: ["birmingham-to-birmingham-airport", "sutton-coldfield-to-birmingham-airport", "dudley-to-birmingham-airport"],
    faqs: [
      { question: "Do you collect from Knowle and Dorridge?", answer: "Yes. Transfers can be requested from these villages and other areas across Solihull borough." },
      { question: "Is there one standard fare for all of Solihull?", answer: "No. The borough covers a broad area, so the price is based on the actual pickup and confirmed journey details." },
      { question: "Can you monitor my flight home?", answer: "Yes. Provide the correct inbound flight number for a booked return collection." },
      { question: "What luggage information is required?", answer: "Enter the number of large suitcases and mention unusual or bulky items so vehicle suitability can be checked." },
    ],
  },
  "cannock-to-birmingham-airport": {
    slug: "cannock-to-birmingham-airport", locationSlug: "cannock",
    metaTitle: "Cannock to Birmingham Airport Transfers",
    metaDescription: "Pre-book a fixed-price transfer from Cannock and nearby Staffordshire communities to Birmingham Airport, with return-flight monitoring.",
    introduction: [
      "A Cannock to Birmingham Airport transfer provides a single direct journey from Staffordshire to the terminal. This can be particularly practical for early flights, family groups or passengers who would otherwise need a local connection before joining an airport service.",
      "Collections can be requested from Cannock town, Hednesford, Heath Hayes, Norton Canes and nearby communities. The precise starting point is used to plan the collection because the wider area covers several approaches to the main road network.",
    ],
    pickupGuidance: "Passengers should wait at the agreed entrance with luggage ready. Rural or less obvious addresses should include clear access notes and a contact number for the collection.",
    routeContext: "The journey begins farther north than the core West Midlands routes, so sufficient allowance for the road journey and airline check-in requirement is important when agreeing pickup time.",
    nearbyRouteSlugs: ["walsall-to-birmingham-airport", "wolverhampton-to-birmingham-airport", "sutton-coldfield-to-birmingham-airport"],
    faqs: [
      { question: "Can you collect from Hednesford or Norton Canes?", answer: "Yes. These and other communities around Cannock can be specified as the pickup location." },
      { question: "Can I book for an early Birmingham Airport flight?", answer: "Yes. The pickup is agreed in advance using your starting address, flight details and airline guidance." },
      { question: "How do I know which vehicle to choose?", answer: "Compare the passenger and large-suitcase limits in the quote form and do not select a vehicle below your party's needs." },
      { question: "Will a delayed return flight be monitored?", answer: "Current arrival information can be followed when the correct flight number is supplied for the booked return." },
    ],
  },
};

export function isAirportRouteSlug(value: string): value is AirportRouteSlug {
  return airportRouteSlugs.includes(value as AirportRouteSlug);
}
