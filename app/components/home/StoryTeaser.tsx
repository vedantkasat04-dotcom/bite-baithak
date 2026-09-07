import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function StoryTeaser() {
  return (
    <section className="section-bb bg-milk">
      <div className="container-bb grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Composed panel stands in for the kitchen photograph. */}
        <div
          className="relative aspect-[4/5] overflow-hidden rounded-2xl lg:aspect-square"
          style={{
            background:
              'radial-gradient(110% 90% at 30% 20%, #6B4A2E, #3B2117 60%, #2A1409)',
          }}
        >
          <div className="absolute inset-0 grid place-items-center">
            <div className="aspect-square w-[70%] rounded-full border border-turmeric/25" />
            <div className="absolute aspect-square w-[48%] rounded-full border border-milk/15" />
          </div>
          <div
            className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
          <p className="accent absolute bottom-6 left-6 text-xl text-milk/70">
            Batch no. 41
          </p>
        </div>

        <div>
          <p className="mb-6 text-xs uppercase tracking-[0.22em] text-ink-soft">
            Our story
          </p>
          <blockquote className="serif text-3xl leading-[1.15] text-ink md:text-5xl">
            “A baithak is not a room. It is the half hour you give someone
            without checking the time.”
          </blockquote>
          <p className="mt-8 max-w-[46ch] text-base leading-relaxed text-ink-soft">
            We started with one recipe, a domestic oven, and an argument about
            how much ghee is too much ghee. Twenty flavours later, the answer is
            still the same: slightly more than you think.
          </p>
          <Link
            href="/story"
            className="group mt-8 inline-flex items-center gap-2 text-sm text-claret transition-colors hover:text-claret-dark"
          >
            Read our story
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}
