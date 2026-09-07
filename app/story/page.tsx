import type { Metadata } from 'next'
import { ButtonLink } from '../components/ui/Button'
import EditorialPanel from '../components/ui/EditorialPanel'

export const metadata: Metadata = {
  title: 'Story',
  description:
    'How Bite Baithak started, what a baithak means, and who does the baking. Small batches, pure desi ghee, Bangalore.',
}

export default function StoryPage() {
  return (
    <article className="pb-24">
      {/* ── Hero ─────────────────────────────────────────── */}
      <header className="container-bb pt-14 md:pt-20">
        <p className="mb-5 text-xs uppercase tracking-[0.22em] text-ink-soft">
          Our story
        </p>
        <h1 className="serif max-w-[24ch] text-5xl leading-[0.95] text-ink md:text-8xl">
          Twenty flavours, one long argument about ghee.
        </h1>
        <p className="mt-8 max-w-[58ch] text-lg leading-relaxed text-ink-soft">
          Bite Baithak began in a Bangalore kitchen with one recipe and a
          domestic oven that could hold exactly two trays. We have better ovens
          now. The recipe has not moved.
        </p>
      </header>

      <div className="container-bb mt-14 md:mt-20">
        <EditorialPanel
          from="#6B4A2E"
          to="#2A1409"
          caption="Tray no. 2, where it started"
          className="aspect-[16/10] w-full md:aspect-[16/7]"
        />
      </div>

      {/* ── Origin ───────────────────────────────────────── */}
      <section className="section-bb">
        <div className="container-bb grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 className="serif text-3xl leading-tight text-ink md:text-4xl">
              Where it started
            </h2>
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-ink-soft">
              Bangalore
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <p className="text-base leading-relaxed text-ink-soft md:text-lg">
              The first thing we ever sold was nankhatai, and we sold it badly —
              eleven tins to people who already knew us, packed in whatever
              containers were in the cupboard. The recipe came down three
              generations without a single measurement written on paper, which
              meant the first six months were spent turning muscle memory into
              something repeatable.
            </p>
            <p className="mt-6 text-base leading-relaxed text-ink-soft md:text-lg">
              What we found is that most shortcuts in baking are invisible for
              about a week and obvious after two. Palm oil holds its shape
              longer than ghee. Commercial leaveners give you a taller cookie.
              Both cost you the thing people actually remember.
            </p>
          </div>
        </div>
      </section>

      {/* ── Pull quote ───────────────────────────────────── */}
      <section className="border-y border-ink/10 bg-milk py-20 md:py-28">
        <div className="container-bb">
          <blockquote className="serif mx-auto max-w-[38ch] text-center text-3xl leading-[1.15] text-claret md:text-6xl">
            “A baithak is not a room. It is the half hour you give someone
            without checking the time.”
          </blockquote>
        </div>
      </section>

      {/* ── Philosophy ───────────────────────────────────── */}
      <section className="section-bb">
        <div className="container-bb grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <EditorialPanel
            from="#E8B4B8"
            to="#B8767C"
            rings={false}
            caption="Jam rolls, hand-wound"
            className="aspect-[4/5] w-full"
          />

          <div>
            <h2 className="serif text-3xl leading-tight text-ink md:text-5xl">
              The baithak part
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink-soft md:text-lg">
              A baithak is a sitting — the informal kind, where people arrive
              without an occasion and stay past the point they meant to leave.
              Somebody puts out a tin. Somebody else refuses a second one and
              then takes it anyway.
            </p>
            <p className="mt-6 text-base leading-relaxed text-ink-soft md:text-lg">
              That is the whole brief for everything we bake. Not a dessert you
              photograph. Something that keeps a conversation going for another
              twenty minutes.
            </p>
          </div>
        </div>
      </section>

      {/* ── The cookies ──────────────────────────────────── */}
      <section className="section-bb bg-cocoa">
        <div className="container-bb">
          <h2 className="serif max-w-[20ch] text-3xl leading-tight text-milk md:text-5xl">
            What goes in, and what stays out
          </h2>

          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {[
              {
                n: '01',
                h: 'Pure desi ghee',
                p: 'Never palm oil, never vegetable shortening. Ghee gives a shorter crumb and a flavour that survives the third week.',
              },
              {
                n: '02',
                h: 'Small batches',
                p: 'Trays, not production lines. It caps how much we can make in a day, which is the trade we have decided to keep making.',
              },
              {
                n: '03',
                h: 'Baked to order',
                p: 'Nothing sits in a warehouse waiting for demand. Your tin is baked after you order it and shipped within 48 hours.',
              },
            ].map((item) => (
              <div key={item.n}>
                <p className="serif text-5xl text-turmeric">{item.n}</p>
                <h3 className="serif mt-4 text-2xl text-milk">{item.h}</h3>
                <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-milk/70">
                  {item.p}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The makers ───────────────────────────────────── */}
      <section className="section-bb">
        <div className="container-bb grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 className="serif text-3xl leading-tight text-ink md:text-4xl">
              The makers
            </h2>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <p className="text-base leading-relaxed text-ink-soft md:text-lg">
              A small team, most of whom came in knowing how to bake for a
              family and had to learn how to bake for a city. Jam rolls are
              still wound by hand, one at a time, because the machine version
              loses the layers. Nankhatai is still portioned by eye, because the
              scoop makes them uniform in a way that reads as factory.
            </p>
            <p className="mt-6 text-base leading-relaxed text-ink-soft md:text-lg">
              We are not trying to scale past this. We are trying to make the
              next tray as good as the last one.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/shop" size="lg">
                Shop the collection
              </ButtonLink>
              <ButtonLink href="/gifting" size="lg" variant="outline">
                Gifting
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}
