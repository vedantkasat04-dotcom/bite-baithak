'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/** Eight moods, foreshadowing the collection's accent palette. */
const COOKIES = [
  { body: '#f0ddb4', edge: '#d9bc85', chip: '#7a5426', label: 'nankhatai' },
  { body: '#ce9a52', edge: '#a9763a', chip: '#6b4517', label: 'ghee atta' },
  { body: '#4a2818', edge: '#2c160c', chip: '#1b0c05', label: 'double chocolate' },
  { body: '#f0e0c4', edge: '#d6be99', chip: '#e0355c', label: 'jam roll' },
  { body: '#f4dfae', edge: '#dcbe83', chip: '#9a63c9', label: 'tooty fruity' },
  { body: '#e0bc72', edge: '#bc9145', chip: '#3a2a12', label: 'ghee namkeen' },
  { body: '#efc97e', edge: '#b07f33', chip: '#7ba05b', label: 'oregano sticks' },
  { body: '#e3c285', edge: '#8e5a22', chip: '#4f7d2f', label: 'garlic toast' },
]

const CAPTIONS = [
  'A box arrives.',
  'The lid lifts.',
  'Eight moods take flight.',
  'The baithak gathers.',
  'Every bite deserves a baithak.',
]

export default function BoxScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const lidRef = useRef<HTMLDivElement>(null)
  const cookiesRef = useRef<HTMLDivElement>(null)
  const baithakRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const mm = gsap.matchMedia()

    mm.add(
      {
        animate: '(prefers-reduced-motion: no-preference)',
        reduced: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const cookies = gsap.utils.toArray<HTMLElement>('.cookie')
        const captions = gsap.utils.toArray<HTMLElement>('.caption')

        // Reduced motion: present the finished tableau, no pin, no scrubbing.
        if (context.conditions?.reduced) {
          gsap.set(lidRef.current, { rotateX: -104, y: -90, opacity: 0 })
          gsap.set(boxRef.current, { opacity: 0, scale: 0.85 })
          gsap.set(baithakRef.current, { opacity: 1, y: 0 })
          gsap.set(hintRef.current, { opacity: 0 })
          cookies.forEach((c, i) => {
            gsap.set(c, { x: (i - 3.5) * 56, y: 10, scale: 0.5, opacity: 1 })
          })
          gsap.set(captions, { opacity: 0 })
          gsap.set(captions[captions.length - 1], { opacity: 1 })
          return
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=3200',
            scrub: 1.2,
            pin: true,
            // Explicit. ScrollTrigger silently drops pin spacing when the
            // pinned element's parent is display:flex — passing `true` forces
            // the spacer regardless of what ancestors do later.
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        tl.to(hintRef.current, { opacity: 0, duration: 0.5 }, 0)
        tl.to(
          lidRef.current,
          { rotateX: -104, y: -90, opacity: 0, duration: 2, ease: 'power2.inOut' },
          0,
        )

        cookies.forEach((cookie, i) => {
          const angle = (i / COOKIES.length) * Math.PI * 2 - Math.PI / 2
          const dist = 180 + (i % 3) * 26
          tl.to(
            cookie,
            {
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist - 110,
              rotation: 300 + i * 34,
              opacity: 1,
              scale: 1,
              duration: 2.5,
              ease: 'power3.out',
            },
            0.8,
          )
          tl.to(
            cookie,
            {
              x: (i - 3.5) * 56,
              y: 10,
              rotation: (i - 3.5) * 7,
              scale: 0.5,
              duration: 2,
              ease: 'power2.inOut',
            },
            3.5,
          )
        })

        tl.to(boxRef.current, { opacity: 0, scale: 0.82, duration: 1.5, ease: 'power2.in' }, 2.8)
        tl.to(baithakRef.current, { opacity: 1, y: 0, duration: 2.5, ease: 'power2.out' }, 3.2)

        // Crossfade captions along the same timeline the visuals ride.
        const step = tl.duration() / CAPTIONS.length
        captions.forEach((cap, i) => {
          if (i > 0) tl.to(cap, { opacity: 1, duration: 0.4 }, i * step)
          if (i < captions.length - 1) tl.to(cap, { opacity: 0, duration: 0.4 }, (i + 1) * step - 0.1)
        })
      },
      containerRef,
    )

    // Web fonts land after first paint and shift layout; stale start/end
    // offsets are the classic cause of a pin that releases early.
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh()
    })

    return () => {
      cancelled = true
      mm.revert()
    }
  }, [])

  return (
    <section
      ref={containerRef}
      id="story"
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-espresso-deep"
    >
      {/* ambient stage light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 animate-drift"
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 50% 38%, rgba(232,135,58,.22), transparent 70%), radial-gradient(ellipse 40% 35% at 78% 70%, rgba(194,69,107,.14), transparent 70%)',
        }}
      />

      {/* ── the baithak: low table, cookies, silhouettes gathered round ── */}
      <div
        ref={baithakRef}
        className="absolute inset-0 opacity-0 translate-y-8 flex items-center justify-center"
      >
        <div className="relative w-full max-w-2xl px-6 translate-y-[90px]">
          {/* overhead warmth — a glow rather than a literal lamp, so the
              settling cookie row has clean air above the table */}
          <div
            aria-hidden
            className="absolute -top-28 left-1/2 -translate-x-1/2 w-72 h-24 rounded-full bg-saffron/30 blur-3xl"
          />
          {/* the low table */}
          <div className="relative w-full h-3 rounded-sm bg-gradient-to-r from-cocoa via-[#6b4327] to-cocoa shadow-[0_14px_36px_-10px_rgba(0,0,0,.85)]" />
          <div className="mx-auto h-2 w-[86%] rounded-b bg-black/50 blur-[2px]" />

          {/* the baithak, seated round it */}
          <div className="mt-3 flex justify-around items-end px-6">
            {[
              { h: 56, w: 40, head: 30, c: '#2a1508', o: 'opacity-70' },
              { h: 74, w: 50, head: 38, c: '#1f0f05', o: 'opacity-95' },
              { h: 72, w: 56, head: 36, c: '#7d3442', o: '' },
              { h: 52, w: 36, head: 28, c: '#3a1f10', o: 'opacity-65' },
            ].map((p, i) => (
              <div key={i} className={`flex flex-col items-center gap-1 ${p.o}`}>
                <div
                  className="rounded-full"
                  style={{ width: p.head, height: p.head, background: '#241207' }}
                />
                <div
                  className="rounded-t-full"
                  style={{ width: p.w, height: p.h, background: p.c }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── the box ── */}
      <div ref={boxRef} className="relative" style={{ perspective: '900px' }}>
        <div
          ref={lidRef}
          className="absolute -top-7 left-0 right-0 h-9 rounded-t-sm bg-gradient-to-b from-espresso-raised to-espresso-soft border border-gold/30 flex items-center justify-center"
          style={{ transformOrigin: 'bottom center' }}
        >
          <span className="text-gold text-[10px] tracking-[0.35em] opacity-70">— THE ASSORTED —</span>
        </div>
        <div className="w-64 h-32 rounded-sm bg-gradient-to-b from-espresso-raised to-[#201007] border border-gold/40 shadow-[0_30px_70px_-25px_rgba(232,135,58,.5)] flex flex-col items-center justify-center gap-2 overflow-hidden">
          <div className="w-full h-8 flex items-center justify-center bg-gradient-to-r from-gold-deep via-gold-bright to-gold-deep">
            <span className="text-espresso text-[11px] tracking-[0.35em] font-medium">BITE · BAITHAK</span>
          </div>
          <span className="text-gold/70 text-[11px] tracking-[0.25em]">Assorted Cookies</span>
        </div>
      </div>

      {/* ── the eight ── */}
      <div ref={cookiesRef} className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {COOKIES.map((c) => (
          <div
            key={c.label}
            className="cookie absolute opacity-0 scale-0"
            style={{ left: '50%', top: '50%', marginLeft: '-26px', marginTop: '-26px' }}
          >
            <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden>
              <circle cx="26" cy="27.5" r="24" fill="#0b0503" opacity=".5" />
              <circle cx="26" cy="26" r="24" fill={c.body} />
              <circle cx="26" cy="26" r="24" fill="none" stroke={c.edge} strokeWidth="2.5" />
              {[
                [18, 19],
                [33, 22],
                [22, 34],
                [34, 33],
                [26, 26],
              ].map(([x, y], k) => (
                <circle key={k} cx={x} cy={y} r={k === 4 ? 2.4 : 3.1} fill={c.chip} opacity=".85" />
              ))}
              <ellipse cx="18" cy="17" rx="8" ry="5" fill="#fff" opacity=".24" transform="rotate(-25 18 17)" />
            </svg>
          </div>
        ))}
      </div>

      {/* ── captions ── */}
      <div className="absolute bottom-16 left-0 right-0 h-8 pointer-events-none">
        {CAPTIONS.map((text, i) => (
          <p
            key={text}
            className="caption absolute inset-x-0 text-center font-display italic text-lg text-gold"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            {text}
          </p>
        ))}
      </div>

      <div ref={hintRef} className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
        <span className="text-cream text-[10px] tracking-[0.35em]">SCROLL</span>
        <div className="w-px h-6 bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  )
}
