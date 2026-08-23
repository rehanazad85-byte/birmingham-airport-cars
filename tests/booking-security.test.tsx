import fs from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import sitemap from "../app/sitemap";
import { BookingSavedCard } from "../components/BookingForm";
import { calculateFinalFare, calculateReturnFare } from "../lib/pricing";
import { createEmptyBookingDetails } from "../lib/booking-validation";
import type { QuoteHandoffPayload } from "../lib/booking-handoff";
import type { BookingRecord } from "../lib/booking-record";
import type { SelectedPlace } from "../lib/places";
import { calculateBookingDeposit, defaultBookingDepositPolicy, getBookingDepositPolicy } from "../lib/server/booking-deposit";
import { BookingPlaceError, verifySelectedBookingPlace } from "../lib/server/booking-places";
import { BookingPersistenceError, createSupabaseBookingRepository, type BookingRepository } from "../lib/server/booking-repository";
import { BookingRevalidationError, BookingValidationError, createPendingBooking, type BookingSubmission } from "../lib/server/booking-service";
import { computeDrivingRoute } from "../lib/routes";
import { POST } from "../app/api/bookings/route";

const now = new Date("2026-08-22T10:00:00.000Z");
const pickup: SelectedPlace = { displayAddress: "10 High Street, Walsall WS1 1AA, UK", placeId: "walsall-place", latitude: 52.58, longitude: -1.98, locality: "Walsall", street: "High Street", streetNumber: "10", types: ["street_address"] };
const bhx: SelectedPlace = { displayAddress: "Birmingham Airport, Birmingham B26 3QJ, UK", placeId: "bhx-place", latitude: 52.45, longitude: -1.74, locality: "Birmingham", name: "Birmingham Airport", types: ["airport"] };
const heathrow: SelectedPlace = { ...bhx, displayAddress: "Heathrow Airport, Hounslow, UK", placeId: "heathrow-place", latitude: 51.47, longitude: -0.45, locality: "Hounslow", name: "Heathrow Airport" };
const manchester: SelectedPlace = { ...bhx, displayAddress: "Manchester Airport, Manchester, UK", placeId: "manchester-place", latitude: 53.35, longitude: -2.27, locality: "Manchester", name: "Manchester Airport" };
const outwardRoute = { distanceMeters: 35405.568, distanceMiles: 22, durationSeconds: 2400 };
const longerReturnRoute = { distanceMeters: 40233.6, distanceMiles: 25, durationSeconds: 3000 };
const details = { ...createEmptyBookingDetails(), fullName: "Alex Customer", mobile: "07123 456789", email: "alex@example.com", pickupBuilding: "Rose Cottage", destinationBuilding: "Terminal entrance", notes: "Please ring the bell.", termsAccepted: true };
const quote: QuoteHandoffPayload = { pickup, destination: bhx, journeyDate: "2027-01-12", journeyTime: "10:30", vehicle: "saloon", passengers: 2, luggage: 2, journeyType: "one-way", outwardBirminghamAccess: "free", outboundRoute: outwardRoute, oneWayFare: calculateFinalFare(47, 47, [])!, involvesAirport: true };

function submission(overrides: Partial<BookingSubmission> = {}): BookingSubmission {
  return { idempotencyKey: "phase5b-quote-0001", quote, details, ...overrides };
}

function memoryRepository(): BookingRepository & { records: Map<string, BookingRecord> } {
  const records = new Map<string, BookingRecord>();
  return {
    records,
    async insertOrGet(record) {
      const existing = records.get(record.idempotency_key);
      if (existing) {
        if (existing.request_fingerprint !== record.request_fingerprint) throw new BookingPersistenceError("IDEMPOTENCY_CONFLICT");
        return { record: existing, created: false };
      }
      records.set(record.idempotency_key, record);
      return { record, created: true };
    },
  };
}

function dependencies(overrides: Partial<Parameters<typeof createPendingBooking>[1]> = {}) {
  return { repository: memoryRepository(), verifyPlace: async (place: SelectedPlace) => place, calculateRoute: async () => outwardRoute, now, createReference: () => "BAC-A1B2C3D4", ...overrides };
}

