import type { SelectedPlace } from "@/lib/places";
import type { FareCalculation, ReturnFareCalculation, VehicleType } from "@/lib/pricing";
import type { JourneyType } from "@/lib/quote-calculator";
import type { RouteDistanceResult } from "@/lib/routes";
import type { BirminghamAccessOption } from "@/lib/airport-access";

export const bookingHandoffVersion = 1;
export const bookingHandoffLifetimeMs = 30 * 60 * 1000;
export const bookingHandoffStoragePrefix = "bac-booking-quote:";

export interface QuoteHandoffPayload {
  pickup: SelectedPlace;
  destination: SelectedPlace;
  journeyDate: string;
  journeyTime: string;
  returnDate?: string;
  returnTime?: string;
  vehicle: VehicleType;
  passengers: number;
  luggage: number;
  journeyType: JourneyType;
  outboundRoute: RouteDistanceResult;
  returnRoute?: RouteDistanceResult;
  oneWayFare?: FareCalculation;
  returnFare?: ReturnFareCalculation;
  involvesAirport: boolean;
  outwardBirminghamAccess?: BirminghamAccessOption;
  returnBirminghamAccess?: BirminghamAccessOption;
}

interface StoredQuoteHandoff {
  version: typeof bookingHandoffVersion;
  id: string;
  createdAt: number;
  quote: QuoteHandoffPayload;
}

export type QuoteHandoffReadResult =
  | { status: "valid"; quote: QuoteHandoffPayload }
  | { status: "missing" | "invalid" | "expired" };

interface BookingStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const vehicles: VehicleType[] = ["saloon", "estate", "mpv", "executive", "large-mpv"];
const moneyMatches = (left: number, right: number) => Math.abs(left - right) < 0.011;
const finiteNonNegative = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0;
const nonEmptyString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

function isSelectedPlace(value: unknown): value is SelectedPlace {
  if (!value || typeof value !== "object") return false;
  const place = value as Partial<SelectedPlace>;
  return nonEmptyString(place.displayAddress) && nonEmptyString(place.placeId) &&
    typeof place.latitude === "number" && Number.isFinite(place.latitude) &&
    typeof place.longitude === "number" && Number.isFinite(place.longitude) &&
    Array.isArray(place.types) && place.types.every((type) => typeof type === "string");
}

function isRoute(value: unknown): value is RouteDistanceResult {
  if (!value || typeof value !== "object") return false;
  const route = value as Partial<RouteDistanceResult>;
  return finiteNonNegative(route.distanceMeters) && finiteNonNegative(route.distanceMiles) && finiteNonNegative(route.durationSeconds) && route.distanceMeters > 0 && route.distanceMiles > 0 && route.durationSeconds > 0;
}

function isFareCalculation(value: unknown): value is FareCalculation {
  if (!value || typeof value !== "object") return false;
  const fare = value as Partial<FareCalculation>;
  if (!finiteNonNegative(fare.journeyFare) || !finiteNonNegative(fare.vehicleAdjustedFare) || !finiteNonNegative(fare.airportAccessCharge) || !finiteNonNegative(fare.finalFare) || !Array.isArray(fare.airportCharges)) return false;
  if (!fare.airportCharges.every((charge) => charge && typeof charge.airportCode === "string" && (charge.direction === "pickup" || charge.direction === "drop-off") && finiteNonNegative(charge.amount))) return false;
  const accessTotal = fare.airportCharges.reduce((sum, charge) => sum + charge.amount, 0);
  return moneyMatches(accessTotal, fare.airportAccessCharge) && moneyMatches(fare.vehicleAdjustedFare + fare.airportAccessCharge, fare.finalFare);
}

