import type { VehicleType } from "@/lib/pricing";

export interface VehicleCapacity {
  label: string;
  maxPassengers: number;
  maxLargeSuitcases: number;
  requiresNoLuggageAtMaxPassengers?: boolean;
}

export const vehicleCapacities: Record<VehicleType, VehicleCapacity> = {
  saloon: {
    label: "Saloon",
    maxPassengers: 4,
    maxLargeSuitcases: 2,
    requiresNoLuggageAtMaxPassengers: true,
  },
  estate: {
    label: "Estate",
    maxPassengers: 4,
    maxLargeSuitcases: 4,
  },
  mpv: {
    label: "MPV",
    maxPassengers: 6,
    maxLargeSuitcases: 4,
  },
  executive: {
    label: "Executive",
    maxPassengers: 4,
    maxLargeSuitcases: 2,
    requiresNoLuggageAtMaxPassengers: true,
  },
  "large-mpv": {
    label: "Large MPV",
    maxPassengers: 8,
    maxLargeSuitcases: 8,
  },
};

export interface CapacityValidation {
  valid: boolean;
  message?: string;
}

export function validateVehicleCapacity(
  vehicle: VehicleType,
  passengers: number,
  largeSuitcases: number,
): CapacityValidation {
  const capacity = vehicleCapacities[vehicle];
  const validCounts =
    Number.isInteger(passengers) &&
    passengers >= 1 &&
    passengers <= capacity.maxPassengers &&
    Number.isInteger(largeSuitcases) &&
    largeSuitcases >= 0 &&
    largeSuitcases <= capacity.maxLargeSuitcases;
  const validCombination =
    !capacity.requiresNoLuggageAtMaxPassengers ||
    passengers !== capacity.maxPassengers ||
    largeSuitcases === 0;

  if (validCounts && validCombination) {
    return { valid: true };
  }

  return {
    valid: false,
    message: `A ${capacity.label} cannot carry this passenger and luggage combination. Please select a larger vehicle.`,
  };
}
