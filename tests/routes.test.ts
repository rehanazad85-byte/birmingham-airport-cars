import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "../app/api/route-distance/route";
import {
  RouteDistanceError,
  computeDrivingRoute,
  isCoordinates,
  metresToMiles,
  normaliseRoutesResponse,
} from "../lib/routes";

const origin = { latitude: 52.5862, longitude: -1.9829 };
const destination = { latitude: 52.4524, longitude: -1.7435 };

afterEach(() => vi.restoreAllMocks());

describe("route coordinate validation", () => {
  it("accepts valid origin and destination coordinates", () => {
    expect(isCoordinates(origin)).toBe(true);
    expect(isCoordinates(destination)).toBe(true);
  });

  it("rejects an invalid latitude", () => {
    expect(isCoordinates({ latitude: 90.1, longitude: 0 })).toBe(false);
  });

  it("rejects an invalid longitude", () => {
    expect(isCoordinates({ latitude: 0, longitude: -180.1 })).toBe(false);
  });

  it("rejects a malformed client request", async () => {
    const response = await POST(new Request("http://localhost/api/route-distance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    }));
    expect(response.status).toBe(400);
  });
});

describe("Google Routes normalisation", () => {
  it("converts metres to miles deterministically", () => {
    expect(metresToMiles(1609.344)).toBe(1);
  });

  it("normalises a successful Routes API response", () => {
    expect(normaliseRoutesResponse({ routes: [{ distanceMeters: 3218.688, duration: "900s" }] })).toEqual({
      distanceMeters: 3218.688,
      distanceMiles: 2,
      durationSeconds: 900,
    });
  });

  it("fails safely when no route is returned", () => {
    expect(() => normaliseRoutesResponse({ routes: [] })).toThrowError(new RouteDistanceError("NO_ROUTE"));
  });

  it("fails safely when the API key is missing", async () => {
    await expect(computeDrivingRoute(origin, destination, { apiKey: "" })).rejects.toMatchObject({ code: "MISSING_API_KEY" });
  });

  it("fails safely when Google returns an error", async () => {
    const fetchImplementation = vi.fn<typeof fetch>().mockResolvedValue(new Response("Unavailable", { status: 503 }));
    await expect(computeDrivingRoute(origin, destination, { apiKey: "test-key", fetchImplementation })).rejects.toMatchObject({ code: "ROUTES_API_ERROR" });
  });

  it("requests only driving distance and duration", async () => {
    const fetchImplementation = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ routes: [{ distanceMeters: 1000, duration: "120s" }] }));
    await computeDrivingRoute(origin, destination, { apiKey: "test-key", fetchImplementation });
    expect(fetchImplementation).toHaveBeenCalledWith(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "X-Goog-FieldMask": "routes.distanceMeters,routes.duration" }),
      }),
    );
    const request = fetchImplementation.mock.calls[0][1];
    expect(JSON.parse(String(request?.body))).toMatchObject({ travelMode: "DRIVE" });
  });
});
