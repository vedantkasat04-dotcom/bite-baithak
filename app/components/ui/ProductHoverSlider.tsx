'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

type Props = {
  images: string[]
  name: string
  sizes?: string
  priority?: boolean
  className?: string
}

export default function ProductHoverSlider({
  images,
  name,
  sizes = '(max-width: 768px) 50vw, 25vw',
  priority,
  className = '',
}: Props) {
  const [active, setActive] = useState(0)
  const [hovering, setHovering] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Cycle while hovering
  useEffect(() => {
    if (!hovering || images.length < 2) return
    const id = setInterval(() => {
      setActive((i) => (i + 1) % images.length)
    }, 1200)
    return () => clearInterval(id)
  }, [hovering, images.length])

  // Reset on hover end
  useEffect(() => {
    if (!hovering) setActive(0)
  }, [hovering])

  // Safari-friendly: use pointer events on the ref instead of React synthetic events
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const enter = () => setHovering(true)
    const leave = () => setHovering(false)
    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    el.addEventListener('mouseenter', enter)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
      el.removeEventListener('mouseenter', enter)
      el.removeEventListener('mouseleave', leave)
    }
  }, [])

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`}>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`${name} — photo ${i + 1}`}
          fill
          sizes={sizes}
          priority={priority && i === 0}
          className={`object-cover transition-opacity duration-500 ease-out ${
            i === active ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? 'w-4 bg-milk' : 'w-1.5 bg-milk/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
