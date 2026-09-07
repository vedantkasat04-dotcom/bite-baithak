'use client'

import { useEffect, useState } from 'react'

export default function CookieCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      if (!visible) setVisible(true)
    }
    const hide = () => setVisible(false)
    const show = () => setVisible(true)

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseleave', hide)
    window.addEventListener('mouseenter', show)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseleave', hide)
      window.removeEventListener('mouseenter', show)
    }
  }, [visible])

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>
      <div
        style={{
          position: 'fixed',
          left: pos.x,
          top: pos.y,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 99999,
          fontSize: '28px',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.2s',
          userSelect: 'none',
          lineHeight: 1,
        }}
      >
        🍪
      </div>
    </>
  )
}
