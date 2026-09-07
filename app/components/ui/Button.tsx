import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

type Variant = 'primary' | 'outline' | 'ghost' | 'ink'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium ' +
  'transition-all duration-300 ease-[var(--ease-out-expo)] ' +
  'disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap'

const variants: Record<Variant, string> = {
  primary: 'bg-claret text-milk hover:bg-claret-dark shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-lift)]',
  outline: 'border border-ink/25 text-ink hover:border-ink hover:bg-ink/[0.04]',
  ghost: 'text-ink-soft hover:text-claret',
  ink: 'bg-ink text-milk hover:bg-cocoa',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-sm md:text-base',
}

export function buttonClass(
  variant: Variant = 'primary',
  size: Size = 'md',
  className = ''
) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`
}

type ButtonProps = ComponentProps<'button'> & {
  variant?: Variant
  size?: Size
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClass(variant, size, className)} {...props}>
      {children}
    </button>
  )
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant
  size?: Size
  children: ReactNode
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonClass(variant, size, className)} {...props}>
      {children}
    </Link>
  )
}
