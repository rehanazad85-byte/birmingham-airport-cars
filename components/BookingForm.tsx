"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { getQuoteTotal, readQuoteHandoff, type QuoteHandoffPayload, type QuoteHandoffReadResult } from "@/lib/booking-handoff";
import { createEmptyBookingDetails, readBookingDraft, saveBookingDraft, validateBookingDetails, type BookingDetails, type BookingFieldErrors, type FlightDetails } from "@/lib/booking-validation";
import { formatGBP } from "@/lib/pricing";
import { formatDistanceMiles, formatDurationSeconds } from "@/lib/routes";
import { vehicleCapacities } from "@/lib/vehicle-capacity";

const inputClass = "mt-1 min-h-11 w-full min-w-0 rounded-lg border border-black/15 bg-white px-3 py-2.5 text-base focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30";

function FieldError({ id, children }: { id: string; children?: string }) {
  return children ? <span id={id} role="alert" className="mt-1 block text-sm text-red-700">{children}</span> : null;
}

function FlightFields({ legend, value, onChange, flightError }: { legend: string; value: FlightDetails; onChange(next: FlightDetails): void; flightError?: string }) {
  const update = (field: keyof FlightDetails, nextValue: string) => onChange({ ...value, [field]: nextValue });
  const errorId = `${legend.toLowerCase().replace(/[^a-z]+/g, "-")}-flight-error`;
  return <fieldset className="min-w-0 rounded-xl border border-black/10 p-4">
    <legend className="px-1 font-semibold">{legend}</legend>
    <div className="mt-2 grid min-w-0 gap-4 sm:grid-cols-2">
      <label className="min-w-0 text-sm font-medium">Airline <span className="font-normal text-black/55">(optional)</span><input className={inputClass} value={value.airline} onChange={(event) => update("airline", event.currentTarget.value)} /></label>
      <label className="min-w-0 text-sm font-medium">Flight number <span className="font-normal text-black/55">(optional)</span><input className={inputClass} value={value.flightNumber} aria-invalid={Boolean(flightError)} aria-describedby={flightError ? errorId : undefined} onChange={(event) => update("flightNumber", event.currentTarget.value)} /><FieldError id={errorId}>{flightError}</FieldError></label>
      <label className="min-w-0 text-sm font-medium">Terminal <span className="font-normal text-black/55">(optional)</span><input className={inputClass} value={value.terminal} onChange={(event) => update("terminal", event.currentTarget.value)} /></label>
      <label className="min-w-0 text-sm font-medium">Passenger name if different <span className="font-normal text-black/55">(optional)</span><input className={inputClass} value={value.passengerName} onChange={(event) => update("passengerName", event.currentTarget.value)} /></label>
      <label className="min-w-0 text-sm font-medium">Scheduled departure <span className="font-normal text-black/55">(optional)</span><input type="datetime-local" className={inputClass} value={value.departureTime} onChange={(event) => update("departureTime", event.currentTarget.value)} /></label>
      <label className="min-w-0 text-sm font-medium">Scheduled arrival / landing <span className="font-normal text-black/55">(optional)</span><input type="datetime-local" className={inputClass} value={value.arrivalTime} onChange={(event) => update("arrivalTime", event.currentTarget.value)} /></label>
      <label className="min-w-0 text-sm font-medium sm:col-span-2">Airport collection notes <span className="font-normal text-black/55">(optional)</span><textarea className={`${inputClass} min-h-24 resize-y`} value={value.notes} onChange={(event) => update("notes", event.currentTarget.value)} /></label>
    </div>
  </fieldset>;
}

function hasFlightDetails(flight: FlightDetails) {
  return Object.values(flight).some((value) => value.trim().length > 0);
}

