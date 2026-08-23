import { createHash, randomBytes } from "node:crypto";
import { getJourneyAirportCharges, type BirminghamAccessOption } from "@/lib/airport-access";
import type { QuoteHandoffPayload } from "@/lib/booking-handoff";
import type { BookingRecord, SavedBookingSummary } from "@/lib/booking-record";
import { isBookingDetails, validateBookingDetails, type BookingDetails, type FlightDetails } from "@/lib/booking-validation";
import { testJourneys } from "@/lib/journeys";
import { getJourneyAirports, mapPlacesToJourney, type SelectedPlace } from "@/lib/places";
import { calculateFinalFare, calculateReturnFare, getIllustrativeFare, getRouteAwareIllustrativeFare, getVehicleAdjustedFixedFare, type VehicleType } from "@/lib/pricing";
import { validateJourneyDateTime, validateReturnDateTime } from "@/lib/quote-calculator";
import { computeDrivingRoute, isCoordinates, type Coordinates, type RouteDistanceResult } from "@/lib/routes";
import { calculateBookingDeposit, getBookingDepositPolicy, type BookingDepositPolicy } from "@/lib/server/booking-deposit";
import { verifySelectedBookingPlace } from "@/lib/server/booking-places";
import { createSupabaseBookingRepository, type BookingRepository } from "@/lib/server/booking-repository";
import { validateVehicleCapacity, vehicleCapacities } from "@/lib/vehicle-capacity";

export class BookingValidationError extends Error {
  constructor() {
    super("The booking or journey details could not be validated. Please recalculate your quotation.");
    this.name = "BookingValidationError";
  }
}

export class BookingRevalidationError extends Error {
  constructor() {
    super("The quotation could not be independently revalidated. Please recalculate your journey.");
    this.name = "BookingRevalidationError";
  }
}

export interface BookingSubmission {
  idempotencyKey: string;
  quote: QuoteHandoffPayload;
  details: BookingDetails;
}

export interface BookingServiceOptions {
  repository?: BookingRepository;
  verifyPlace?: (place: SelectedPlace) => Promise<SelectedPlace>;
  calculateRoute?: (origin: Coordinates, destination: Coordinates) => Promise<RouteDistanceResult>;
  depositPolicy?: BookingDepositPolicy;
  now?: Date;
  createReference?: () => string;
}

function isSelectedPlace(value: unknown): value is SelectedPlace {
  if (!value || typeof value !== "object") return false;
  const place = value as Partial<SelectedPlace>;
  const validTypes = Array.isArray(place.types) && place.types.every((type) => typeof type === "string");
  const coordinatesValid = isCoordinates(place);
  return typeof place.placeId === "string" && place.placeId.length > 0 && place.placeId.length <= 256 &&
    typeof place.displayAddress === "string" && place.displayAddress.trim().length > 0 && place.displayAddress.length <= 1000 &&
    coordinatesValid && validTypes;
}

function isBirminghamAccess(value: unknown): value is BirminghamAccessOption {
  return value === "free" || value === "drop-and-go";
}

function validateSubmission(value: unknown, now: Date): BookingSubmission {
  if (!value || typeof value !== "object") throw new BookingValidationError();
  const submission = value as Partial<BookingSubmission>;
  if (typeof submission.idempotencyKey !== "string" || !/^[A-Za-z0-9_-]{8,128}$/.test(submission.idempotencyKey) || !isBookingDetails(submission.details) || Object.keys(validateBookingDetails(submission.details)).length > 0) throw new BookingValidationError();
  if (!submission.quote || typeof submission.quote !== "object") throw new BookingValidationError();

  const quote = submission.quote as Partial<QuoteHandoffPayload>;
  if (!isSelectedPlace(quote.pickup) || !isSelectedPlace(quote.destination) || quote.pickup.placeId === quote.destination.placeId ||
      typeof quote.journeyDate !== "string" || typeof quote.journeyTime !== "string" ||
      typeof quote.vehicle !== "string" || !(quote.vehicle in vehicleCapacities) ||
      typeof quote.passengers !== "number" || typeof quote.luggage !== "number" ||
      !validateVehicleCapacity(quote.vehicle as VehicleType, quote.passengers, quote.luggage).valid ||
      Object.keys(validateJourneyDateTime(quote.journeyDate, quote.journeyTime, now)).length > 0 ||
      (quote.outwardBirminghamAccess !== undefined && !isBirminghamAccess(quote.outwardBirminghamAccess))) throw new BookingValidationError();

  if (quote.journeyType === "return") {
    if (typeof quote.returnDate !== "string" || typeof quote.returnTime !== "string" ||
        Object.keys(validateReturnDateTime(quote.journeyDate, quote.journeyTime, quote.returnDate, quote.returnTime)).length > 0 ||
        (quote.returnBirminghamAccess !== undefined && !isBirminghamAccess(quote.returnBirminghamAccess))) throw new BookingValidationError();
  } else if (quote.journeyType !== "one-way" || quote.returnDate !== undefined || quote.returnTime !== undefined || quote.returnBirminghamAccess !== undefined) {
    throw new BookingValidationError();
  }

  const allDetails = [submission.details.fullName, submission.details.mobile, submission.details.email, submission.details.pickupBuilding, submission.details.destinationBuilding, submission.details.notes, ...Object.values(submission.details.outboundFlight), ...Object.values(submission.details.returnFlight)];
  if (allDetails.some((field) => field.length > 2000)) throw new BookingValidationError();
  return submission as BookingSubmission;
}

