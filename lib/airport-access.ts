import type { SelectedPlace } from "@/lib/places";

export type AirportCode = "BHX" | "LHR" | "LGW" | "STN" | "MAN" | "EMA" | "LTN";
export type AirportDirection = "pickup" | "drop-off";
export type BirminghamAccessOption = "free" | "drop-and-go";

export interface AirportAccessConfig {
  code: AirportCode;
  name: string;
  pickupCharge: number;
  dropOffCharge: number;
  customerSelection: boolean;
  identityPatterns: RegExp[];
}

export const airportAccessConfig: Record<AirportCode, AirportAccessConfig> = {
  BHX: { code: "BHX", name: "Birmingham Airport", pickupCharge: 8, dropOffCharge: 8, customerSelection: true, identityPatterns: [/\bbirmingham airport\b/, /\bbhx\b/] },
  LHR: { code: "LHR", name: "Heathrow Airport", pickupCharge: 8, dropOffCharge: 7, customerSelection: false, identityPatterns: [/\b(?:london )?heathrow airport\b/, /\blhr\b/] },
  LGW: { code: "LGW", name: "Gatwick Airport", pickupCharge: 8, dropOffCharge: 10, customerSelection: false, identityPatterns: [/\b(?:london )?gatwick airport\b/, /\blgw\b/] },
  STN: { code: "STN", name: "Stansted Airport", pickupCharge: 10, dropOffCharge: 10, customerSelection: false, identityPatterns: [/\b(?:london )?stansted airport\b/, /\bstn\b/] },
  MAN: { code: "MAN", name: "Manchester Airport", pickupCharge: 6.6, dropOffCharge: 5.5, customerSelection: false, identityPatterns: [/\bmanchester airport\b/, /\bman\b/] },
  EMA: { code: "EMA", name: "East Midlands Airport", pickupCharge: 6, dropOffCharge: 5, customerSelection: false, identityPatterns: [/\beast midlands airport\b/, /\bema\b/] },
  LTN: { code: "LTN", name: "Luton Airport", pickupCharge: 7, dropOffCharge: 7, customerSelection: false, identityPatterns: [/\b(?:london )?luton airport\b/, /\bltn\b/] },
};

const normalise = (value?: string) => value?.trim().toLocaleLowerCase("en-GB").replace(/[^a-z0-9]+/g, " ").trim() ?? "";

export function recogniseSupportedAirport(place: SelectedPlace): AirportCode | null {
  const identity = `${normalise(place.name)} ${normalise(place.displayAddress)}`;
  if (!place.types.includes("airport") && !/\bairport\b/.test(identity)) return null;
  return (Object.values(airportAccessConfig).find((airport) => airport.identityPatterns.some((pattern) => pattern.test(identity)))?.code ?? null);
}

export function getAirportAccessCharge(code: AirportCode, direction: AirportDirection, birminghamOption: BirminghamAccessOption = "free"): number {
  if (code === "BHX" && birminghamOption === "free") return 0;
  const airport = airportAccessConfig[code];
  return direction === "pickup" ? airport.pickupCharge : airport.dropOffCharge;
}

export interface AirportAccessChargeLine {
  airportCode: AirportCode;
  direction: AirportDirection;
  amount: number;
}

export function getJourneyAirportCharges(
  pickupAirport: AirportCode | null,
  destinationAirport: AirportCode | null,
  birminghamOption: BirminghamAccessOption = "free",
): AirportAccessChargeLine[] {
  const charges: AirportAccessChargeLine[] = [];
  if (pickupAirport) charges.push({ airportCode: pickupAirport, direction: "pickup", amount: getAirportAccessCharge(pickupAirport, "pickup", birminghamOption) });
  if (destinationAirport) charges.push({ airportCode: destinationAirport, direction: "drop-off", amount: getAirportAccessCharge(destinationAirport, "drop-off", birminghamOption) });
  return charges;
}
