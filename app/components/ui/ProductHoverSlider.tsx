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
  const firstChange = useRef(true)

  useEffect(() => {
    if (!hovering || images.length < 2) return
    firstChange.current = true

    // First change is fast (300ms), subsequent are normal (1200ms)
    const tick = () => {
      setActive((i) => (i + 1) % images.length)
      const delay = firstChange.current ? 1200 : 1200
      firstChange.current = false
      timer = setTimeout(tick, delay)
    }

    let timer = setTimeout(tick, 300) // first change after 300ms
    return () => clearTimeout(timer)
  }, [hovering, images.length])

  useEffect(() => {
    if (!hovering) {
      setActive(0)
      firstChange.current = true
    }
  }, [hovering])

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
          className={`object-cover transition-opacity duration-300 ease-out ${
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