function returnQuote(overrides: Partial<QuoteHandoffPayload> = {}): QuoteHandoffPayload {
  const outbound = calculateFinalFare(47, 47, [])!;
  return { ...quote, journeyType: "return", returnDate: "2027-01-20", returnTime: "15:45", returnRoute: longerReturnRoute, returnFare: calculateReturnFare(outbound, 47, 47, [])!, oneWayFare: undefined, returnBirminghamAccess: "free", ...overrides };
}

describe("Phase 5B deposit policy", () => {
  it("defaults to one centrally controlled 25% policy", () => {
    expect(defaultBookingDepositPolicy).toEqual({ percentage: 25, minimumDepositPence: 0 });
    expect(getBookingDepositPolicy({})).toEqual(defaultBookingDepositPolicy);
  });

  it("rounds £97.30 deterministically to a £24.33 deposit and £72.97 balance", () => {
    expect(calculateBookingDeposit(9730)).toEqual({ depositPercentage: 25, depositPence: 2433, balancePence: 7297 });
  });

  it("always reconciles deposit and balance in integer pence", () => {
    for (let pence = 0; pence < 10000; pence += 13) {
      const result = calculateBookingDeposit(pence);
      expect(result.depositPence + result.balancePence).toBe(pence);
    }
  });

  it("supports controlled percentage and minimum-deposit changes without exceeding the total", () => {
    expect(getBookingDepositPolicy({ BOOKING_DEPOSIT_PERCENTAGE: "30", BOOKING_MINIMUM_DEPOSIT_PENCE: "1500" })).toEqual({ percentage: 30, minimumDepositPence: 1500 });
    expect(calculateBookingDeposit(1000, { percentage: 25, minimumDepositPence: 1500 })).toEqual({ depositPercentage: 25, depositPence: 1000, balancePence: 0 });
    expect(() => getBookingDepositPolicy({ BOOKING_DEPOSIT_PERCENTAGE: "101" })).toThrow();
    expect(() => calculateBookingDeposit(-1)).toThrow();
  });
});

