import Image from 'next/image'
import { supabase } from './lib/supabase'
import { accentFor, imageFor, sortProducts } from './lib/products'
import Navbar from './components/Navbar'
import BoxScene from './components/BoxScene'

export default async function Home() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('in_stock', true)

  const products = sortProducts(data ?? [])

  return (
    <>
      <Navbar />

      {/* ─────────────────────────────────────────────── hero ── */}
      <header
        id="top"
        className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 animate-drift"
          style={{
            background:
              'radial-gradient(ellipse 50% 40% at 50% 30%, rgba(232,135,58,.26), transparent 70%), radial-gradient(ellipse 45% 40% at 20% 80%, rgba(74,140,140,.16), transparent 70%), radial-gradient(ellipse 45% 40% at 82% 72%, rgba(194,69,107,.16), transparent 70%)',
          }}
        />
        <p className="relative text-gold/80 text-[11px] tracking-[0.5em] mb-6">
          SMALL BATCH · BAKED TO ORDER
        </p>
        <h1 className="relative font-display text-5xl sm:text-6xl md:text-7xl font-light leading-[1.05] max-w-4xl">
          <span className="foil">Every bite</span>
          <br />
          <span className="text-cream">deserves a </span>
          <span className="foil italic">baithak</span>
        </h1>
        <p className="relative mt-8 max-w-xl text-cream/60 text-sm leading-relaxed">
          Nankhatai that crumbles the moment it lands. Jam rolls rolled by hand.
          Namkeen built for the third cup of chai. Nine things worth sitting
          down for.
        </p>
        <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#products"
            className="group relative overflow-hidden rounded-sm bg-gradient-to-r from-gold-deep via-gold to-gold-deep px-8 py-3.5 text-[11px] font-medium tracking-[0.3em] text-espresso transition-transform duration-300 hover:scale-[1.03]"
          >
            EXPLORE THE COLLECTION
          </a>
          <a
            href="#story"
            className="rounded-sm border border-gold/40 px-8 py-3.5 text-[11px] tracking-[0.3em] text-gold transition-colors duration-300 hover:bg-gold/10 hover:border-gold/70"
          >
            OUR STORY
          </a>
        </div>
        <div className="relative mt-16 flex items-center gap-8 text-[10px] tracking-[0.3em] text-cream/35">
          <span>PURE GHEE</span>
          <span className="h-3 w-px bg-gold/25" />
          <span>NO PALM OIL</span>
          <span className="h-3 w-px bg-gold/25" />
          <span>BAKED FRESH</span>
        </div>
      </header>

      {/* ──────────────────────────────────── the scroll story ── */}
      <BoxScene />

      {/* ───────────────────────────────────────────── products ── */}
      <main className="relative bg-espresso">
        <section id="products" className="max-w-6xl mx-auto px-6 py-28">
          <p className="text-gold/80 tracking-[0.45em] text-[11px] mb-4 text-center">
            OUR PRODUCTS
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-center text-cream">
            The Baithak Collection
          </h2>
          <div className="rule-fade mx-auto mt-8 mb-16 max-w-md" />

          {error && (
            <p className="text-center text-rose/80 text-sm">
              Couldn&apos;t load the collection right now. Please refresh.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => {
              const accent = accentFor(p)
              return (
                <article
                  key={p.id}
                  className="card-accent group flex flex-col rounded-lg p-5"
                  style={{ ['--accent' as string]: accent }}
                >
                  <div className="relative w-full aspect-square overflow-hidden rounded-md bg-espresso-deep/60">
                    <Image
                      src={imageFor(p)}
                      alt={p.name}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: accent }}
                    />
                    <p
                      className="text-[10px] tracking-[0.3em]"
                      style={{ color: accent }}
                    >
                      {p.category.toUpperCase()}
                    </p>
                  </div>

                  <h3 className="mt-2 font-display text-2xl font-light text-cream">
                    {p.name}
                  </h3>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-cream/50">
                    {p.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-gold/10 pt-4">
                    <p className="font-display text-xl text-gold">
                      &#8377;{p.price}
                    </p>
                    <button
                      type="button"
                      className="rounded-sm border px-4 py-2 text-[10px] tracking-[0.25em] transition-all duration-300"
                      style={{
                        borderColor: `color-mix(in srgb, ${accent} 45%, transparent)`,
                        color: accent,
                      }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* ────────────────────────────────────────────── footer ── */}
        <footer className="border-t border-gold/10 bg-espresso-deep">
          <div className="max-w-6xl mx-auto px-6 py-14 flex flex-col items-center gap-5">
            <p className="text-gold text-[11px] tracking-[0.45em]">
              BITE · BAITHAK
            </p>
            <p className="font-display italic text-cream/55 text-sm">
              Every bite deserves a baithak.
            </p>
            <div className="rule-fade w-full max-w-xs" />
            <p className="text-[10px] tracking-[0.25em] text-cream/25">
              © {new Date().getFullYear()} BITE BAITHAK
            </p>
          </div>
        </footer>
      </main>
    </>
  )
}
