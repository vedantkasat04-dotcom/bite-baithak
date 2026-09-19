'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { Menu, ShoppingBag, X, Search } from 'lucide-react'
import { useCart, selectCount } from '../lib/store'
import AnnouncementBar from './AnnouncementBar'

const LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/story', label: 'Story' },
  { href: '/gifting', label: 'Gifting' },
  { href: '/gifting#contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ name: string; slug: string; price: number; weight: string }[]>([])
  const searchRef = useRef<HTMLInputElement>(null)

  const items = useCart((s) => s.items)
  const hasHydrated = useCart((s) => s.hasHydrated)
  const toggleDrawer = useCart((s) => s.toggleDrawer)
  const count = hasHydrated ? selectCount(items) : 0

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setQuery('')
      setResults([])
    }
  }, [searchOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const timer = setTimeout(async () => {
      const res = await fetch(
        `https://tcqfwdngfkywyrlbsxek.supabase.co/rest/v1/products?name=ilike.*${encodeURIComponent(query)}*&select=name,slug,price,weight&order=sort_order`,
        { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! } }
      )
      const data = await res.json()
      setResults(Array.isArray(data) ? data : [])
    }, 250)
    return () => clearTimeout(timer)
  }, [query])

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
              const active = link.href.includes('#')
                ? false
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
            {/* Search button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="rounded-full p-2.5 text-ink transition-colors hover:bg-ink/[0.06]"
            >
              <Search size={19} strokeWidth={1.75} />
            </button>

            {/* Cart button */}
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

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[80] bg-cocoa/40 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="mx-auto mt-24 max-w-xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 rounded-2xl bg-paper px-5 py-4 shadow-[var(--shadow-card-lift)]">
              <Search size={18} className="shrink-0 text-ink-soft" strokeWidth={1.75} />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cookies, savouries…"
                className="flex-1 bg-transparent text-base text-ink placeholder-ink/30 focus:outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-ink-soft hover:text-ink">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="mt-2 overflow-hidden rounded-2xl bg-paper shadow-[var(--shadow-card-lift)]">
                {results.map((product) => (
                  <Link
                    key={product.slug}
                    href={`/product/${product.slug}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-milk"
                  >
                    <div>
                      <p className="text-sm font-medium text-ink">{product.name}</p>
                      <p className="text-xs text-ink-soft">{product.weight}</p>
                    </div>
                    <p className="text-sm font-medium text-ink">₹{product.price}</p>
                  </Link>
                ))}
              </div>
            )}

            {query && results.length === 0 && (
              <div className="mt-2 rounded-2xl bg-paper px-5 py-6 text-center shadow-[var(--shadow-card-lift)]">
                <p className="text-sm text-ink-soft">No products found for "{query}"</p>
                <Link
                  href="/shop"
                  onClick={() => setSearchOpen(false)}
                  className="mt-3 inline-block text-sm text-claret hover:underline"
                >
                  Browse all products →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
