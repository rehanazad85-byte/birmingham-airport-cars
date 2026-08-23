import { describe, expect, it } from "vitest";
import { bookingHandoffLifetimeMs, bookingHandoffStoragePrefix, getQuoteTotal, isQuoteHandoffPayload, readQuoteHandoff, saveQuoteHandoff, type QuoteHandoffPayload } from "../lib/booking-handoff";
import { calculateFinalFare, calculateReturnFare } from "../lib/pricing";
import type { SelectedPlace } from "../lib/places";

const pickup: SelectedPlace = { displayAddress: "10 Long Address Street, Walsall, West Midlands WS1 1AA, UK", placeId: "pickup-id", latitude: 52.58, longitude: -1.98, locality: "Walsall", street: "Long Address Street", streetNumber: "10", postcode: "WS1 1AA", country: "GB", types: ["street_address"] };
const destination: SelectedPlace = { displayAddress: "Birmingham Airport, Birmingham B26 3QJ, UK", placeId: "airport-id", latitude: 52.45, longitude: -1.74, locality: "Birmingham", postcode: "B26 3QJ", country: "GB", name: "Birmingham Airport", types: ["airport"] };
const route = { distanceMeters: 35405.568, distanceMiles: 22, durationSeconds: 2400 };
const oneWayFare = calculateFinalFare(47, 47, [])!;

const oneWayQuote: QuoteHandoffPayload = { pickup, destination, journeyDate: "2027-01-12", journeyTime: "10:30", vehicle: "saloon", passengers: 2, luggage: 2, journeyType: "one-way", outboundRoute: route, oneWayFare, involvesAirport: true };

function storage() {
  const values = new Map<string, string>();
  return { values, getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key) };
}

describe("Phase 5A quote handoff", () => {
  it("stores the complete quote behind an opaque identifier rather than query-string prices", () => {
    const store = storage();
    const id = saveQuoteHandoff(oneWayQuote, store, 1000, () => "opaque-quote-id");
    expect(id).toBe("opaque-quote-id");
    expect(store.values.has(`${bookingHandoffStoragePrefix}opaque-quote-id`)).toBe(true);
    expect(readQuoteHandoff(id, store, 2000)).toEqual({ status: "valid", quote: oneWayQuote });
  });

  it("preserves separate outbound and return routes and the original return total", () => {
    const outbound = calculateFinalFare(47, 47, [])!;
    const returnFare = calculateReturnFare(outbound, 47, 47, [])!;
    const quote: QuoteHandoffPayload = { ...oneWayQuote, journeyType: "return", returnDate: "2027-01-20", returnTime: "15:45", returnRoute: { distanceMeters: 37014.912, distanceMiles: 23, durationSeconds: 2580 }, returnFare, oneWayFare: undefined };
    expect(isQuoteHandoffPayload(quote)).toBe(true);
    expect(getQuoteTotal(quote)).toBe(89.3);
    expect(quote.returnFare?.returnDiscount).toBe(4.7);
    expect(quote.outboundRoute.distanceMiles).toBe(22);
    expect(quote.returnRoute?.distanceMiles).toBe(23);
  });

  it("preserves independent Birmingham Airport access selections for server revalidation", () => {
    const outbound = calculateFinalFare(47, 47, [])!;
    const returnFare = calculateReturnFare(outbound, 47, 47, [])!;
    const quote: QuoteHandoffPayload = { ...oneWayQuote, journeyType: "return", returnDate: "2027-01-20", returnTime: "15:45", returnRoute: route, returnFare, oneWayFare: undefined, outwardBirminghamAccess: "drop-and-go", returnBirminghamAccess: "free" };
    expect(isQuoteHandoffPayload(quote)).toBe(true);
    expect(isQuoteHandoffPayload({ ...quote, returnBirminghamAccess: "invented" })).toBe(false);
    expect(isQuoteHandoffPayload({ ...oneWayQuote, returnBirminghamAccess: "drop-and-go" })).toBe(false);
  });

  it("rejects tampered, zero and internally inconsistent price data", () => {
    expect(isQuoteHandoffPayload({ ...oneWayQuote, oneWayFare: { ...oneWayFare, finalFare: 1 } })).toBe(false);
    expect(isQuoteHandoffPayload({ ...oneWayQuote, outboundRoute: { ...route, distanceMiles: 0 } })).toBe(false);
    expect(isQuoteHandoffPayload({ ...oneWayQuote, oneWayFare: undefined })).toBe(false);
  });

  it("handles missing, malformed and expired handoffs safely", () => {
    const store = storage();
    expect(readQuoteHandoff(null, store)).toEqual({ status: "missing" });
    store.setItem(`${bookingHandoffStoragePrefix}bad`, "not-json");
    expect(readQuoteHandoff("bad", store)).toEqual({ status: "invalid" });
    saveQuoteHandoff(oneWayQuote, store, 1000, () => "expired");
    expect(readQuoteHandoff("expired", store, 1000 + bookingHandoffLifetimeMs + 1)).toEqual({ status: "expired" });
  });
});
