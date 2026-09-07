import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/** Surfaces a clear message at boot instead of a confusing runtime failure
 *  deep inside a fetch when the env vars are absent. */
if (!url || !anonKey) {
  throw new Error(
    'Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and ' +
      'NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  )
}

export const supabase = createClient(url, anonKey)

export type Category = 'cookies' | 'snacks'

export type Product = {
  id: string
  sort_order: number
  name: string
  slug: string
  category: Category
  flavour: string
  price: number
  weight: string
  short_description: string | null
  long_description: string | null
  ingredients: string[]
  image_url: string | null
  gallery_urls: string[]
  hero_color: string
  tags: string[]
  in_stock: boolean
  is_bestseller: boolean
  created_at: string
}

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest'

const SELECT = '*'

/** The live table can lag behind this schema (migration 002 adds
 *  `flavour`, `ingredients`, and `gallery_urls`). Normalising on read means
 *  a missing column degrades a filter instead of crashing a render. */
function normalize(row: Record<string, unknown>): Product {
  return {
    ...(row as Product),
    flavour: (row.flavour as string) ?? 'assorted',
    ingredients: (row.ingredients as string[]) ?? [],
    gallery_urls: (row.gallery_urls as string[]) ?? [],
    tags: (row.tags as string[]) ?? [],
  }
}

/** Every fetch below returns data-or-empty rather than throwing, so a
 *  Supabase outage degrades the page instead of blanking the whole route. */
function warn(context: string, message: string) {
  console.error(`[supabase] ${context}: ${message}`)
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(SELECT)
    .order('sort_order', { ascending: true })

  if (error) {
    warn('getProducts', error.message)
    return []
  }
  return (data ?? []).map(normalize)
}

export async function getBestsellers(limit = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(SELECT)
    .eq('is_bestseller', true)
    .order('sort_order', { ascending: true })
    .limit(limit)

  if (error) {
    warn('getBestsellers', error.message)
    return []
  }
  return (data ?? []).map(normalize)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(SELECT)
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    warn('getProductBySlug', error.message)
    return null
  }
  return data ? normalize(data) : null
}

/** Related = same flavour first, topped up with same category. */
export async function getRelatedProducts(
  product: Product,
  limit = 6
): Promise<Product[]> {
  const byFlavour = await supabase
    .from('products')
    .select(SELECT)
    .neq('id', product.id)
    .or(`flavour.eq.${product.flavour},category.eq.${product.category}`)
    .order('sort_order', { ascending: true })
    .limit(limit)

  // Falls back to category alone when the flavour column is not there yet.
  const { data, error } = byFlavour.error
    ? await supabase
        .from('products')
        .select(SELECT)
        .neq('id', product.id)
        .eq('category', product.category)
        .order('sort_order', { ascending: true })
        .limit(limit)
    : byFlavour

  if (error) {
    warn('getRelatedProducts', error.message)
    return []
  }

  const rows = (data ?? []).map(normalize)
  // Same flavour is a stronger signal than same category — float it up.
  return rows.sort((a, b) => {
    const aScore = a.flavour === product.flavour ? 0 : 1
    const bScore = b.flavour === product.flavour ? 0 : 1
    return aScore - bScore || a.sort_order - b.sort_order
  })
}

export function sortProducts(products: Product[], key: SortKey): Product[] {
  const rows = [...products]
  switch (key) {
    case 'price-asc':
      return rows.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return rows.sort((a, b) => b.price - a.price)
    case 'newest':
      return rows.sort(
        (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
      )
    default:
      return rows.sort((a, b) => a.sort_order - b.sort_order)
  }
}

/** ₹1,299 — Indian digit grouping, no decimals on whole rupees. */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value)
}

export const CATEGORY_LABEL: Record<Category, string> = {
  cookies: 'Cookies',
  snacks: 'Savouries',
}
