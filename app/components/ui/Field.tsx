import type { ComponentProps, ReactNode } from 'react'

const control =
  'w-full rounded-xl border border-ink/15 bg-milk px-4 py-3 text-sm text-ink ' +
  'outline-none transition-colors placeholder:text-ink-soft/50 ' +
  'focus:border-claret'

export function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string
  htmlFor: string
  children: ReactNode
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="text-xs uppercase tracking-[0.16em] text-ink-soft"
      >
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-ink-soft/80">{hint}</p>}
    </div>
  )
}

export function Input({ className = '', ...props }: ComponentProps<'input'>) {
  return <input className={`${control} ${className}`} {...props} />
}

export function Textarea({
  className = '',
  ...props
}: ComponentProps<'textarea'>) {
  return <textarea className={`${control} resize-y ${className}`} {...props} />
}

export function Select({ className = '', ...props }: ComponentProps<'select'>) {
  return (
    <select className={`${control} appearance-none ${className}`} {...props} />
  )
}
