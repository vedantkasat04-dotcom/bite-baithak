'use client'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-[#1a0f0a]/95 backdrop-blur-sm border-b border-[#d4af6a]/10' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-[#d4af6a] text-xs tracking-[0.4em]">BITE · BAITHAK</div>
        <div className="flex items-center gap-8">
          <a href="#products" className="text-[#f5e6d3] opacity-60 hover:opacity-100 text-xs tracking-[0.2em] transition-opacity">SHOP</a>
          <a href="#story" className="text-[#f5e6d3] opacity-60 hover:opacity-100 text-xs tracking-[0.2em] transition-opacity">STORY</a>
          <button className="text-[#f5e6d3] opacity-60 hover:opacity-100 text-xs tracking-[0.2em] transition-opacity">
            CART (0)
          </button>
        </div>
      </div>
    </nav>
  )
}