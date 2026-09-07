import Marquee from '../ui/Marquee'

/* ─────────────────────────────────────────────────────────────
   PLACEHOLDER CONTENT — REPLACE BEFORE LAUNCH.
   These are invented quotes, not real customer reviews. Publishing
   fabricated testimonials on a live store misleads shoppers (and is
   actionable under consumer-protection rules). Swap in real, attributable
   quotes — or delete this section — before going live.
   ───────────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  { quote: 'The nankhatai is the closest I have come to my grandmother’s. I ordered four tins the same week.', name: 'Placeholder — replace' },
  { quote: 'Sent the dry fruit box to twelve clients at Diwali. Three of them asked where it was from.', name: 'Placeholder — replace' },
  { quote: 'The cashew pepper is a strange idea that completely works. It disappeared in two days.', name: 'Placeholder — replace' },
  { quote: 'Packaging arrived intact from Bangalore to Guwahati, which I did not expect.', name: 'Placeholder — replace' },
  { quote: 'The lavash is now a standing order. It goes with everything.', name: 'Placeholder — replace' },
]

export default function Testimonials() {
  return (
    <section className="section-bb bg-cocoa">
      <div className="container-bb">
        <div className="mb-10 md:mb-14">
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-milk/60">
            What people say
          </p>
          <h2 className="serif text-3xl leading-tight text-milk md:text-5xl">
            Worth sitting down for
          </h2>
        </div>
      </div>

      <Marquee duration={52}>
        {TESTIMONIALS.map((t, i) => (
          <figure
            key={i}
            className="mx-3 flex w-[320px] shrink-0 flex-col justify-between rounded-2xl bg-milk/[0.06] p-7 backdrop-blur-sm md:w-[400px]"
          >
            <blockquote className="serif text-xl leading-snug text-milk md:text-2xl">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-6 text-xs uppercase tracking-[0.18em] text-turmeric">
              {t.name}
            </figcaption>
          </figure>
        ))}
      </Marquee>
    </section>
  )
}
