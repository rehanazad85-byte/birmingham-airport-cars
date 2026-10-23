import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingPaymentOptions } from "@/components/BookingPaymentOptions";

export const dynamic = "force-dynamic";

async function getPendingBooking(reference: string) {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  const endpoint = new URL("/rest/v1/bookings", url);
  endpoint.searchParams.set("booking_reference", `eq.${reference}`);
  endpoint.searchParams.set("status", "eq.pending_payment");
  endpoint.searchParams.set("select", "booking_reference,total_pence,deposit_pence,balance_pence");
  endpoint.searchParams.set("limit", "1");
  const response = await fetch(endpoint, { headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` }, cache: "no-store" });
  if (!response.ok) return null;
  const rows = await response.json() as Array<{ booking_reference: string; total_pence: number; deposit_pence: number; balance_pence: number }>;
  return rows[0] ?? null;
}

export default async function BookingPaymentPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference: rawReference } = await params;
  const reference = rawReference.trim().toUpperCase();
  if (!/^BAC-[A-F0-9]{8}$/.test(reference)) notFound();
  const booking = await getPendingBooking(reference);
  if (!booking) return <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16"><div className="rounded-2xl border border-black/10 bg-white p-6 shadow-premium"><h1 className="font-serif text-3xl font-semibold">Payment unavailable</h1><p className="mt-3 leading-7 text-black/65">This booking is not currently awaiting payment. If you have already paid, please do not make another payment.</p><Link href="/contact" className="mt-5 inline-block font-semibold text-gold-700 underline">Contact Birmingham Airport Cars</Link></div></main>;
  return <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16"><div className="mb-6"><p className="text-sm uppercase tracking-widest text-black/50">Booking {booking.booking_reference}</p><h1 className="mt-2 font-serif text-4xl font-semibold">Payment</h1></div><BookingPaymentOptions bookingReference={booking.booking_reference} depositPence={booking.deposit_pence} totalPence={booking.total_pence} balancePence={booking.balance_pence} /></main>;
}
