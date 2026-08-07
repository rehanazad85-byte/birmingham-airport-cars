import type { TestJourney } from "@/lib/journeys";

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

export function recogniseAirport(place: SelectedPlace): "Birmingham Airport" | "Heathrow Airport" | null {
  const identity = `${normalise(place.name)} ${normalise(place.displayAddress)}`;
  const looksLikeAirport = place.types.includes("airport") || /\bairport\b/.test(identity);
  if (!looksLikeAirport) return null;
  if (/\bbirmingham airport\b/.test(identity)) return "Birmingham Airport";
  if (/\b(london )?heathrow airport\b/.test(identity)) return "Heathrow Airport";
  return null;
}

export function mapPlacesToJourney(journeys: TestJourney[], pickup: SelectedPlace, destination: SelectedPlace) {
  const pickupArea = recognisePickupArea(pickup);
  const airport = recogniseAirport(destination);
  if (!pickupArea || !airport) return undefined;
  return journeys.find((journey) => journey.pickup === pickupArea && journey.destination === airport);
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
