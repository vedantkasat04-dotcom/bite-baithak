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

export default function ProductVideo({
  slug,
  name,
  heroColor,
  imageUrl,
  className = '',
  sizes,
  priority,
  rings,
}: Props) {
  const src = productVideo(slug)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)
  const [canPlay, setCanPlay] = useState(false)

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = true
  })

  function handlePlay(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!src || failed) return
    setPlaying(true)
    setTimeout(() => {
      videoRef.current?.play().catch(() => {})
    }, 50)
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Gradient tile — always underneath */}
      <ProductTile
        name={name}
        heroColor={heroColor}
        imageUrl={imageUrl}
        sizes={sizes}
        priority={priority}
        rings={rings}
        className="absolute inset-0 z-0 h-full w-full"
      />

      {/* Video — hidden until play is clicked */}
      {src && !failed && (
        <video
          ref={videoRef}
          src={src}
          loop
          muted
          playsInline
          preload="metadata"
          onCanPlay={() => setCanPlay(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-500 ${
            playing && canPlay ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Play button — shows only when not playing */}
      {src && !failed && !playing && (
        <button
          onClick={handlePlay}
          aria-label={`Play ${name} video`}
          className="absolute inset-0 z-20 flex items-center justify-center group"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/20 group-hover:bg-black/60 group-hover:scale-110 transition-all duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-6 h-6 ml-1"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}

      {/* Pause button — shows when playing */}
      {playing && (
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            videoRef.current?.pause()
            setPlaying(false)
          }}
          aria-label="Pause video"
          className="absolute bottom-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/20 hover:bg-black/70 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        </button>
      )}
    </div>
  )
}
