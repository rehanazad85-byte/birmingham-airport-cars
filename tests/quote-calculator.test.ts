import { describe, expect, it } from "vitest";
import { testJourneys } from "../lib/journeys";
import { findJourney, uniqueJourneyValues, validateJourneySelection } from "../lib/quote-calculator";

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
