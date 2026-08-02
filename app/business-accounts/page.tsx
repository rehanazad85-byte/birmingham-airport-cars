import { PageHero } from "@/components/PageHero";

export default function Page() {
  return (
    <>
      <PageHero eyebrow="For organisations" title="Professional airport travel for your business">
        <p>Designed for companies that need dependable transfers, clear communication and a straightforward account relationship.</p>
      </PageHero>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-3xl">Business account benefits</h2>
          <ul className="mt-5 space-y-3 text-black/65">
            <li>• Priority booking support</li>
            <li>• Consistent travel standards</li>
            <li>• Centralised journey records</li>
            <li>• Monthly invoicing planned for a later phase</li>
          </ul>
          <p className="mt-6 text-sm text-black/65">
            For account enquiries, call {" "}
            <a href="tel:07474234244" className="font-semibold underline">
              07474 234244
            </a>{" "}
            or email {" "}
            <a href="mailto:info@birminghamairportcars.co.uk" className="font-semibold underline">
              info@birminghamairportcars.co.uk
            </a>.
          </p>
        </div>
        <form className="rounded-2xl border p-6">
          <h2 className="font-serif text-2xl">Register your interest</h2>
          {['Company name', 'Contact name', 'Email address', 'Telephone'].map((field) => (
            <label className="mt-4 block text-sm font-medium" key={field}>
              {field}
              <input className="mt-1 w-full rounded-lg border px-3 py-3" />
            </label>
          ))}
          <button type="button" className="mt-5 w-full rounded-lg bg-gold-500 px-5 py-3 font-semibold">
            Submit enquiry
          </button>
          <p className="mt-3 text-xs text-black/50">Phase 1 front-end form only. Submission handling will be connected later.</p>
        </form>
      </section>
    </>
  );
}
