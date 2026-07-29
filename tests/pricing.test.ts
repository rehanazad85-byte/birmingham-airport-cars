import { describe, expect, it } from "vitest";
import { calculateSaloonFare, getIllustrativeFare } from "../lib/pricing";

describe("pricing engine", () => {
  it("applies the minimum fare within three miles", () => expect(calculateSaloonFare(3)).toBe(20));
  it("calculates Walsall to Birmingham Airport saloon fare", () => expect(getIllustrativeFare(22, "saloon")).toBe(47));
  it("applies the estate multiplier", () => expect(getIllustrativeFare(22, "estate")).toBe(58));
  it("calculates Walsall to Heathrow saloon fare", () => expect(getIllustrativeFare(120, "saloon")).toBe(184));
  it("rejects negative distance", () => expect(() => calculateSaloonFare(-1)).toThrow(RangeError));
});
