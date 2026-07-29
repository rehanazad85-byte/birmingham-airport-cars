export const locationSlugs = [
  "walsall",
  "sutton-coldfield",
  "wolverhampton",
  "west-bromwich",
  "dudley",
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
};

export function isLocationSlug(value: string): value is LocationSlug {
  return locationSlugs.includes(value as LocationSlug);
}
