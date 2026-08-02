export const locationSlugs = [
  "walsall",
  "sutton-coldfield",
  "wolverhampton",
  "west-bromwich",
  "dudley",
  "birmingham",
  "solihull",
  "cannock",
] as const;

export type LocationSlug = (typeof locationSlugs)[number];

type LocationFaq = {
  question: string;
  answer: string;
};

export type Location = {
  slug: LocationSlug;
  name: string;
  metaTitle: string;
  metaDescription: string;
  heroIntro: string;
  localIntro: string[];
  birminghamAirport: string[];
  otherAirports: {
    introduction: string;
    airports: string[];
  };
  pickupAreas: string[];
  nearbySlugs: LocationSlug[];
  faqs: LocationFaq[];
};

export const locations: Record<LocationSlug, Location> = {
  walsall: {
    slug: "walsall",
    name: "Walsall",
    metaTitle: "Airport Transfers Walsall",
    metaDescription:
      "Pre-booked airport transfers from Walsall to Birmingham Airport and major UK airports, with fixed-price confirmation and flight monitoring.",
    heroIntro:
      "Pre-booked airport transfers for passengers travelling from Walsall to Birmingham Airport and other major UK airports.",
    localIntro: [
      "Walsall passengers often need an airport journey that starts before local public transport is convenient or finishes after the last connection home. A pre-booked transfer provides a direct collection from your chosen pickup point, with room to plan for luggage and the needs of your group.",
      "We serve Walsall town centre and communities across the wider borough, whether you are leaving from home, a workplace or a hotel. Journey details are checked before the booking is confirmed so the collection can be planned around your flight.",
    ],
    birminghamAirport: [
      "Birmingham Airport is the nearest major airport for many Walsall travellers. Collections can be arranged from across the borough for departures from the main terminal, including early-morning flights and evening arrivals.",
      "Your confirmed pickup time should allow for the route to the airport, airline check-in guidance and expected traffic. For return collections, flight monitoring helps the service respond when an inbound flight lands earlier or later than scheduled.",
    ],
    otherAirports: {
      introduction:
        "Longer-distance transfers can also be arranged when your itinerary uses an airport outside the West Midlands.",
      airports: ["Heathrow Airport", "Manchester Airport", "East Midlands Airport", "Gatwick Airport"],
    },
    pickupAreas: [
      "Walsall town centre",
      "Aldridge",
      "Bloxwich",
      "Pelsall",
      "Rushall",
      "Willenhall",
      "Bentley",
      "Pheasey",
    ],
    nearbySlugs: ["west-bromwich", "wolverhampton", "sutton-coldfield"],
    faqs: [
      {
        question: "Can I book a Walsall airport transfer for an early flight?",
        answer:
          "Yes. Pre-booking is suitable for early departures because the collection time can be agreed in advance around your flight and airline check-in guidance.",
      },
      {
        question: "Can you collect from areas outside Walsall town centre?",
        answer:
          "Yes. Coverage includes neighbourhoods across the wider Walsall borough, including Aldridge, Bloxwich, Pelsall, Rushall and Willenhall.",
      },
      {
        question: "Is the fare from Walsall confirmed before travel?",
        answer:
          "Journey details are checked before a fixed price is confirmed. Any requested extras or changes to the booked journey should be agreed in advance.",
      },
    ],
  },
  "sutton-coldfield": {
    slug: "sutton-coldfield",
    name: "Sutton Coldfield",
    metaTitle: "Airport Transfers Sutton Coldfield",
    metaDescription:
      "Professional airport transfers from Sutton Coldfield to Birmingham Airport and major UK airports, pre-booked with fixed-price confirmation.",
    heroIntro:
      "Direct airport transfers for homes, hotels and businesses across Sutton Coldfield and its surrounding neighbourhoods.",
    localIntro: [
      "Sutton Coldfield has convenient access to the regional road network, but travelling with luggage or at unsociable hours can make changes between local services impractical. A pre-booked car gives you one planned collection and a direct journey to the terminal.",
      "Collections are available across the Royal Town, from central Sutton Coldfield to residential areas near Sutton Park and the surrounding communities. The appropriate vehicle can be selected for individual travellers, families, groups and business passengers.",
    ],
    birminghamAirport: [
      "Birmingham Airport is a common choice for Sutton Coldfield residents and local businesses. Transfers are planned from your exact pickup location rather than a town-centre meeting point, helping households and groups travel together with their luggage.",
      "Pickup timing is agreed with the departure schedule in mind. When you book a return collection, the inbound flight can be monitored so the driver has current arrival information.",
    ],
    otherAirports: {
      introduction:
        "We also support itineraries that depart from other regional and London airports, subject to advance booking.",
      airports: ["East Midlands Airport", "Manchester Airport", "Heathrow Airport", "Gatwick Airport"],
    },
    pickupAreas: [
      "Sutton Coldfield town centre",
      "Four Oaks",
      "Mere Green",
      "Boldmere",
      "Walmley",
      "Wylde Green",
      "Streetly",
      "Little Aston",
    ],
    nearbySlugs: ["walsall", "west-bromwich", "dudley"],
    faqs: [
      {
        question: "Do you collect from Four Oaks and Mere Green?",
        answer:
          "Yes. Four Oaks, Mere Green, Boldmere, Walmley and other nearby Sutton Coldfield neighbourhoods are within the intended coverage area.",
      },
      {
        question: "Can a business arrange a Sutton Coldfield airport transfer?",
        answer:
          "Yes. Companies can arrange travel for staff or guests, and regular travel requirements can be discussed through the business accounts page.",
      },
      {
        question: "Can I arrange a return pickup from Birmingham Airport?",
        answer:
          "Yes. You can request both outbound and return travel. Provide the correct flight details so the inbound flight can be monitored.",
      },
    ],
  },
  wolverhampton: {
    slug: "wolverhampton",
    name: "Wolverhampton",
    metaTitle: "Airport Transfers Wolverhampton",
    metaDescription:
      "Pre-booked Wolverhampton airport transfers to Birmingham Airport, Manchester, Heathrow and other UK airports with a choice of vehicles.",
    heroIntro:
      "Planned airport transfers from Wolverhampton city centre and surrounding communities to airports across the UK.",
    localIntro: [
      "For Wolverhampton travellers, an airport transfer removes the need to take luggage through rail changes or arrange separate transport to a station. Collection can be made from your home, hotel or workplace for a direct journey to the departure terminal.",
      "Coverage extends beyond the city centre into the northern, eastern and western neighbourhoods of Wolverhampton. Bookings can be planned for solo passengers, families, larger parties and corporate travel.",
    ],
    birminghamAirport: [
      "Birmingham Airport serves a wide range of routes used by Wolverhampton passengers. A pre-booked transfer provides a direct alternative to travelling into central Birmingham and changing onto an airport service.",
      "The collection time is agreed after considering your flight details and pickup location. Return bookings use the supplied flight number for monitoring, helping the driver work with current arrival information.",
    ],
    otherAirports: {
      introduction:
        "Manchester can be relevant for routes not available locally, while London and East Midlands airports can also be covered.",
      airports: ["Manchester Airport", "Heathrow Airport", "East Midlands Airport", "Gatwick Airport"],
    },
    pickupAreas: [
      "Wolverhampton city centre",
      "Tettenhall",
      "Penn",
      "Wednesfield",
      "Bilston",
      "Bushbury",
      "Compton",
      "Codsall",
    ],
    nearbySlugs: ["walsall", "dudley", "west-bromwich"],
    faqs: [
      {
        question: "Can you collect from Tettenhall, Penn or Wednesfield?",
        answer:
          "Yes. Airport collections can be arranged across Wolverhampton, including Tettenhall, Penn, Wednesfield, Bilston and surrounding areas.",
      },
      {
        question: "Do you only travel from Wolverhampton to Birmingham Airport?",
        answer:
          "No. Birmingham Airport is a frequent destination, but transfers to Manchester, Heathrow, East Midlands, Gatwick and other UK airports can also be requested.",
      },
      {
        question: "What flight information is needed for a return journey?",
        answer:
          "Provide the airline, flight number, arrival date and scheduled arrival time. Correct details allow the return collection to be planned and the flight to be monitored.",
      },
    ],
  },
  "west-bromwich": {
    slug: "west-bromwich",
    name: "West Bromwich",
    metaTitle: "Airport Transfers West Bromwich",
    metaDescription:
      "Direct airport transfers from West Bromwich and nearby Sandwell areas to Birmingham Airport and other major UK airports.",
    heroIntro:
      "Pre-booked airport travel from West Bromwich and nearby Sandwell communities, with direct pickup at your chosen address.",
    localIntro: [
      "West Bromwich is well connected to Birmingham, but an airport departure with cases, children or a group can still be easier with a direct collection. A pre-booked transfer avoids changing between local services and takes you to the terminal from your specified address.",
      "The service covers residential and commercial pickup points across West Bromwich and nearby parts of Sandwell. Vehicle choice can be matched to passenger numbers and luggage requirements when booking.",
    ],
    birminghamAirport: [
      "Birmingham Airport is the principal regional airport for many West Bromwich passengers. Transfers can be arranged for departures throughout the day, including collections when public transport options are less convenient.",
      "Your pickup is planned using the supplied departure details, allowing time for the airport check-in process. On a return booking, flight monitoring provides current information if your flight schedule changes.",
    ],
    otherAirports: {
      introduction:
        "For holidays, long-haul flights and specialist routes, direct transfers can be requested to airports farther afield.",
      airports: ["East Midlands Airport", "Manchester Airport", "Heathrow Airport", "Gatwick Airport"],
    },
    pickupAreas: [
      "West Bromwich town centre",
      "Great Barr",
      "Charlemont",
      "Stone Cross",
      "Hateley Heath",
      "Hill Top",
      "Oldbury",
      "Tipton",
    ],
    nearbySlugs: ["walsall", "dudley", "sutton-coldfield"],
    faqs: [
      {
        question: "Which parts of Sandwell do you collect from?",
        answer:
          "The West Bromwich service includes local areas such as Great Barr, Charlemont, Stone Cross and Hateley Heath, with nearby Oldbury and Tipton also covered.",
      },
      {
        question: "Can you carry a family and holiday luggage?",
        answer:
          "Yes. Vehicle options are available for different group sizes. Passenger numbers, cases and any larger items should be stated so a suitable vehicle can be confirmed.",
      },
      {
        question: "Will I know the airport transfer price before collection?",
        answer:
          "Yes. Once the journey information has been checked, a fixed price can be confirmed before travel rather than calculated on a meter during the journey.",
      },
    ],
  },
  dudley: {
    slug: "dudley",
    name: "Dudley",
    metaTitle: "Airport Transfers Dudley",
    metaDescription:
      "Pre-booked airport transfers from Dudley and surrounding Black Country areas to Birmingham Airport and major airports across the UK.",
    heroIntro:
      "Direct airport transfers serving Dudley town and surrounding Black Country communities for departures across the UK.",
    localIntro: [
      "Dudley borough covers a broad area, so the most convenient station or public transport route can vary considerably by neighbourhood. A booked airport car collects from the address you provide and keeps the group together for a direct journey to the terminal.",
      "Pickups can be arranged from Dudley town centre and communities across the borough, including Sedgley, Gornal and Brierley Hill. Journey planning takes account of your specific starting point, flight details and luggage needs.",
    ],
    birminghamAirport: [
      "Birmingham Airport is the closest major passenger airport for much of Dudley borough. Direct transfers are available without the need to first travel into Birmingham city centre or manage multiple connections with luggage.",
      "For departures, the agreed collection time is based on the booking details and airline guidance. For arrivals, supplying an accurate flight number enables monitoring before the airport pickup.",
    ],
    otherAirports: {
      introduction:
        "Transfers can also be booked to airports serving different destinations and long-haul connections.",
      airports: ["Manchester Airport", "Heathrow Airport", "East Midlands Airport", "Gatwick Airport"],
    },
    pickupAreas: [
      "Dudley town centre",
      "Sedgley",
      "Gornal",
      "Brierley Hill",
      "Kingswinford",
      "Netherton",
      "Coseley",
      "Stourbridge",
    ],
    nearbySlugs: ["wolverhampton", "west-bromwich", "walsall"],
    faqs: [
      {
        question: "Do you cover the wider Dudley borough?",
        answer:
          "Yes. Collections can be requested from Dudley town and surrounding communities including Sedgley, Gornal, Brierley Hill, Kingswinford and Netherton.",
      },
      {
        question: "Can I request a larger vehicle from Dudley?",
        answer:
          "Yes. The available vehicle range serves different passenger and luggage requirements. Give complete details when requesting the journey so the right option can be considered.",
      },
      {
        question: "Are delayed inbound flights monitored?",
        answer:
          "Flight monitoring is part of the planned return service. The correct flight number is important so current arrival information can be checked.",
      },
    ],
  },
  birmingham: {
    slug: "birmingham",
    name: "Birmingham",
    metaTitle: "Airport Transfers Birmingham",
    metaDescription:
      "Pre-booked airport transfers from Birmingham neighbourhoods, hotels and workplaces to Birmingham Airport and other major UK airports.",
    heroIntro:
      "Direct airport transfers from Birmingham homes, hotels and workplaces, planned around your flight and luggage requirements.",
    localIntro: [
      "Birmingham journeys can begin in the city centre, the Jewellery Quarter, Edgbaston or one of the many residential districts beyond the ring road. A door-to-terminal transfer avoids carrying cases between local services and gives groups one agreed collection point.",
      "City-centre hotel pickups, family departures from suburban addresses and travel from business premises can all be requested. Precise pickup details matter in busy central locations, so passengers should provide the building name, entrance and a working contact number.",
    ],
    birminghamAirport: [
      "Although Birmingham Airport shares the city name, it sits to the east beside the NEC and Birmingham International. A pre-booked car provides a direct journey from your Birmingham address without a rail change or onward transfer from the station.",
      "Collection planning varies by neighbourhood and flight time. The agreed pickup should allow for city traffic and the airline's check-in guidance, while a return booking can use flight monitoring to follow current arrival information.",
    ],
    otherAirports: {
      introduction:
        "Birmingham passengers can also request longer transfers when their airline, route or connection departs from another UK airport.",
      airports: ["East Midlands Airport", "Manchester Airport", "Heathrow Airport", "Gatwick Airport"],
    },
    pickupAreas: [
      "Birmingham city centre", "Edgbaston", "Harborne", "Jewellery Quarter", "Erdington", "Moseley", "Selly Oak", "Yardley",
    ],
    nearbySlugs: ["solihull", "sutton-coldfield", "west-bromwich"],
    faqs: [
      { question: "Can you collect from a Birmingham city-centre hotel?", answer: "Yes. Provide the hotel name, full address and preferred entrance so the collection point can be agreed clearly in advance." },
      { question: "Is Birmingham Airport in Birmingham city centre?", answer: "No. The airport is beside Birmingham International and the NEC, east of the city. Your transfer is planned from the specific Birmingham pickup address you provide." },
      { question: "Can several passengers be collected from one Birmingham address?", answer: "Yes. State the full passenger and luggage totals when requesting a quote so an appropriate vehicle can be selected." },
    ],
  },
  solihull: {
    slug: "solihull",
    name: "Solihull",
    metaTitle: "Airport Transfers Solihull",
    metaDescription:
      "Direct, pre-booked airport transfers from Solihull and surrounding villages to Birmingham Airport and major UK airports.",
    heroIntro:
      "Pre-booked airport transfers from Solihull town, residential neighbourhoods and surrounding villages.",
    localIntro: [
      "Solihull includes a mix of town-centre addresses, residential neighbourhoods and villages, so the most practical route to the airport depends on the exact collection point. A booked transfer provides one direct pickup rather than asking passengers to travel first to a rail station.",
      "Collections can be requested from central Solihull, Shirley, Knowle and communities closer to the rural borough boundary. Families and groups should include every passenger and large suitcase in their quote details so the vehicle choice can be checked.",
    ],
    birminghamAirport: [
      "Birmingham Airport is close to parts of Solihull borough, but terminal travel can still be inconvenient with luggage, children or an early departure. A pre-arranged car collects at the address supplied and takes the party directly to the airport.",
      "The pickup time is agreed around the flight schedule, the starting neighbourhood and airline guidance. For a booked return, an accurate flight number allows current arrival information to be monitored.",
    ],
    otherAirports: {
      introduction:
        "Direct travel can also be requested for routes departing from airports beyond the West Midlands.",
      airports: ["East Midlands Airport", "Heathrow Airport", "Manchester Airport", "Gatwick Airport"],
    },
    pickupAreas: ["Solihull town centre", "Shirley", "Knowle", "Dorridge", "Olton", "Elmdon", "Dickens Heath", "Hockley Heath"],
    nearbySlugs: ["birmingham", "sutton-coldfield", "dudley"],
    faqs: [
      { question: "Do you collect from villages around Solihull?", answer: "Yes. Collections can be requested from Knowle, Dorridge, Dickens Heath, Hockley Heath and other nearby communities." },
      { question: "Can I book a Solihull pickup for an early departure?", answer: "Yes. Advance booking allows the collection to be agreed around the flight and airline check-in guidance." },
      { question: "What details help you select a vehicle?", answer: "Provide the number of passengers, large suitcases and any unusual items. The chosen vehicle must be suitable for the complete travelling party." },
    ],
  },
  cannock: {
    slug: "cannock",
    name: "Cannock",
    metaTitle: "Airport Transfers Cannock",
    metaDescription:
      "Pre-booked airport transfers from Cannock, Hednesford and nearby communities to Birmingham Airport and other UK airports.",
    heroIntro:
      "Planned airport transfers from Cannock and nearby Staffordshire communities to Birmingham Airport and airports across the UK.",
    localIntro: [
      "Cannock passengers travelling by public transport may need a local connection before beginning the main airport journey. A door-to-terminal transfer instead starts at the home, hotel or workplace specified in the booking and keeps luggage with the travelling party.",
      "The service can cover Cannock town, Hednesford, Heath Hayes and neighbouring communities near Cannock Chase. Advance details allow the collection and vehicle to be planned for couples, families, groups or business passengers.",
    ],
    birminghamAirport: [
      "Birmingham Airport is a frequent regional departure point for Cannock residents. A direct transfer avoids arranging parking or managing cases across separate rail and local transport stages.",
      "Pickup planning should reflect the journey from Staffordshire, likely road conditions and the airline's requested arrival time. On the return leg, flight monitoring helps the driver follow changes to the inbound schedule.",
    ],
    otherAirports: {
      introduction:
        "Manchester and East Midlands may suit particular routes, while transfers to London airports can be requested for long-haul itineraries.",
      airports: ["Manchester Airport", "East Midlands Airport", "Heathrow Airport", "Gatwick Airport"],
    },
    pickupAreas: ["Cannock town centre", "Hednesford", "Heath Hayes", "Norton Canes", "Bridgtown", "Great Wyrley", "Cheslyn Hay", "Rugeley"],
    nearbySlugs: ["walsall", "wolverhampton", "sutton-coldfield"],
    faqs: [
      { question: "Can you collect from Hednesford or Heath Hayes?", answer: "Yes. Cannock coverage includes Hednesford, Heath Hayes, Norton Canes and surrounding communities, subject to the journey details supplied." },
      { question: "Can I arrange both departure and return travel?", answer: "Yes. Provide the outbound details and the correct inbound flight number when requesting the return collection." },
      { question: "Is the Cannock airport fare metered?", answer: "The journey details are checked and a fixed price is confirmed before travel rather than calculated on a meter during the booked journey." },
    ],
  },
};

export function isLocationSlug(value: string): value is LocationSlug {
  return locationSlugs.includes(value as LocationSlug);
}
