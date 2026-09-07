import type { Metadata } from 'next'
import { Building2, Check, Gift } from 'lucide-react'
import { formatPrice } from '../lib/supabase'
import { ButtonLink } from '../components/ui/Button'
import EditorialPanel from '../components/ui/EditorialPanel'
import { CorporateForm, ContactForm } from './GiftingForms'

export const metadata: Metadata = {
  title: 'Gifting',
  description:
    'Corporate and festive gifting from Bite Baithak. Custom-branded boxes from 25 units, and pre-curated gift boxes for everyone else.',
}

/* Indicative box pricing. These are curated bundles, not rows in the
   products table, so they are enquiry-only rather than add-to-cart.
   Create real SKUs to make them directly purchasable. */
const GIFT_BOXES = [
  {
    name: 'The Short Sitting',
    price: 749,
    contents: ['Nankhatai', 'Jam Roll Cookies', 'Atta Ghee'],
    note: 'Three tins. The starting point.',
    from: '#C49030',
    to: '#8B661C',
  },
  {
    name: 'The Long Sitting',
    price: 1349,
    contents: [
      'Mix Dry Fruits',
      'Double Chocolate',
      'Cashew Cookies',
      'Oregano Lavash',
      'Nankhatai',
    ],
    note: 'Five tins, sweet and savoury.',
    from: '#8B4A2B',
    to: '#3B2117',
  },
  {
    name: 'The Full Baithak',
    price: 2249,
    contents: [
      'Eight tins, chosen across every flavour family',
      'Printed flavour card',
      'Ribbon-tied outer box',
    ],
    note: 'Our largest ready-made box.',
    from: '#8B1E2C',
    to: '#4A0F18',
  },
]

const CORPORATE_POINTS = [
  'From 25 boxes, with volume pricing above 100',
  'Custom-branded sleeves, or a printed insert with your message',
  'Split delivery to multiple addresses across India',
  'Festive lead time: two weeks before Diwali week',
]

