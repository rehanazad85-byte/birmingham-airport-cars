"use client";

import { useState } from "react";
import { formatGBP } from "@/lib/pricing";

export function BookingPaymentOptions({ bookingReference, depositPence, totalPence, balancePence }: { bookingReference: string; depositPence: number; totalPence: number; balancePence: number }) {
  const [loading, setLoading] = useState<"deposit" | "full" | null>(null);
  const [error, setError] = useState("");

  const startCheckout = async (paymentMode: "deposit" | "full") => {
    if (loading) return;
    setLoading(paymentMode);
    setError("");
    try {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingReference, paymentMode }),
      });
      const payload = await response.json() as { checkoutUrl?: string; error?: string };
      if (!response.ok || !payload.checkoutUrl) throw new Error(payload.error || "Unable to start secure payment.");
      window.location.assign(payload.checkoutUrl);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Unable to start secure payment.");
      setLoading(null);
    }
  };

  return <section className="rounded-2xl border border-gold-500/30 bg-white p-6 shadow-premium">
    <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Choose how to pay</p>
    <h2 className="mt-2 font-serif text-3xl font-semibold">Secure your booking</h2>
    <p className="mt-3 leading-7 text-black/65">Pay the deposit now and the remaining balance on the day of travel, or pay the full journey price now. Cancellations made at least 24 hours before the scheduled pickup time are eligible for a full refund.</p>
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      <button type="button" disabled={Boolean(loading)} onClick={() => startCheckout("deposit")} className="rounded-xl border-2 border-gold-500 bg-cream p-5 text-left transition hover:bg-gold-50 disabled:cursor-wait disabled:opacity-60">
        <span className="block font-semibold">Pay deposit</span>
        <span className="mt-1 block font-serif text-3xl font-semibold">{formatGBP(depositPence / 100)}</span>
        <span className="mt-2 block text-sm text-black/65">{formatGBP(balancePence / 100)} remaining, payable on the day of travel.</span>
        <span className="mt-4 block font-semibold text-gold-700">{loading === "deposit" ? "Opening secure payment…" : "Continue to secure payment"}</span>
      </button>
      <button type="button" disabled={Boolean(loading)} onClick={() => startCheckout("full")} className="rounded-xl border border-black/15 bg-white p-5 text-left transition hover:border-gold-500 disabled:cursor-wait disabled:opacity-60">
        <span className="block font-semibold">Pay in full</span>
        <span className="mt-1 block font-serif text-3xl font-semibold">{formatGBP(totalPence / 100)}</span>
        <span className="mt-2 block text-sm text-black/65">Nothing further to pay for the quoted journey.</span>
        <span className="mt-4 block font-semibold text-gold-700">{loading === "full" ? "Opening secure payment…" : "Continue to secure payment"}</span>
      </button>
    </div>
    {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    <p className="mt-5 text-xs leading-5 text-black/55">Payments are processed securely by Stripe. Your booking is confirmed only after payment is successfully received.</p>
  </section>;
}
