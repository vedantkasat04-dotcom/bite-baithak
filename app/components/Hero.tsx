'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useCallback, useRef } from 'react'

type Slide = {
  src: string
  alt: string
  eyebrow: string
  title: React.ReactNode
  subtitle: string
  cta: { label: string; href: string }
  secondary?: { label: string; href: string }
  objectPos?: string
}

const SLIDES: Slide[] = [
  {
    src: '/hero/slide-1.png',
    alt: 'Family sharing chai and Bite Baithak cookies in a Rajasthani haveli',
    eyebrow: 'Small batch. Baked fresh.',
    title: (
      <>
        Every bite <br className="hidden md:block" />
        <span className="italic">deserves</span> a baithak.
      </>
    ),
    subtitle: 'Handcrafted cookies and savouries — no palm oil, no preservatives, no shortcuts.',
    cta: { label: 'Shop the collection', href: '/shop' },
    secondary: { label: 'Our story', href: '/story' },
    objectPos: 'object-[70%_center] md:object-center',
  },
  {
    src: '/hero/slide-2.png',
    alt: 'Baker in white gloves arranging fresh double chocolate cookies on a brass thali',
    eyebrow: 'Made by hand. Every batch.',
    title: (
      <>
        Small batches. <br className="hidden md:block" />
        <span className="italic">Never</span> mass produced.
      </>
    ),
    subtitle: 'Slow-baked in small trays with real ingredients — the way cookies were meant to be made.',
    cta: { label: 'Meet our bakes', href: '/shop' },
    secondary: { label: 'Our story', href: '/story' },
    objectPos: 'object-center',
  },
]

const
cd ~/Projects/bite-baithak

# 1. Slide 2 project mein daal (agar already nahi hai)
find ~/Downloads -maxdepth 1 -iname "ChatGPT Image Sep 25*11_53_05*.png" -exec cp {} public/hero/slide-2.png \;
ls -lh public/hero/

# 2. Naya Hero — full slideshow logic (2 slides abhi, 3rd add ho jaayegi later)
cat > app/components/Hero.tsx << 'EOF'
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useCallback, useRef } from 'react'

type Slide = {
  src: string
  alt: string
  eyebrow: string
  title: React.ReactNode
  subtitle: string
  cta: { label: string; href: string }
  secondary?: { label: string; href: string }
  objectPos?: string
}

const SLIDES: Slide[] = [
  {
    src: '/hero/slide-1.png',
    alt: 'Family sharing chai and Bite Baithak cookies in a Rajasthani haveli',
    eyebrow: 'Small batch. Baked fresh.',
    title: (
      <>
        Every bite <br className="hidden md:block" />
        <span className="italic">deserves</span> a baithak.
      </>
    ),
    subtitle: 'Handcrafted cookies and savouries — no palm oil, no preservatives, no shortcuts.',
    cta: { label: 'Shop the collection', href: '/shop' },
    secondary: { label: 'Our story', href: '/story' },
    objectPos: 'object-[70%_center] md:object-center',
  },
  {
    src: '/hero/slide-2.png',
    alt: 'Baker in white gloves arranging fresh double chocolate cookies on a brass thali',
    eyebrow: 'Made by hand. Every batch.',
    title: (
      <>
        Small batches. <br className="hidden md:block" />
        <span className="italic">Never</span> mass produced.
      </>
    ),
    subtitle: 'Slow-baked in small trays with real ingredients — the way cookies were meant to be made.',
    cta: { label: 'Meet our bakes', href: '/shop' },
    secondary: { label: 'Our story', href: '/story' },
    objectPos: 'object-center',
  },
]

const AUTO_ADVANCE_MS = 6000

export default function Hero() {
  const [i, setI] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartX = useRef<number | null>(null)

  const go = useCallback((n: number) => {
    setI((prev) => (n + SLIDES.length) % SLIDES.length)
  }, [])
  const next = useCallback(() => go(i + 1), [i, go])
  const prev = useCallback(() => go(i - 1), [i, go])

  // Auto-advance
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(next, AUTO_ADVANCE_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [i, next])

  // Keyboard arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  // Mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)()
    touchStartX.current = null
  }

  return (
    <section
      className="relative w-full"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      <div className="relative h-[85vh] min-h-[560px] w-full overflow-hidden md:h-[92vh] md:min-h-[640px]">
        {SLIDES.map((s, idx) => (
          <div
            key={s.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === i ? 'opacity-100 z-[1]' : 'opacity-0 z-0'
            }`}
            aria-hidden={idx !== i}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              priority={idx === 0}
              sizes="100vw"
              className={`object-cover ${s.objectPos ?? 'object-center'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/10 md:bg-gradient-to-r md:from-ink/70 md:via-ink/25 md:to-transparent" />
          </div>
        ))}

        {/* Text overlay */}
        <div className="container-bb absolute inset-0 z-10 flex items-end pb-14 md:items-center md:pb-0">
          <div className="w-full max-w-xl text-milk">
            <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-milk/85 md:text-xs md:tracking-[0.32em]">
              {SLIDES[i].eyebrow}
            </p>
            <h1 className="serif text-[42px] leading-[0.95] md:text-6xl lg:text-7xl xl:text-8xl">
              {SLIDES[i].title}
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-milk/90 md:mt-6 md:text-base lg:text-lg">
              {SLIDES[i].subtitle}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-9">
              <Link
                href={SLIDES[i].cta.href}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-milk px-7 py-3.5 text-sm font-medium text-ink transition-all hover:bg-turmeric"
              >
                {SLIDES[i].cta.label}
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              {SLIDES[i].secondary && (
                <Link
                  href={SLIDES[i].secondary!.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-milk/40 px-7 py-3.5 text-sm font-medium text-milk backdrop-blur-sm transition-all hover:bg-milk/10"
                >
                  {SLIDES[i].secondary!.label}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Arrows — desktop only, subtle */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-milk/30 bg-ink/20 p-3 text-milk backdrop-blur-md transition hover:bg-ink/40 md:block lg:left-8"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-milk/30 bg-ink/20 p-3 text-milk backdrop-blur-md transition hover:bg-ink/40 md:block lg:right-8"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2 md:bottom-7">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => go(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1 rounded-full transition-all ${
                idx === i ? 'w-8 bg-milk md:w-10' : 'w-3 bg-milk/40 hover:bg-milk/60 md:w-4'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
