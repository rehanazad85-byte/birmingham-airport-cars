"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { analyticsConsentEvent, readAnalyticsConsent, saveAnalyticsConsent, type AnalyticsConsent } from "@/lib/cookie-consent";

export function CookieConsent() {
  const [choice, setChoice] = useState<AnalyticsConsent | null | undefined>(undefined);

  useEffect(() => setChoice(readAnalyticsConsent(window.localStorage)), []);

  const choose = (nextChoice: AnalyticsConsent) => {
    saveAnalyticsConsent(window.localStorage, nextChoice);
    setChoice(nextChoice);
    window.dispatchEvent(new CustomEvent(analyticsConsentEvent, { detail: nextChoice }));
  };

  if (choice !== null) return null;

  return <section role="dialog" aria-label="Cookie choices" aria-live="polite" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-xl border border-white/15 bg-ink p-4 text-white shadow-2xl sm:bottom-5 sm:p-5">
    <h2 className="font-serif text-xl font-semibold">Your privacy choices</h2>
    <p className="mt-2 text-sm leading-6 text-white/75">We use essential browser storage for your cookie choice. With your permission, Google Analytics helps us understand website use. Declining analytics does not affect address search or quotations. Read our <Link className="underline" href="/privacy-policy">privacy and cookie information</Link>.</p>
    <div className="mt-4 grid grid-cols-2 gap-3 sm:flex">
      <button type="button" onClick={() => choose("accepted")} className="min-h-11 rounded-lg bg-gold-500 px-5 py-2.5 font-semibold text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Accept</button>
      <button type="button" onClick={() => choose("declined")} className="min-h-11 rounded-lg border border-white/60 px-5 py-2.5 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Decline</button>
    </div>
  </section>;
}

