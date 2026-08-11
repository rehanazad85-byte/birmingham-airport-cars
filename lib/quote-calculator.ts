import type { TestJourney } from "@/lib/journeys";
import type { VehicleType } from "@/lib/pricing";
import type { SelectedPlace } from "@/lib/places";

export type JourneyType = "one-way" | "return";

export interface PlaceSelection {
  label: string;
  placeId?: string;
  fullAddress?: string;
}

export interface AddressQuoteSelection {
  inputValue: string;
  place: SelectedPlace | null;
}

export interface ExtraStop extends PlaceSelection {
  order: number;
}

export interface DistanceMatrixResult {
  distanceMiles: number;
  durationMinutes: number;
  providerReference?: string;
}

export interface AirportSupplement {
  airportId: string;
  amount: number;
  description: string;
}

export interface AdminPricingContext {
  pricingVersion?: string;
  manualAdjustment?: number;
}

export interface QuoteRequest {
  pickup: PlaceSelection;
  destination: PlaceSelection;
  vehicle: VehicleType;
  passengers: number;
  luggage: number;
  journeyType: JourneyType;
  returnJourney?: { date?: string; time?: string };
  extraStops?: ExtraStop[];
  distance?: DistanceMatrixResult;
  airportSupplements?: AirportSupplement[];
  adminPricing?: AdminPricingContext;
}

export interface QuoteFieldErrors {
  pickup?: string;
  destination?: string;
  passengers?: string;
  luggage?: string;
  journey?: string;
  journeyDate?: string;
  journeyTime?: string;
  returnDate?: string;
  returnTime?: string;
}

export function validateReturnDateTime(
  journeyDate: string,
  journeyTime: string,
  returnDate: string,
  returnTime: string,
): Pick<QuoteFieldErrors, "returnDate" | "returnTime"> {
  const errors: Pick<QuoteFieldErrors, "returnDate" | "returnTime"> = {};
  if (!returnDate) errors.returnDate = "Please select a return date.";
  if (!returnTime) errors.returnTime = "Please select a return time.";
  if (!journeyDate || !journeyTime || !returnDate || !returnTime) return errors;

  const parseLocalDateTime = (date: string, time: string) => {
    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes] = time.split(":").map(Number);
    const value = new Date(year, month - 1, day, hours, minutes);
    return value.getFullYear() === year && value.getMonth() === month - 1 && value.getDate() === day && value.getHours() === hours && value.getMinutes() === minutes ? value : null;
  };
  const outbound = parseLocalDateTime(journeyDate, journeyTime);
  const returning = parseLocalDateTime(returnDate, returnTime);
  if (!outbound || !returning || returning.getTime() <= outbound.getTime()) {
    errors.returnTime = "Please select a return date and time after the outbound journey.";
  }
  return errors;
}

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function validateJourneyDateTime(
  journeyDate: string,
  journeyTime: string,
  now: Date = new Date(),
): Pick<QuoteFieldErrors, "journeyDate" | "journeyTime"> {
  const errors: Pick<QuoteFieldErrors, "journeyDate" | "journeyTime"> = {};

  if (!journeyDate) errors.journeyDate = "Please select a journey date.";
  if (!journeyTime) errors.journeyTime = "Please select a journey time.";
  if (!journeyDate || !journeyTime) return errors;

  const [year, month, day] = journeyDate.split("-").map(Number);
  const [hours, minutes] = journeyTime.split(":").map(Number);
  const selectedDateTime = new Date(year, month - 1, day, hours, minutes);

  const isValidSelection =
    selectedDateTime.getFullYear() === year &&
    selectedDateTime.getMonth() === month - 1 &&
    selectedDateTime.getDate() === day &&
    selectedDateTime.getHours() === hours &&
    selectedDateTime.getMinutes() === minutes;

  if (!isValidSelection || selectedDateTime.getTime() < now.getTime()) {
    errors.journeyTime = "Please select a journey date and time that has not passed.";
  }

  return errors;
}

export function uniqueJourneyValues(journeys: TestJourney[], field: "pickup" | "destination"): string[] {
  return [...new Set(journeys.map((journey) => journey[field]))];
}

export function findJourney(journeys: TestJourney[], pickup: string, destination: string): TestJourney | undefined {
  return journeys.find((journey) => journey.pickup === pickup && journey.destination === destination);
}

export function validateJourneySelection(
  journeys: TestJourney[],
  values: { pickup: string; destination: string; passengers: number; luggage: number },
): QuoteFieldErrors {
  const errors: QuoteFieldErrors = {};

  if (!values.pickup) errors.pickup = "Please select a pickup location.";
  if (!values.destination) errors.destination = "Please select a destination.";
  if (!Number.isInteger(values.passengers) || values.passengers < 1) errors.passengers = "Enter at least one passenger.";
  if (!Number.isInteger(values.luggage) || values.luggage < 0) errors.luggage = "Enter a valid luggage quantity.";
  if (values.pickup && values.destination && !findJourney(journeys, values.pickup, values.destination)) {
    errors.journey = "An online estimate is not available for this pickup and destination combination. Please contact us for a quotation.";
  }

  return errors;
}

export function validateAddressSelections(values: {
  pickup: AddressQuoteSelection;
  destination: AddressQuoteSelection;
  passengers: number;
  luggage: number;
}): QuoteFieldErrors {
  const errors: QuoteFieldErrors = {};
  if (!values.pickup.inputValue.trim()) errors.pickup = "Please enter a pickup address.";
  else if (!values.pickup.place) errors.pickup = "Select a valid pickup address from the suggestions.";
  if (!values.destination.inputValue.trim()) errors.destination = "Please enter a destination address.";
  else if (!values.destination.place) errors.destination = "Select a valid destination from the suggestions.";
  if (!Number.isInteger(values.passengers) || values.passengers < 1) errors.passengers = "Enter at least one passenger.";
  if (!Number.isInteger(values.luggage) || values.luggage < 0) errors.luggage = "Enter a valid luggage quantity.";
  return errors;
}
