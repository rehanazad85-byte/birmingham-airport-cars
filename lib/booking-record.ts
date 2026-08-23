import type { AirportAccessChargeLine, AirportCode, BirminghamAccessOption } from "@/lib/airport-access";
import type { FlightDetails } from "@/lib/booking-validation";
import type { SelectedPlace } from "@/lib/places";
import type { VehicleType } from "@/lib/pricing";
import type { JourneyType } from "@/lib/quote-calculator";
import type { RouteDistanceResult } from "@/lib/routes";

export const bookingStatuses = ["pending_payment", "deposit_paid", "paid", "confirmed", "cancelled", "payment_failed"] as const;
export type BookingStatus = (typeof bookingStatuses)[number];
export const savedBookingStoragePrefix = "bac-booking-saved:";

export interface BookingRecord {
  booking_reference: string;
  idempotency_key: string;
  request_fingerprint: string;
  status: BookingStatus;
  customer_full_name: string;
  customer_mobile: string;
  customer_email: string;
  booking_notes: string;
  terms_accepted_at: string;
  pickup_place: SelectedPlace;
  pickup_building: string;
  destination_place: SelectedPlace;
  destination_building: string;
  outward_date: string;
  outward_time: string;
  return_date: string | null;
  return_time: string | null;
  journey_type: JourneyType;
  vehicle: VehicleType;
  passengers: number;
  luggage: number;
  pickup_airport: AirportCode | null;
  destination_airport: AirportCode | null;
  outward_route: RouteDistanceResult;
  return_route: RouteDistanceResult | null;
  outward_birmingham_access: BirminghamAccessOption;
  return_birmingham_access: BirminghamAccessOption | null;
  outward_airport_charges: AirportAccessChargeLine[];
  return_airport_charges: AirportAccessChargeLine[];
  outward_journey_fare_pence: number;
  return_journey_fare_pence: number;
  outward_airport_access_pence: number;
  return_airport_access_pence: number;
  return_saving_pence: number;
  total_pence: number;
  deposit_percentage: number;
  deposit_pence: number;
  balance_pence: number;
  outward_flight: FlightDetails | null;
  return_flight: FlightDetails | null;
}

export interface SavedBookingSummary {
  bookingReference: string;
  status: "pending_payment";
  totalPence: number;
  depositPercentage: number;
  depositPence: number;
  balancePence: number;
}

export function isSavedBookingSummary(value: unknown): value is SavedBookingSummary {
  if (!value || typeof value !== "object") return false;
  const summary = value as Partial<SavedBookingSummary>;
  return typeof summary.bookingReference === "string" && /^BAC-[A-F0-9]{8}$/.test(summary.bookingReference) &&
    summary.status === "pending_payment" &&
    [summary.totalPence, summary.depositPercentage, summary.depositPence, summary.balancePence].every((amount) => typeof amount === "number" && Number.isInteger(amount) && amount >= 0) &&
    summary.depositPence! + summary.balancePence! === summary.totalPence;
}
