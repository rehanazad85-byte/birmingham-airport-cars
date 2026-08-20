import fs from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BookingReviewCard } from "../components/BookingForm";
import { bookingDraftStoragePrefix, createEmptyBookingDetails, readBookingDraft, saveBookingDraft, validateBookingDetails } from "../lib/booking-validation";
import type { QuoteHandoffPayload } from "../lib/booking-handoff";
import { calculateFinalFare, calculateReturnFare } from "../lib/pricing";

const outbound = calculateFinalFare(47, 47, [])!;
const quote: QuoteHandoffPayload = {
  pickup: { displayAddress: "A very long hotel and apartment building address, 10 Long Street, Walsall, West Midlands WS1 1AA, United Kingdom", placeId: "p1", latitude: 52.58, longitude: -1.98, types: ["street_address"] },
  destination: { displayAddress: "Birmingham Airport, Birmingham B26 3QJ, United Kingdom", placeId: "p2", latitude: 52.45, longitude: -1.74, types: ["airport"] },
  journeyDate: "2027-01-12", journeyTime: "10:30", vehicle: "estate", passengers: 3, luggage: 3, journeyType: "one-way",
  outboundRoute: { distanceMeters: 35405.568, distanceMiles: 22, durationSeconds: 2400 }, oneWayFare: outbound, involvesAirport: true,
};

describe("Phase 5A booking details", () => {
  it("requires customer identity, mobile, email and terms acceptance", () => {
    expect(validateBookingDetails(createEmptyBookingDetails())).toEqual(expect.objectContaining({ fullName: expect.any(String), mobile: expect.any(String), email: expect.any(String), termsAccepted: expect.any(String) }));
  });

  it("keeps property, notes and all flight fields optional for airport and non-airport journeys", () => {
    const details = { ...createEmptyBookingDetails(), fullName: "Alex Customer", mobile: "07123 456789", email: "alex@example.com", termsAccepted: true };
    expect(validateBookingDetails(details)).toEqual({});
    expect(validateBookingDetails({ ...details, pickupBuilding: "13, Rose Cottage", destinationBuilding: "Holiday Inn" })).toEqual({});
  });

  it("retains a validated booking draft across a same-tab browser refresh", () => {
    const values = new Map<string, string>();
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
    const details = { ...createEmptyBookingDetails(), fullName: "Alex Customer", mobile: "07123 456789", email: "alex@example.com", pickupBuilding: "Rose Cottage", termsAccepted: true };
    saveBookingDraft("quote-1", details, storage);
    expect(values.has(`${bookingDraftStoragePrefix}quote-1`)).toBe(true);
    expect(readBookingDraft("quote-1", storage)).toEqual(details);
    storage.setItem(`${bookingDraftStoragePrefix}bad`, "not-json");
    expect(readBookingDraft("bad", storage)).toBeNull();
  });

  it("accepts free-text building and property identifiers and renders long addresses safely", () => {
    const details = { ...createEmptyBookingDetails(), fullName: "Alex Customer", mobile: "07123 456789", email: "alex@example.com", pickupBuilding: "Apartment 14B, Rose Court", destinationBuilding: "Holiday Inn", termsAccepted: true };
    const html = renderToStaticMarkup(<BookingReviewCard quote={quote} details={details} />);
    expect(html).toContain("Apartment 14B, Rose Court");
    expect(html).toContain("Holiday Inn");
    expect(html).toContain("break-words");
    expect(html).toContain("22.0 miles");
    expect(html).toContain("40 mins");
  });

  it("renders separate return details, saving, access and unchanged total", () => {
    const returnFare = calculateReturnFare(outbound, 47, 47, [])!;
    const returnQuote: QuoteHandoffPayload = { ...quote, journeyType: "return", returnDate: "2027-01-20", returnTime: "15:45", returnRoute: { distanceMeters: 37014.912, distanceMiles: 23, durationSeconds: 2580 }, returnFare, oneWayFare: undefined };
    const details = { ...createEmptyBookingDetails(), fullName: "Alex Customer", mobile: "07123 456789", email: "alex@example.com", termsAccepted: true };
    const html = renderToStaticMarkup(<BookingReviewCard quote={returnQuote} details={details} />);
    expect(html).toContain("Return journey");
    expect(html).toContain("2027-01-20");
    expect(html).toContain("23.0 miles");
    expect(html).toContain("Return saving (10%)");
    expect(html).toContain("£89.30");
  });

  it("contains correct legal links, optional flight language and no payment processing", () => {
    const source = fs.readFileSync("components/BookingForm.tsx", "utf8");
    expect(source).toContain('href="/terms-and-conditions"');
    expect(source).toContain('href="/privacy-policy"');
    expect(source).toContain("Flight or airport details");
    expect(source).toContain("not required to continue");
    expect(source).toContain("No payment will be taken");
    expect(source).not.toMatch(/stripe|paymentintent|checkout\.sessions|card number/i);
  });

  it("provides responsive source protection without hiding overflow", () => {
    const source = fs.readFileSync("components/BookingForm.tsx", "utf8");
    expect(source).toContain("booking-form min-w-0");
    expect(source).toContain("w-full min-w-0");
    expect(source).toContain("text-base");
    expect(source).toContain("flex flex-wrap");
    expect(source).not.toContain("overflow-hidden");
  });

  it("keeps the booking page out of the public sitemap and provides a calculator recovery path", () => {
    const page = fs.readFileSync("app/booking/page.tsx", "utf8");
    const form = fs.readFileSync("components/BookingForm.tsx", "utf8");
    const sitemap = fs.readFileSync("app/sitemap.ts", "utf8");
    expect(page).toContain("index: false");
    expect(form).toContain('href="/book-now"');
    expect(sitemap).not.toContain('"/booking"');
  });
});
