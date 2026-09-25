import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative w-full">
      {/* Photo — tall on mobile (portrait crop), wide on desktop */}
      <div className="relative h-[85vh] min-h-[560px] w-full overflow-hidden md:h-[92vh] md:min-h-[640px]">
        <Image
          src="/hero/slide-1.png"
          alt="Family sharing chai and Bite Baithak cookies in a Rajasthani haveli"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center] md:object-center"
        />

        {/* Bottom-to-top gradient — text niche readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/10 md:bg-gradient-to-r md:from-ink/70 md:via-ink/25 md:to-transparent" />

        {/* Text overlay — bottom on mobile, left-center on desktop */}
        <div className="container-bb absolute inset-0 z-10 flex items-end pb-10 md:items-center md:pb-0">
          <div className="w-full max-w-xl text-milk">
            <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-milk/85 md:text-xs md:tracking-[0.32em]">
              Small batch. Baked fresh.
            </p>

            <h1 className="serif text-[42px] leading-[0.95] md:text-6xl lg:text-7xl xl:text-8xl">
              Every bite <br className="hidden md:block" />
              <span className="italic">deserves</span> a baithak.
            </h1>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-milk/90 md:mt-6 md:text-base lg:text-lg">
              Handcrafted cookies and savouries — no palm oil, no preservatives, no shortcuts.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-9">
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-milk px-7 py-3.5 text-sm font-medium text-ink transition-all hover:bg-turmeric"
              >
                Shop the collection
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/story"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-milk/40 px-7 py-3.5 text-sm font-medium text-milk backdrop-blur-sm transition-all hover:bg-milk/10"
              >
                Our story
              </Link>
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 md:bottom-6">
          <span className="h-1 w-6 rounded-full bg-milk md:w-8" />
          <span className="h-1 w-3 rounded-full bg-milk/40 md:w-4" />
          <span className="h-1 w-3 rounded-full bg-milk/40 md:w-4" />
        </div>
      </div>
    </section>
  )
}
