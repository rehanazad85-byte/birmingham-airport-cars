import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingForm } from "@/components/BookingForm";
import { BookingPaymentContinuation } from "@/components/BookingPaymentContinuation";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Booking details",
  description: "Review an airport-transfer quotation and provide the details needed to continue a booking request.",
  robots: { index: false, follow: false },
};

export default function BookingPage(){return <><PageHero eyebrow="Booking request" title="Add your booking details"><p>Your calculated journey and estimated fare will be carried forward for review.</p></PageHero><section className="mx-auto max-w-5xl px-3 py-10 sm:px-4 sm:py-16"><Suspense fallback={<div className="rounded-xl border bg-white p-6">Loading quotation…</div>}><BookingForm /><BookingPaymentContinuation /></Suspense></section></>}
