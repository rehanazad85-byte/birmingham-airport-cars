import { describe, expect, it } from "vitest";
import { mapPlacesToJourney, normaliseGooglePlace, normaliseGooglePlaceNew, recogniseAirport, recognisePickupArea, type SelectedPlace } from "../lib/places";
import { testJourneys } from "../lib/journeys";
import { validateAddressSelections } from "../lib/quote-calculator";
import { validateVehicleCapacity } from "../lib/vehicle-capacity";
import { getIllustrativeFare } from "../lib/pricing";

const place = (overrides: Partial<SelectedPlace>): SelectedPlace => ({ displayAddress: "Address", placeId: "place-1", latitude: 52.5, longitude: -1.9, country: "GB", types: ["street_address"], ...overrides });

describe("Google Places foundation", () => {
  it("normalises structured Google place data", () => {
    expect(normaliseGooglePlace({ formatted_address: "1 High Street, Walsall WS1 1AA, UK", place_id: "abc", types: ["street_address"], geometry: { location: { lat: () => 52.58, lng: () => -1.98 } }, address_components: [{ long_name: "Walsall", short_name: "Walsall", types: ["postal_town"] }, { long_name: "WS1 1AA", short_name: "WS1 1AA", types: ["postal_code"] }, { long_name: "United Kingdom", short_name: "GB", types: ["country"] }] })).toMatchObject({ placeId: "abc", locality: "Walsall", postcode: "WS1 1AA", country: "GB", latitude: 52.58 });
  });
  it("normalises Places API (New) place data", () => {
    expect(normaliseGooglePlaceNew({ formattedAddress: "1 High Street, Walsall WS1 1AA, UK", id: "new-abc", displayName: "1 High Street", types: ["street_address"], location: { lat: () => 52.58, lng: () => -1.98 }, addressComponents: [{ longText: "Walsall", shortText: "Walsall", types: ["postal_town"] }, { longText: "WS1 1AA", shortText: "WS1 1AA", types: ["postal_code"] }, { longText: "United Kingdom", shortText: "GB", types: ["country"] }] })).toMatchObject({ placeId: "new-abc", locality: "Walsall", postcode: "WS1 1AA", country: "GB", latitude: 52.58, name: "1 High Street" });
  });
  it("recognises Birmingham Airport", () => expect(recogniseAirport(place({ name: "Birmingham Airport", displayAddress: "Birmingham Airport, Birmingham B26 3QJ, UK", types: ["airport"] }))).toBe("Birmingham Airport"));
  it("recognises Heathrow Airport", () => expect(recogniseAirport(place({ name: "Heathrow Airport", displayAddress: "Heathrow Airport, Hounslow, UK", types: ["airport"] }))).toBe("Heathrow Airport"));
  it.each([["Walsall", "Walsall"], ["Sutton Coldfield", "Sutton Coldfield"], ["Wolverhampton", "Wolverhampton"]] as const)("maps a full %s address", (locality, expected) => expect(recognisePickupArea(place({ displayAddress: `10 High Street, ${locality}, UK`, locality }))).toBe(expected));
  it("does not invent a fare for an unsupported journey", () => expect(mapPlacesToJourney(testJourneys, place({ locality: "Wolverhampton" }), place({ name: "Heathrow Airport", displayAddress: "Heathrow Airport, UK", types: ["airport"] }))).toBeUndefined());
  it("rejects typed but unselected addresses", () => expect(validateAddressSelections({ pickup: { inputValue: "Walsall", place: null }, destination: { inputValue: "Heathrow", place: null }, passengers: 2, luggage: 1 })).toMatchObject({ pickup: expect.any(String), destination: expect.any(String) }));
  it("preserves capacity validation", () => expect(validateVehicleCapacity("saloon", 4, 1).valid).toBe(false));
  it("preserves supported pricing", () => {
    const journey = mapPlacesToJourney(testJourneys, place({ locality: "Walsall" }), place({ name: "Birmingham Airport", displayAddress: "Birmingham Airport, UK", types: ["airport"] }));
    expect(journey?.id).toBe("walsall-bhx");
    expect(getIllustrativeFare(journey!.distanceMiles!, "saloon")).toBe(47);
  });
});
