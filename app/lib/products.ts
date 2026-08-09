import type { Product } from './supabase'

/**
 * Per-product accent hue. Drives the card aura, border and category chip so
 * each product owns a colour while the espresso/gold shell stays constant.
 */
const ACCENT_BY_SLUG: Record<string, string> = {
  'assorted-cookies': '#d4af6a',
  nankhatai: '#e8a33a',
  'ghee-atta-cookies': '#c98a3c',
  'double-chocolate-cookies': '#8b4a2b',
  'jam-roll-cookies': '#c2456b',
  'tooty-fruity-cookies': '#9a63c9',
  'ghee-namkeen-cookies': '#4a8c8c',
  'oregano-lavish-sticks': '#7ba05b',
  'garlic-toast': '#e8873a',
}

const ACCENT_BY_CATEGORY: Record<string, string> = {
  cookies: '#d4af6a',
  namkeen: '#4a8c8c',
  snacks: '#7ba05b',
}

export function accentFor(p: Pick<Product, 'slug' | 'category'>): string {
  return ACCENT_BY_SLUG[p.slug] ?? ACCENT_BY_CATEGORY[p.category] ?? '#d4af6a'
}

/**
 * Hosts that only ever held placeholder URLs. A dead `image_url` renders as a
 * broken image, so fall back to the bundled illustration instead of trusting it.
 */
const DEAD_PLACEHOLDER = /(^|\/\/)i\.imgur\.com\/placeholder/i

export function imageFor(p: Pick<Product, 'slug' | 'image_url'>): string {
  const url = p.image_url?.trim()
  if (url && !DEAD_PLACEHOLDER.test(url)) return url
  return `/products/${p.slug}.svg`
}

/** Display order: hero box first, then cookies, namkeen, snacks. */
const CATEGORY_ORDER = ['cookies', 'namkeen', 'snacks']

export function sortProducts(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    if (a.slug === 'assorted-cookies') return -1
    if (b.slug === 'assorted-cookies') return 1
    const c =
      CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
    return c !== 0 ? c : b.price - a.price
  })
}
