import { describe, expect, it } from "vitest";
import { isValidMeasurementId } from "../lib/analytics";

describe("analytics measurement ID validation", () => {
  it("accepts a valid Google Analytics 4 measurement ID", () => {
    expect(isValidMeasurementId("G-B392XM8H07")).toBe(true);
  });

  it("rejects missing or malformed measurement IDs", () => {
    expect(isValidMeasurementId("")).toBe(false);
    expect(isValidMeasurementId("UA-123456-1")).toBe(false);
    expect(isValidMeasurementId("invalid")).toBe(false);
  });
});
