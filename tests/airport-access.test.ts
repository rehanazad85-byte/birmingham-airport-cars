import { describe, expect, it } from "vitest";
import { getJourneyAirportCharges, recogniseSupportedAirport, type AirportCode, type BirminghamAccessOption } from "../lib/airport-access";
import { testJourneys } from "../lib/journeys";
import { mapPlacesToJourney, type SelectedPlace } from "../lib/places";
import { calculateFinalFare, getVehicleAdjustedFixedFare, type VehicleType } from "../lib/pricing";

const area = (locality = "Walsall"): SelectedPlace => ({ displayAddress: locality, placeId: `area-${locality}`, latitude: 52.5, longitude: -1.9, locality, country: "GB", types: ["postal_town"] });
const airport = (code: AirportCode, name: string): SelectedPlace => ({ displayAddress: `${name}, UK`, placeId: `airport-${code}`, latitude: 52, longitude: -1, name, country: "GB", types: ["airport"] });
const airports: Record<AirportCode, SelectedPlace> = {
  BHX: airport("BHX", "Birmingham Airport"), LHR: airport("LHR", "Heathrow Airport"), LGW: airport("LGW", "Gatwick Airport"),
  STN: airport("STN", "Stansted Airport"), MAN: airport("MAN", "Manchester Airport"), EMA: airport("EMA", "East Midlands Airport"), LTN: airport("LTN", "Luton Airport"),
};

function fixedFare(code: AirportCode, direction: "outbound" | "reverse", vehicle: VehicleType = "saloon", option: BirminghamAccessOption = "free") {
  const pickup = direction === "outbound" ? area() : airports[code];
  const destination = direction === "outbound" ? airports[code] : area();
  const journey = mapPlacesToJourney(testJourneys, pickup, destination);
  const adjusted = getVehicleAdjustedFixedFare(journey?.fixedSaloonFare, vehicle);
  const lines = getJourneyAirportCharges(direction === "reverse" ? code : null, direction === "outbound" ? code : null, option);
  return calculateFinalFare(journey?.fixedSaloonFare ?? null, adjusted, lines);
}

describe("Phase 3D airport access pricing", () => {
  it.each([
    ["BHX", "Birmingham Airport"], ["LHR", "Heathrow Airport"], ["LGW", "Gatwick Airport"], ["STN", "Stansted Airport"],
    ["MAN", "Manchester Airport"], ["EMA", "East Midlands Airport"], ["LTN", "Luton Airport"],
  ] as const)("recognises %s from structured airport data", (code, name) => expect(recogniseSupportedAirport(airport(code, name))).toBe(code));

  it("does not fabricate an airport identity from uncertain data", () => expect(recogniseSupportedAirport(area("Manchester"))).toBeNull());
  it("prices Walsall to BHX with free drop-off at £47", () => expect(fixedFare("BHX", "outbound")?.finalFare).toBe(47));
  it("prices Walsall to BHX with Drop & Go at £55", () => expect(fixedFare("BHX", "outbound", "saloon", "drop-and-go")?.finalFare).toBe(55));
  it("prices BHX to Walsall with free pickup at £47", () => expect(fixedFare("BHX", "reverse")?.finalFare).toBe(47));
  it("prices BHX to Walsall with Drop & Go at £55", () => expect(fixedFare("BHX", "reverse", "saloon", "drop-and-go")?.finalFare).toBe(55));
  it("adds Birmingham access after the vehicle multiplier", () => expect(fixedFare("BHX", "outbound", "estate", "drop-and-go")).toMatchObject({ vehicleAdjustedFare: 59, airportAccessCharge: 8, finalFare: 67 }));
  it("prices Walsall to Heathrow at £192", () => expect(fixedFare("LHR", "outbound")?.finalFare).toBe(192));
  it("prices Heathrow to Walsall at £193", () => expect(fixedFare("LHR", "reverse")?.finalFare).toBe(193));
  it("prices Walsall to Gatwick at £235", () => expect(fixedFare("LGW", "outbound")?.finalFare).toBe(235));
  it("prices Gatwick to Walsall at £233", () => expect(fixedFare("LGW", "reverse")?.finalFare).toBe(233));
  it("prices Walsall to Stansted at £210", () => expect(fixedFare("STN", "outbound")?.finalFare).toBe(210));
  it("prices Walsall to Manchester at £125.50", () => expect(fixedFare("MAN", "outbound")?.finalFare).toBe(125.5));
  it("prices Manchester to Walsall at £126.60", () => expect(fixedFare("MAN", "reverse")?.finalFare).toBe(126.6));
  it("prices Walsall to East Midlands at £90", () => expect(fixedFare("EMA", "outbound")?.finalFare).toBe(90));
  it("prices Walsall to Luton at £165", () => expect(fixedFare("LTN", "outbound")?.finalFare).toBe(165));
  it("does not multiply Heathrow access for a larger vehicle", () => expect(fixedFare("LHR", "outbound", "large-mpv")).toMatchObject({ vehicleAdjustedFare: 324, airportAccessCharge: 7, finalFare: 331 }));
  it("retains Manchester decimal pence", () => expect(fixedFare("MAN", "reverse")).toMatchObject({ airportAccessCharge: 6.6, finalFare: 126.6 }));
  it("adds no charge to a non-airport journey", () => expect(calculateFinalFare(47, 47, getJourneyAirportCharges(null, null))).toMatchObject({ airportAccessCharge: 0, finalFare: 47 }));
  it("adds pickup and drop-off charges for airport-to-airport", () => expect(calculateFinalFare(100, 100, getJourneyAirportCharges("LHR", "LGW"))).toMatchObject({ airportAccessCharge: 18, finalFare: 118, airportCharges: [{ airportCode: "LHR", direction: "pickup", amount: 8 }, { airportCode: "LGW", direction: "drop-off", amount: 10 }] }));
  it("returns no fare when the journey itself cannot be priced", () => expect(calculateFinalFare(null, null, getJourneyAirportCharges("LHR", null))).toBeNull());
});
