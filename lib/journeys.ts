export interface TestJourney {
  id: string;
  pickup: string;
  destination: string;
  distanceMiles?: number;
  estimatedTime: string;
  airportCode?: "BHX" | "LHR" | "LGW" | "STN" | "MAN" | "EMA" | "LTN";
  fixedSaloonFare?: number;
}

export const testJourneys: TestJourney[] = [
  { id: "walsall-bhx", pickup: "Walsall", destination: "Birmingham Airport", airportCode: "BHX", distanceMiles: 22, fixedSaloonFare: 47, estimatedTime: "Approximately 35–45 minutes" },
  { id: "walsall-lhr", pickup: "Walsall", destination: "Heathrow Airport", airportCode: "LHR", distanceMiles: 120, fixedSaloonFare: 185, estimatedTime: "Approximately 2 hours 10 minutes" },
  { id: "walsall-lgw", pickup: "Walsall", destination: "Gatwick Airport", airportCode: "LGW", fixedSaloonFare: 225, estimatedTime: "Journey duration will be confirmed from the selected addresses" },
  { id: "walsall-stn", pickup: "Walsall", destination: "Stansted Airport", airportCode: "STN", fixedSaloonFare: 200, estimatedTime: "Journey duration will be confirmed from the selected addresses" },
  { id: "walsall-man", pickup: "Walsall", destination: "Manchester Airport", airportCode: "MAN", fixedSaloonFare: 120, estimatedTime: "Journey duration will be confirmed from the selected addresses" },
  { id: "walsall-ema", pickup: "Walsall", destination: "East Midlands Airport", airportCode: "EMA", fixedSaloonFare: 85, estimatedTime: "Journey duration will be confirmed from the selected addresses" },
  { id: "walsall-ltn", pickup: "Walsall", destination: "Luton Airport", airportCode: "LTN", fixedSaloonFare: 158, estimatedTime: "Journey duration will be confirmed from the selected addresses" },
  { id: "sutton-bhx", pickup: "Sutton Coldfield", destination: "Birmingham Airport", airportCode: "BHX", distanceMiles: 18, estimatedTime: "Approximately 25–35 minutes" },
  { id: "wolverhampton-bhx", pickup: "Wolverhampton", destination: "Birmingham Airport", airportCode: "BHX", distanceMiles: 27, estimatedTime: "Approximately 40–50 minutes" },
];
