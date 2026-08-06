import type { AirportId } from "@/lib/airports";

export type AirportKnowledgeAnswer = { question: string; answer: string };

export type AirportKnowledge = {
  airportId: AirportId;
  overview: string;
  terminalOverview: string;
  departurePlanning: string;
  dropOffGuidance: string;
  collectionGuidance: string;
  flightNumberGuidance: string;
  delayedFlightGuidance: string;
  luggageAndVehiclePlanning: string;
  checkInReminder: string;
  returnJourneyGuidance: string;
  answers: AirportKnowledgeAnswer[];
};

export const airportKnowledge: Record<AirportId, AirportKnowledge> = {
  birmingham: {
    airportId: "birmingham",
    overview: "Birmingham Airport journeys should be planned around the exact pickup address, requested departure or arrival details, and likely road conditions on the day.",
    terminalOverview: "Confirm the current airport and airline information before travel and include the relevant departure or arrival details with the booking request.",
    departurePlanning: "For an outbound journey, allow for road and motorway conditions as well as the time your airline asks you to be at the airport.",
    dropOffGuidance: "The airport drop-off arrangement is confirmed with the booking. Check the agreed journey details before setting off.",
    collectionGuidance: "For a Birmingham Airport collection, the meeting point is confirmed with the booking. Follow those instructions rather than assuming a particular collection location.",
    flightNumberGuidance: "Supply the correct flight number for an airport collection so the arrival can be identified and the agreed collection can be planned.",
    delayedFlightGuidance: "If known flight or journey details change, notify Birmingham Airport Cars. Any revised meeting or waiting arrangement must be confirmed for the booking.",
    luggageAndVehiclePlanning: "Include every passenger, large suitcase, pushchair and other substantial item. Confirm mobility equipment, access requirements or unusual items before the vehicle is selected.",
    checkInReminder: "Check your airline's current check-in and security guidance; the required airport arrival time varies by airline and journey.",
    returnJourneyGuidance: "Request the return journey separately where needed and provide its date, pickup details, flight information, passenger total and luggage requirements.",
    answers: [
      { question: "What information is needed for a Birmingham Airport collection?", answer: "Provide the arrival date, correct flight number, passenger and luggage totals, and any access or unusual-item requirements. The agreed meeting point is confirmed with the booking." },
      { question: "How should an outbound Birmingham Airport transfer be planned?", answer: "Use the exact pickup address, check the airline's current guidance and allow sensibly for road and motorway conditions. The requested pickup time is confirmed for the individual journey." },
      { question: "Why is the exact pickup address needed?", answer: "The exact address helps establish the practical collection point and journey requirements. A town name or representative postcode is not enough for a confirmed quotation." },
      { question: "Can a Birmingham Airport return journey be requested?", answer: "Yes. Request it separately and provide the return date, collection details, flight number where relevant, and the passenger and luggage requirements for that journey." },
      { question: "What passenger and luggage information is required?", answer: "Count every passenger, including children, and every large suitcase. Disclose pushchairs, mobility equipment, access requirements and unusual items before vehicle suitability is confirmed." },
      { question: "What should I do if flight details change?", answer: "Notify Birmingham Airport Cars when known details change and follow the collection instructions confirmed for the booking. A changed schedule does not by itself confirm a new meeting or waiting arrangement." },
    ],
  },
  heathrow: {
    airportId: "heathrow",
    overview: "Heathrow journeys require the correct passenger terminal and agreed access or collection instructions because arrangements differ across the airport.",
    terminalOverview: "Heathrow currently operates passenger Terminals 2, 3, 4 and 5. Check the terminal shown by the airline before travel.",
    departurePlanning: "For an outbound journey, confirm the terminal with the airline, check its current check-in guidance and allow for road conditions and terminal-specific airport access.",
    dropOffGuidance: "Follow the Heathrow drop-off arrangement confirmed with the booking and recheck the airline's terminal information before setting off.",
    collectionGuidance: "Passenger collection is not permitted from Heathrow terminal forecourts. The relevant collection location must be agreed and may use an authorised car park or another confirmed meeting point; terminal-door collection must not be assumed.",
    flightNumberGuidance: "Supply the correct flight number and terminal for a Heathrow collection so the arrival can be identified and the agreed meeting instructions can be planned.",
    delayedFlightGuidance: "Notify Birmingham Airport Cars if known flight or journey details change. Follow the confirmed meeting instructions and do not assume a particular waiting arrangement.",
    luggageAndVehiclePlanning: "Provide the full passenger and luggage requirements. Mobility equipment, access requirements and unusual items must be disclosed before vehicle suitability is confirmed.",
    checkInReminder: "Check your airline's current terminal, check-in and security guidance because these details can vary by flight.",
    returnJourneyGuidance: "Request outbound and return Heathrow journeys separately, with the correct terminal, flight and passenger details for each direction.",
    answers: [
      { question: "Which Heathrow terminal should I supply?", answer: "Supply the terminal currently shown by your airline. Heathrow operates passenger Terminals 2, 3, 4 and 5, and access and meeting arrangements differ by terminal." },
      { question: "Where is Heathrow passenger collection arranged?", answer: "The relevant location is agreed for the booking and may be an authorised car park or another confirmed meeting point. Follow the supplied instructions for the terminal." },
      { question: "Can a driver collect from a Heathrow terminal forecourt?", answer: "No. Passenger collection is not permitted from Heathrow terminal forecourts, so terminal-door collection must not be assumed." },
      { question: "Why is the Heathrow flight number required?", answer: "The correct flight number identifies the arrival that the collection relates to and supports planning around the agreed meeting instructions." },
      { question: "Can a return Heathrow journey be requested?", answer: "Yes. Request each direction separately and provide the correct date, address, terminal, flight, passenger and luggage details for each journey." },
      { question: "What should be disclosed about luggage or mobility equipment?", answer: "Give the full passenger and large-suitcase totals and disclose pushchairs, mobility equipment, access requirements or unusual items before the vehicle is confirmed." },
    ],
  },
};