function FlightReview({ title, flight }: { title: string; flight: FlightDetails }) {
  if (!hasFlightDetails(flight)) return null;
  return <section><h3 className="font-semibold">{title}</h3><dl className="mt-2 grid min-w-0 gap-3 sm:grid-cols-2">
    {flight.airline && <div><dt className="text-xs uppercase tracking-wider text-black/50">Airline</dt><dd className="break-words">{flight.airline}</dd></div>}
    {flight.flightNumber && <div><dt className="text-xs uppercase tracking-wider text-black/50">Flight number</dt><dd className="break-words">{flight.flightNumber}</dd></div>}
    {flight.terminal && <div><dt className="text-xs uppercase tracking-wider text-black/50">Terminal</dt><dd className="break-words">{flight.terminal}</dd></div>}
    {flight.passengerName && <div><dt className="text-xs uppercase tracking-wider text-black/50">Passenger name</dt><dd className="break-words">{flight.passengerName}</dd></div>}
    {flight.departureTime && <div><dt className="text-xs uppercase tracking-wider text-black/50">Scheduled departure</dt><dd>{flight.departureTime.replace("T", " at ")}</dd></div>}
    {flight.arrivalTime && <div><dt className="text-xs uppercase tracking-wider text-black/50">Scheduled arrival</dt><dd>{flight.arrivalTime.replace("T", " at ")}</dd></div>}
    {flight.notes && <div className="sm:col-span-2"><dt className="text-xs uppercase tracking-wider text-black/50">Airport notes</dt><dd className="break-words whitespace-pre-wrap">{flight.notes}</dd></div>}
  </dl></section>;
}

