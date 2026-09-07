export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl bg-milk shadow-[var(--shadow-card)]">
      <div className="aspect-[4/5] animate-pulse bg-ink/[0.06]" />
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 animate-pulse rounded bg-ink/[0.06]" />
          <div className="h-3.5 w-1/3 animate-pulse rounded bg-ink/[0.06]" />
        </div>
        <div className="h-5 w-14 animate-pulse rounded bg-ink/[0.06]" />
      </div>
    </div>
  )
}

export function SkeletonGrid({
  count = 6,
  columns = 'sm:grid-cols-2 lg:grid-cols-3',
}: {
  count?: number
  columns?: string
}) {
  return (
    <div
      className={`grid grid-cols-1 gap-6 ${columns}`}
      role="status"
      aria-label="Loading products"
    >
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonLine({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-ink/[0.06] ${className}`} />
  )
}
