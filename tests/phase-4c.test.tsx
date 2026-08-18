import fs from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PrivacyPolicyPage from "../app/privacy-policy/page";
import TermsAndConditionsPage from "../app/terms-and-conditions/page";
import { Footer } from "../components/Footer";
import { analyticsConsentStorageKey, isAnalyticsConsent, readAnalyticsConsent, saveAnalyticsConsent } from "../lib/cookie-consent";
import { companyDetails } from "../lib/company-details";
import { formatDistanceMiles, formatDurationSeconds } from "../lib/routes";

describe("Phase 4C journey presentation", () => {
  it("formats route mileage and duration without changing internal precision", () => {
    expect(formatDistanceMiles(21.437)).toBe("21.4 miles");
    expect(formatDurationSeconds(2280)).toBe("38 mins");
    expect(formatDurationSeconds(5040)).toBe("1 hr 24 mins");
  });

  it("keeps the successful summary tied to route distance and duration", () => {
    const source = fs.readFileSync("components/QuoteForm.tsx", "utf8");
    expect(source).toContain("formatDistanceMiles(outboundRoute.distanceMiles)");
    expect(source).toContain("formatDurationSeconds(outboundRoute.durationSeconds)");
    expect(source).toContain("getRouteAwareIllustrativeFare(undefined,route.distanceMiles,vehicle)");
    expect(source).toContain("Total estimated fare");
    expect(source).toContain("Airport access charge");
    expect(source).toContain("Return saving (10%)");
  });

  it("uses fluid calculator and Places controls rather than fixed widths", () => {
    const form = fs.readFileSync("components/QuoteForm.tsx", "utf8");
    const css = fs.readFileSync("app/globals.css", "utf8");
    expect(form).toContain("quote-form min-w-0 max-w-full");
    expect(css).toContain("max-width:100%;min-width:0");
    expect(css).toContain("font-size:16px");
    expect(css).not.toMatch(/\.quote-form[^}]*width:\s*\d+px/);
  });
});

describe("Phase 4C consent and legal foundation", () => {
  it("persists both analytics choices", () => {
    const values = new Map<string, string>();
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
    expect(readAnalyticsConsent(storage)).toBeNull();
    saveAnalyticsConsent(storage, "declined");
    expect(values.get(analyticsConsentStorageKey)).toBe("declined");
    expect(readAnalyticsConsent(storage)).toBe("declined");
    saveAnalyticsConsent(storage, "accepted");
    expect(readAnalyticsConsent(storage)).toBe("accepted");
    expect(isAnalyticsConsent("unknown")).toBe(false);
  });

  it("gates GA4 on accepted consent while leaving calculator code independent", () => {
    const analytics = fs.readFileSync("components/GoogleAnalytics.tsx", "utf8");
    const form = fs.readFileSync("components/QuoteForm.tsx", "utf8");
    expect(analytics).toContain('consent === "accepted"');
    expect(form).not.toContain("analyticsConsent");
  });

  it("renders complete legal routes and footer links without invented identity fields", () => {
    const terms = renderToStaticMarkup(<TermsAndConditionsPage />);
    const privacy = renderToStaticMarkup(<PrivacyPolicyPage />);
    const footer = renderToStaticMarkup(<Footer />);
    expect(terms).toContain("Quotations and booking requests");
    expect(privacy).toContain("Google Analytics 4");
    expect(footer).toContain('/terms-and-conditions');
    expect(footer).toContain('/privacy-policy');
    expect(companyDetails.legalCompanyName).toBeUndefined();
    expect(companyDetails.companyNumber).toBeUndefined();
    expect(companyDetails.operatorLicenceNumber).toBeUndefined();
    expect(`${terms}${privacy}`).not.toMatch(/company number|operator licence number/i);
  });
});
