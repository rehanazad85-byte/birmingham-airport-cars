"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { isValidMeasurementId } from "@/lib/analytics";
import { analyticsConsentEvent, readAnalyticsConsent, type AnalyticsConsent } from "@/lib/cookie-consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}

export function GoogleAnalytics({ measurementId }: { measurementId?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);

  useEffect(() => {
    setConsent(readAnalyticsConsent(window.localStorage));
    const updateConsent = (event: Event) => setConsent((event as CustomEvent<AnalyticsConsent>).detail);
    window.addEventListener(analyticsConsentEvent, updateConsent);
    return () => window.removeEventListener(analyticsConsentEvent, updateConsent);
  }, []);

  const isEnabled = consent === "accepted" && isValidMeasurementId(measurementId);

  useEffect(() => {
    if (!isEnabled || !window.gtag) {
      return;
    }

    window.gtag("js", new Date());
    window.gtag("config", measurementId);
  }, [isEnabled, measurementId]);

  useEffect(() => {
    if (!isEnabled || !window.gtag) {
      return;
    }

    window.gtag("event", "page_view", {
      page_path: `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`,
    });
  }, [isEnabled, pathname, searchParams]);

  if (!isEnabled || !measurementId) {
    return null;
  }

  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
