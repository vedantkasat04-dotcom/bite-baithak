'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Loader() {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const duration = 2600
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const p = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(p)
      if (p < 100) {
        requestAnimationFrame(tick)
      } else {
        setTimeout(() => setDone(true), 400)
      }
    }
    requestAnimationFrame(tick)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-paper"
        >
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-20"
          >
            <p className="serif text-5xl md:text-7xl text-ink tracking-tight">
              Bite <em>Baithak</em>
            </p>
            <p className="mt-3 text-xs tracking-[0.4em] text-ink/30 uppercase">
              Small batch · Baked fresh
            </p>
          </motion.div>

          {/* Progress bar */}
          <div className="w-64 md:w-[420px]">
            <div className="relative h-px bg-ink/10">
              {/* Fill */}
              <div
                className="absolute left-0 top-0 h-px bg-ink/40 transition-none"
                style={{ width: `${progress}%` }}
              />

              {/* Cookie */}
              <div
                className="absolute -top-5 text-3xl md:text-4xl transition-none"
                style={{
                  left: `calc(${progress}% - 20px)`,
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))',
                }}
              >
                🍪
              </div>
            </div>

            {/* Labels */}
            <div className="mt-8 flex justify-between items-center">
              <span className="text-[10px] tracking-[0.4em] text-ink/25 uppercase">Baking</span>
              <span className="serif text-2xl md:text-3xl text-ink/50 tabular-nums">
                {progress}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
