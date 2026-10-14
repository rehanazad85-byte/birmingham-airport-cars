import type { LocationSlug } from "@/lib/locations";
import type { AirportId } from "@/lib/airports";

export const airportRouteSlugs = [
  "walsall-to-birmingham-airport",
  "sutton-coldfield-to-birmingham-airport",
  "wolverhampton-to-birmingham-airport",
  "west-bromwich-to-birmingham-airport",
  "dudley-to-birmingham-airport",
  "birmingham-to-birmingham-airport",
  "solihull-to-birmingham-airport",
  "cannock-to-birmingham-airport",
  "walsall-to-heathrow-airport",
  "sutton-coldfield-to-heathrow-airport",
  "wolverhampton-to-heathrow-airport",
  "west-bromwich-to-heathrow-airport",
  "dudley-to-heathrow-airport",
  "birmingham-to-heathrow-airport",
  "solihull-to-heathrow-airport",
  "cannock-to-heathrow-airport",
] as const;

export type AirportRouteSlug = (typeof airportRouteSlugs)[number];

type RouteFaq = { question: string; answer: string };

export type AirportRoute = {
  slug: AirportRouteSlug;
  locationSlug: LocationSlug;
  destinationAirport: AirportId;
  metaTitle: string;
  metaDescription: string;
  introduction: string[];
  representativePickup: string;
  representativePostcode: string;
  distanceRange: string;
  journeyTimeRange: string;
  pickupGuidance: string;
  routeContext: string;
  nearbyRouteSlugs: AirportRouteSlug[];
  faqs: RouteFaq[];
};