describe("Phase 5B authoritative booking revalidation", () => {
  it("persists a pending one-way fixed-fare booking with server-issued reference and accepted terms", async () => {
    const result = await createPendingBooking(submission(), dependencies());
    expect(result.created).toBe(true);
    expect(result.booking).toEqual({ bookingReference: "BAC-A1B2C3D4", status: "pending_payment", totalPence: 4700, depositPercentage: 25, depositPence: 1175, balancePence: 3525 });
    expect(result.record).toMatchObject({ customer_full_name: "Alex Customer", customer_mobile: "07123 456789", customer_email: "alex@example.com", pickup_building: "Rose Cottage", destination_building: "Terminal entrance", booking_notes: "Please ring the bell.", terms_accepted_at: now.toISOString(), destination_airport: "BHX", outward_journey_fare_pence: 4700, outward_flight: null });
  });

  it("ignores manipulated browser totals, routes, deposits and saving values", async () => {
    const tampered = { ...quote, outboundRoute: { distanceMeters: 1, distanceMiles: 99999, durationSeconds: 1 }, oneWayFare: { ...quote.oneWayFare!, finalFare: 0, vehicleAdjustedFare: 0 }, deposit: 0, balance: 0, returnSaving: 999999 } as QuoteHandoffPayload;
    const result = await createPendingBooking(submission({ quote: tampered }), dependencies());
    expect(result.record.outward_route).toEqual(outwardRoute);
    expect(result.record.total_pence).toBe(4700);
    expect(result.record.deposit_pence).toBe(1175);
  });

  it("derives fixed-fare eligibility from independently verified place metadata", async () => {
    const fakeWalsall = { ...pickup, locality: "Walsall" };
    const result = await createPendingBooking(submission({ quote: { ...quote, pickup: fakeWalsall } }), dependencies({ verifyPlace: async (place) => place.placeId === pickup.placeId ? { ...place, locality: "Coventry" } : place, calculateRoute: async () => longerReturnRoute }));
    expect(result.record.pickup_place.locality).toBe("Coventry");
    expect(result.record.outward_journey_fare_pence).toBe(5100);
  });

  it("revalidates live-distance pricing using the fresh server-side route", async () => {
    const coventry = { ...pickup, locality: "Coventry" };
    const result = await createPendingBooking(submission({ quote: { ...quote, pickup: coventry } }), dependencies({ calculateRoute: async () => longerReturnRoute }));
    expect(result.record.outward_route.distanceMiles).toBe(25);
    expect(result.record.outward_journey_fare_pence).toBe(5100);
    expect(result.record.total_pence).toBe(5100);
  });

  it("preserves independently selected Birmingham access and discounts the return journey fare only", async () => {
    const result = await createPendingBooking(submission({ quote: returnQuote({ outwardBirminghamAccess: "drop-and-go", returnBirminghamAccess: "free", returnFare: { ...returnQuote().returnFare!, returnDiscount: 9999, finalFare: 1 } }) }), dependencies());
    expect(result.record).toMatchObject({ outward_airport_access_pence: 800, return_airport_access_pence: 0, return_saving_pence: 470, outward_journey_fare_pence: 4700, return_journey_fare_pence: 4700, total_pence: 9730, deposit_pence: 2433, balance_pence: 7297 });
  });

  it("keeps separate paid outbound and return airport access outside the return saving", async () => {
    const result = await createPendingBooking(submission({ quote: returnQuote({ outwardBirminghamAccess: "drop-and-go", returnBirminghamAccess: "drop-and-go" }) }), dependencies());
    expect(result.record).toMatchObject({ outward_airport_access_pence: 800, return_airport_access_pence: 800, return_saving_pence: 470, total_pence: 10530 });
  });

  it("preserves the approved Heathrow fare and its directional access charges", async () => {
    const result = await createPendingBooking(submission({ quote: { ...returnQuote(), destination: heathrow } }), dependencies());
    expect(result.record).toMatchObject({ outward_journey_fare_pence: 18500, return_journey_fare_pence: 18500, outward_airport_access_pence: 700, return_airport_access_pence: 800, return_saving_pence: 1850, total_pence: 36650 });
  });

  it("preserves Manchester's decimal airport charges without discounting them", async () => {
    const result = await createPendingBooking(submission({ quote: { ...returnQuote(), destination: manchester } }), dependencies());
    expect(result.record).toMatchObject({ outward_journey_fare_pence: 12000, outward_airport_access_pence: 550, return_airport_access_pence: 660, return_saving_pence: 1200, total_pence: 24010 });
  });

  it("prices return live-distance legs independently", async () => {
    let calls = 0;
    const coventry = { ...pickup, locality: "Coventry" };
    const result = await createPendingBooking(submission({ quote: { ...returnQuote(), pickup: coventry } }), dependencies({ calculateRoute: async () => calls++ === 0 ? outwardRoute : longerReturnRoute }));
    expect(result.record).toMatchObject({ outward_journey_fare_pence: 4700, return_journey_fare_pence: 5100, return_saving_pence: 510, total_pence: 9290 });
    expect(result.record.return_route).toEqual(longerReturnRoute);
  });

  it("stores optional outward and return flight details without making them mandatory", async () => {
    const withFlights = { ...details, outboundFlight: { ...details.outboundFlight, flightNumber: "BA123", terminal: "2" }, returnFlight: { ...details.returnFlight, flightNumber: "BA456" } };
    const result = await createPendingBooking(submission({ quote: returnQuote(), details: withFlights }), dependencies());
    expect(result.record.outward_flight?.flightNumber).toBe("BA123");
    expect(result.record.return_flight?.flightNumber).toBe("BA456");
    expect((await createPendingBooking(submission(), dependencies())).record.outward_flight).toBeNull();
  });

  it("prevents duplicate records and returns the same reference for repeated submissions", async () => {
    const repository = memoryRepository();
    const first = await createPendingBooking(submission(), dependencies({ repository, createReference: () => "BAC-A1B2C3D4" }));
    const second = await createPendingBooking(submission(), dependencies({ repository, createReference: () => "BAC-E5F6A7B8" }));
    expect(first.created).toBe(true);
    expect(second.created).toBe(false);
    expect(second.booking.bookingReference).toBe("BAC-A1B2C3D4");
    expect(repository.records.size).toBe(1);
  });

  it("rejects reuse of another customer's idempotency key without exposing their booking", async () => {
    const repository = memoryRepository();
    await createPendingBooking(submission(), dependencies({ repository }));
    await expect(createPendingBooking(submission({ details: { ...details, email: "another@example.com" } }), dependencies({ repository }))).rejects.toMatchObject({ code: "IDEMPOTENCY_CONFLICT" });
    expect(repository.records.size).toBe(1);
  });

  it("generates random non-sequential public booking references", async () => {
    const references = new Set<string>();
    for (let index = 0; index < 8; index++) {
      const result = await createPendingBooking(submission({ idempotencyKey: `phase5b-quote-${index}` }), { ...dependencies(), createReference: undefined });
      expect(result.booking.bookingReference).toMatch(/^BAC-[A-F0-9]{8}$/);
      references.add(result.booking.bookingReference);
    }
    expect(references.size).toBe(8);
  });

  it("fails closed when server place verification or route calculation is unavailable", async () => {
    await expect(createPendingBooking(submission(), dependencies({ verifyPlace: async () => { throw new Error("No place"); } }))).rejects.toBeInstanceOf(BookingRevalidationError);
    await expect(createPendingBooking(submission(), dependencies({ calculateRoute: async () => { throw new Error("No route"); } }))).rejects.toBeInstanceOf(BookingRevalidationError);
    await expect(createPendingBooking(submission(), dependencies({ calculateRoute: async () => ({ ...outwardRoute, distanceMiles: 0 }) }))).rejects.toBeInstanceOf(BookingRevalidationError);
  });

  it("logs only the route failure category and safe error metadata", async () => {
    const diagnostic = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(computeDrivingRoute(pickup, bhx, { apiKey: "server-test-key", fetchImplementation: async () => new Response(null, { status: 503 }) })).rejects.toThrow();
    expect(diagnostic).toHaveBeenCalledWith("BOOKING_ROUTE_REVALIDATION_FAILED", { reason: "google_routes_non_2xx", status: 503 });
    const output = JSON.stringify(diagnostic.mock.calls);
    expect(output).not.toContain("server-test-key");
    expect(output).not.toContain(pickup.placeId);
    expect(output).not.toContain(String(pickup.latitude));
    expect(output).not.toContain(pickup.displayAddress);
    diagnostic.mockRestore();
  });

  it("rejects invalid capacity, date order, terms, access selections and idempotency keys", async () => {
    await expect(createPendingBooking(submission({ quote: { ...quote, passengers: 4, luggage: 1 } }), dependencies())).rejects.toBeInstanceOf(BookingValidationError);
    await expect(createPendingBooking(submission({ quote: { ...returnQuote(), returnDate: "2027-01-01" } }), dependencies())).rejects.toBeInstanceOf(BookingValidationError);
    await expect(createPendingBooking(submission({ details: { ...details, termsAccepted: false } }), dependencies())).rejects.toBeInstanceOf(BookingValidationError);
    await expect(createPendingBooking(submission({ quote: { ...quote, outwardBirminghamAccess: "invented" as "free" } }), dependencies())).rejects.toBeInstanceOf(BookingValidationError);
    await expect(createPendingBooking(submission({ idempotencyKey: "bad" }), dependencies())).rejects.toBeInstanceOf(BookingValidationError);
  });
});

