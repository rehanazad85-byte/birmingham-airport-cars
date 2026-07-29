export interface TestJourney {
  id: string;
  pickup: string;
  destination: string;
  distanceMiles: number;
  estimatedTime: string;
}

export const testJourneys: TestJourney[] = [
  { id: "walsall-bhx", pickup: "Walsall", destination: "Birmingham Airport", distanceMiles: 22, estimatedTime: "Approximately 35–45 minutes" },
  { id: "walsall-lhr", pickup: "Walsall", destination: "Heathrow Airport", distanceMiles: 120, estimatedTime: "Approximately 2 hours 10 minutes" },
  { id: "sutton-bhx", pickup: "Sutton Coldfield", destination: "Birmingham Airport", distanceMiles: 18, estimatedTime: "Approximately 25–35 minutes" },
  { id: "wolverhampton-bhx", pickup: "Wolverhampton", destination: "Birmingham Airport", distanceMiles: 27, estimatedTime: "Approximately 40–50 minutes" },
];
