'use client'
import { useEffect, useState } from 'react'

const LINKS = [
  { href: '#products', label: 'SHOP' },
  { href: '#story', label: 'STORY' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-espresso/90 backdrop-blur-md border-b border-gold/15'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#top" className="foil text-[11px] tracking-[0.45em] font-medium">
          BITE · BAITHAK
        </a>
        <div className="flex items-center gap-7">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative text-cream/60 hover:text-cream text-[10px] tracking-[0.28em] transition-colors duration-300 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
          <button
            type="button"
            className="rounded-sm border border-gold/30 px-3.5 py-1.5 text-[10px] tracking-[0.22em] text-gold transition-colors duration-300 hover:bg-gold/10 hover:border-gold/60"
          >
            CART (0)
          </button>
        </div>
      </div>
    </nav>
  )
}
