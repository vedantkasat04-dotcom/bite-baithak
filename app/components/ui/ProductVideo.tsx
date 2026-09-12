'use client'

import { useEffect, useRef, useState } from 'react'
import ProductTile from './ProductTile'
import { productVideo } from '../../lib/product-media'

type Props = {
  slug: string
  name: string
  heroColor: string
  imageUrl?: string | null
  playback?: 'auto' | 'inview'
  className?: string
  sizes?: string
  priority?: boolean
  rings?: boolean
}

export default function ProductVideo({ slug, name, heroColor, imageUrl, className = '', sizes, priority, rings }: Props) {
  const src = productVideo(slug)
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const wrap = wrapRef.current
    if (!video || !wrap || !src) return

    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '400px', threshold: 0 }
    )
    io.observe(wrap)
    return () => io.disconnect()
  }, [src])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return
    video.muted = true
    if (visible) {
      video.play().catch(() => {})
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [visible, src])

  if (!src) {
    return (
      <div ref={wrapRef} className={className}>
        <ProductTile name={name} heroColor={heroColor} imageUrl={imageUrl} sizes={sizes} priority={priority} rings={rings} className="h-full w-full" />
      </div>
    )
  }

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`}>
      <ProductTile name={name} heroColor={heroColor} imageUrl={imageUrl} sizes={sizes} priority={priority} rings={rings} className="absolute inset-0 z-0 h-full w-full" />
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 z-10 h-full w-full object-cover"
      />
    </div>
  )
}
