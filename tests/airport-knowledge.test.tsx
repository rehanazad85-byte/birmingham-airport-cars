import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import BookNowPage from "../app/book-now/page";
import { AirportRouteLandingPage } from "../components/AirportRouteLandingPage";
import { Footer } from "../components/Footer";
import { airportKnowledge } from "../lib/airport-knowledge";
import { airportRoutes, airportRouteSlugs } from "../lib/airport-routes";
import { getPublicRoutePricing } from "../lib/route-pricing-examples";

describe("Phase 2F airport knowledge and live-site cleanup", () => {
  it("provides useful central knowledge for both airports", () => {
    expect(Object.keys(airportKnowledge)).toEqual(["birmingham", "heathrow"]);
    expect(airportKnowledge.birmingham.answers.length).toBeGreaterThanOrEqual(5);
    expect(airportKnowledge.heathrow.answers.length).toBeGreaterThanOrEqual(5);
  });

  it("assigns every route the correct destination knowledge", () => {
    expect(airportRouteSlugs).toHaveLength(16);
    for (const slug of airportRouteSlugs) {
      const route = airportRoutes[slug];
      expect(airportKnowledge[route.destinationAirport].airportId).toBe(route.destinationAirport);
    }
  });

  it("keeps Heathrow facts out of Birmingham route output", () => {
    const html = renderToStaticMarkup(<AirportRouteLandingPage route={airportRoutes["walsall-to-birmingham-airport"]} />);
    expect(html).toContain("meeting point is confirmed with the booking");
    expect(html).not.toContain("Terminals 2, 3, 4 and 5");
    expect(html).not.toContain("Heathrow terminal forecourts");
  });

  it("preserves Heathrow terminal and forecourt guidance once in its airport section", () => {
    const html = renderToStaticMarkup(<AirportRouteLandingPage route={airportRoutes["walsall-to-heathrow-airport"]} />);
    expect(html).toContain("Terminals 2, 3, 4 and 5");
    expect(html).toContain("not permitted from Heathrow terminal forecourts");
    expect(html.match(/Heathrow terminals and collection/g) ?? []).toHaveLength(0);
    expect(html.match(/Planning travel to and from Heathrow Airport/g) ?? []).toHaveLength(1);
  });

  it("does not publish airport charges", () => {
    const text = JSON.stringify(airportKnowledge);
    expect(text).not.toMatch(/£|parking fee|drop-off charge|collection charge|grace period/i);
  });

  it("removes development wording and final-fare promises from the quote page", () => {
    const html = renderToStaticMarkup(<BookNowPage />);
    expect(html).not.toMatch(/Phase 1|development test journey|later phase|confirmed final fare/i);
    expect(html).toContain("Get an airport transfer quote");
  });

  it("uses a normal customer-facing footer copyright", () => {
    const html = renderToStaticMarkup(<Footer />);
    expect(html).toContain("All rights reserved");
    expect(html).not.toContain("Phase 1 independent website");
  });

  it("keeps route identities, canonicals, quote CTAs and approval gating", () => {
    for (const slug of airportRouteSlugs) {
      expect(airportRoutes[slug].slug).toBe(slug);
      expect(`/airport-transfers/${airportRoutes[slug].slug}`).toBe(`/airport-transfers/${slug}`);
      if (slug === "walsall-to-birmingham-airport" || slug === "walsall-to-heathrow-airport") {
        expect(getPublicRoutePricing(slug)?.approvedExampleFare).toBe(slug.includes("birmingham") ? 47 : 185);
      } else {
        expect(getPublicRoutePricing(slug)).toBeNull();
      }
      const html = renderToStaticMarkup(<AirportRouteLandingPage route={airportRoutes[slug]} />);
      expect(html).toContain("Get an exact quote");
      expect(html).not.toContain("£0");
    }
  });
});
