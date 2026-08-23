import { NextResponse } from "next/server";
import { BookingPersistenceError } from "@/lib/server/booking-repository";
import { BookingRevalidationError, BookingValidationError, createPendingBooking } from "@/lib/server/booking-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid booking request." }, { status: 400 });
  }

  try {
    const result = await createPendingBooking(body);
    return NextResponse.json({ booking: result.booking }, { status: result.created ? 201 : 200 });
  } catch (error) {
    if (error instanceof BookingValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    if (error instanceof BookingPersistenceError && error.code === "IDEMPOTENCY_CONFLICT") return NextResponse.json({ error: "This booking request has already been used for different details." }, { status: 409 });
    if (error instanceof BookingRevalidationError) return NextResponse.json({ error: error.message }, { status: 503 });
    return NextResponse.json({ error: "Secure booking could not be completed. Please try again or contact us." }, { status: 503 });
  }
}
