import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "../app/page";
import { vehicleCapacities } from "../lib/vehicle-capacity";

describe("homepage fleet section", () => {
  it("renders the supplied fleet image, representative wording and booking CTA", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain("Our Fleet");
    expect(html).toContain("%2Fimages%2Ffleet%2Fbirmingham-airport-cars-representative-fleet.jpeg");
    expect(html).toContain("Vehicle images are representative. The exact make and model may vary according to availability and journey requirements.");
    expect(html).toContain("Mercedes-Benz E-Class Estate shown as a representative vehicle.");
    expect(html).toContain("Audi A8 shown as a representative vehicle.");
    expect(html).toContain("Mercedes-Benz V-Class shown as a representative vehicle.");
    expect(html).toContain('href="/book-now"');
    expect(html).toContain("Get an instant fare");
  });

  it("renders capacities from the authoritative vehicle rules", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(vehicleCapacities.estate).toMatchObject({ maxPassengers: 4, maxLargeSuitcases: 4 });
    expect(vehicleCapacities.executive).toMatchObject({ maxPassengers: 4, maxLargeSuitcases: 2, requiresNoLuggageAtMaxPassengers: true });
    expect(vehicleCapacities["large-mpv"]).toMatchObject({ maxPassengers: 8, maxLargeSuitcases: 8 });
    expect(html).toContain("Up to 4 passengers and up to 4 large suitcases.");
    expect(html).toContain("Up to 3 passengers with up to 2 large suitcases, or 4 passengers with no large suitcases.");
    expect(html).toContain("Up to 8 passengers and up to 8 large suitcases.");
  });
});
