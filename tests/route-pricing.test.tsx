import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RoutePricingGuidance } from "../components/RoutePricingGuidance";
import { airportRouteSlugs } from "../lib/airport-routes";
import {
  calculateCostPerPassenger,
  getApprovedRoutePricing,
  routePricingExamples,
  type RoutePricingExample,
} from "../lib/route-pricing-examples";

const baseExample: RoutePricingExample = {
  routeSlug: "walsall-to-heathrow-airport",
  originTown: "Walsall",
  destinationAirport: "Heathrow Airport",
  representativePickupName: "Walsall town centre",
  representativePickupPostcode: "WS1 1TP",
  destinationTerminal: "Heathrow Terminal 5",
  vehicleType: "saloon",
  approvedExampleFare: null,
  approvedTypicalFareMinimum: null,
  approvedTypicalFareMaximum: null,
  passengerCount: null,
  conditions: "Representative guidance only.",
  approvalStatus: "draft",
  lastReviewedDate: "2026-08-04",
};

const renderPricing = (example: RoutePricingExample) =>
  renderToStaticMarkup(<RoutePricingGuidance pricing={getApprovedRoutePricing(example)} />);

describe("route pricing approval and rendering", () => {
  it("never renders draft pricing examples", () => {
    const html = renderPricing({ ...baseExample, approvedExampleFare: 123 });
    expect(html).not.toContain("123");
    expect(html).toContain("confirmed quotation");
  });

  it("renders the quotation CTA for null pricing", () => {
    const html = renderToStaticMarkup(<RoutePricingGuidance pricing={null} />);
    expect(html).toContain("Get an exact quote");
    expect(html).toContain("confirmed quotation");
  });

  it("renders an approved representative fare", () => {
    const html = renderPricing({ ...baseExample, approvalStatus: "approved", approvedExampleFare: 120 });
    expect(html).toContain("£120 before applicable airport access charges");
    expect(html).toContain("Walsall town centre");
  });

  it("renders an approved typical range", () => {
    const html = renderPricing({
      ...baseExample,
      approvalStatus: "approved",
      approvedTypicalFareMinimum: 110,
      approvedTypicalFareMaximum: 130,
    });
    expect(html).toContain("£110–£130");
    expect(html).toContain("Get an exact quote");
  });

  it("calculates and explains cost per passenger", () => {
    const approved = getApprovedRoutePricing({
      ...baseExample,
      approvalStatus: "approved",
      approvedExampleFare: 100,
      passengerCount: 3,
    });
    expect(approved && calculateCostPerPassenger(approved)).toBeCloseTo(33.3333);
    const html = renderToStaticMarkup(<RoutePricingGuidance pricing={approved} />);
    expect(html).toContain("£33.33 per person");
    expect(html).toContain("simple division");
    expect(html).toContain("not charged individually");
  });

  it.each([null, 0, -1])("rejects a passenger count of %s", (passengerCount) => {
    const approved = getApprovedRoutePricing({
      ...baseExample,
      approvalStatus: "approved",
      approvedExampleFare: 100,
      passengerCount,
    });
    expect(approved && calculateCostPerPassenger(approved)).toBeNull();
  });

  it("does not show per-person pricing when vehicle capacity is invalid", () => {
    const approved = getApprovedRoutePricing({
      ...baseExample,
      approvalStatus: "approved",
      approvedExampleFare: 100,
      passengerCount: 5,
      vehicleType: "saloon",
    });
    const html = renderToStaticMarkup(<RoutePricingGuidance pricing={approved} />);
    expect(html).not.toContain("per person");
  });

  it("does not render zero or placeholder money", () => {
    const html = renderPricing({
      ...baseExample,
      approvalStatus: "approved",
      approvedExampleFare: 0,
      approvedTypicalFareMinimum: 0,
      approvedTypicalFareMaximum: 0,
    });
    expect(html).not.toContain("£0");
    expect(html).not.toContain("TBC");
    expect(html).not.toContain("price unavailable");
  });

  it("keeps all sixteen existing route slugs and pricing records", () => {
    expect(airportRouteSlugs).toHaveLength(16);
    expect(Object.keys(routePricingExamples)).toEqual([...airportRouteSlugs]);
  });
});
