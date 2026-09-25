import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative w-full">
      <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[21/9]">
        <Image
          src="/hero/slide-1.png"
          alt="Family sharing chai and Bite Baithak cookies in a Rajasthani haveli"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 hidden bg-gradient-to-r from-ink/55 via-ink/15 to-transparent md:block" />

        <div className="container-bb absolute inset-0 z-10 hidden items-center md:flex">
          <div className="max-w-xl text-milk">
            <p className="mb-4 text-xs uppercase tracking-[0.32em] text-milk/85">
              Small batch. Baked fresh.
            </p>
            <h1 className="serif text-5xl leading-[0.95] lg:text-7xl xl:text-8xl">
              Every bite <br />
              <span className="italic">deserves</span> a baithak.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-milk/90 lg:text-lg">
              Handcrafted cookies and savouries — no palm oil, no preservatives, no shortcuts.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-milk px-7 py-3.5 text-sm font-medium text-ink transition-all hover:bg-turmeric"
              >
                Shop the collection
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/story"
                className="inline-flex items-center gap-2 rounded-full border border-milk/40 px-7 py-3.5 text-sm font-medium text-milk backdrop-blur-sm transition-all hover:bg-milk/10"
              >
                Our story
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 md:bottom-8">
          <span className="h-1 w-6 rounded-full bg-milk md:w-8" />
          <span className="h-1 w-3 rounded-full bg-milk/40 md:w-4" />
          <span className="h-1 w-3 rounded-full bg-milk/40 md:w-4" />
        </div>
      </div>

      <div className="bg-paper px-6 py-10 text-center md:hidden">
        <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-ink-soft">
          Small batch. Baked fresh.
        </p>
        <h1 className="serif text-4xl leading-[0.98] text-ink">
          Every bite <span className="italic">deserves</span> a baithak.
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
          Handcrafted cookies and savouries — no palm oil, no preservatives, no shortcuts.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-claret px-6 py-3.5 text-sm font-medium text-milk"
          >
            Shop the collection
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/story"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 text-sm font-medium text-ink"
          >
            Our story
          </Link>
        </div>
      </div>
    </section>
  )
}