describe("Phase 5B Google place verification", () => {
  it("derives trusted locality, airport identity and coordinates from server-side Google Place details", async () => {
    const fetchImplementation = vi.fn(async () => Response.json({ id: pickup.placeId, formattedAddress: pickup.displayAddress, displayName: { text: "Rose Cottage" }, location: { latitude: pickup.latitude, longitude: pickup.longitude }, addressComponents: [{ longText: "Walsall", shortText: "Walsall", types: ["postal_town"] }], types: ["street_address"] }));
    const verified = await verifySelectedBookingPlace({ ...pickup, locality: "Invented" }, { apiKey: "test-server-key", fetchImplementation });
    expect(verified.locality).toBe("Walsall");
    expect(fetchImplementation).toHaveBeenCalledOnce();
  });

  it("rejects mismatched place IDs, changed coordinates, fallback places and unavailable Google data", async () => {
    const response = { id: pickup.placeId, formattedAddress: pickup.displayAddress, location: { latitude: pickup.latitude + 1, longitude: pickup.longitude }, types: ["street_address"] };
    await expect(verifySelectedBookingPlace(pickup, { apiKey: "key", fetchImplementation: async () => Response.json(response) })).rejects.toBeInstanceOf(BookingPlaceError);
    await expect(verifySelectedBookingPlace({ ...pickup, placeId: "fallback:walsall" }, { apiKey: "key" })).rejects.toBeInstanceOf(BookingPlaceError);
    await expect(verifySelectedBookingPlace(pickup, { apiKey: "key", fetchImplementation: async () => new Response(null, { status: 403 }) })).rejects.toBeInstanceOf(BookingPlaceError);
  });
});

