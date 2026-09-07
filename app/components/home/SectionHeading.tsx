import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type Props = {
  eyebrow?: string
  title: string
  link?: { href: string; label: string }
}

export default function SectionHeading({ eyebrow, title, link }: Props) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
      <div>
        {eyebrow && (
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-ink-soft">
            {eyebrow}
          </p>
        )}
        <h2 className="serif text-3xl leading-tight text-ink md:text-5xl">
          {title}
        </h2>
      </div>

      {link && (
        <Link
          href={link.href}
          className="group inline-flex shrink-0 items-center gap-2 text-sm text-claret transition-colors hover:text-claret-dark"
        >
          {link.label}
          <ArrowRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  )
}
