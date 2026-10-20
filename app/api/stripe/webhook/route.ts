import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SIGNATURE_TOLERANCE_SECONDS = 300;

type CheckoutSessionCompleted = {
  id?: unknown;
  object?: unknown;
  client_reference_id?: unknown;
  payment_status?: unknown;
  amount_total?: unknown;
  metadata?: unknown;
};

type StripeEvent = {
  id?: unknown;
  type?: unknown;
  data?: { object?: CheckoutSessionCompleted };
};

function verifyStripeSignature(payload: string, signatureHeader: string, secret: string) {
  const parts = signatureHeader.split(",");
  const timestampPart = parts.find((part) => part.startsWith("t="));
  const signatures = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3));

  if (!timestampPart || signatures.length === 0) return false;

  const timestamp = Number(timestampPart.slice(2));
  if (!Number.isSafeInteger(timestamp)) return false;
  if (Math.abs(Math.floor(Date.now() / 1000) - timestamp) > SIGNATURE_TOLERANCE_SECONDS) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`, "utf8")
    .digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  return signatures.some((signature) => {
    if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
    const suppliedBuffer = Buffer.from(signature, "hex");
    return suppliedBuffer.length === expectedBuffer.length && timingSafeEqual(suppliedBuffer, expectedBuffer);
  });
}

function getSupabaseConfiguration() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) throw new Error("Booking storage is not configured.");
  return { url, serviceRoleKey };
}

async function markBookingPaid(bookingReference: string, paymentMode: "deposit" | "full") {
  const { url, serviceRoleKey } = getSupabaseConfiguration();
  const endpoint = new URL("/rest/v1/bookings", url);
  endpoint.searchParams.set("booking_reference", `eq.${bookingReference}`);
  endpoint.searchParams.set("status", "eq.pending_payment");

  const response = await fetch(endpoint, {
    method: "PATCH",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ status: paymentMode === "full" ? "paid" : "deposit_paid" }),
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Unable to update booking payment status.");
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET_MISSING");
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });

  const payload = await request.text();
  if (!verifyStripeSignature(payload, signature, webhookSecret)) {
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(payload) as StripeEvent;
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data?.object;
  const metadata = session?.metadata && typeof session.metadata === "object"
    ? session.metadata as Record<string, unknown>
    : {};
  const bookingReference = typeof metadata.booking_reference === "string"
    ? metadata.booking_reference.trim().toUpperCase()
    : typeof session?.client_reference_id === "string"
      ? session.client_reference_id.trim().toUpperCase()
      : "";
  const paymentMode = metadata.payment_mode === "deposit" || metadata.payment_mode === "full"
    ? metadata.payment_mode
    : null;

  if (session?.payment_status !== "paid") {
    return NextResponse.json({ received: true });
  }

  if (!/^BAC-[A-F0-9]{8}$/.test(bookingReference) || !paymentMode) {
    console.error("STRIPE_WEBHOOK_INVALID_METADATA", { eventId: event.id, sessionId: session?.id });
    return NextResponse.json({ error: "Invalid checkout metadata." }, { status: 400 });
  }

  try {
    await markBookingPaid(bookingReference, paymentMode);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("STRIPE_WEBHOOK_PROCESSING_FAILED", {
      eventId: event.id,
      bookingReference,
      reason: error instanceof Error ? error.name : "unknown",
    });
    return NextResponse.json({ error: "Unable to process webhook." }, { status: 500 });
  }
}
