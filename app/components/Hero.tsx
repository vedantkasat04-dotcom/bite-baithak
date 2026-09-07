'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ButtonLink } from './ui/Button'

gsap.registerPlugin(ScrollTrigger)

/** All-intra re-encode: every frame is a keyframe, so seeking to an
 *  arbitrary currentTime is cheap. The source file only has keyframes
 *  once per second, which would make the scrub snap in 1s steps. */
const SCRUB_SRC = '/hero-scrub.mp4'
/** Mobile plays straight through, so the smaller original is the right
 *  file there — no seeking, much less data. */
const PLAYBACK_SRC = '/hero.mp4'

const MOBILE_QUERY = '(max-width: 767px)'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const captionRef = useRef<HTMLParagraphElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  const [ready, setReady] = useState(false)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  // Pick the source before anything loads. Runs client-side only, so the
  // server never guesses wrong and causes a hydration mismatch.
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const apply = () => setIsMobile(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  // Load the chosen file and report when it is buffered enough to scrub.
  useEffect(() => {
    const video = videoRef.current
    if (!video || isMobile === null) return

    const src = isMobile ? PLAYBACK_SRC : SCRUB_SRC
    if (!video.src.endsWith(src)) {
      video.src = src
      video.load()
    }

    const markReady = () => setReady(true)

    // readyState 4 = HAVE_ENOUGH_DATA. Check immediately in case the file
    // is already cached and the event fired before this effect attached.
    if (video.readyState >= 4) markReady()
    video.addEventListener('canplaythrough', markReady)
    video.addEventListener('error', markReady) // never trap behind a loader

    // Safety net: some browsers withhold canplaythrough on short files.
    const timeout = window.setTimeout(markReady, 6000)

    return () => {
      video.removeEventListener('canplaythrough', markReady)
      video.removeEventListener('error', markReady)
      window.clearTimeout(timeout)
    }
  }, [isMobile])

  // Scroll-scrub (desktop) / plain playback (mobile).
  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video || !ready) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // ── Desktop: scroll drives currentTime ──────────────────
      mm.add(
        {
          scrub: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        },
        (context) => {
          if (!context.conditions?.scrub) return

          video.pause()
          video.currentTime = 0

          const duration = Number.isFinite(video.duration) ? video.duration : 10

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.5,
            },
          })

          // Position 0, duration 1 — the video spans the whole scroll range.
          tl.to(video, { currentTime: duration, ease: 'none', duration: 1 }, 0)

          // Overlay copy enters at the progress points from the brief.
          tl.fromTo(
            [captionRef.current, headlineRef.current],
            { opacity: 0, y: 34 },
            { opacity: 1, y: 0, duration: 0.12, stagger: 0.03, ease: 'power2.out' },
            0
          )
          tl.fromTo(
            subRef.current,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' },
            0.3
          )
          tl.fromTo(
            ctaRef.current,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' },
            0.6
          )

          // Duration is only trustworthy once metadata has landed; a late
          // refresh keeps the tween end matched to the real length.
          ScrollTrigger.refresh()
        }
      )

      // ── Mobile / reduced motion: no seeking ─────────────────
      mm.add(
        {
          plain: '(max-width: 767px), (prefers-reduced-motion: reduce)',
        },
        (context) => {
          if (!context.conditions?.plain) return

          // Scrubbing a video on mobile is expensive and janky, so it just
          // plays. Autoplay can still be refused — that is non-fatal, the
          // first frame stays on screen.
          video.loop = true
          video.play().catch(() => {})

          gsap.set(
            [captionRef.current, headlineRef.current, subRef.current, ctaRef.current],
            { opacity: 1, y: 0 }
          )
        }
      )
    }, section)

    return () => ctx.revert()
  }, [ready])

  return (
    <section
      ref={sectionRef}
      // 300vh on desktop gives the scrub room; mobile collapses to a single
      // viewport since nothing is being scrubbed.
      className="relative h-[100svh] md:h-[300vh]"
      aria-label="Bite Baithak"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-cocoa">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Warm wash so overlay copy holds contrast over any frame. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(27,15,8,0.72) 0%, rgba(27,15,8,0.28) 38%, rgba(27,15,8,0.06) 62%, rgba(27,15,8,0.20) 100%)',
          }}
        />

        {!ready && (
          <div className="absolute inset-0 grid place-items-center bg-cocoa">
            <div className="flex flex-col items-center gap-4">
              <span className="serif text-3xl text-milk/90">
                Bite <span className="italic">Baithak</span>
              </span>
              <span className="h-px w-16 origin-left animate-pulse bg-turmeric" />
            </div>
          </div>
        )}

        {/* Overlay copy — bottom-left per the brief, clear of a centred
            wordmark reveal at the end of the video. */}
        <div className="container-bb absolute inset-x-0 bottom-0 pb-14 md:pb-20">
          <div className="max-w-[52rem]">
            <p
              ref={captionRef}
              className="text-xs tracking-[0.22em] text-milk/70 uppercase opacity-0"
            >
              Bangalore · Baked fresh
            </p>

            <h1
              ref={headlineRef}
              className="serif mt-5 text-5xl leading-[0.92] text-milk opacity-0 sm:text-6xl md:text-8xl lg:text-9xl"
            >
              Every bite deserves
              <br />
              <span className="italic">a baithak.</span>
            </h1>

            <p
              ref={subRef}
              className="mt-6 max-w-[44ch] text-base leading-relaxed text-milk/80 opacity-0 md:text-lg"
            >
              20 flavours. Pure desi ghee. Zero shortcuts.
            </p>

            <div
              ref={ctaRef}
              className="mt-9 flex flex-wrap gap-3 opacity-0 md:gap-4"
            >
              <ButtonLink href="/shop" size="lg">
                Shop the collection
              </ButtonLink>
              <ButtonLink
                href="/story"
                size="lg"
                variant="outline"
                className="border-milk/40 text-milk hover:border-milk hover:bg-milk/10"
              >
                Our story
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
