import { NextResponse } from "next/server";
import { createStripeCheckoutSession, StripeCheckoutError } from "@/lib/server/stripe";

export const runtime = "nodejs";

interface CheckoutRequest {
  bookingReference?: unknown;
  paymentMode?: unknown;
}

function getSupabaseConfiguration() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) throw new Error("Booking storage is not configured.");
  return { url, serviceRoleKey };
}

async function loadPendingBooking(bookingReference: string) {
  const { url, serviceRoleKey } = getSupabaseConfiguration();
  const endpoint = new URL("/rest/v1/bookings", url);
  endpoint.searchParams.set("booking_reference", `eq.${bookingReference}`);
  endpoint.searchParams.set("status", "eq.pending_payment");
  endpoint.searchParams.set("select", "booking_reference,customer_email,total_pence,deposit_pence,balance_pence,status");
  endpoint.searchParams.set("limit", "1");
  const response = await fetch(endpoint, {
    headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to load booking.");
  const rows = await response.json() as Array<{
    booking_reference: string;
    customer_email: string;
    total_pence: number;
    deposit_pence: number;
    balance_pence: number;
    status: string;
  }>;
  return rows[0] ?? null;
}

export async function POST(request: Request) {
  let input: CheckoutRequest;
  try {
    input = await request.json() as CheckoutRequest;
  } catch {
    return NextResponse.json({ error: "Invalid payment request." }, { status: 400 });
  }

  const bookingReference = typeof input.bookingReference === "string" ? input.bookingReference.trim().toUpperCase() : "";
  const paymentMode = input.paymentMode === "deposit" || input.paymentMode === "full" ? input.paymentMode : null;
  if (!/^BAC-[A-F0-9]{8}$/.test(bookingReference) || !paymentMode) {
    return NextResponse.json({ error: "Invalid payment request." }, { status: 400 });
  }

  try {
    const booking = await loadPendingBooking(bookingReference);
    if (!booking) return NextResponse.json({ error: "This booking is not awaiting payment." }, { status: 404 });

    // The amount always comes from the server-side booking record, never the browser.
    const amountPence = paymentMode === "full" ? booking.total_pence : booking.deposit_pence;
    if (!Number.isSafeInteger(amountPence) || amountPence <= 0) throw new Error("Invalid booking amount.");

    const requestUrl = new URL(request.url);
    const origin = requestUrl.origin;
    const session = await createStripeCheckoutSession({
      bookingReference,
      customerEmail: booking.customer_email,
      amountPence,
      paymentMode,
      successUrl: `${origin}/booking/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/booking?payment=cancelled&booking=${encodeURIComponent(bookingReference)}`,
    });

    return NextResponse.json({ checkoutUrl: session.url }, { status: 201 });
  } catch (error) {
    console.error("STRIPE_CHECKOUT_FAILED", { bookingReference, reason: error instanceof Error ? error.name : "unknown" });
    const message = error instanceof StripeCheckoutError ? error.message : "Unable to start secure payment.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
