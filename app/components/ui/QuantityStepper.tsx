'use client'

import { Minus, Plus } from 'lucide-react'
import { MAX_QUANTITY } from '../../lib/store'

type Props = {
  value: number
  onChange: (next: number) => void
  min?: number
  /** Compact variant for cart lines; default suits the product page. */
  size?: 'sm' | 'md'
  label?: string
}

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  size = 'md',
  label = 'Quantity',
}: Props) {
  const pad = size === 'sm' ? 'p-1.5' : 'p-2.5'
  const width = size === 'sm' ? 'w-8' : 'w-12'
  const text = size === 'sm' ? 'text-xs' : 'text-sm'

  return (
    <div
      className="inline-flex items-center rounded-full border border-ink/15 bg-milk"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={`${pad} rounded-full text-ink-soft transition-colors hover:text-claret disabled:opacity-30 disabled:hover:text-ink-soft`}
      >
        <Minus size={size === 'sm' ? 13 : 15} strokeWidth={2} />
      </button>

      <span
        className={`${width} ${text} text-center tabular-nums font-medium text-ink`}
        aria-live="polite"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QUANTITY}
        aria-label="Increase quantity"
        className={`${pad} rounded-full text-ink-soft transition-colors hover:text-claret disabled:opacity-30 disabled:hover:text-ink-soft`}
      >
        <Plus size={size === 'sm' ? 13 : 15} strokeWidth={2} />
      </button>
    </div>
  )
}
