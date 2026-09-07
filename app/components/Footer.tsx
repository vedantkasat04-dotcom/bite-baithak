import Link from 'next/link'
import NewsletterForm from './NewsletterForm'
import InstagramGlyph from './ui/InstagramGlyph'

const SHOP_LINKS = [
  { href: '/shop', label: 'All products' },
  { href: '/shop?flavour=chocolate', label: 'Chocolate' },
  { href: '/shop?flavour=nuts', label: 'Nut cookies' },
  { href: '/shop?category=snacks', label: 'Savouries' },
  { href: '/gifting', label: 'Gift boxes' },
]

const HELP_LINKS = [
  { href: '/story', label: 'Our story' },
  { href: '/gifting#corporate', label: 'Corporate orders' },
  { href: '/gifting#contact', label: 'Contact us' },
  { href: '/cart', label: 'Your cart' },
]

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-milk">
      <div className="container-bb py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="lg:pr-8">
            <Link href="/" className="serif text-2xl text-ink">
              Bite <span className="italic">Baithak</span>
            </Link>
            <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-ink-soft">
              Small-batch cookies and savouries in pure desi ghee. Twenty
              flavours, baked in Bangalore, shipped across India.
            </p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-claret"
            >
              <InstagramGlyph size={16} />
              @bitebaithak
            </a>
          </div>

          <nav aria-labelledby="footer-shop">
            <h3
              id="footer-shop"
              className="text-xs uppercase tracking-[0.18em] text-ink-soft"
            >
              Shop
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {SHOP_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink transition-colors hover:text-claret"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-help">
            <h3
              id="footer-help"
              className="text-xs uppercase tracking-[0.18em] text-ink-soft"
            >
              Help
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {HELP_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink transition-colors hover:text-claret"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-xs uppercase tracking-[0.18em] text-ink-soft">
              Newsletter
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-ink-soft">
              New flavours, restocks, and festive boxes. No more than once a
              month.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-ink/10 pt-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Bite Baithak. All rights reserved.</p>
          <p className="accent text-base text-ink-soft">
            Every Bite Deserves a Baithak
          </p>
        </div>
      </div>
    </footer>
  )
}
