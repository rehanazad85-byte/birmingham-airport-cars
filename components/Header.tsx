"use client";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";

const links = [
  ["Home", "/"], ["Areas We Cover", "/areas-we-cover"], ["Airport Taxi FAQs", "/airport-taxi-faqs"],
  ["Business Accounts", "/business-accounts"], ["Contact", "/contact"]
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-50 border-b border-white/10 bg-ink text-white">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
      <Link href="/" className="leading-tight" aria-label="Birmingham Airport Cars home">
        <span className="block text-[11px] uppercase tracking-[.32em] text-gold-400">Premium transfers</span>
        <span className="font-serif text-xl font-semibold sm:text-2xl">Birmingham Airport Cars</span>
      </Link>
      <nav className="hidden items-center gap-6 lg:flex">{links.map(([label, href]) => <Link className="text-sm text-white/80 hover:text-gold-400" href={href} key={href}>{label}</Link>)}</nav>
      <div className="hidden items-center gap-3 md:flex">
        <a href="tel:07474234244" className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm"><Phone size={15}/> 07474 234244</a>
        <Link href="/book-now" className="rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-black hover:bg-gold-400">Get an Instant Fare</Link>
      </div>
      <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button>
    </div>
    {open && <div className="border-t border-white/10 px-4 py-5 lg:hidden">{links.map(([label, href]) => <Link onClick={() => setOpen(false)} className="block border-b border-white/10 py-3" href={href} key={href}>{label}</Link>)}<Link href="/book-now" className="mt-4 block rounded bg-gold-500 px-4 py-3 text-center font-semibold text-black">Get an Instant Fare</Link></div>}
  </header>;
}
