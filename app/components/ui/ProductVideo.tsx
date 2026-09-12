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
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return
    video.muted = true
    video.load()
    const tryPlay = () => {
      video.muted = true
      video.play().catch(() => {})
    }
    video.addEventListener('loadeddata', tryPlay)
    document.addEventListener('click', tryPlay, { once: true })
    document.addEventListener('touchstart', tryPlay, { once: true })
    return () => {
      video.removeEventListener('loadeddata', tryPlay)
    }
  }, [src])

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
        autoPlay
        onLoadedData={() => setReady(true)}
        className={`absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