function asPence(pounds: number) {
  const pence = Math.round((pounds + Number.EPSILON) * 100);
  if (!Number.isSafeInteger(pence) || pence < 0) {
    console.error("BOOKING_FARE_REVALIDATION_FAILED", { reason: "invalid_amount" });
    throw new BookingRevalidationError();
  }
  return pence;
}

function optionalFlight(details: FlightDetails): FlightDetails | null {
  return Object.values(details).some((value) => value.trim()) ? details : null;
}

function isValidRoute(route: RouteDistanceResult) {
  return [route.distanceMeters, route.distanceMiles, route.durationSeconds].every((value) => typeof value === "number" && Number.isFinite(value) && value > 0);
}

function createBookingReference() {
  return `BAC-${randomBytes(4).toString("hex").toUpperCase()}`;
}

function summaryFromRecord(record: BookingRecord): SavedBookingSummary {
  if (record.status !== "pending_payment") {
    console.error("BOOKING_RESPONSE_VALIDATION_FAILED", { reason: "invalid_booking_status" });
    throw new BookingRevalidationError();
  }
  return {
    bookingReference: record.booking_reference,
    status: "pending_payment",
    totalPence: record.total_pence,
    depositPercentage: record.deposit_percentage,
    depositPence: record.deposit_pence,
    balancePence: record.balance_pence,
  };
}

