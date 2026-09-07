type Props = {
  /** Two-stop gradient built from the palette; stands in for photography. */
  from: string
  to: string
  className?: string
  caption?: string
  rings?: boolean
}

/** Composed image panel used across the editorial pages until real
 *  photography is dropped in. */
export default function EditorialPanel({
  from,
  to,
  className = '',
  caption,
  rings = true,
}: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background: `radial-gradient(115% 95% at 30% 20%, ${from}, ${to})`,
      }}
    >
      {rings && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="aspect-square w-[68%] rounded-full border border-milk/12" />
          <div className="absolute aspect-square w-[44%] rounded-full border border-turmeric/22" />
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {caption && (
        <p className="accent absolute bottom-5 left-6 text-lg text-milk/65">
          {caption}
        </p>
      )}
    </div>
  )
}
