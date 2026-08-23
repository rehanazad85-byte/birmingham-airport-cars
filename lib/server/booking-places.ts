import { normaliseGooglePlaceNew, type SelectedPlace } from "@/lib/places";
import { isCoordinates } from "@/lib/routes";

export class BookingPlaceError extends Error {
  constructor() {
    super("The selected address could not be independently verified.");
    this.name = "BookingPlaceError";
  }
}

interface GooglePlaceDetails {
  id?: unknown;
  formattedAddress?: unknown;
  displayName?: { text?: unknown };
  location?: { latitude?: unknown; longitude?: unknown };
  addressComponents?: Array<{ longText?: string; shortText?: string; types: string[] }>;
  types?: unknown;
}

export async function verifySelectedBookingPlace(
  supplied: SelectedPlace,
  options: { apiKey?: string; fetchImplementation?: typeof fetch } = {},
): Promise<SelectedPlace> {
  const apiKey = options.apiKey ?? (process.env.GOOGLE_PLACES_SERVER_API_KEY || process.env.GOOGLE_ROUTES_API_KEY);
  if (!apiKey || !supplied.placeId || supplied.placeId.startsWith("fallback:")) throw new BookingPlaceError();

  let response: Response;
  try {
    response = await (options.fetchImplementation ?? fetch)(`https://places.googleapis.com/v1/places/${encodeURIComponent(supplied.placeId)}`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "id,formattedAddress,displayName,location,addressComponents,types",
      },
      cache: "no-store",
    });
  } catch {
    throw new BookingPlaceError();
  }
  if (!response.ok) throw new BookingPlaceError();

  let details: GooglePlaceDetails;
  try {
    details = await response.json() as GooglePlaceDetails;
  } catch {
    throw new BookingPlaceError();
  }

  if (details.id !== supplied.placeId || typeof details.formattedAddress !== "string" || !isCoordinates(details.location) || !Array.isArray(details.types) || !details.types.every((type) => typeof type === "string")) throw new BookingPlaceError();
  if (Math.abs(details.location.latitude - supplied.latitude) > 0.00001 || Math.abs(details.location.longitude - supplied.longitude) > 0.00001) throw new BookingPlaceError();

  const verified = normaliseGooglePlaceNew({
    id: details.id,
    formattedAddress: details.formattedAddress,
    displayName: typeof details.displayName?.text === "string" ? details.displayName.text : null,
    location: { lat: () => details.location!.latitude as number, lng: () => details.location!.longitude as number },
    addressComponents: details.addressComponents,
    types: details.types as string[],
  });
  if (!verified) throw new BookingPlaceError();
  return verified;
}
