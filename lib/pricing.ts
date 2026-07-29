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

export function formatGBP(amount: number): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(amount);
}
