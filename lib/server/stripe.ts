type StripeCheckoutMode = "deposit" | "full";

export interface StripeCheckoutSessionInput {
  bookingReference: string;
  customerEmail: string;
  amountPence: number;
  paymentMode: StripeCheckoutMode;
  successUrl: string;
  cancelUrl: string;
}

export interface StripeCheckoutSessionResult {
  id: string;
  url: string;
}

export class StripeCheckoutError extends Error {
  constructor(message = "Unable to start secure payment.") {
    super(message);
    this.name = "StripeCheckoutError";
  }
}

export async function createStripeCheckoutSession(
  input: StripeCheckoutSessionInput,
  options: { secretKey?: string; fetchImplementation?: typeof fetch } = {},
): Promise<StripeCheckoutSessionResult> {
  const secretKey = options.secretKey ?? process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new StripeCheckoutError("Stripe is not configured.");
  if (!Number.isSafeInteger(input.amountPence) || input.amountPence <= 0) throw new StripeCheckoutError("Invalid payment amount.");

  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("success_url", input.successUrl);
  body.set("cancel_url", input.cancelUrl);
  body.set("customer_email", input.customerEmail);
  body.set("client_reference_id", input.bookingReference);
  body.set("metadata[booking_reference]", input.bookingReference);
  body.set("metadata[payment_mode]", input.paymentMode);
  body.set("payment_intent_data[metadata][booking_reference]", input.bookingReference);
  body.set("payment_intent_data[metadata][payment_mode]", input.paymentMode);
  body.set("line_items[0][quantity]", "1");
  body.set("line_items[0][price_data][currency]", "gbp");
  body.set("line_items[0][price_data][unit_amount]", String(input.amountPence));
  body.set("line_items[0][price_data][product_data][name]", input.paymentMode === "full" ? `Birmingham Airport Cars booking ${input.bookingReference} - full payment` : `Birmingham Airport Cars booking ${input.bookingReference} - deposit`);

  let response: Response;
  try {
    response = await (options.fetchImplementation ?? fetch)("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
    });
  } catch {
    throw new StripeCheckoutError();
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new StripeCheckoutError();
  }
  if (!response.ok || !payload || typeof payload !== "object") throw new StripeCheckoutError();
  const session = payload as { id?: unknown; url?: unknown };
  if (typeof session.id !== "string" || typeof session.url !== "string" || !session.url.startsWith("https://checkout.stripe.com/")) throw new StripeCheckoutError();
  return { id: session.id, url: session.url };
}
