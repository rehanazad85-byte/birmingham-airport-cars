import type { AirportRouteSlug } from "@/lib/airport-routes";
import type { VehicleType } from "@/lib/pricing";
import { validateVehicleCapacity } from "@/lib/vehicle-capacity";

export type PricingApprovalStatus = "draft" | "approved";

export type RoutePricingExample = {
  routeSlug: AirportRouteSlug;
  originTown: string;
  destinationAirport: string;
  representativePickupName: string;
  representativePickupPostcode: string;
  destinationTerminal: string;
  vehicleType: VehicleType;
  approvedExampleFare: number | null;
  approvedTypicalFareMinimum: number | null;
  approvedTypicalFareMaximum: number | null;
  passengerCount: number | null;
  conditions: string;
  approvalStatus: PricingApprovalStatus;
  lastReviewedDate: string;
};

export type ApprovedRoutePricing = RoutePricingExample & {
  approvalStatus: "approved";
};

const draft = (
  routeSlug: AirportRouteSlug,
  originTown: string,
  pickup: string,
  postcode: string,
  destinationAirport: string,
  destinationTerminal: string,
): RoutePricingExample => ({
  routeSlug,
  originTown,
  destinationAirport,
  representativePickupName: pickup,
  representativePickupPostcode: postcode,
  destinationTerminal,
  vehicleType: "saloon",
  approvedExampleFare: null,
  approvedTypicalFareMinimum: null,
  approvedTypicalFareMaximum: null,
  passengerCount: null,
  conditions: "Owner approval is required before any representative fare or typical range is published.",
  approvalStatus: "draft",
  lastReviewedDate: "2026-08-04",
});

const approvedFixed = (
  routeSlug: AirportRouteSlug,
  originTown: string,
  pickup: string,
  postcode: string,
  destinationAirport: string,
  destinationTerminal: string,
  fare: number,
): RoutePricingExample => ({
  ...draft(routeSlug, originTown, pickup, postcode, destinationAirport, destinationTerminal),
  approvedExampleFare: fare,
  conditions: "Approved underlying Saloon journey fare. Applicable airport access charges are calculated separately.",
  approvalStatus: "approved",
  lastReviewedDate: "2026-08-11",
});

export const routePricingExamples: Record<AirportRouteSlug, RoutePricingExample> = {
  "walsall-to-birmingham-airport": approvedFixed("walsall-to-birmingham-airport", "Walsall", "Walsall town centre", "WS1 1TP", "Birmingham Airport", "Birmingham Airport", 47),
  "sutton-coldfield-to-birmingham-airport": draft("sutton-coldfield-to-birmingham-airport", "Sutton Coldfield", "Sutton Coldfield town centre", "B72 1PA", "Birmingham Airport", "Birmingham Airport"),
  "wolverhampton-to-birmingham-airport": draft("wolverhampton-to-birmingham-airport", "Wolverhampton", "Wolverhampton city centre", "WV1 1SH", "Birmingham Airport", "Birmingham Airport"),
  "west-bromwich-to-birmingham-airport": draft("west-bromwich-to-birmingham-airport", "West Bromwich", "West Bromwich town centre", "B70 8DJ", "Birmingham Airport", "Birmingham Airport"),
  "dudley-to-birmingham-airport": draft("dudley-to-birmingham-airport", "Dudley", "Dudley town centre", "DY1 1NS", "Birmingham Airport", "Birmingham Airport"),
  "birmingham-to-birmingham-airport": draft("birmingham-to-birmingham-airport", "Birmingham", "Birmingham city centre", "B1 1BB", "Birmingham Airport", "Birmingham Airport"),
  "solihull-to-birmingham-airport": draft("solihull-to-birmingham-airport", "Solihull", "Solihull town centre", "B91 3RG", "Birmingham Airport", "Birmingham Airport"),
  "cannock-to-birmingham-airport": draft("cannock-to-birmingham-airport", "Cannock", "Cannock town centre", "WS11 1WS", "Birmingham Airport", "Birmingham Airport"),
  "walsall-to-heathrow-airport": approvedFixed("walsall-to-heathrow-airport", "Walsall", "Walsall town centre", "WS1 1TP", "Heathrow Airport", "Heathrow terminal confirmed with booking", 185),
  "sutton-coldfield-to-heathrow-airport": draft("sutton-coldfield-to-heathrow-airport", "Sutton Coldfield", "Sutton Coldfield town centre", "B72 1PA", "Heathrow Airport", "Heathrow terminal confirmed with booking"),
  "wolverhampton-to-heathrow-airport": draft("wolverhampton-to-heathrow-airport", "Wolverhampton", "Wolverhampton city centre", "WV1 1SH", "Heathrow Airport", "Heathrow terminal confirmed with booking"),
  "west-bromwich-to-heathrow-airport": draft("west-bromwich-to-heathrow-airport", "West Bromwich", "West Bromwich town centre", "B70 8DJ", "Heathrow Airport", "Heathrow terminal confirmed with booking"),
  "dudley-to-heathrow-airport": draft("dudley-to-heathrow-airport", "Dudley", "Dudley town centre", "DY1 1NS", "Heathrow Airport", "Heathrow terminal confirmed with booking"),
  "birmingham-to-heathrow-airport": draft("birmingham-to-heathrow-airport", "Birmingham", "Birmingham city centre", "B1 1BB", "Heathrow Airport", "Heathrow terminal confirmed with booking"),
  "solihull-to-heathrow-airport": draft("solihull-to-heathrow-airport", "Solihull", "Solihull town centre", "B91 3RG", "Heathrow Airport", "Heathrow terminal confirmed with booking"),
  "cannock-to-heathrow-airport": draft("cannock-to-heathrow-airport", "Cannock", "Cannock town centre", "WS11 1WS", "Heathrow Airport", "Heathrow terminal confirmed with booking"),
};

const positiveMoney = (value: number | null): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

export function getApprovedRoutePricing(example: RoutePricingExample): ApprovedRoutePricing | null {
  if (example.approvalStatus !== "approved") return null;

  const hasExample = positiveMoney(example.approvedExampleFare);
  const hasRange =
    positiveMoney(example.approvedTypicalFareMinimum) &&
    positiveMoney(example.approvedTypicalFareMaximum) &&
    example.approvedTypicalFareMinimum <= example.approvedTypicalFareMaximum;

  return hasExample || hasRange
    ? {
        ...example,
        approvedExampleFare: hasExample ? example.approvedExampleFare : null,
        approvedTypicalFareMinimum: hasRange ? example.approvedTypicalFareMinimum : null,
        approvedTypicalFareMaximum: hasRange ? example.approvedTypicalFareMaximum : null,
        approvalStatus: "approved",
      }
    : null;
}

export function getPublicRoutePricing(slug: AirportRouteSlug): ApprovedRoutePricing | null {
  return getApprovedRoutePricing(routePricingExamples[slug]);
}

export function calculateCostPerPassenger(example: ApprovedRoutePricing): number | null {
  const { approvedExampleFare, passengerCount, vehicleType } = example;
  if (!positiveMoney(approvedExampleFare) || !Number.isInteger(passengerCount) || !passengerCount || passengerCount < 1) {
    return null;
  }
  if (!validateVehicleCapacity(vehicleType, passengerCount, 0).valid) return null;
  return approvedExampleFare / passengerCount;
}

export function formatApprovedMoney(value: number): string {
  return value.toLocaleString("en-GB", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}
