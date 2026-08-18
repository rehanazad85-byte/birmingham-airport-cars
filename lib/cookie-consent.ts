export type AnalyticsConsent = "accepted" | "declined";

export const analyticsConsentStorageKey = "bac-analytics-consent";
export const analyticsConsentEvent = "bac:analytics-consent";

export function isAnalyticsConsent(value: string | null): value is AnalyticsConsent {
  return value === "accepted" || value === "declined";
}

export function readAnalyticsConsent(storage: Pick<Storage, "getItem">): AnalyticsConsent | null {
  const value = storage.getItem(analyticsConsentStorageKey);
  return isAnalyticsConsent(value) ? value : null;
}

export function saveAnalyticsConsent(storage: Pick<Storage, "setItem">, consent: AnalyticsConsent) {
  storage.setItem(analyticsConsentStorageKey, consent);
}

