import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative h-[88vh] min-h-[600px] w-full overflow-hidden md:h-screen">
      {/* Background photo */}
      <Image
        src="/hero/slide-1.jpg"
        alt="A three-generation family sharing chai and Bite Baithak cookies in a Rajasthani haveli"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Left-side gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/30 to-transparent md:from-ink/60 md:via-ink/20" />

      {/* Content overlay */}
      <div className="container-bb relative z-10 flex h-full items-center">
        <div className="max-w-xl text-milk">
          <p className="mb-4 text-xs uppercase tracking-[0.32em] text-milk/80 md:text-sm">
            Small batch · Baked fresh
          </p>

          <h1 className="serif text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
            Every bite <br />
            <span className="italic">deserves</span> a baithak.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-milk/85 md:text-lg">
            Handcrafted cookies and savouries — made the way they were meant to be. No palm oil, no preservatives, no shortcuts.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-milk px-7 py-3.5 text-sm font-medium text-ink transition-all hover:bg-turmeric"
            >
              Shop the collection
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
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

      {/* Slide indicator (placeholder — becomes real when more slides land) */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        <span className="h-1 w-8 rounded-full bg-milk" />
        <span className="h-1 w-4 rounded-full bg-milk/30" />
        <span className="h-1 w-4 rounded-full bg-milk/30" />
      </div>
    </section>
  )
}