export function BookingReviewCard({ quote, details }: { quote: QuoteHandoffPayload; details: BookingDetails }) {
  const outboundFare = quote.journeyType === "return" ? quote.returnFare!.outbound : quote.oneWayFare!;
  return <article className="min-w-0 rounded-2xl border border-gold-500/30 bg-cream p-4 sm:p-6">
    <h2 className="font-serif text-3xl font-semibold">Review booking</h2>
    <p className="mt-2 text-sm text-black/65">Check every detail before continuing. This is still an estimated quotation and not a confirmed booking.</p>
    <section className="mt-6"><h3 className="font-semibold">Outbound journey</h3><dl className="mt-3 grid min-w-0 gap-4 sm:grid-cols-2">
      <div className="min-w-0"><dt className="text-xs uppercase tracking-wider text-black/50">Pickup</dt><dd className="break-words font-semibold">{details.pickupBuilding && `${details.pickupBuilding}, `}{quote.pickup.displayAddress}</dd></div>
      <div className="min-w-0"><dt className="text-xs uppercase tracking-wider text-black/50">Destination</dt><dd className="break-words font-semibold">{details.destinationBuilding && `${details.destinationBuilding}, `}{quote.destination.displayAddress}</dd></div>
      <div><dt className="text-xs uppercase tracking-wider text-black/50">Date and time</dt><dd>{quote.journeyDate} at {quote.journeyTime}</dd></div>
      <div><dt className="text-xs uppercase tracking-wider text-black/50">Distance / estimated time</dt><dd>{formatDistanceMiles(quote.outboundRoute.distanceMiles)} · {formatDurationSeconds(quote.outboundRoute.durationSeconds)}</dd></div>
    </dl></section>
    {quote.journeyType === "return" && <section className="mt-6 border-t border-black/10 pt-5"><h3 className="font-semibold">Return journey</h3><dl className="mt-3 grid min-w-0 gap-4 sm:grid-cols-2">
      <div className="min-w-0"><dt className="text-xs uppercase tracking-wider text-black/50">Pickup</dt><dd className="break-words font-semibold">{details.destinationBuilding && `${details.destinationBuilding}, `}{quote.destination.displayAddress}</dd></div>
      <div className="min-w-0"><dt className="text-xs uppercase tracking-wider text-black/50">Destination</dt><dd className="break-words font-semibold">{details.pickupBuilding && `${details.pickupBuilding}, `}{quote.pickup.displayAddress}</dd></div>
      <div><dt className="text-xs uppercase tracking-wider text-black/50">Date and time</dt><dd>{quote.returnDate} at {quote.returnTime}</dd></div>
      <div><dt className="text-xs uppercase tracking-wider text-black/50">Distance / estimated time</dt><dd>{formatDistanceMiles(quote.returnRoute!.distanceMiles)} · {formatDurationSeconds(quote.returnRoute!.durationSeconds)}</dd></div>
    </dl></section>}
    <section className="mt-6 border-t border-black/10 pt-5"><h3 className="font-semibold">Passengers and vehicle</h3><dl className="mt-3 grid gap-4 sm:grid-cols-3"><div><dt className="text-xs uppercase tracking-wider text-black/50">Vehicle</dt><dd>{vehicleCapacities[quote.vehicle].label}</dd></div><div><dt className="text-xs uppercase tracking-wider text-black/50">Passengers</dt><dd>{quote.passengers}</dd></div><div><dt className="text-xs uppercase tracking-wider text-black/50">Luggage</dt><dd>{quote.luggage} large suitcase{quote.luggage === 1 ? "" : "s"}</dd></div></dl></section>
    <section className="mt-6 border-t border-black/10 pt-5"><h3 className="font-semibold">Estimated fare</h3><dl className="mt-3 space-y-3">
      <div className="flex flex-wrap justify-between gap-2"><dt>Outbound journey fare</dt><dd className="font-semibold">{formatGBP(outboundFare.vehicleAdjustedFare)}</dd></div>
      <div className="flex flex-wrap justify-between gap-2"><dt>Outbound airport access</dt><dd className="font-semibold">{outboundFare.airportAccessCharge === 0 ? "Free / Included" : formatGBP(outboundFare.airportAccessCharge)}</dd></div>
      {quote.journeyType === "return" && <><div className="flex flex-wrap justify-between gap-2"><dt>Return journey fare</dt><dd className="font-semibold">{formatGBP(quote.returnFare!.returnLeg.vehicleAdjustedFare + quote.returnFare!.returnDiscount)}</dd></div><div className="flex flex-wrap justify-between gap-2 text-emerald-800"><dt>Return saving (10%)</dt><dd className="font-semibold">−{formatGBP(quote.returnFare!.returnDiscount)}</dd></div><div className="flex flex-wrap justify-between gap-2"><dt>Return airport access</dt><dd className="font-semibold">{quote.returnFare!.returnLeg.airportAccessCharge === 0 ? "Free / Included" : formatGBP(quote.returnFare!.returnLeg.airportAccessCharge)}</dd></div></>}
      <div className="flex flex-wrap items-end justify-between gap-2 border-t border-black/10 pt-4"><dt className="font-semibold uppercase tracking-wider">Total estimated fare</dt><dd className="font-serif text-3xl font-semibold">{formatGBP(getQuoteTotal(quote))}</dd></div>
    </dl></section>
    <section className="mt-6 border-t border-black/10 pt-5"><h3 className="font-semibold">Contact details</h3><dl className="mt-3 grid min-w-0 gap-4 sm:grid-cols-2"><div><dt className="text-xs uppercase tracking-wider text-black/50">Full name</dt><dd className="break-words">{details.fullName}</dd></div><div><dt className="text-xs uppercase tracking-wider text-black/50">Mobile</dt><dd className="break-words">{details.mobile}</dd></div><div><dt className="text-xs uppercase tracking-wider text-black/50">Email</dt><dd className="break-all">{details.email}</dd></div>{details.notes && <div className="sm:col-span-2"><dt className="text-xs uppercase tracking-wider text-black/50">Booking notes</dt><dd className="break-words whitespace-pre-wrap">{details.notes}</dd></div>}</dl></section>
    {quote.involvesAirport && (hasFlightDetails(details.outboundFlight) || hasFlightDetails(details.returnFlight)) && <div className="mt-6 space-y-5 border-t border-black/10 pt-5"><FlightReview title="Outbound flight details" flight={details.outboundFlight} />{quote.journeyType === "return" && <FlightReview title="Return flight details" flight={details.returnFlight} />}</div>}
  </article>;
}

