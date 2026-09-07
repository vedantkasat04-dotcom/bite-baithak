'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, ShoppingBag, X } from 'lucide-react'
import { useCart, selectCount } from '../lib/store'
import AnnouncementBar from './AnnouncementBar'

const LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/story', label: 'Story' },
  { href: '/gifting', label: 'Gifting' },
  // The contact form lives at the foot of /gifting — no separate route.
  { href: '/gifting#contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const items = useCart((s) => s.items)
  const hasHydrated = useCart((s) => s.hasHydrated)
  const toggleDrawer = useCart((s) => s.toggleDrawer)

  // Badge stays blank until the persisted cart is read, otherwise the
  // server-rendered 0 and the client value disagree on first paint.
  const count = hasHydrated ? selectCount(items) : 0

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50">
      <AnnouncementBar />

      <nav
        className={`border-b transition-all duration-500 ease-[var(--ease-out-expo)] ${
          scrolled
            ? 'border-ink/10 bg-paper/85 backdrop-blur-md'
            : 'border-transparent bg-paper'
        }`}
      >
        <div className="container-bb flex h-16 items-center justify-between gap-6 md:h-20">
          <Link
            href="/"
            className="serif shrink-0 text-xl text-ink md:text-2xl"
            aria-label="Bite Baithak — home"
          >
            Bite <span className="italic">Baithak</span>
          </Link>

          <ul className="hidden items-center gap-9 md:flex">
            {LINKS.map((link) => {
              const base = link.href.split('#')[0]
              const active =
                link.href.includes('#')
                  ? false // anchor links never own the active state
                  : pathname === base || pathname.startsWith(base + '/')
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative text-sm transition-colors hover:text-claret ${
                      active ? 'text-claret' : 'text-ink-soft'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute -bottom-1.5 left-0 h-px w-full bg-claret" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleDrawer}
              aria-label={`Open cart${count > 0 ? `, ${count} items` : ''}`}
              className="relative rounded-full p-2.5 text-ink transition-colors hover:bg-ink/[0.06]"
            >
              <ShoppingBag size={19} strokeWidth={1.75} />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-claret px-1 text-[10px] font-medium tabular-nums text-milk">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="rounded-full p-2.5 text-ink transition-colors hover:bg-ink/[0.06] md:hidden"
            >
              {mobileOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-ink/10 bg-paper md:hidden">
            <ul className="container-bb flex flex-col py-2">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3.5 text-base text-ink-soft transition-colors hover:text-claret"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
