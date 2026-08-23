export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface RouteDistanceResult {
  distanceMeters: number;
  distanceMiles: number;
  durationSeconds: number;
}

export function formatDistanceMiles(distanceMiles: number): string {
  return `${distanceMiles.toFixed(1)} miles`;
}

export function formatDurationSeconds(durationSeconds: number): string {
  const totalMinutes = Math.max(1, Math.round(durationSeconds / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min${minutes === 1 ? "" : "s"}`;
  return `${hours} hr${hours === 1 ? "" : "s"}${minutes ? ` ${minutes} min${minutes === 1 ? "" : "s"}` : ""}`;
}

interface GoogleRoutesResponse {
  routes?: Array<{
    distanceMeters?: unknown;
    duration?: unknown;
  }>;
}

export class RouteDistanceError extends Error {
  constructor(public readonly code: "MISSING_API_KEY" | "ROUTES_API_ERROR" | "NO_ROUTE") {
    super(code);
    this.name = "RouteDistanceError";
  }
}

export function isCoordinates(value: unknown): value is Coordinates {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.latitude === "number" &&
    Number.isFinite(candidate.latitude) &&
    candidate.latitude >= -90 &&
    candidate.latitude <= 90 &&
    typeof candidate.longitude === "number" &&
    Number.isFinite(candidate.longitude) &&
    candidate.longitude >= -180 &&
    candidate.longitude <= 180
  );
}

export function metresToMiles(distanceMeters: number): number {
  if (!Number.isFinite(distanceMeters) || distanceMeters < 0) {
    throw new RangeError("Distance must be a non-negative finite number.");
  }
  return distanceMeters / 1609.344;
}

function parseDurationSeconds(duration: unknown): number | null {
  if (typeof duration !== "string") return null;
  const match = /^(\d+(?:\.\d+)?)s$/.exec(duration);
  if (!match) return null;
  const seconds = Number(match[1]);
  return Number.isFinite(seconds) && seconds >= 0 ? seconds : null;
}

export function normaliseRoutesResponse(payload: unknown): RouteDistanceResult {
  const route = (payload as GoogleRoutesResponse | null)?.routes?.[0];
  const distanceMeters = route?.distanceMeters;
  const durationSeconds = parseDurationSeconds(route?.duration);

  if (
    typeof distanceMeters !== "number" ||
    !Number.isFinite(distanceMeters) ||
    distanceMeters < 0 ||
    durationSeconds === null
  ) {
    throw new RouteDistanceError("NO_ROUTE");
  }

  return {
    distanceMeters,
    distanceMiles: metresToMiles(distanceMeters),
    durationSeconds,
  };
}

export async function computeDrivingRoute(
  origin: Coordinates,
  destination: Coordinates,
  options: {
    apiKey?: string;
    fetchImplementation?: typeof fetch;
  } = {},
): Promise<RouteDistanceResult> {
  const apiKey = options.apiKey ?? process.env.GOOGLE_ROUTES_API_KEY;
  if (!apiKey) {
    console.error("BOOKING_ROUTE_REVALIDATION_FAILED", { reason: "missing_api_key" });
    throw new RouteDistanceError("MISSING_API_KEY");
  }

  const fetchImplementation = options.fetchImplementation ?? fetch;
  let response: Response;
  try {
    response = await fetchImplementation("https://routes.googleapis.com/directions/v2:computeRoutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "routes.distanceMeters,routes.duration",
      },
      body: JSON.stringify({
        origin: { location: { latLng: origin } },
        destination: { location: { latLng: destination } },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        computeAlternativeRoutes: false,
      }),
      cache: "no-store",
    });
  } catch (error) {
    console.error("BOOKING_ROUTE_REVALIDATION_FAILED", { reason: "request_failed", errorName: error instanceof Error ? error.name : "UnknownError" });
    throw new RouteDistanceError("ROUTES_API_ERROR");
  }

  if (!response.ok) {
    console.error("BOOKING_ROUTE_REVALIDATION_FAILED", { reason: "google_routes_non_2xx", status: response.status });
    throw new RouteDistanceError("ROUTES_API_ERROR");
  }

  try {
    return normaliseRoutesResponse(await response.json());
  } catch (error) {
    if (error instanceof RouteDistanceError) {
      console.error("BOOKING_ROUTE_REVALIDATION_FAILED", { reason: error.code.toLowerCase() });
      throw error;
    }
    console.error("BOOKING_ROUTE_REVALIDATION_FAILED", { reason: "invalid_response", errorName: error instanceof Error ? error.name : "UnknownError" });
    throw new RouteDistanceError("ROUTES_API_ERROR");
  }
}
