'use client'

import { useEffect, useRef, useState } from 'react'
import ProductTile from './ProductTile'
import { productVideo } from '../../lib/product-media'

type Props = {
  slug: string
  name: string
  heroColor: string
  imageUrl?: string | null
  /** 'auto' plays immediately (few cards on screen, e.g. the home
   *  bestsellers). 'inview' only plays while visible, so a long shop grid
   *  never decodes a dozen videos at once. */
  playback?: 'auto' | 'inview'
  className?: string
  sizes?: string
  priority?: boolean
  rings?: boolean
}

const DEBUG = process.env.NODE_ENV !== 'production'

export default function ProductVideo({
  slug,
  name,
  heroColor,
  imageUrl,
  playback = 'auto',
  className = '',
  sizes,
  priority,
  rings,
}: Props) {
  const src = productVideo(slug)
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [failed, setFailed] = useState(false)
  const [canPlay, setCanPlay] = useState(false)
  // Looping video is motion; honour the OS preference and stay on the tile.
  const [reducedMotion, setReducedMotion] = useState(false)

  // Dev-only: report the resolved path for every card, once per mount.
  useEffect(() => {
    if (!DEBUG) return
    if (src) {
      console.log(`[ProductVideo] "${slug}" → ${src}`)
    } else {
      console.log(
        `[ProductVideo] "${slug}" → no video mapped (gradient fallback). ` +
          `Add an entry in app/lib/product-media.ts to attach one.`
      )
    }
  }, [slug, src])

  // React does not reliably reflect `muted` as a DOM attribute through
  // hydration, and an unmuted video is blocked from autoplaying. Set the
  // property directly so playback cannot silently fail.
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = true
  })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReducedMotion(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const active = Boolean(src) && !failed && !reducedMotion

  // Play/pause with visibility on the shop grid.
  useEffect(() => {
    const video = videoRef.current
    const wrap = wrapRef.current
    if (!active || !video || !wrap) return

    // A refused autoplay is not an error state — there is deliberately no
    // control to fall back to, so swallow it and let the effect re-run on
    // `canPlay` to try again once the browser has enough data.
    const play = async () => {
      try {
        await video.play()
      } catch {
        // Silent. The gradient tile underneath is a complete fallback.
      }
    }

    if (playback === 'auto') {
      play()
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play()
        else video.pause()
      },
      { rootMargin: '200px', threshold: 0.1 }
    )
    io.observe(wrap)
    return () => io.disconnect()
  }, [active, playback, canPlay])

  function handleError() {
    const el = videoRef.current
    const code = el?.error?.code
    const reason =
      code === 1 ? 'aborted'
      : code === 2 ? 'network error'
      : code === 3 ? 'decode error'
      : code === 4 ? 'not found or unsupported format (404?)'
      : 'unknown'

    console.error(
      `[ProductVideo] "${slug}" failed to load ${src} — ${reason}. ` +
        `Falling back to the gradient tile.`
    )
    setFailed(true)
  }

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`}>
      {/* z-0 — the gradient sits underneath. It is both the fallback and
          the cover for the video's first paint, so there is no flash. */}
      <ProductTile
        name={name}
        heroColor={heroColor}
        imageUrl={imageUrl}
        sizes={sizes}
        priority={priority}
        rings={rings}
        className="absolute inset-0 z-0 h-full w-full"
      />

      {/* z-10 — video layers above the gradient. */}
      {active && (
        <video
          ref={videoRef}
          src={src}
          // 'inview' grids stay opt-in so a long shop page does not decode a
          // dozen videos at once; the observer above plays them instead. Either
          // way playback never needs a user gesture.
          autoPlay={playback === 'auto'}
          loop
          muted
          playsInline
          preload="metadata"
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden
          tabIndex={-1}
          onCanPlay={() => {
            if (DEBUG) console.log(`[ProductVideo] "${slug}" playing ${src}`)
            setCanPlay(true)
          }}
          onError={handleError}
          // pointer-events-none — the card is a link to the product, and the
          // video must never become a click-to-play target in front of it.
          className={`pointer-events-none absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-500 ${
            canPlay ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}
