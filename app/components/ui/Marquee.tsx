import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Seconds for one full pass. Longer = slower. */
  duration?: number
  reverse?: boolean
  className?: string
}

/** Seamless auto-scroll: the track is duplicated and translated by exactly
 *  -50%, so the loop point is invisible. Pauses on hover, and the
 *  reduced-motion rule in globals.css stops it entirely. */
export default function Marquee({
  children,
  duration = 40,
  reverse = false,
  className = '',
}: Props) {
  return (
    <div className={`group relative overflow-hidden ${className}`}>
      <div
        className="flex w-max animate-[bb-marquee_linear_infinite] group-hover:[animation-play-state:paused]"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        <div className="flex shrink-0 items-stretch">{children}</div>
        <div className="flex shrink-0 items-stretch" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}
