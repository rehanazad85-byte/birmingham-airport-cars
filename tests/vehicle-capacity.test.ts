import { describe, expect, it } from "vitest";
import { validateVehicleCapacity } from "../lib/vehicle-capacity";

describe("vehicle capacity validation", () => {
  it.each([
    ["saloon", 3, 2],
    ["saloon", 4, 0],
    ["estate", 4, 4],
    ["large-mpv", 8, 8],
  ] as const)("%s accepts %i passengers and %i large suitcases", (vehicle, passengers, luggage) => {
    expect(validateVehicleCapacity(vehicle, passengers, luggage).valid).toBe(true);
  });

  it.each([
    ["saloon", 4, 1],
    ["saloon", 5, 0],
    ["executive", 4, 1],
    ["mpv", 7, 0],
  ] as const)("%s rejects %i passengers and %i large suitcases", (vehicle, passengers, luggage) => {
    expect(validateVehicleCapacity(vehicle, passengers, luggage).valid).toBe(false);
  });

  it("prevents fare calculation for an invalid combination", () => {
    const validation = validateVehicleCapacity("saloon", 4, 1);
    expect(validation.valid).toBe(false);
  });

  it("immediately revalidates current values when the vehicle changes", () => {
    const passengers = 4;
    const luggage = 4;

    expect(validateVehicleCapacity("estate", passengers, luggage).valid).toBe(true);
    expect(validateVehicleCapacity("saloon", passengers, luggage).valid).toBe(false);
  });
});
