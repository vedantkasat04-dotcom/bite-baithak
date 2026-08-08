'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function BoxScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const lidRef = useRef<HTMLDivElement>(null)
  const cookiesRef = useRef<HTMLDivElement>(null)
  const baithakRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=3000',
          scrub: 1.5,
          pin: true,
          onUpdate: (self) => {
            const p = self.progress
            const captions = [
              { at: 0, text: 'A box arrives.' },
              { at: 0.15, text: 'The lid lifts.' },
              { at: 0.35, text: 'Six moods take flight.' },
              { at: 0.65, text: 'The baithak gathers.' },
              { at: 0.9, text: 'Every bite deserves a baithak.' },
            ]
            let current = captions[0].text
            for (let i = captions.length - 1; i >= 0; i--) {
              if (p >= captions[i].at) { current = captions[i].text; break }
            }
            if (captionRef.current) captionRef.current.textContent = current
          }
        }
      })
      tl.to(lidRef.current, { rotateX: -110, y: -80, opacity: 0, duration: 2, ease: 'power2.inOut' }, 0)
      const cookies = cookiesRef.current?.querySelectorAll('.cookie')
      cookies?.forEach((cookie, i) => {
        const angle = (i / 8) * Math.PI * 2
        const dist = 180 + i * 15
        tl.to(cookie, { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist - 120, rotation: 360 + i * 30, opacity: 1, scale: 1, duration: 2.5, ease: 'power3.out' }, 0.8)
        tl.to(cookie, { x: (i - 4) * 55, y: 80, rotation: (i - 4) * 8, scale: 0.45, duration: 2, ease: 'power2.inOut' }, 3.5)
      })
      tl.to('.bb-box', { opacity: 0, scale: 0.8, duration: 1.5, ease: 'power2.in' }, 2.8)
      tl.to(baithakRef.current, { opacity: 1, y: 0, duration: 2.5, ease: 'power2.out' }, 3.2)
    }, containerRef)
    return () => ctx.revert()
  }, [])

  const cookieColors = ['#4a2c17','#b17d47','#e6c898','#f5ecd8','#d4a675','#c19461','#5c3820','#f7e2ac']

  return (
    <section ref={containerRef} id="story" className="relative w-full h-screen bg-[#1a0f0a] overflow-hidden flex flex-col items-center justify-center">
      <div ref={baithakRef} className="absolute inset-0 opacity-0 translate-y-8 flex flex-col items-center justify-end pb-16">
        <div className="relative w-full max-w-2xl mx-auto">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="w-px h-12 bg-[#d4af6a] opacity-50"/>
            <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[30px] border-l-transparent border-r-transparent border-b-[#d4af6a]"/>
            <div className="w-24 h-4 bg-[#d4af6a] opacity-20 blur-xl rounded-full mt-1"/>
          </div>
          <div className="mt-24 w-full h-3 bg-[#5c3820] rounded-sm shadow-lg"/>
          <div className="flex justify-around mt-2">
            {[0,1,2].map(i => (
              <div key={i} className="w-20 h-20 rounded-full bg-[#f5ecd8] border-2 border-[#e6d5b8] shadow-md flex items-center justify-center">
                <div className="w-12 h-12 rounded-full" style={{background: cookieColors[i*2]}}/>
              </div>
            ))}
          </div>
          <div className="flex justify-around items-end mt-4 px-8">
            <div className="flex flex-col items-center gap-1 opacity-80"><div className="w-10 h-10 rounded-full bg-[#2a1508]"/><div className="w-12 h-16 bg-[#2a1508] rounded-t-full"/></div>
            <div className="flex flex-col items-center gap-1"><div className="w-12 h-12 rounded-full bg-[#1f0f05]"/><div className="w-14 h-20 bg-[#1f0f05] rounded-t-full"/></div>
            <div className="flex flex-col items-center gap-1"><div className="w-11 h-11 rounded-full bg-[#3a1f10]"/><div className="w-16 h-20 bg-[#8b3a4a] rounded-t-full"/></div>
            <div className="flex flex-col items-center gap-1 opacity-75"><div className="w-8 h-8 rounded-full bg-[#3a1f10]"/><div className="w-10 h-14 bg-[#3a1f10] rounded-t-full"/></div>
          </div>
        </div>
      </div>
      <div className="bb-box relative" style={{perspective: '800px'}}>
        <div ref={lidRef} className="absolute -top-6 left-0 right-0 h-8 bg-[#2a1508] border border-[#d4af6a]/20 flex items-center justify-center" style={{transformOrigin: 'bottom center'}}>
          <span className="text-[#d4af6a] text-xs tracking-[0.3em] opacity-60">— The Assorted —</span>
        </div>
        <div className="w-64 h-32 bg-[#3a1f10] border border-[#d4af6a]/30 flex flex-col items-center justify-center gap-2">
          <div className="w-full h-8 bg-[#d4af6a] flex items-center justify-center">
            <span className="text-[#1a0f0a] text-xs tracking-[0.3em] font-medium">BITE · BAITHAK</span>
          </div>
          <span className="text-[#d4af6a] text-xs opacity-50 tracking-wider">Assorted Cookies</span>
        </div>
      </div>
      <div ref={cookiesRef} className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {cookieColors.map((color, i) => (
          <div key={i} className="cookie absolute opacity-0 scale-0" style={{left:'50%',top:'50%',marginLeft:'-24px',marginTop:'-24px'}}>
            <div className="w-12 h-12 rounded-full shadow-lg" style={{background: color}}/>
          </div>
        ))}
      </div>
      <p ref={captionRef} className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[#d4af6a] font-serif italic text-lg text-center">A box arrives.</p>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
        <span className="text-[#f5e6d3] text-xs tracking-[0.3em]">SCROLL</span>
        <div className="w-px h-6 bg-[#d4af6a] animate-pulse"/>
      </div>
    </section>
  )
}
