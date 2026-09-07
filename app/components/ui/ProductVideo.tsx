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

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = true
  })

  function handlePlay(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!src) return
    setPlaying(true)
    setTimeout(() => {
      videoRef.current?.play()
    }, 50)
  }

  function handleClose(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    videoRef.current?.pause()
    setPlaying(false)
  }

  return (
    <>
      {/* Card thumbnail */}
      <div className={`relative overflow-hidden ${className}`}>
        <ProductTile
          name={name}
          heroColor={heroColor}
          imageUrl={imageUrl}
          sizes={sizes}
          priority={priority}
          rings={rings}
          className="absolute inset-0 z-0 h-full w-full"
        />

        {/* Play button overlay — only if video exists */}
        {src && !failed && (
          <button
            onClick={handlePlay}
            aria-label={`Play ${name} video`}
            className="absolute inset-0 z-10 flex items-center justify-center group"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/20 group-hover:bg-black/60 transition-all duration-200">
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
      </div>

      {/* Fullscreen modal — renders when playing */}
      {playing && src && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-3xl mx-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute -top-12 right-0 text-white/70 hover:text-white text-sm flex items-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M18.364 5.636a1 1 0 010 1.414L13.414 12l4.95 4.95a1 1 0 01-1.414 1.414L12 13.414l-4.95 4.95a1 1 0 01-1.414-1.414L10.586 12 5.636 7.05a1 1 0 011.414-1.414L12 10.586l4.95-4.95a1 1 0 011.414 0z"/>
              </svg>
              Close
            </button>

            {/* Video */}
            <video
              ref={videoRef}
              src={src}
              controls
              playsInline
              muted={false}
              onError={() => setFailed(true)}
              className="w-full rounded-xl shadow-2xl"
            />

            {/* Product name below */}
            <p className="text-white/70 text-center mt-4 text-sm tracking-wide">
              {name}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
