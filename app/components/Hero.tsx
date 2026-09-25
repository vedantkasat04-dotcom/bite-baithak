'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useCallback, useRef } from 'react'

const SLIDES = [
  {
    src: '/hero/slide-1.png',
    alt: 'Family sharing chai and Bite Baithak cookies in a Rajasthani haveli',
    eyebrow: 'Small batch. Baked fresh.',
    h1: 'Every bite',
    hI: 'deserves',
    h2: 'a baithak.',
    sub: 'Handcrafted cookies and savouries — no palm oil, no preservatives, no shortcuts.',
    cta: 'Shop the collection',
    ctaHref: '/shop',
    sec: 'Our story',
    secHref: '/story',
    pos: 'object-[70%_center] md:object-center',
  },
  {
    src: '/hero/slide-2.png',
    alt: 'Baker in white gloves arranging fresh double chocolate cookies',
    eyebrow: 'Made by hand. Every batch.',
    h1: 'Small batches.',
    hI: 'Never',
    h2: 'mass produced.',
    sub: 'Slow-baked in small trays with real ingredients — the way cookies were meant to be made.',
    cta: 'Meet our bakes',
    ctaHref: '/shop',
    sec: 'Our story',
    secHref: '/story',
    pos: 'object-center',
  },
]

export default function Hero() {
  const [i, setI] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartX = useRef<number | null>(null)

  const go = useCallback((n: number) => setI(((n % SLIDES.length) + SLIDES.length) % SLIDES.length), [])
  const next = useCallback(() => go(i + 1), [i, go])
  const prev = useCallback(() => go(i - 1), [i, go])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(next, 6000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [i, next])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)()
    touchStartX.current = null
  }

  const s = SLIDES[i]

  return (
    <section className="relative w-full" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="relative h-[85vh] min-h-[560px] w-full overflow-hidden md:h-[92vh] md:min-h-[640px]">
        {SLIDES.map((slide, idx) => (
          <div key={slide.src} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === i ? 'opacity-100 z-[1]' : 'opacity-0 z-0'}`}>
            <Image src={slide.src} alt={slide.alt} fill priority={idx === 0} sizes="100vw" className={`object-cover ${slide.pos}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/10 md:bg-gradient-to-r md:from-ink/70 md:via-ink/25 md:to-transparent" />
          </div>
        ))}

        <div className="container-bb absolute inset-0 z-10 flex items-end pb-14 md:items-center md:pb-0">
          <div className="w-full max-w-xl text-milk">
            <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-milk/85 md:text-xs md:tracking-[0.32em]">{s.eyebrow}</p>
            <h1 className="serif text-[42px] leading-[0.95] md:text-6xl lg:text-7xl xl:text-8xl">
              {s.h1} <br className="hidden md:block" />
              <span className="italic">{s.hI}</span> {s.h2}
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-milk/90 md:mt-6 md:text-base lg:text-lg">{s.sub}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-9">
              <Link href={s.ctaHref} className="group inline-flex items-center justify-center gap-2 rounded-full bg-milk px-7 py-3.5 text-sm font-medium text-ink transition-all hover:bg-turmeric">
                {s.cta}<ArrowRight size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link href={s.secHref} className="inline-flex items-center justify-center gap-2 rounded-full border border-milk/40 px-7 py-3.5 text-sm font-medium text-milk backdrop-blur-sm transition-all hover:bg-milk/10">
                {s.sec}
              </Link>
            </div>
          </div>
        </div>

        <button onClick={prev} aria-label="Previous slide" className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-milk/30 bg-ink/20 p-3 text-milk backdrop-blur-md transition hover:bg-ink/40 md:block lg:left-8">
          <ChevronLeft size={20} />
        </button>
        <button onClick={next} aria-label="Next slide" className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-milk/30 bg-ink/20 p-3 text-milk backdrop-blur-md transition hover:bg-ink/40 md:block lg:right-8">
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2 md:bottom-7">
          {SLIDES.map((_, idx) => (
            <button key={idx} onClick={() => go(idx)} aria-label={`Go to slide ${idx + 1}`} className={`h-1 rounded-full transition-all ${idx === i ? 'w-8 bg-milk md:w-10' : 'w-3 bg-milk/40 hover:bg-milk/60 md:w-4'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
