'use client'

import { useEffect, useState } from 'react'

const MESSAGES = [
  'Free shipping across India on orders above ₹1299',
  'Baked in small batches — never mass produced',
  'Pure desi ghee. Never palm oil.',
  'Corporate and festive gifting — bulk orders open',
]

const INTERVAL_MS = 4200

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return // Hold on the first message rather than cycling.

    const id = setInterval(
      () => setIndex((i) => (i + 1) % MESSAGES.length),
      INTERVAL_MS
    )
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bg-cocoa text-milk">
      <div className="container-bb flex h-10 items-center justify-center overflow-hidden">
        <p
          key={index}
          className="animate-[bb-rotate-in_0.5s_var(--ease-out-expo)] text-center text-xs tracking-wide"
        >
          {MESSAGES[index]}
        </p>
      </div>
    </div>
  )
}
