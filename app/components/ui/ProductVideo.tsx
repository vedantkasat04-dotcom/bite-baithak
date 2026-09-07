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
  const [canPlay, setCanPlay] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = true
  })

  useEffect(() => {
    const video = videoRef.current
    const wrap = wrapRef.current
    if (!video || !wrap || !src || failed) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else { video.pause(); video.currentTime = 0 }
      },
      { rootMargin: '300px', threshold: 0 }
    )
    io.observe(wrap)
    return () => io.disconnect()
  }, [src, failed])

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`}>
      <ProductTile name={name} heroColor={heroColor} imageUrl={imageUrl} sizes={sizes} priority={priority} rings={rings} className="absolute inset-0 z-0 h-full w-full" />
      {src && !failed && (
        <video ref={videoRef} src={src} loop muted playsInline preload="auto"
          onCanPlay={() => setCanPlay(true)} onError={() => setFailed(true)}
          className={`absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-500 ${canPlay ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  )
}
