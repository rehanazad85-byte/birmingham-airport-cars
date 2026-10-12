import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";import { QuoteForm } from "@/components/QuoteForm";
export const metadata:Metadata={title:{absolute:"Book a Birmingham Airport Taxi | Get a Quote"},description:"Book your Birmingham Airport taxi online in minutes. Fixed fares, 24/7 pickups and an instant quote. Or call 07474 234244 to arrange your transfer.",alternates:{canonical:"/book-now"}};
export default function Page(){return <><PageHero eyebrow="Airport transfer quote" title="Get an airport transfer quote"><p>Enter your journey details to check the available vehicle options and request a confirmed airport transfer quotation.</p></PageHero><section className="mx-auto max-w-6xl px-3 py-10 sm:px-4 sm:py-16"><QuoteForm/></section></>}
