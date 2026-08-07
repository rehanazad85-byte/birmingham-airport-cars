import { describe, expect, it, vi } from "vitest";
import { waitForGooglePlaces } from "../components/PlacesAutocompleteInput";

describe("Google Places autocomplete initialisation", () => {
  it("waits until the Places Autocomplete constructor is available", async () => {
    vi.useFakeTimers();
    let ready = false;
    const waiting = waitForGooglePlaces(() => ready, 1_000, 50);

    await vi.advanceTimersByTimeAsync(100);
    ready = true;
    await vi.advanceTimersByTimeAsync(50);

    await expect(waiting).resolves.toBeUndefined();
    vi.useRealTimers();
  });

  it("stops waiting when Places never becomes available", async () => {
    vi.useFakeTimers();
    const waiting = waitForGooglePlaces(() => false, 100, 25);
    const assertion = expect(waiting).rejects.toThrow("Google Places did not become available");

    await vi.advanceTimersByTimeAsync(100);

    await assertion;
    vi.useRealTimers();
  });
});
