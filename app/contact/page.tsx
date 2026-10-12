import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: { absolute: "Contact Birmingham Airport Cars | 07474 234244" },
  description: "Contact Birmingham Airport Cars for fixed-price airport transfers. Call 07474 234244, available 24/7, for Birmingham Airport and West Midlands taxis.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Speak to Birmingham Airport Cars">
        <p>For airport transfer enquiries, business travel and future account applications.</p>
      </PageHero>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-3xl">Contact details</h2>
          <p className="mt-4 text-black/65">
            Telephone: {" "}
            <a href="tel:07474234244" className="font-semibold underline">
              07474 234244
            </a>
          </p>
          <p className="mt-2 text-black/65">
            Email: {" "}
            <a href="mailto:info@birminghamairportcars.co.uk" className="font-semibold underline">
              info@birminghamairportcars.co.uk
            </a>
          </p>
        </div>
        <form className="rounded-2xl border p-6">
          {['Name', 'Email', 'Telephone', 'Message'].map((field) => (
            <label className="mt-4 block text-sm font-medium" key={field}>
              {field}
              {field === 'Message' ? (
                <textarea className="mt-1 min-h-32 w-full rounded-lg border px-3 py-3" />
              ) : (
                <input className="mt-1 w-full rounded-lg border px-3 py-3" />
              )}
            </label>
          ))}
          <button type="button" className="mt-5 rounded-lg bg-gold-500 px-6 py-3 font-semibold">
            Send enquiry
          </button>
        </form>
      </section>
    </>
  );
}