export default function GiftingPage() {
  return (
    <div className="pb-8">
      {/* ── Split hero ───────────────────────────────────── */}
      <section className="container-bb pt-14 md:pt-20">
        <p className="mb-5 text-xs uppercase tracking-[0.22em] text-ink-soft">
          Gifting
        </p>
        <h1 className="serif max-w-[26ch] text-5xl leading-[0.95] text-ink md:text-8xl">
          Something worth opening slowly.
        </h1>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <a
            href="#corporate"
            className="group relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-2xl p-8 shadow-[var(--shadow-card)] transition-shadow duration-500 hover:shadow-[var(--shadow-card-lift)] md:min-h-[380px] md:p-10"
            style={{ background: 'linear-gradient(145deg, #3B2117, #5C2E0A)' }}
          >
            <Building2 size={20} className="text-milk" strokeWidth={1.75} />
            <div>
              <h2 className="serif text-3xl text-milk md:text-4xl">
                Corporate
              </h2>
              <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-milk/70">
                Diwali hampers, client boxes, and onboarding gifts. Branded,
                bulk, delivered on your date.
              </p>
              <span className="mt-6 inline-block text-sm text-turmeric">
                From 25 boxes →
              </span>
            </div>
          </a>

          <a
            href="#personal"
            className="group relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-2xl p-8 shadow-[var(--shadow-card)] transition-shadow duration-500 hover:shadow-[var(--shadow-card-lift)] md:min-h-[380px] md:p-10"
            style={{ background: 'linear-gradient(145deg, #E8B4B8, #D08F96)' }}
          >
            <Gift size={20} className="text-ink" strokeWidth={1.75} />
            <div>
              <h2 className="serif text-3xl text-ink md:text-4xl">Personal</h2>
              <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-ink/70">
                Ready-made boxes for birthdays, housewarmings, and thank-yous
                that need to arrive as an object.
              </p>
              <span className="mt-6 inline-block text-sm text-claret">
                From {formatPrice(749)} →
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* ── Corporate ────────────────────────────────────── */}
      <section id="corporate" className="section-bb scroll-mt-28">
        <div className="container-bb grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="serif text-3xl leading-tight text-ink md:text-5xl">
              Corporate &amp; festive
            </h2>
            <p className="mt-6 max-w-[44ch] text-base leading-relaxed text-ink-soft">
              We put aside dedicated production capacity for bulk orders, which
              is the only way to keep them from competing with daily baking.
              Book early for Diwali — festive slots close first.
            </p>

            <ul className="mt-8 flex flex-col gap-3.5">
              {CORPORATE_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft"
                >
                  <Check
                    size={16}
                    className="mt-0.5 shrink-0 text-jade"
                    strokeWidth={2.25}
                  />
                  {point}
                </li>
              ))}
            </ul>

            <EditorialPanel
              from="#6B4A2E"
              to="#2A1409"
              caption="Branded sleeves, 250-box run"
              className="mt-10 aspect-[16/10] w-full"
            />
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="rounded-2xl bg-milk p-7 shadow-[var(--shadow-card)] md:p-9">
              <h3 className="serif text-2xl text-ink">Request a quote</h3>
              <p className="mt-2 text-sm text-ink-soft">
                Tell us the shape of it and we’ll come back with pricing.
              </p>
              <div className="mt-7">
                <CorporateForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Corporate testimonial ────────────────────────── */}
      {/* PLACEHOLDER — invented quote. Replace with a real, attributable
          client testimonial or remove this section before launch. */}
      <section className="border-y border-ink/10 bg-cocoa py-20 md:py-28">
        <div className="container-bb">
          <blockquote className="serif mx-auto max-w-[36ch] text-center text-2xl leading-[1.2] text-milk md:text-5xl">
            “We sent 180 boxes to clients last Diwali. Six of them called to ask
            where we’d found it.”
          </blockquote>
          <p className="mt-8 text-center text-xs uppercase tracking-[0.18em] text-turmeric">
            Placeholder — replace with a real client
          </p>
        </div>
      </section>

      {/* ── Personal boxes ───────────────────────────────── */}
      <section id="personal" className="section-bb scroll-mt-28">
        <div className="container-bb">
          <h2 className="serif text-3xl leading-tight text-ink md:text-5xl">
            Ready-made boxes
          </h2>
          <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-ink-soft">
            Curated, packed, and tied. Tell us the address and the date and we
            handle the rest.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {GIFT_BOXES.map((box) => (
              <article
                key={box.name}
                className="flex flex-col overflow-hidden rounded-2xl bg-milk shadow-[var(--shadow-card)] transition-shadow duration-500 hover:shadow-[var(--shadow-card-lift)]"
              >
                <EditorialPanel
                  from={box.from}
                  to={box.to}
                  rings={false}
                  className="aspect-[4/3] w-full rounded-none"
                />

                <div className="flex flex-1 flex-col p-7">
                  <h3 className="serif text-2xl text-ink">{box.name}</h3>
                  <p className="mt-1.5 text-sm text-ink-soft">{box.note}</p>

                  <ul className="mt-5 flex flex-1 flex-col gap-2">
                    {box.contents.map((c) => (
                      <li
                        key={c}
                        className="flex items-start gap-2.5 text-sm text-ink-soft"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-turmeric" />
                        {c}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 flex items-center justify-between gap-4 border-t border-ink/10 pt-5">
                    <span className="serif text-2xl tabular-nums text-ink">
                      {formatPrice(box.price)}
                    </span>
                    <ButtonLink href="#contact" size="sm" variant="outline">
                      Enquire
                    </ButtonLink>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────── */}
      <section id="contact" className="section-bb scroll-mt-28 bg-milk">
        <div className="container-bb grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 className="serif text-3xl leading-tight text-ink md:text-5xl">
              Get in touch
            </h2>
            <p className="mt-6 max-w-[38ch] text-base leading-relaxed text-ink-soft">
              Questions about a box, a bulk order, or a delivery date. We answer
              within a working day.
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}