describe("Phase 5B server-only Supabase persistence", () => {
  it("fails closed when server-only database settings are absent", () => {
    expect(() => createSupabaseBookingRepository({ url: "", serviceRoleKey: "" })).toThrow(BookingPersistenceError);
    expect(() => createSupabaseBookingRepository({ url: "http://example.com", serviceRoleKey: "secret" })).toThrow(BookingPersistenceError);
  });

  it("uses private service-role requests, insert conflict protection and safe replay lookup", async () => {
    const record = (await createPendingBooking(submission(), dependencies())).record;
    const requests: Array<{ input: RequestInfo | URL; init?: RequestInit }> = [];
    const responses = [Response.json([]), Response.json([record])];
    const repository = createSupabaseBookingRepository({ url: "https://project.supabase.co", serviceRoleKey: "server-only-test-secret", fetchImplementation: async (input, init) => { requests.push({ input, init }); return responses.shift()!; } });
    const result = await repository.insertOrGet(record);
    expect(result.created).toBe(false);
    expect(requests[0].input.toString()).toContain("on_conflict=idempotency_key");
    expect(requests[0].init?.headers).toMatchObject({ Authorization: "Bearer server-only-test-secret", Prefer: "resolution=ignore-duplicates,return=representation" });
    expect(requests[1].input.toString()).toContain("idempotency_key=eq.");
  });

  it("uses row-level security, a unique reference, unique idempotency key and reconciled pence columns", () => {
    const migration = fs.readFileSync("supabase/migrations/202608220001_phase_5b_bookings.sql", "utf8");
    expect(migration).toContain("booking_reference text not null unique");
    expect(migration).toContain("idempotency_key text not null unique");
    expect(migration).toContain("enable row level security");
    expect(migration).toContain("revoke all on table public.bookings from anon, authenticated");
    expect(migration).toContain("grant select, insert\non table public.bookings\nto service_role;");
    expect(migration).not.toMatch(/grant\s+[^;]*(?:update|delete)[^;]*\bon table public\.bookings\s+to service_role/i);
    expect(migration).toContain("deposit_pence + balance_pence = total_pence");
  });
});

describe("Phase 5B public behaviour and scope", () => {
  it("keeps the invalid request response unchanged", async () => {
    const response = await POST(new Request("https://example.test/api/bookings", { method: "POST", body: "not-json" }));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Invalid booking request." });
  });

  it("shows the authoritative reference, deposit and balance without false payment or confirmation", () => {
    const html = renderToStaticMarkup(<BookingSavedCard booking={{ bookingReference: "BAC-A1B2C3D4", status: "pending_payment", totalPence: 9730, depositPercentage: 25, depositPence: 2433, balancePence: 7297 }} />);
    expect(html).toContain("Booking details saved");
    expect(html).toContain("BAC-A1B2C3D4");
    expect(html).toContain("£97.30");
    expect(html).toContain("£24.33");
    expect(html).toContain("£72.97");
    expect(html).toContain("No payment has been taken and your booking is not yet confirmed.");
  });

  it("does not expose booking lookup, server credentials, payment or email integrations", () => {
    const api = fs.readFileSync("app/api/bookings/route.ts", "utf8");
    const client = fs.readFileSync("components/BookingForm.tsx", "utf8");
    const environment = fs.readFileSync(".env.example", "utf8");
    expect(api).toContain("export async function POST");
    expect(api).not.toContain("export async function GET");
    expect(client).not.toMatch(/SUPABASE_SERVICE_ROLE|serviceRoleKey|stripe|paymentintent|checkout\.sessions|resend/i);
    expect(environment).not.toContain("NEXT_PUBLIC_SUPABASE_SERVICE_ROLE");
    expect(api).not.toMatch(/stripe|paymentintent|checkout\.sessions|resend/i);
  });

  it("keeps booking non-indexable, absent from the sitemap and does not create SEO routes", () => {
    const page = fs.readFileSync("app/booking/page.tsx", "utf8");
    expect(page).toContain("index: false");
    expect(sitemap().some((entry) => entry.url.endsWith("/booking"))).toBe(false);
  });
});