export const airportRoutes: Record<AirportRouteSlug, AirportRoute> = {
  "walsall-to-birmingham-airport": {
    slug: "walsall-to-birmingham-airport", locationSlug: "walsall", destinationAirport: "birmingham",
    representativePickup: "Walsall town centre", representativePostcode: "WS1 1TP",
    distanceRange: "Varies by exact pickup address", journeyTimeRange: "Varies by pickup time and road conditions",
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
    slug: "sutton-coldfield-to-birmingham-airport", locationSlug: "sutton-coldfield", destinationAirport: "birmingham",
    representativePickup: "Sutton Coldfield town centre", representativePostcode: "B72 1PA",
    distanceRange: "Varies by exact pickup address", journeyTimeRange: "Varies by pickup time and road conditions",
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
    slug: "wolverhampton-to-birmingham-airport", locationSlug: "wolverhampton", destinationAirport: "birmingham",
    representativePickup: "Wolverhampton city centre", representativePostcode: "WV1 1SH",
    distanceRange: "Varies by exact pickup address", journeyTimeRange: "Varies by pickup time and road conditions",
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
    slug: "west-bromwich-to-birmingham-airport", locationSlug: "west-bromwich", destinationAirport: "birmingham",
    representativePickup: "West Bromwich town centre", representativePostcode: "B70 8DJ",
    distanceRange: "Varies by exact pickup address", journeyTimeRange: "Varies by pickup time and road conditions",
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
    slug: "dudley-to-birmingham-airport", locationSlug: "dudley", destinationAirport: "birmingham",
    representativePickup: "Dudley town centre", representativePostcode: "DY1 1NS",
    distanceRange: "Varies by exact pickup address", journeyTimeRange: "Varies by pickup time and road conditions",
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
    slug: "birmingham-to-birmingham-airport", locationSlug: "birmingham", destinationAirport: "birmingham",
    representativePickup: "Birmingham city centre", representativePostcode: "B1 1BB",
    distanceRange: "Varies by exact pickup address", journeyTimeRange: "Varies by pickup time and road conditions",
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
    slug: "solihull-to-birmingham-airport", locationSlug: "solihull", destinationAirport: "birmingham",
    representativePickup: "Solihull town centre", representativePostcode: "B91 3RG",
    distanceRange: "Varies by exact pickup address", journeyTimeRange: "Varies by pickup time and road conditions",
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
    slug: "cannock-to-birmingham-airport", locationSlug: "cannock", destinationAirport: "birmingham",
    representativePickup: "Cannock town centre", representativePostcode: "WS11 1WS",
    distanceRange: "Varies by exact pickup address", journeyTimeRange: "Varies by pickup time and road conditions",
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
  "walsall-to-heathrow-airport": {
    slug: "walsall-to-heathrow-airport", locationSlug: "walsall", destinationAirport: "heathrow",
    representativePickup: "Walsall town centre", representativePostcode: "WS1 1TP",
    distanceRange: "approximately 120–135 miles", journeyTimeRange: "typically around 2 hours 15 minutes–3 hours 15 minutes",
    metaTitle: "Walsall to Heathrow Airport Transfers",
    metaDescription: "Plan a fixed-price Walsall to Heathrow Airport transfer with terminal-aware guidance, flight monitoring and vehicles for different luggage needs.",
    introduction: [
      "A pre-booked Walsall to Heathrow Airport transfer keeps passengers and luggage together for the longer journey to west London. Collection can be arranged from the address supplied in Walsall, Aldridge, Bloxwich, Pelsall, Willenhall or another nearby community.",
      "The M6 and wider motorway network can be affected by the time of day, so the pickup is planned around the exact address, terminal, airline check-in guidance and expected conditions rather than a single town-wide journey time.",
    ],
    pickupGuidance: "For a Walsall home collection, provide the complete address and note any gated access, restricted stopping or difficult entrance. Be ready with the full party and luggage at the agreed time.",
    routeContext: "From the representative Walsall town-centre pickup, the road journey is approximately 120–135 miles and typically around 2 hours 15 minutes–3 hours 15 minutes. These are planning ranges, not guarantees; the exact address, terminal and traffic can materially change the journey.",
    nearbyRouteSlugs: ["west-bromwich-to-heathrow-airport", "wolverhampton-to-heathrow-airport", "sutton-coldfield-to-heathrow-airport"],
    faqs: [
      { question: "Can you collect from Aldridge or Bloxwich for Heathrow?", answer: "Yes. The route can begin across the wider Walsall borough, with the confirmed quote based on the complete pickup address." },
      { question: "How early should a Walsall pickup be for Heathrow?", answer: "The pickup time is agreed from the exact Walsall address, the confirmed terminal, airline check-in guidance and reasonable allowance for a long motorway journey." },
      { question: "Can I book a return from a specific Heathrow terminal?", answer: "Yes. Supply the terminal and correct inbound flight details. The collection point and timing are then confirmed for that booking rather than assumed." },
      { question: "What if my Heathrow arrival time changes?", answer: "The supplied flight number allows current arrival information to be monitored. The agreed collection instructions and any waiting arrangements still apply." },
      { question: "Is a larger vehicle available for a Walsall family?", answer: "Yes. Enter every passenger and large suitcase, then choose a vehicle within the displayed capacity limits." },
    ],
  },
  "sutton-coldfield-to-heathrow-airport": {
    slug: "sutton-coldfield-to-heathrow-airport", locationSlug: "sutton-coldfield", destinationAirport: "heathrow",
    representativePickup: "Sutton Coldfield town centre", representativePostcode: "B72 1PA",
    distanceRange: "approximately 115–130 miles", journeyTimeRange: "typically around 2 hours 10 minutes–3 hours 10 minutes",
    metaTitle: "Sutton Coldfield to Heathrow Airport Transfers",
    metaDescription: "Book a Sutton Coldfield to Heathrow Airport transfer from homes, hotels and businesses, with fixed-price confirmation and flight monitoring.",
    introduction: [
      "A direct Sutton Coldfield to Heathrow Airport car avoids taking cases through Birmingham before joining a London-bound service. The collection can start at a home, hotel or workplace in Four Oaks, Mere Green, Boldmere, Walmley, Wylde Green or elsewhere in the Royal Town.",
      "Starting points on different sides of Sutton Park reach the motorway network differently. The full address and Heathrow terminal are therefore needed before the collection plan and fixed quotation can be confirmed.",
    ],
    pickupGuidance: "Give the property, hotel or business name and the entrance where a vehicle can safely stop. For large developments, add a concise meeting instruction and keep your phone available near pickup time.",
    routeContext: "A representative town-centre journey is approximately 115–130 miles and typically around 2 hours 10 minutes–3 hours 10 minutes. Neighbourhood, terminal, departure time and road conditions can move the journey outside those planning ranges.",
    nearbyRouteSlugs: ["birmingham-to-heathrow-airport", "walsall-to-heathrow-airport", "solihull-to-heathrow-airport"],
    faqs: [
      { question: "Do Heathrow transfers cover Four Oaks and Mere Green?", answer: "Yes. Collections can be requested from these and other Sutton Coldfield neighbourhoods using the exact address for quotation and planning." },
      { question: "Can a Sutton Coldfield business arrange Heathrow travel?", answer: "Yes. One-off journeys can be quoted, while organisations with recurring staff or guest travel can discuss a business account." },
      { question: "Which Heathrow terminal should I enter?", answer: "Use the terminal confirmed by your airline. Heathrow operates Terminals 2, 3, 4 and 5, and terminal details affect the airport approach and collection instructions." },
      { question: "Can I travel with golf clubs or other bulky items?", answer: "Mention all unusual items before booking. Passenger numbers and large cases alone may not show the space needed for bulky equipment." },
      { question: "Is the Sutton Coldfield to Heathrow journey time guaranteed?", answer: "No. Any range shown is for planning only; the exact pickup, terminal, road conditions and required stops can change it." },
    ],
  },
  "wolverhampton-to-heathrow-airport": {
    slug: "wolverhampton-to-heathrow-airport", locationSlug: "wolverhampton", destinationAirport: "heathrow",
    representativePickup: "Wolverhampton city centre", representativePostcode: "WV1 1SH",
    distanceRange: "approximately 125–140 miles", journeyTimeRange: "typically around 2 hours 20 minutes–3 hours 20 minutes",
    metaTitle: "Wolverhampton to Heathrow Airport Transfers",
    metaDescription: "Pre-book a Wolverhampton to Heathrow Airport transfer with a confirmed fixed quote, terminal guidance and options for groups and luggage.",
    introduction: [
      "Travelling from Wolverhampton to Heathrow is a substantial cross-region journey. A booked transfer collects the party at one city, hotel or residential address and keeps luggage with them through to the correct Heathrow terminal.",
      "Tettenhall and Codsall begin west of the city, while Wednesfield and Bilston use different approaches. Those local differences matter when agreeing a pickup time for a long-distance airport journey.",
    ],
    pickupGuidance: "City-centre passengers should name a practical hotel, office or building entrance. Residential passengers should flag narrow access or parking restrictions and be ready before the booked time.",
    routeContext: "From the representative city-centre pickup, allow for approximately 125–140 miles and typically around 2 hours 20 minutes–3 hours 20 minutes. These broad ranges can change with the exact neighbourhood, Heathrow terminal and motorway conditions.",
    nearbyRouteSlugs: ["dudley-to-heathrow-airport", "walsall-to-heathrow-airport", "west-bromwich-to-heathrow-airport"],
    faqs: [
      { question: "Can a Heathrow transfer start in Tettenhall or Wednesfield?", answer: "Yes. Collections can be arranged across Wolverhampton and nearby communities, with the specific address used for the confirmed quote." },
      { question: "Can I request a comfort stop on the way to Heathrow?", answer: "Discuss any planned stop when requesting the journey because it can affect the booking requirements, route time and confirmed fare." },
      { question: "How is a delayed Heathrow return handled?", answer: "Provide the correct flight number so current arrival information can be followed. The booking confirmation sets out the meeting and waiting arrangement." },
      { question: "Will the driver meet us inside every Heathrow terminal?", answer: "Do not assume an inside-terminal meeting. The collection point is agreed for the booked terminal and may involve an authorised car park or another specified location." },
      { question: "Which vehicle suits eight passengers from Wolverhampton?", answer: "The Large MPV permits up to eight passengers and eight large suitcases, subject to the complete travelling requirements entered." },
    ],
  },
  "west-bromwich-to-heathrow-airport": {
    slug: "west-bromwich-to-heathrow-airport", locationSlug: "west-bromwich", destinationAirport: "heathrow",
    representativePickup: "West Bromwich town centre", representativePostcode: "B70 8DJ",
    distanceRange: "approximately 115–130 miles", journeyTimeRange: "typically around 2 hours 10 minutes–3 hours 10 minutes",
    metaTitle: "West Bromwich to Heathrow Airport Transfers",
    metaDescription: "Arrange a West Bromwich to Heathrow Airport transfer with direct pickup, fixed-price confirmation, flight monitoring and terminal guidance.",
    introduction: [
      "A West Bromwich to Heathrow transfer gives Sandwell passengers a single direct journey instead of carrying luggage through local and London connections. Collection can begin in central West Bromwich, Stone Cross, Hateley Heath, Oldbury, Tipton or another agreed address.",
      "The starting area influences how the vehicle joins the motorway network, while the Heathrow terminal affects the final airport approach. Both details are checked before travel is confirmed.",
    ],
    pickupGuidance: "For apartment, hotel and commercial addresses, specify the entrance or safe roadside meeting point. Everyone and all luggage should be ready at the agreed collection time.",
    routeContext: "The representative town-centre route is approximately 115–130 miles and typically around 2 hours 10 minutes–3 hours 10 minutes. Treat these as approximate planning ranges because congestion, exact address and terminal can alter them.",
    nearbyRouteSlugs: ["birmingham-to-heathrow-airport", "walsall-to-heathrow-airport", "dudley-to-heathrow-airport"],
    faqs: [
      { question: "Can you collect from Oldbury or Tipton for Heathrow?", answer: "Yes. Nearby Sandwell pickup points can be requested, and the exact address is used to confirm the journey." },
      { question: "Is a Heathrow transfer suitable for a family with cases?", answer: "Yes, provided the selected vehicle can carry the full passenger and large-suitcase combination. Mention pushchairs and other bulky items separately." },
      { question: "Does a quoted time include guaranteed traffic conditions?", answer: "No. Road conditions cannot be guaranteed, so the booking is planned with reasonable allowance using the flight and pickup details." },
      { question: "Where are passengers collected at Heathrow?", answer: "The booking will specify the meeting location for the relevant terminal. Heathrow does not permit passenger pickup from terminal forecourts." },
      { question: "Can regular Sandwell business journeys be arranged?", answer: "Businesses with recurring airport-transfer needs can discuss account requirements through the business accounts page." },
    ],
  },
  "dudley-to-heathrow-airport": {
    slug: "dudley-to-heathrow-airport", locationSlug: "dudley", destinationAirport: "heathrow",
    representativePickup: "Dudley town centre", representativePostcode: "DY1 1NS",
    distanceRange: "approximately 120–135 miles", journeyTimeRange: "typically around 2 hours 15 minutes–3 hours 15 minutes",
    metaTitle: "Dudley to Heathrow Airport Transfers",
    metaDescription: "Plan a Dudley to Heathrow Airport transfer from across the borough, with a confirmed quote, flight monitoring and suitable vehicle options.",
    introduction: [
      "Dudley borough covers a broad part of the Black Country, so a Heathrow journey from Kingswinford is not identical to one beginning in Dudley town or Brierley Hill. A direct transfer starts at the supplied address and avoids separate local connections before the London journey.",
      "The complete pickup location, passenger total, luggage and Heathrow terminal are considered together so the vehicle and collection plan reflect the actual booking.",
    ],
    pickupGuidance: "Give clear access instructions for hillside, gated or restricted addresses and identify the entrance for hotels or workplaces. Have the travelling party and cases together before collection.",
    routeContext: "From the representative Dudley town-centre point, the route is approximately 120–135 miles and typically around 2 hours 15 minutes–3 hours 15 minutes. Western borough pickups, traffic and the selected Heathrow terminal can change those ranges.",
    nearbyRouteSlugs: ["wolverhampton-to-heathrow-airport", "west-bromwich-to-heathrow-airport", "birmingham-to-heathrow-airport"],
    faqs: [
      { question: "Do you cover Kingswinford and Brierley Hill for Heathrow?", answer: "Yes. These and other Dudley borough communities can be used as the pickup point for a confirmed quotation." },
      { question: "Can the Heathrow trip include more than one Dudley pickup?", answer: "Additional pickups must be requested before confirmation because they can change the route, time, vehicle requirements and fare." },
      { question: "What flight details are needed for the return?", answer: "Provide the airline, flight number, arrival date and terminal information available from your booking." },
      { question: "Can you guarantee a particular Heathrow collection procedure?", answer: "No universal procedure is promised. The meeting point is confirmed for the terminal and booking arrangements in force for that journey." },
      { question: "Can I bring a wheelchair or mobility equipment?", answer: "Describe the equipment and whether it folds before booking so space and vehicle suitability can be assessed alongside luggage." },
    ],
  },
  "birmingham-to-heathrow-airport": {
    slug: "birmingham-to-heathrow-airport", locationSlug: "birmingham", destinationAirport: "heathrow",
    representativePickup: "Birmingham city centre", representativePostcode: "B1 1BB",
    distanceRange: "approximately 105–120 miles", journeyTimeRange: "typically around 2 hours–3 hours",
    metaTitle: "Birmingham to Heathrow Airport Transfers",
    metaDescription: "Book a Birmingham to Heathrow Airport transfer from a home, hotel or workplace with fixed-price confirmation and terminal-aware planning.",
    introduction: [
      "A private transfer from Birmingham to Heathrow provides a direct alternative to changing between city transport and a London airport connection. It can begin at a city-centre hotel, business address or home in districts such as Edgbaston, Harborne, Moseley or Yardley.",
      "Central stopping restrictions and the distance between Birmingham neighbourhoods make precise pickup instructions important. The correct Heathrow terminal must also be supplied so the final approach and collection guidance match the journey.",
    ],
    pickupGuidance: "Name the Birmingham building, hotel or workplace entrance and identify a legal place for the vehicle to stop. In the city centre, keep your phone available and be ready before the arranged time.",
    routeContext: "A Birmingham city-centre starting point is approximately 105–120 miles from Heathrow and typically around 2 hours–3 hours by road. The actual district, terminal, traffic and any agreed stops determine the real journey.",
    nearbyRouteSlugs: ["solihull-to-heathrow-airport", "sutton-coldfield-to-heathrow-airport", "west-bromwich-to-heathrow-airport"],
    faqs: [
      { question: "Can you collect from a Birmingham city-centre hotel?", answer: "Yes. Give the full hotel name, address and agreed entrance so the collection point is unambiguous." },
      { question: "Can a company book Birmingham to Heathrow travel?", answer: "Yes. Individual business journeys can be quoted, and recurring staff or guest travel can be discussed as a business account requirement." },
      { question: "Do Heathrow Terminals 2, 3, 4 and 5 use the same meeting point?", answer: "No. The airport layout and collection arrangements differ, so follow the terminal-specific instructions confirmed with the booking." },
      { question: "Can colleagues with several cases travel together?", answer: "Yes, if the selected vehicle remains within both its passenger and large-suitcase limits. Add bulky items separately." },
      { question: "Does flight monitoring replace contacting the service?", answer: "No. Flight information supports planning, but passengers should still follow the confirmed instructions and make contact if their circumstances change." },
    ],
  },
  "solihull-to-heathrow-airport": {
    slug: "solihull-to-heathrow-airport", locationSlug: "solihull", destinationAirport: "heathrow",
    representativePickup: "Solihull town centre", representativePostcode: "B91 3RG",
    distanceRange: "approximately 100–115 miles", journeyTimeRange: "typically around 1 hour 50 minutes–2 hours 50 minutes",
    metaTitle: "Solihull to Heathrow Airport Transfers",
    metaDescription: "Arrange a direct Solihull to Heathrow Airport transfer from the town or surrounding villages, planned for your terminal and luggage.",
    introduction: [
      "A Solihull to Heathrow Airport transfer can collect from the town, Shirley, Knowle, Dorridge, Dickens Heath or surrounding villages for one direct journey to the airline terminal. This is useful when the party has luggage or a flight time that makes rail connections less practical.",
      "Southern Solihull villages and addresses nearer Birmingham Airport begin from different points on the road network. The exact pickup postcode is therefore essential to the confirmed quote and sensible departure planning.",
    ],
    pickupGuidance: "For village and rural-edge addresses, include concise directions if the entrance is not obvious. Hotel and business collections should name the building and practical pickup entrance.",
    routeContext: "From Solihull town centre, Heathrow is approximately 100–115 miles and typically around 1 hour 50 minutes–2 hours 50 minutes by road. Starting village, terminal and motorway conditions can place the journey outside this planning range.",
    nearbyRouteSlugs: ["birmingham-to-heathrow-airport", "sutton-coldfield-to-heathrow-airport", "dudley-to-heathrow-airport"],
    faqs: [
      { question: "Can you collect from Knowle or Dorridge for Heathrow?", answer: "Yes. The confirmed quotation uses the full village address because distances vary across Solihull borough." },
      { question: "Is there one Heathrow fare for all Solihull pickups?", answer: "No. The exact address, vehicle, terminal and booking requirements must be checked before a fixed quotation is confirmed." },
      { question: "What should I do if my airline changes terminal?", answer: "Share the updated terminal information as soon as possible so the booking and airport instructions can be checked." },
      { question: "Can a return flight be monitored?", answer: "Yes. Supplying the correct inbound flight number allows current arrival information to support collection planning." },
      { question: "Are child seats automatically supplied?", answer: "Do not assume equipment is included. State all child-travel requirements when requesting the journey so the available arrangement can be confirmed." },
    ],
  },
  "cannock-to-heathrow-airport": {
    slug: "cannock-to-heathrow-airport", locationSlug: "cannock", destinationAirport: "heathrow",
    representativePickup: "Cannock town centre", representativePostcode: "WS11 1WS",
    distanceRange: "approximately 125–140 miles", journeyTimeRange: "typically around 2 hours 20 minutes–3 hours 25 minutes",
    metaTitle: "Cannock to Heathrow Airport Transfers",
    metaDescription: "Pre-book a Cannock to Heathrow Airport transfer from Cannock Chase communities with a confirmed quote and flight-aware return planning.",
    introduction: [
      "Cannock passengers face a longer journey south to Heathrow before reaching the terminal. A pre-booked vehicle can collect from Cannock town, Hednesford, Heath Hayes, Norton Canes or a nearby Staffordshire address and carry the party throughout the trip.",
      "Pickups north of Cannock or close to the M6 Toll do not share one standard route. Collection timing is agreed only after the postcode, flight, terminal, passenger and luggage details are known.",
    ],
    pickupGuidance: "Provide clear access notes for rural or less obvious addresses and a working contact number. Everyone should be ready with luggage before the agreed collection time for this longer transfer.",
    routeContext: "The representative Cannock town-centre journey is approximately 125–140 miles and typically around 2 hours 20 minutes–3 hours 25 minutes. Location within the wider area, motorway conditions and the Heathrow terminal can all alter it.",
    nearbyRouteSlugs: ["walsall-to-heathrow-airport", "wolverhampton-to-heathrow-airport", "sutton-coldfield-to-heathrow-airport"],
    faqs: [
      { question: "Can Heathrow transfers start in Hednesford or Heath Hayes?", answer: "Yes. Collections can be requested across the Cannock area, with the exact postcode used for quotation and journey planning." },
      { question: "How is the Cannock departure time chosen?", answer: "It is agreed using the pickup address, Heathrow terminal, airline check-in guidance and reasonable allowance for the longer motorway journey." },
      { question: "Can I arrange an outbound and return transfer?", answer: "Yes. Supply the correct inbound flight details and follow the collection instructions confirmed for the return terminal." },
      { question: "What vehicle should a Cannock group choose?", answer: "Use the passenger and large-suitcase limits shown for each vehicle. Mention sports equipment, pushchairs or mobility aids separately." },
      { question: "Is the approximate journey-time range guaranteed?", answer: "No. It is a planning guide only and cannot account for every traffic event, pickup variation, stop or terminal approach." },
    ],
  },
};

export function isAirportRouteSlug(value: string): value is AirportRouteSlug {
  return airportRouteSlugs.includes(value as AirportRouteSlug);
}
