import type { TestJourney } from "@/lib/journeys";
import { airportAccessConfig, recogniseSupportedAirport, type AirportCode } from "@/lib/airport-access";

export interface AddressComponent {
  longName: string;
  shortName: string;
  types: string[];
}

export interface SelectedPlace {
  displayAddress: string;
  placeId: string;
  latitude: number;
  longitude: number;
  postcode?: string;
  locality?: string;
  street?: string;
  streetNumber?: string;
  premises?: string;
  administrativeArea?: string;
  county?: string;
  country?: string;
  name?: string;
  types: string[];
}

export interface GooglePlaceLike {
  formatted_address?: string;
  place_id?: string;
  name?: string;
  types?: string[];
  address_components?: Array<{ long_name: string; short_name: string; types: string[] }>;
  geometry?: { location?: { lat(): number; lng(): number } };
}

export interface GooglePlaceNewLike {
  formattedAddress?: string | null;
  id?: string;
  displayName?: string | null;
  types?: string[];
  addressComponents?: Array<{ longText?: string; shortText?: string; types: string[] }>;
  location?: { lat(): number; lng(): number };
}

function component(place: GooglePlaceLike, type: string) {
  return place.address_components?.find((item) => item.types.includes(type));
}

export function normaliseGooglePlace(place: GooglePlaceLike): SelectedPlace | null {
  const latitude = place.geometry?.location?.lat();
  const longitude = place.geometry?.location?.lng();
  const displayAddress = place.formatted_address ?? place.name;
  if (!displayAddress || !place.place_id || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  const locality = component(place, "postal_town") ?? component(place, "locality");
  return {
    displayAddress,
    placeId: place.place_id,
    latitude: latitude as number,
    longitude: longitude as number,
    postcode: component(place, "postal_code")?.long_name,
    locality: locality?.long_name,
    street: component(place, "route")?.long_name,
    streetNumber: component(place, "street_number")?.long_name,
    premises: component(place, "premise")?.long_name ?? component(place, "subpremise")?.long_name,
    administrativeArea: component(place, "administrative_area_level_1")?.long_name,
    county: component(place, "administrative_area_level_2")?.long_name,
    country: component(place, "country")?.short_name,
    name: place.name,
    types: place.types ?? [],
  };
}

function newComponent(place: GooglePlaceNewLike, type: string) {
  return place.addressComponents?.find((item) => item.types.includes(type));
}

export function normaliseGooglePlaceNew(place: GooglePlaceNewLike): SelectedPlace | null {
  const latitude = place.location?.lat();
  const longitude = place.location?.lng();
  const displayAddress = place.formattedAddress ?? place.displayName;
  if (!displayAddress || !place.id || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  const locality = newComponent(place, "postal_town") ?? newComponent(place, "locality");
  return {
    displayAddress,
    placeId: place.id,
    latitude: latitude as number,
    longitude: longitude as number,
    postcode: newComponent(place, "postal_code")?.longText,
    locality: locality?.longText,
    street: newComponent(place, "route")?.longText,
    streetNumber: newComponent(place, "street_number")?.longText,
    premises: newComponent(place, "premise")?.longText ?? newComponent(place, "subpremise")?.longText,
    administrativeArea: newComponent(place, "administrative_area_level_1")?.longText,
    county: newComponent(place, "administrative_area_level_2")?.longText,
    country: newComponent(place, "country")?.shortText,
    name: place.displayName ?? undefined,
    types: place.types ?? [],
  };
}

const normalise = (value?: string) => value?.trim().toLocaleLowerCase("en-GB").replace(/[^a-z0-9]+/g, " ").trim() ?? "";

export function recognisePickupArea(place: SelectedPlace): "Walsall" | "Sutton Coldfield" | "Wolverhampton" | null {
  const locality = normalise(place.locality);
  if (locality === "walsall") return "Walsall";
  if (locality === "sutton coldfield") return "Sutton Coldfield";
  if (locality === "wolverhampton") return "Wolverhampton";
  return null;
}

export function recogniseAirport(place: SelectedPlace): string | null {
  const code = recogniseSupportedAirport(place);
  return code ? airportAccessConfig[code].name : null;
}

export function mapPlacesToJourney(journeys: TestJourney[], pickup: SelectedPlace, destination: SelectedPlace) {
  const pickupArea = recognisePickupArea(pickup);
  const destinationArea = recognisePickupArea(destination);
  const pickupAirport = recogniseSupportedAirport(pickup);
  const destinationAirport = recogniseSupportedAirport(destination);
  if (pickupArea && destinationAirport) return journeys.find((journey) => journey.pickup === pickupArea && journey.airportCode === destinationAirport);
  if (pickupAirport && destinationArea) return journeys.find((journey) => journey.pickup === destinationArea && journey.airportCode === pickupAirport);
  return undefined;
}

export function getJourneyAirports(pickup: SelectedPlace, destination: SelectedPlace): { pickupAirport: AirportCode | null; destinationAirport: AirportCode | null } {
  return { pickupAirport: recogniseSupportedAirport(pickup), destinationAirport: recogniseSupportedAirport(destination) };
}

const fallbackPlaces: Record<string, SelectedPlace> = {
  walsall: { displayAddress: "Walsall", placeId: "fallback:walsall", latitude: 52.5862, longitude: -1.9829, locality: "Walsall", country: "GB", types: ["postal_town"] },
  "sutton coldfield": { displayAddress: "Sutton Coldfield", placeId: "fallback:sutton-coldfield", latitude: 52.5704, longitude: -1.824, locality: "Sutton Coldfield", country: "GB", types: ["postal_town"] },
  wolverhampton: { displayAddress: "Wolverhampton", placeId: "fallback:wolverhampton", latitude: 52.5868, longitude: -2.128, locality: "Wolverhampton", country: "GB", types: ["postal_town"] },
  "birmingham airport": { displayAddress: "Birmingham Airport", placeId: "fallback:birmingham-airport", latitude: 52.4524, longitude: -1.7435, locality: "Birmingham", country: "GB", name: "Birmingham Airport", types: ["airport"] },
  "heathrow airport": { displayAddress: "Heathrow Airport", placeId: "fallback:heathrow-airport", latitude: 51.47, longitude: -0.4543, locality: "Hounslow", country: "GB", name: "Heathrow Airport", types: ["airport"] },
};

export function getSafeFallbackPlace(value: string): SelectedPlace | null {
  return fallbackPlaces[normalise(value)] ?? null;
}
