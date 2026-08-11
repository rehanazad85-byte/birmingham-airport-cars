import { describe, expect, it } from "vitest";
import { calculateFinalFare, calculateReturnFare, calculateSaloonFare, formatGBP, getIllustrativeFare, getRouteAwareIllustrativeFare, getVehicleAdjustedFixedFare } from "../lib/pricing";
import { getJourneyAirportCharges } from "../lib/airport-access";

describe("pricing engine", () => {
  it("applies the minimum fare within three miles", () => expect(calculateSaloonFare(3)).toBe(20));
  it("calculates Walsall to Birmingham Airport saloon fare", () => expect(getIllustrativeFare(22, "saloon")).toBe(47));
  it("applies the estate multiplier", () => expect(getIllustrativeFare(22, "estate")).toBe(58));
  it("calculates Walsall to Heathrow saloon fare", () => expect(getIllustrativeFare(120, "saloon")).toBe(184));
  it("rejects negative distance", () => expect(() => calculateSaloonFare(-1)).toThrow(RangeError));
  it("preserves an existing illustrative journey fare over live distance", () => expect(getRouteAwareIllustrativeFare(22, 25, "saloon")).toBe(47));
  it("uses live distance when no illustrative journey exists", () => expect(getRouteAwareIllustrativeFare(undefined, 22, "saloon")).toBe(47));
  it("does not fabricate a fare when routing fails", () => expect(getRouteAwareIllustrativeFare(undefined, undefined, "saloon")).toBeNull());
});

describe("Phase 3E return pricing", () => {
  it("preserves the one-way Walsall to Birmingham fare", () => {
    expect(calculateFinalFare(47, 47, getJourneyAirportCharges(null, "BHX", "free"))?.finalFare).toBe(47);
  });

  it("prices Walsall to Birmingham and back with a 10% second-leg discount", () => {
    const outbound = calculateFinalFare(47, 47, getJourneyAirportCharges(null, "BHX", "free"));
    expect(calculateReturnFare(outbound, 47, 47, getJourneyAirportCharges("BHX", null, "free"))).toMatchObject({
      returnDiscount: 4.7,
      discountedReturnJourneyFare: 42.3,
      finalFare: 89.3,
    });
  });

  it("keeps Birmingham outbound and return access selections independent", () => {
    const outboundPaid = calculateFinalFare(47, 47, getJourneyAirportCharges(null, "BHX", "drop-and-go"));
    const freeReturn = calculateReturnFare(outboundPaid, 47, 47, getJourneyAirportCharges("BHX", null, "free"));
    const paidReturn = calculateReturnFare(outboundPaid, 47, 47, getJourneyAirportCharges("BHX", null, "drop-and-go"));
    expect(freeReturn?.finalFare).toBe(97.3);
    expect(paidReturn?.finalFare).toBe(105.3);
    expect(paidReturn?.returnDiscount).toBe(4.7);
  });

  it("does not discount Heathrow airport charges", () => {
    const outbound = calculateFinalFare(185, 185, getJourneyAirportCharges(null, "LHR"));
    expect(calculateReturnFare(outbound, 185, 185, getJourneyAirportCharges("LHR", null))).toMatchObject({
      returnDiscount: 18.5,
      discountedReturnJourneyFare: 166.5,
      finalFare: 366.5,
      outbound: { airportAccessCharge: 7 },
      returnLeg: { airportAccessCharge: 8, finalFare: 174.5 },
    });
  });

  it("applies the vehicle multiplier before discount and never multiplies access", () => {
    const adjusted = getVehicleAdjustedFixedFare(47, "estate");
    const outbound = calculateFinalFare(47, adjusted, getJourneyAirportCharges(null, "BHX", "drop-and-go"));
    expect(calculateReturnFare(outbound, 47, adjusted, getJourneyAirportCharges("BHX", null, "drop-and-go"))).toMatchObject({
      returnDiscount: 5.9,
      discountedReturnJourneyFare: 53.1,
      finalFare: 128.1,
      outbound: { vehicleAdjustedFare: 59, airportAccessCharge: 8 },
      returnLeg: { airportAccessCharge: 8 },
    });
  });

  it("preserves Manchester decimal charges at full value", () => {
    const outbound = calculateFinalFare(120, 120, getJourneyAirportCharges(null, "MAN"));
    expect(calculateReturnFare(outbound, 120, 120, getJourneyAirportCharges("MAN", null))).toMatchObject({
      returnDiscount: 12,
      finalFare: 240.1,
      outbound: { airportAccessCharge: 5.5 },
      returnLeg: { airportAccessCharge: 6.6 },
    });
    expect(formatGBP(5.5)).toBe("£5.50");
    expect(formatGBP(6.6)).toBe("£6.60");
  });

  it("calculates live-distance return legs independently", () => {
    const outboundFare = getRouteAwareIllustrativeFare(undefined, 22, "saloon");
    const returnFare = getRouteAwareIllustrativeFare(undefined, 25, "saloon");
    const outbound = calculateFinalFare(outboundFare, outboundFare, []);
    expect(calculateReturnFare(outbound, returnFare, returnFare, [])).toMatchObject({ returnDiscount: 5.1, finalFare: 92.9 });
  });

  it("handles airport-to-airport access independently on both legs", () => {
    const outbound = calculateFinalFare(100, 100, getJourneyAirportCharges("LHR", "LGW"));
    expect(calculateReturnFare(outbound, 100, 100, getJourneyAirportCharges("LGW", "LHR"))).toMatchObject({
      returnDiscount: 10,
      finalFare: 223,
      outbound: { airportAccessCharge: 18 },
      returnLeg: { airportAccessCharge: 15 },
    });
  });

  it("does not fabricate a return quotation when either leg cannot be priced", () => {
    const outbound = calculateFinalFare(47, 47, []);
    expect(calculateReturnFare(outbound, null, null, [])).toBeNull();
    expect(calculateReturnFare(null, 47, 47, [])).toBeNull();
  });
});
