"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { isSavedBookingSummary, savedBookingStoragePrefix, type SavedBookingSummary } from "@/lib/booking-record";

export function BookingPaymentContinuation() {
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<SavedBookingSummary | null>(null);

  useEffect(() => {
    const quoteId = searchParams.get("quote");
    if (!quoteId) return;

    const readSavedBooking = () => {
      const raw = window.sessionStorage.getItem(`${savedBookingStoragePrefix}${quoteId}`);
      if (!raw) return;
      try {
        const parsed: unknown = JSON.parse(raw);
        if (isSavedBookingSummary(parsed)) setBooking(parsed);
      } catch {
        // BookingForm owns cleanup of malformed saved-booking data.
      }
    };

    readSavedBooking();
    const interval = window.setInterval(readSavedBooking, 500);
    return () => window.clearInterval(interval);
  }, [searchParams]);

  if (!booking) return null;

  return (
    <div className="mt-5 rounded-2xl border border-gold-500/30 bg-white p-5 shadow-premium sm:p-6">
      <p className="font-semibold">Ready for secure payment</p>
      <p className="mt-2 text-sm leading-6 text-black/65">
        Continue to choose either the 25% deposit or full journey payment. Your booking is not confirmed until payment succeeds.
      </p>
      <Link
        href={`/booking/pay/${encodeURIComponent(booking.bookingReference)}`}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-gold-500 px-6 py-3 text-center font-semibold text-black hover:bg-gold-400 sm:w-auto"
      >
        Continue to secure payment
      </Link>
    </div>
  );
}