export function BookingForm() {
  const searchParams = useSearchParams();
  const [handoff, setHandoff] = useState<QuoteHandoffReadResult | null>(null);
  const [details, setDetails] = useState<BookingDetails>(createEmptyBookingDetails);
  const [errors, setErrors] = useState<BookingFieldErrors>({});
  const [stage, setStage] = useState<"details" | "review" | "ready">("details");
  const [draftReady, setDraftReady] = useState(false);

  useEffect(() => {
    const quoteId = searchParams.get("quote");
    const result = readQuoteHandoff(quoteId, window.sessionStorage);
    setHandoff(result);
    if (quoteId && result.status === "valid") setDetails(readBookingDraft(quoteId, window.sessionStorage) ?? createEmptyBookingDetails());
    setDraftReady(true);
  }, [searchParams]);
  useEffect(() => {
    const quoteId = searchParams.get("quote");
    if (draftReady && quoteId && handoff?.status === "valid") saveBookingDraft(quoteId, details, window.sessionStorage);
  }, [details, draftReady, handoff, searchParams]);

  if (!handoff) return <div role="status" className="rounded-xl border bg-white p-6">Loading quotation…</div>;
  if (handoff.status !== "valid") return <div role="alert" className="rounded-2xl border border-gold-500/30 bg-white p-6 shadow-premium"><h2 className="font-serif text-3xl font-semibold">Quotation details unavailable</h2><p className="mt-3 leading-7 text-black/65">{handoff.status === "expired" ? "This quotation handoff has expired." : "The booking page needs a valid quotation from the calculator."} Please calculate the journey again so its route and fare can be carried here safely.</p><Link className="mt-5 inline-block rounded-lg bg-ink px-5 py-3 font-semibold text-white" href="/book-now">Return to calculator</Link></div>;
  const quote = handoff.quote;

  if (stage === "ready") return <div className="space-y-6"><div role="status" className="rounded-2xl border border-gold-500/30 bg-white p-6 shadow-premium"><p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Phase 5A complete</p><h2 className="mt-2 font-serif text-3xl font-semibold">Booking details ready</h2><p className="mt-3 leading-7 text-black/65">Your journey and customer details are ready for the secure payment step. No booking has been confirmed and no payment has been taken in this phase.</p></div><BookingReviewCard quote={quote} details={details} /></div>;

  if (stage === "review") return <div className="space-y-5"><BookingReviewCard quote={quote} details={details} /><div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => setStage("details")} className="min-h-12 rounded-lg border border-ink px-5 py-3 font-semibold">Edit details</button><button type="button" onClick={() => setStage("ready")} className="min-h-12 rounded-lg bg-gold-500 px-5 py-3 font-semibold text-black">Continue booking</button></div><p className="text-center text-sm text-black/60">No payment will be taken and the booking is not yet confirmed.</p></div>;

  const update = <K extends keyof BookingDetails>(field: K, value: BookingDetails[K]) => { setDetails((current) => ({ ...current, [field]: value })); setErrors((current) => ({ ...current, [field]: undefined })); };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateBookingDetails(details);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setStage("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return <form onSubmit={submit} noValidate className="booking-form min-w-0 space-y-6">
    <div className="rounded-2xl border border-gold-500/30 bg-cream p-4 sm:p-6"><p className="text-sm font-semibold uppercase tracking-widest text-gold-700">Quote carried forward</p><div className="mt-3 grid min-w-0 gap-4 sm:grid-cols-2"><div className="min-w-0"><p className="text-xs uppercase tracking-wider text-black/50">Pickup</p><p className="break-words font-semibold">{quote.pickup.displayAddress}</p></div><div className="min-w-0"><p className="text-xs uppercase tracking-wider text-black/50">Destination</p><p className="break-words font-semibold">{quote.destination.displayAddress}</p></div><div><p className="text-xs uppercase tracking-wider text-black/50">Journey</p><p className="font-semibold">{quote.journeyType === "return" ? "Return" : "One-way"} · {quote.journeyDate} at {quote.journeyTime}</p></div><div><p className="text-xs uppercase tracking-wider text-black/50">Estimated total</p><p className="font-serif text-2xl font-semibold">{formatGBP(getQuoteTotal(quote))}</p></div></div><p className="mt-4 text-sm text-black/60">The route and estimate are shown for review. They must be revalidated by the server before future payment processing.</p></div>
    <fieldset className="min-w-0 rounded-2xl bg-white p-4 shadow-premium sm:p-6"><legend className="px-1 font-serif text-2xl font-semibold">Customer details</legend><p className="mt-1 text-sm text-black/60">Fields marked required must be completed.</p><div className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2">
      <label className="min-w-0 text-sm font-medium sm:col-span-2">Full name <span className="text-red-700">(required)</span><input autoComplete="name" className={inputClass} value={details.fullName} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "full-name-error" : undefined} onChange={(event) => update("fullName", event.currentTarget.value)} /><FieldError id="full-name-error">{errors.fullName}</FieldError></label>
      <label className="min-w-0 text-sm font-medium">Mobile number <span className="text-red-700">(required)</span><input type="tel" inputMode="tel" autoComplete="tel" className={inputClass} value={details.mobile} aria-invalid={Boolean(errors.mobile)} aria-describedby={errors.mobile ? "mobile-error" : undefined} onChange={(event) => update("mobile", event.currentTarget.value)} /><FieldError id="mobile-error">{errors.mobile}</FieldError></label>
      <label className="min-w-0 text-sm font-medium">Email address <span className="text-red-700">(required)</span><input type="email" inputMode="email" autoComplete="email" className={inputClass} value={details.email} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} onChange={(event) => update("email", event.currentTarget.value)} /><FieldError id="email-error">{errors.email}</FieldError></label>
    </div></fieldset>
    <fieldset className="min-w-0 rounded-2xl bg-white p-4 shadow-premium sm:p-6"><legend className="px-1 font-serif text-2xl font-semibold">Property and driver information</legend><p className="mt-1 text-sm leading-6 text-black/60">These optional details help the driver find the correct property. They do not change the Google-validated route location.</p><div className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2">
      <label className="min-w-0 text-sm font-medium">Pickup building number or name <span className="font-normal text-black/55">(optional)</span><input placeholder="e.g. 13, Rose Cottage or Holiday Inn" className={inputClass} value={details.pickupBuilding} onChange={(event) => update("pickupBuilding", event.currentTarget.value)} /></label>
      <label className="min-w-0 text-sm font-medium">Destination building number or name <span className="font-normal text-black/55">(optional)</span><input placeholder="e.g. 13, Rose Cottage or Holiday Inn" className={inputClass} value={details.destinationBuilding} onChange={(event) => update("destinationBuilding", event.currentTarget.value)} /></label>
      <label className="min-w-0 text-sm font-medium sm:col-span-2">Booking notes / special requirements <span className="font-normal text-black/55">(optional)</span><textarea className={`${inputClass} min-h-28 resize-y`} value={details.notes} onChange={(event) => update("notes", event.currentTarget.value)} /></label>
    </div></fieldset>
    {quote.involvesAirport && <details className="min-w-0 rounded-2xl bg-white p-4 shadow-premium sm:p-6"><summary className="cursor-pointer font-serif text-2xl font-semibold">Flight or airport details <span className="font-sans text-sm font-normal text-black/55">(optional)</span></summary><p className="mt-3 text-sm leading-6 text-black/60">Add these details if known. They help us plan airport drop-off or collection, but they are not required to continue.</p><div className="mt-5 space-y-5"><FlightFields legend="Outbound flight" value={details.outboundFlight} flightError={errors.outboundFlightNumber} onChange={(flight) => update("outboundFlight", flight)} />{quote.journeyType === "return" && <FlightFields legend="Return flight" value={details.returnFlight} flightError={errors.returnFlightNumber} onChange={(flight) => update("returnFlight", flight)} />}</div></details>}
    <div className="rounded-2xl bg-white p-4 shadow-premium sm:p-6"><label className="flex min-w-0 cursor-pointer items-start gap-3"><input type="checkbox" className="mt-1 size-5 shrink-0 accent-gold-500" checked={details.termsAccepted} aria-invalid={Boolean(errors.termsAccepted)} aria-describedby={errors.termsAccepted ? "terms-error" : undefined} onChange={(event) => update("termsAccepted", event.currentTarget.checked)} /><span className="min-w-0 text-sm leading-6">I confirm the journey details are correct and I agree to the <Link className="font-semibold underline" href="/terms-and-conditions">Terms &amp; Conditions</Link> and <Link className="font-semibold underline" href="/privacy-policy">Privacy Policy</Link>.</span></label><FieldError id="terms-error">{errors.termsAccepted}</FieldError></div>
    <button type="submit" className="min-h-12 w-full rounded-lg bg-gold-500 px-6 py-3 font-semibold text-black hover:bg-gold-400">Review booking</button>
  </form>;
}