function isReturnFareCalculation(value: unknown): value is ReturnFareCalculation {
  if (!value || typeof value !== "object") return false;
  const fare = value as Partial<ReturnFareCalculation>;
  if (!isFareCalculation(fare.outbound) || !isFareCalculation(fare.returnLeg) || !finiteNonNegative(fare.returnDiscount) || !finiteNonNegative(fare.discountedReturnJourneyFare) || !finiteNonNegative(fare.finalFare)) return false;
  const originalReturnFare = fare.returnLeg.vehicleAdjustedFare + fare.returnDiscount;
  return moneyMatches(originalReturnFare * 0.1, fare.returnDiscount) &&
    moneyMatches(fare.discountedReturnJourneyFare, fare.returnLeg.vehicleAdjustedFare) &&
    moneyMatches(fare.outbound.finalFare + fare.returnLeg.finalFare, fare.finalFare);
}

export function isQuoteHandoffPayload(value: unknown): value is QuoteHandoffPayload {
  if (!value || typeof value !== "object") return false;
  const quote = value as Partial<QuoteHandoffPayload>;
  const commonValid = isSelectedPlace(quote.pickup) && isSelectedPlace(quote.destination) &&
    nonEmptyString(quote.journeyDate) && nonEmptyString(quote.journeyTime) &&
    vehicles.includes(quote.vehicle as VehicleType) && Number.isInteger(quote.passengers) && (quote.passengers ?? 0) > 0 &&
    Number.isInteger(quote.luggage) && (quote.luggage ?? -1) >= 0 && isRoute(quote.outboundRoute) &&
    typeof quote.involvesAirport === "boolean" &&
    (quote.outwardBirminghamAccess === undefined || quote.outwardBirminghamAccess === "free" || quote.outwardBirminghamAccess === "drop-and-go");
  if (!commonValid) return false;
  if (quote.journeyType === "one-way") return isFareCalculation(quote.oneWayFare) && quote.returnFare === undefined && quote.returnRoute === undefined && quote.returnDate === undefined && quote.returnTime === undefined && quote.returnBirminghamAccess === undefined;
  if (quote.journeyType === "return") return nonEmptyString(quote.returnDate) && nonEmptyString(quote.returnTime) && isRoute(quote.returnRoute) && isReturnFareCalculation(quote.returnFare) && quote.oneWayFare === undefined && (quote.returnBirminghamAccess === undefined || quote.returnBirminghamAccess === "free" || quote.returnBirminghamAccess === "drop-and-go");
  return false;
}

export function saveQuoteHandoff(
  quote: QuoteHandoffPayload,
  storage: BookingStorage,
  now = Date.now(),
  createId = () => crypto.randomUUID(),
): string | null {
  if (!isQuoteHandoffPayload(quote)) return null;
  const id = createId();
  if (!nonEmptyString(id)) return null;
  const stored: StoredQuoteHandoff = { version: bookingHandoffVersion, id, createdAt: now, quote };
  storage.setItem(`${bookingHandoffStoragePrefix}${id}`, JSON.stringify(stored));
  return id;
}

export function readQuoteHandoff(id: string | null, storage: BookingStorage, now = Date.now()): QuoteHandoffReadResult {
  if (!id) return { status: "missing" };
  const key = `${bookingHandoffStoragePrefix}${id}`;
  const raw = storage.getItem(key);
  if (!raw) return { status: "missing" };
  try {
    const stored = JSON.parse(raw) as Partial<StoredQuoteHandoff>;
    if (stored.version !== bookingHandoffVersion || stored.id !== id || !finiteNonNegative(stored.createdAt) || !isQuoteHandoffPayload(stored.quote)) return { status: "invalid" };
    if (now - stored.createdAt > bookingHandoffLifetimeMs || stored.createdAt > now + 60_000) {
      storage.removeItem(key);
      return { status: "expired" };
    }
    return { status: "valid", quote: stored.quote };
  } catch {
    return { status: "invalid" };
  }
}

export function getQuoteTotal(quote: QuoteHandoffPayload): number {
  return quote.journeyType === "return" ? quote.returnFare!.finalFare : quote.oneWayFare!.finalFare;
}
