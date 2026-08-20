export interface FlightDetails {
  airline: string;
  flightNumber: string;
  terminal: string;
  departureTime: string;
  arrivalTime: string;
  passengerName: string;
  notes: string;
}

export interface BookingDetails {
  fullName: string;
  mobile: string;
  email: string;
  pickupBuilding: string;
  destinationBuilding: string;
  notes: string;
  outboundFlight: FlightDetails;
  returnFlight: FlightDetails;
  termsAccepted: boolean;
}

export interface BookingFieldErrors {
  fullName?: string;
  mobile?: string;
  email?: string;
  outboundFlightNumber?: string;
  returnFlightNumber?: string;
  termsAccepted?: string;
}

export const bookingDraftStoragePrefix = "bac-booking-draft:";

interface DraftStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const emptyFlightDetails = (): FlightDetails => ({ airline: "", flightNumber: "", terminal: "", departureTime: "", arrivalTime: "", passengerName: "", notes: "" });

export function createEmptyBookingDetails(): BookingDetails {
  return { fullName: "", mobile: "", email: "", pickupBuilding: "", destinationBuilding: "", notes: "", outboundFlight: emptyFlightDetails(), returnFlight: emptyFlightDetails(), termsAccepted: false };
}

function isFlightDetails(value: unknown): value is FlightDetails {
  if (!value || typeof value !== "object") return false;
  const flight = value as Partial<FlightDetails>;
  return [flight.airline, flight.flightNumber, flight.terminal, flight.departureTime, flight.arrivalTime, flight.passengerName, flight.notes].every((field) => typeof field === "string");
}

export function isBookingDetails(value: unknown): value is BookingDetails {
  if (!value || typeof value !== "object") return false;
  const details = value as Partial<BookingDetails>;
  return [details.fullName, details.mobile, details.email, details.pickupBuilding, details.destinationBuilding, details.notes].every((field) => typeof field === "string") && isFlightDetails(details.outboundFlight) && isFlightDetails(details.returnFlight) && typeof details.termsAccepted === "boolean";
}

export function saveBookingDraft(quoteId: string, details: BookingDetails, storage: DraftStorage) {
  if (quoteId && isBookingDetails(details)) storage.setItem(`${bookingDraftStoragePrefix}${quoteId}`, JSON.stringify(details));
}

export function readBookingDraft(quoteId: string, storage: DraftStorage): BookingDetails | null {
  if (!quoteId) return null;
  const raw = storage.getItem(`${bookingDraftStoragePrefix}${quoteId}`);
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    return isBookingDetails(value) ? value : null;
  } catch {
    return null;
  }
}

export function validateBookingDetails(details: BookingDetails): BookingFieldErrors {
  const errors: BookingFieldErrors = {};
  if (details.fullName.trim().length < 2) errors.fullName = "Enter the customer’s full name.";
  const mobileDigits = details.mobile.replace(/[^0-9]/g, "");
  if (mobileDigits.length < 10 || mobileDigits.length > 15) errors.mobile = "Enter a valid mobile number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) errors.email = "Enter a valid email address.";
  if (details.outboundFlight.flightNumber && !/^[A-Za-z0-9 -]{2,12}$/.test(details.outboundFlight.flightNumber.trim())) errors.outboundFlightNumber = "Enter a valid flight number or leave it blank.";
  if (details.returnFlight.flightNumber && !/^[A-Za-z0-9 -]{2,12}$/.test(details.returnFlight.flightNumber.trim())) errors.returnFlightNumber = "Enter a valid return flight number or leave it blank.";
  if (!details.termsAccepted) errors.termsAccepted = "Confirm the journey details and accept the Terms & Conditions and Privacy Policy.";
  return errors;
}
