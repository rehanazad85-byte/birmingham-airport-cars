export const airports = {
  birmingham: {
    id: "birmingham",
    name: "Birmingham Airport",
    shortName: "Birmingham Airport",
    terminalSummary:
      "The drop-off arrangement for Birmingham Airport is confirmed as part of the booking.",
    collectionGuidance:
      "For an airport collection, the agreed meeting point is confirmed with the booking and the supplied flight details are used for planning.",
  },
  heathrow: {
    id: "heathrow",
    name: "Heathrow Airport",
    shortName: "Heathrow",
    terminalSummary:
      "Heathrow operates four passenger terminals: Terminals 2, 3, 4 and 5. Confirm the terminal shown by your airline before travel because the airport approaches and meeting arrangements differ by terminal.",
    collectionGuidance:
      "Passenger collection is not permitted from Heathrow terminal forecourts. The collection location must be agreed for the relevant terminal and may use an authorised car park or another confirmed meeting point. Follow the instructions supplied with the booking rather than assuming a terminal-door collection.",
  },
} as const;

export type AirportId = keyof typeof airports;
export type Airport = (typeof airports)[AirportId];
