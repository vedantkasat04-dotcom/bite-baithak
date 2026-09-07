import Image from 'next/image'
import { shade, alpha, readableOn } from '../../lib/color'

type Props = {
  name: string
  heroColor: string
  imageUrl?: string | null
  /** Tin-lid rings are decorative; drop them on very small tiles. */
  rings?: boolean
  className?: string
  sizes?: string
  priority?: boolean
}

/** Renders real photography when `imageUrl` is set, and a composed
 *  colour-field tile built from the product's own accent hex when it
 *  isn't. Swapping in photos later needs no component changes. */
export default function ProductTile({
  name,
  heroColor,
  imageUrl,
  rings = true,
  className = '',
  sizes = '(max-width: 768px) 100vw, 33vw',
  priority = false,
}: Props) {
  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
      </div>
    )
  }

  const ink = readableOn(heroColor)

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 100% at 28% 22%, ${shade(heroColor, 0.28)}, ${heroColor} 62%, ${shade(heroColor, -0.22)})`,
      }}
      aria-hidden
    >
      {rings && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div
            className="aspect-square w-[78%] rounded-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
            style={{ border: `1px solid ${alpha('#FAF5E8', 0.16)}` }}
          />
          <div
            className="absolute aspect-square w-[58%] rounded-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-110"
            style={{ border: `1px solid ${alpha('#FAF5E8', 0.12)}` }}
          />
          <div
            className="absolute aspect-square w-[38%] rounded-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.15]"
            style={{ border: `1px solid ${alpha('#D4A017', 0.28)}` }}
          />
        </div>
      )}

      {/* Product name set into the tile, so a photo-less card still reads. */}
      <div className="absolute inset-0 grid place-items-center px-6 text-center">
        <span
          className="serif text-2xl leading-tight md:text-[28px]"
          style={{ color: ink }}
        >
          {name}
        </span>
      </div>

      {/* Warm grain — keeps flat colour from looking like a CSS swatch. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  )
}
