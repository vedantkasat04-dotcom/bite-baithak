import Link from 'next/link'
import { ArrowRight, Building2, Gift } from 'lucide-react'

const CARDS = [
  {
    href: '/gifting#corporate',
    icon: Building2,
    eyebrow: 'For teams',
    title: 'Corporate gifting',
    body: 'Diwali hampers and client boxes, custom-branded, from 25 units. Delivered across India on your schedule.',
    bg: 'linear-gradient(145deg, #3B2117 0%, #5C2E0A 100%)',
    fg: 'text-milk',
    sub: 'text-milk/70',
  },
  {
    href: '/gifting#personal',
    icon: Gift,
    eyebrow: 'For people',
    title: 'Personal gifting',
    body: 'Pre-curated boxes for birthdays, housewarmings, and the friend who feeds you every time you visit.',
    bg: 'linear-gradient(145deg, #E8B4B8 0%, #D99AA0 100%)',
    fg: 'text-ink',
    sub: 'text-ink/70',
  },
]

export default function GiftingTeaser() {
  return (
    <section className="section-bb">
      <div className="container-bb grid gap-6 md:grid-cols-2">
        {CARDS.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-2xl p-8 shadow-[var(--shadow-card)] transition-shadow duration-500 hover:shadow-[var(--shadow-card-lift)] md:min-h-[420px] md:p-10"
              style={{ background: card.bg }}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={card.fg} strokeWidth={1.75} />
                <span
                  className={`text-xs uppercase tracking-[0.22em] ${card.sub}`}
                >
                  {card.eyebrow}
                </span>
              </div>

              <div>
                <h3 className={`serif text-3xl md:text-4xl ${card.fg}`}>
                  {card.title}
                </h3>
                <p
                  className={`mt-4 max-w-[38ch] text-sm leading-relaxed ${card.sub}`}
                >
                  {card.body}
                </p>
                <span
                  className={`mt-7 inline-flex items-center gap-2 text-sm ${card.fg}`}
                >
                  Explore
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
