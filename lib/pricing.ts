export type VehicleType = "saloon" | "estate" | "mpv" | "executive" | "large-mpv";

export interface PricingConfig {
  baseFare: number;
  includedMiles: number;
  saloonPricePerAdditionalMile: number;
  vehicleMultipliers: Record<VehicleType, number>;
}

export const pricingConfig: PricingConfig = {
  baseFare: 20,
  includedMiles: 3,
  saloonPricePerAdditionalMile: 1.4,
  vehicleMultipliers: {
    saloon: 1,
    estate: 1.25,
    mpv: 1.5,
    executive: 1.35,
    "large-mpv": 1.75,
  },
};

export function calculateSaloonFare(distanceMiles: number, config = pricingConfig): number {
  if (!Number.isFinite(distanceMiles) || distanceMiles < 0) {
    throw new RangeError("Distance must be a non-negative finite number.");
  }
  if (distanceMiles <= config.includedMiles) return config.baseFare;
  return config.baseFare + (distanceMiles - config.includedMiles) * config.saloonPricePerAdditionalMile;
}

export function calculateVehicleFare(distanceMiles: number, vehicle: VehicleType, config = pricingConfig): number {
  return calculateSaloonFare(distanceMiles, config) * config.vehicleMultipliers[vehicle];
}

export function roundFareToNearestPound(fare: number): number {
  return Math.round(fare);
}

export function getIllustrativeFare(distanceMiles: number, vehicle: VehicleType, config = pricingConfig): number {
  return roundFareToNearestPound(calculateVehicleFare(distanceMiles, vehicle, config));
}

export function getRouteAwareIllustrativeFare(
  existingJourneyDistanceMiles: number | undefined,
  routeDistanceMiles: number | undefined,
  vehicle: VehicleType,
  config = pricingConfig,
): number | null {
  const distanceMiles = existingJourneyDistanceMiles ?? routeDistanceMiles;
  return distanceMiles === undefined ? null : getIllustrativeFare(distanceMiles, vehicle, config);
}

export interface AirportChargeLine {
  airportCode: import("@/lib/airport-access").AirportCode;
  direction: import("@/lib/airport-access").AirportDirection;
  amount: number;
}

export interface FareCalculation {
  journeyFare: number;
  vehicleAdjustedFare: number;
  airportAccessCharge: number;
  airportCharges: AirportChargeLine[];
  finalFare: number;
}

export interface ReturnFareCalculation {
  outbound: FareCalculation;
  returnLeg: FareCalculation;
  returnDiscount: number;
  discountedReturnJourneyFare: number;
  finalFare: number;
}

const roundMoney = (amount: number) => Math.round((amount + Number.EPSILON) * 100) / 100;

export function calculateFinalFare(journeyFare: number | null, vehicleAdjustedFare: number | null, airportCharges: AirportChargeLine[]): FareCalculation | null {
  if (journeyFare === null || vehicleAdjustedFare === null) return null;
  const airportAccessCharge = roundMoney(airportCharges.reduce((total, charge) => total + charge.amount, 0));
  return { journeyFare, vehicleAdjustedFare, airportAccessCharge, airportCharges, finalFare: roundMoney(vehicleAdjustedFare + airportAccessCharge) };
}

export function calculateReturnFare(
  outbound: FareCalculation | null,
  returnJourneyFare: number | null,
  returnVehicleAdjustedFare: number | null,
  returnAirportCharges: AirportChargeLine[],
): ReturnFareCalculation | null {
  if (outbound === null || returnJourneyFare === null || returnVehicleAdjustedFare === null) return null;
  const returnDiscount = roundMoney(returnVehicleAdjustedFare * 0.1);
  const discountedReturnJourneyFare = roundMoney(returnVehicleAdjustedFare - returnDiscount);
  const returnLeg = calculateFinalFare(returnJourneyFare, discountedReturnJourneyFare, returnAirportCharges);
  if (returnLeg === null) return null;
  return {
    outbound,
    returnLeg,
    returnDiscount,
    discountedReturnJourneyFare,
    finalFare: roundMoney(outbound.finalFare + returnLeg.finalFare),
  };
}

export function getVehicleAdjustedFixedFare(fixedSaloonFare: number | undefined, vehicle: VehicleType, config = pricingConfig): number | null {
  return fixedSaloonFare === undefined ? null : roundFareToNearestPound(fixedSaloonFare * config.vehicleMultipliers[vehicle]);
}

export function formatGBP(amount: number): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2 }).format(amount);
}
