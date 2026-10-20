import Link from "next/link";

export default function PaymentSuccessPage() {
  return <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16"><div className="rounded-2xl border border-gold-500/30 bg-white p-6 shadow-premium"><p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Payment submitted</p><h1 className="mt-2 font-serif text-4xl font-semibold">Thank you</h1><p className="mt-4 leading-7 text-black/65">Stripe has returned you to Birmingham Airport Cars. We are securely verifying the payment before marking the booking as confirmed.</p><p className="mt-3 leading-7 text-black/65">Please do not make another payment for the same booking. If you paid a deposit, the remaining balance is payable on the day of travel.</p><Link href="/" className="mt-6 inline-block rounded-lg bg-ink px-5 py-3 font-semibold text-white">Return to Birmingham Airport Cars</Link></div></main>;
}
