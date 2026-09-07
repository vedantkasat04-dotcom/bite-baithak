'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Loader() {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let start = 0
    const duration = 2800
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const p = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(p)
      if (p < 100) {
        requestAnimationFrame(tick)
      } else {
        setTimeout(() => setDone(true), 300)
      }
    }
    requestAnimationFrame(tick)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-paper"
        >
          {/* Brand */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="serif text-3xl text-ink mb-16"
          >
            Bite <em>Baithak</em>
          </motion.p>

          {/* Progress bar with cookie */}
          <div className="w-72 md:w-96 relative">
            {/* Track */}
            <div className="h-px bg-ink/10 w-full relative">
              {/* Fill */}
              <motion.div
                className="absolute left-0 top-0 h-px bg-ink"
                style={{ width: `${progress}%` }}
              />

              {/* Cookie sliding on bar */}
              <motion.div
                className="absolute -top-4 text-2xl"
                style={{ left: `calc(${progress}% - 16px)` }}
              >
                🍪
              </motion.div>
            </div>

            {/* Number */}
            <div className="mt-6 flex justify-between text-xs tracking-[0.3em] text-ink/40">
              <span>BAKING</span>
              <span>{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
