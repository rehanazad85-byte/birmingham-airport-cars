import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AirportRouteLandingPage } from "../components/AirportRouteLandingPage";
import { airports } from "../lib/airports";
import { airportRoutes, airportRouteSlugs } from "../lib/airport-routes";
import { locations } from "../lib/locations";
import { routeAuthorityContent } from "../lib/route-authority-content";

describe("Phase 2E route authority content", () => {
  it("covers all sixteen existing routes with at least five useful answers", () => {
    expect(airportRouteSlugs).toHaveLength(16);
    expect(Object.keys(routeAuthorityContent)).toEqual([...airportRouteSlugs]);
    for (const slug of airportRouteSlugs) {
      expect(routeAuthorityContent[slug].answers.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("preserves shared Heathrow terminals and collection restrictions", () => {
    expect(airports.heathrow.terminalSummary).toContain("Terminals 2, 3, 4 and 5");
    expect(airports.heathrow.collectionGuidance).toContain("not permitted from Heathrow terminal forecourts");
    expect(airports.heathrow.collectionGuidance).toContain("authorised car park");
    expect(airports.heathrow.collectionGuidance).not.toContain("terminal-door collection is guaranteed");
  });

  it("preserves Birmingham Airport meeting-point guidance", () => {
    expect(airports.birmingham.collectionGuidance).toContain("meeting point is confirmed with the booking");
  });

  it("qualifies representative pickups rather than implying a town-wide fare", () => {
    for (const content of Object.values(routeAuthorityContent)) {
      expect(content.representativePickupQualification).toContain("route-planning reference point only");
      expect(content.representativePickupQualification).toContain("does not create a town-wide fixed-fare boundary");
    }
  });

  it("counts children and requires advance confirmation for unusual or accessibility items", () => {
    for (const content of Object.values(routeAuthorityContent)) {
      expect(content.childAndSpecialItemGuidance).toContain("Children count towards the passenger total");
      expect(content.childAndSpecialItemGuidance).toContain("must be disclosed");
      expect(content.childAndSpecialItemGuidance).toContain("confirmed before booking");
    }
  });

  it("does not describe return travel as automatically included", () => {
    for (const content of Object.values(routeAuthorityContent)) {
      expect(content.returnJourneyGuidance).toContain("not automatically included");
    }
  });

  it("keeps vehicle guidance aligned with the capacity rules", () => {
    for (const content of Object.values(routeAuthorityContent)) {
      const guidance = content.answers.find(({ question }) => question.startsWith("Which vehicle"))?.answer;
      expect(guidance).toContain("four passengers and four large suitcases");
      expect(guidance).toContain("six passengers and four large suitcases");
      expect(guidance).toContain("eight passengers and eight large suitcases");
      expect(guidance).toContain("at four passengers it carries no large suitcases");
    }
  });

  it("renders the direct answer and exact-quote CTA without unapproved fares on every route", () => {
    for (const slug of airportRouteSlugs) {
      const html = renderToStaticMarkup(<AirportRouteLandingPage route={airportRoutes[slug]} />);
      expect(html).toContain("Quick route answer");
      expect(html).toContain("confirmed quotation");
      expect(html).toContain("Get an exact quote");
      expect(html).not.toContain("£0");
      expect(html).not.toContain("TBC");
      expect(html).not.toContain("price unavailable");
    }
  });

  it("keeps all route origins, destinations and canonical path identities unchanged", () => {
    for (const slug of airportRouteSlugs) {
      const route = airportRoutes[slug];
      expect(route.slug).toBe(slug);
      expect(locations[route.locationSlug]).toBeDefined();
      expect(airports[route.destinationAirport]).toBeDefined();
      expect(`/airport-transfers/${route.slug}`).toBe(`/airport-transfers/${slug}`);
    }
  });
});