export async function createPendingBooking(value: unknown, options: BookingServiceOptions = {}): Promise<{ booking: SavedBookingSummary; created: boolean; record: BookingRecord }> {
  const now = options.now ?? new Date();
  const submission = validateSubmission(value, now);
  const repository = options.repository ?? createSupabaseBookingRepository();
  const verifyPlace = options.verifyPlace ?? verifySelectedBookingPlace;
  const calculateRoute = options.calculateRoute ?? computeDrivingRoute;

  let pickup: SelectedPlace;
  let destination: SelectedPlace;
  let outwardRoute: RouteDistanceResult;
  let returnRoute: RouteDistanceResult | null;
  try {
    [pickup, destination] = await Promise.all([verifyPlace(submission.quote.pickup), verifyPlace(submission.quote.destination)]);
  } catch {
    throw new BookingRevalidationError();
  }
  if (!isSelectedPlace(pickup) || !isSelectedPlace(destination) || pickup.placeId !== submission.quote.pickup.placeId || destination.placeId !== submission.quote.destination.placeId) {
    console.error("BOOKING_PLACE_VERIFICATION_FAILED", { reason: "place_mismatch" });
    throw new BookingRevalidationError();
  }
  try {
    [outwardRoute, returnRoute] = await Promise.all([
      calculateRoute({ latitude: pickup.latitude, longitude: pickup.longitude }, { latitude: destination.latitude, longitude: destination.longitude }),
      submission.quote.journeyType === "return" ? calculateRoute({ latitude: destination.latitude, longitude: destination.longitude }, { latitude: pickup.latitude, longitude: pickup.longitude }) : Promise.resolve(null),
    ]);
  } catch {
    throw new BookingRevalidationError();
  }
  if (!isValidRoute(outwardRoute) || (returnRoute && !isValidRoute(returnRoute))) {
    console.error("BOOKING_ROUTE_REVALIDATION_FAILED", { reason: "invalid_route" });
    throw new BookingRevalidationError();
  }

  const quote = submission.quote;
  const airports = getJourneyAirports(pickup, destination);
  const fixedJourney = mapPlacesToJourney(testJourneys, pickup, destination);
  const outwardAccess = quote.outwardBirminghamAccess ?? "free";
  const returnAccess = quote.journeyType === "return" ? quote.returnBirminghamAccess ?? "free" : null;
  const outwardVehicleFare = fixedJourney?.fixedSaloonFare !== undefined ? getVehicleAdjustedFixedFare(fixedJourney.fixedSaloonFare, quote.vehicle) : getRouteAwareIllustrativeFare(undefined, outwardRoute.distanceMiles, quote.vehicle);
  const outwardBaseFare = fixedJourney?.fixedSaloonFare ?? getIllustrativeFare(outwardRoute.distanceMiles, "saloon");
  const outwardCharges = getJourneyAirportCharges(airports.pickupAirport, airports.destinationAirport, outwardAccess);
  const outwardFare = calculateFinalFare(outwardBaseFare, outwardVehicleFare, outwardCharges);
  if (!outwardFare) {
    console.error("BOOKING_FARE_REVALIDATION_FAILED", { reason: "outward_fare_unavailable" });
    throw new BookingRevalidationError();
  }

  const returnCharges = returnAccess ? getJourneyAirportCharges(airports.destinationAirport, airports.pickupAirport, returnAccess) : [];
  const returnVehicleFare = returnRoute ? fixedJourney?.fixedSaloonFare !== undefined ? getVehicleAdjustedFixedFare(fixedJourney.fixedSaloonFare, quote.vehicle) : getRouteAwareIllustrativeFare(undefined, returnRoute.distanceMiles, quote.vehicle) : null;
  const returnBaseFare = returnRoute ? fixedJourney?.fixedSaloonFare ?? getIllustrativeFare(returnRoute.distanceMiles, "saloon") : null;
  const returnFare = returnRoute ? calculateReturnFare(outwardFare, returnBaseFare, returnVehicleFare, returnCharges) : null;
  if (quote.journeyType === "return" && !returnFare) {
    console.error("BOOKING_FARE_REVALIDATION_FAILED", { reason: "return_fare_unavailable" });
    throw new BookingRevalidationError();
  }

  const totalPence = asPence(returnFare?.finalFare ?? outwardFare.finalFare);
  const deposit = calculateBookingDeposit(totalPence, options.depositPolicy ?? getBookingDepositPolicy());
  const fingerprint = createHash("sha256").update(JSON.stringify({
    pickup, destination, journeyDate: quote.journeyDate, journeyTime: quote.journeyTime,
    returnDate: quote.returnDate, returnTime: quote.returnTime, vehicle: quote.vehicle,
    passengers: quote.passengers, luggage: quote.luggage, journeyType: quote.journeyType,
    outwardAccess, returnAccess, details: submission.details,
  })).digest("hex");
  const reference = (options.createReference ?? createBookingReference)();
  if (!/^BAC-[A-F0-9]{8}$/.test(reference)) {
    console.error("BOOKING_REFERENCE_VALIDATION_FAILED", { reason: "invalid_reference" });
    throw new BookingRevalidationError();
  }

  const record: BookingRecord = {
    booking_reference: reference,
    idempotency_key: submission.idempotencyKey,
    request_fingerprint: fingerprint,
    status: "pending_payment",
    customer_full_name: submission.details.fullName.trim(),
    customer_mobile: submission.details.mobile.trim(),
    customer_email: submission.details.email.trim(),
    booking_notes: submission.details.notes.trim(),
    terms_accepted_at: now.toISOString(),
    pickup_place: pickup,
    pickup_building: submission.details.pickupBuilding.trim(),
    destination_place: destination,
    destination_building: submission.details.destinationBuilding.trim(),
    outward_date: quote.journeyDate,
    outward_time: quote.journeyTime,
    return_date: quote.returnDate ?? null,
    return_time: quote.returnTime ?? null,
    journey_type: quote.journeyType,
    vehicle: quote.vehicle,
    passengers: quote.passengers,
    luggage: quote.luggage,
    pickup_airport: airports.pickupAirport,
    destination_airport: airports.destinationAirport,
    outward_route: outwardRoute,
    return_route: returnRoute,
    outward_birmingham_access: outwardAccess,
    return_birmingham_access: returnAccess,
    outward_airport_charges: outwardCharges,
    return_airport_charges: returnCharges,
    outward_journey_fare_pence: asPence(outwardFare.vehicleAdjustedFare),
    return_journey_fare_pence: returnFare ? asPence(returnFare.returnLeg.vehicleAdjustedFare + returnFare.returnDiscount) : 0,
    outward_airport_access_pence: asPence(outwardFare.airportAccessCharge),
    return_airport_access_pence: returnFare ? asPence(returnFare.returnLeg.airportAccessCharge) : 0,
    return_saving_pence: returnFare ? asPence(returnFare.returnDiscount) : 0,
    total_pence: totalPence,
    deposit_percentage: deposit.depositPercentage,
    deposit_pence: deposit.depositPence,
    balance_pence: deposit.balancePence,
    outward_flight: airports.pickupAirport || airports.destinationAirport ? optionalFlight(submission.details.outboundFlight) : null,
    return_flight: quote.journeyType === "return" && (airports.pickupAirport || airports.destinationAirport) ? optionalFlight(submission.details.returnFlight) : null,
  };
  const result = await repository.insertOrGet(record);
  return { booking: summaryFromRecord(result.record), created: result.created, record: result.record };
}
