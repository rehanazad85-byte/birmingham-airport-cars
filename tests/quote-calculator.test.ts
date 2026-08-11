import { describe, expect, it } from "vitest";
import { testJourneys } from "../lib/journeys";
import { findJourney, uniqueJourneyValues, validateJourneyDateTime, validateJourneySelection, validateReturnDateTime } from "../lib/quote-calculator";
import { getIllustrativeFare } from "../lib/pricing";

describe("quote calculator journey selection", () => {
  it("shows Walsall only once in pickup options", () => {
    expect(uniqueJourneyValues(testJourneys, "pickup").filter((pickup) => pickup === "Walsall")).toHaveLength(1);
  });

  it("preserves both Walsall journeys", () => {
    expect(findJourney(testJourneys, "Walsall", "Birmingham Airport")?.id).toBe("walsall-bhx");
    expect(findJourney(testJourneys, "Walsall", "Heathrow Airport")?.id).toBe("walsall-lhr");
  });

  it("rejects missing and invalid selections", () => {
    const missing = validateJourneySelection(testJourneys, { pickup: "", destination: "", passengers: 0, luggage: -1 });
    expect(missing).toMatchObject({ pickup: expect.any(String), destination: expect.any(String), passengers: expect.any(String), luggage: expect.any(String) });

    const unsupported = validateJourneySelection(testJourneys, { pickup: "Wolverhampton", destination: "Heathrow Airport", passengers: 2, luggage: 1 });
    expect(unsupported.journey).toBeTruthy();
  });
});

describe("journey date and time validation", () => {
  const now = new Date(2026, 7, 9, 19, 0);

  it("rejects yesterday", () => {
    expect(validateJourneyDateTime("2026-08-08", "20:00", now).journeyTime).toBeTruthy();
  });

  it("rejects an earlier time today", () => {
    expect(validateJourneyDateTime("2026-08-09", "18:30", now).journeyTime).toBeTruthy();
  });

  it("accepts a future time today", () => {
    expect(validateJourneyDateTime("2026-08-09", "19:30", now)).toEqual({});
  });

  it("accepts tomorrow with an earlier clock time", () => {
    expect(validateJourneyDateTime("2026-08-10", "08:00", now)).toEqual({});
  });

  it("preserves the existing supported journey fare", () => {
    const journey = findJourney(testJourneys, "Walsall", "Birmingham Airport");
    expect(journey && getIllustrativeFare(journey.distanceMiles!, "saloon")).toBe(47);
  });
});

describe("return date and time validation", () => {
  it("requires complete return details", () => {
    expect(validateReturnDateTime("2026-08-10", "10:00", "", "")).toEqual({
      returnDate: "Please select a return date.",
      returnTime: "Please select a return time.",
    });
  });

  it("rejects a return date before the outbound date", () => {
    expect(validateReturnDateTime("2026-08-10", "10:00", "2026-08-09", "12:00").returnTime).toBeTruthy();
  });

  it("rejects a same-day return time that is not later", () => {
    expect(validateReturnDateTime("2026-08-10", "10:00", "2026-08-10", "10:00").returnTime).toBeTruthy();
    expect(validateReturnDateTime("2026-08-10", "10:00", "2026-08-10", "09:59").returnTime).toBeTruthy();
  });

  it("accepts a later same-day return and a later-date return", () => {
    expect(validateReturnDateTime("2026-08-10", "10:00", "2026-08-10", "10:01")).toEqual({});
    expect(validateReturnDateTime("2026-08-10", "23:00", "2026-08-11", "01:00")).toEqual({});
  });

  it("rejects impossible calendar values", () => {
    expect(validateReturnDateTime("2026-08-10", "10:00", "2026-02-30", "12:00").returnTime).toBeTruthy();
  });
});
