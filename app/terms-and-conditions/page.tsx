import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { companyDetails } from "@/lib/company-details";

export const metadata: Metadata = { title: "Terms & Conditions", description: "Terms for website quotations and airport-transfer booking requests with Birmingham Airport Cars.", alternates: { canonical: "/terms-and-conditions" } };

const sections = [
  ["Quotations and booking requests", "A fare shown by the website is an estimate based on the journey information supplied. Viewing an estimate or sending a request does not confirm a booking. The complete journey requirements and final quotation must be agreed before travel."],
  ["Distance, routes and journey times", "Live estimates use the driving route returned for the selected addresses. Mileage and journey time are estimates; actual travel can vary because of traffic, road conditions, closures or changes to the journey."],
  ["Fares and airport access", "The estimate applies the selected vehicle and the pricing rules shown by the quote service. Airport pickup or drop-off charges are shown separately where applicable. A final quotation may change if the supplied journey details change."],
  ["Return journeys", "Where the website offers a return-booking saving, it applies to the return journey fare only. Airport access charges remain payable in full."],
  ["Information you provide", "Please provide accurate pickup, destination, date, time, passenger and luggage details. Vehicle suitability depends on the number of passengers and luggage declared."],
  ["Changes, cancellations and delays", "Contact us as soon as possible if your requirements change. Any cancellation, amendment, waiting-time or delay arrangements that apply to a booking will be explained when the booking is confirmed."],
  ["Website use", "The website is provided to help customers review services, calculate estimates and make enquiries. Do not misuse the website, interfere with its operation or submit unlawful material."],
] as const;

export default function TermsAndConditionsPage(){return <><PageHero eyebrow="Legal" title="Terms & Conditions"><p>Important information about website quotations and airport-transfer booking requests.</p></PageHero><article className="mx-auto max-w-3xl px-4 py-12 sm:py-16"><p className="leading-7 text-black/65">These terms explain how estimates and booking requests work when you use {companyDetails.tradingName}.</p><div className="mt-10 space-y-8">{sections.map(([title,copy])=><section key={title}><h2 className="font-serif text-2xl font-semibold">{title}</h2><p className="mt-3 leading-7 text-black/65">{copy}</p></section>)}</div><section className="mt-8"><h2 className="font-serif text-2xl font-semibold">Contact</h2><p className="mt-3 leading-7 text-black/65">Questions about these terms or a journey can be sent to <a className="font-semibold underline" href={`mailto:${companyDetails.contactEmail}`}>{companyDetails.contactEmail}</a> or discussed by calling <a className="font-semibold underline" href={companyDetails.contactTelephoneHref}>{companyDetails.contactTelephone}</a>. You can also use our <Link className="font-semibold underline" href="/contact">contact page</Link>.</p></section></article></>}

