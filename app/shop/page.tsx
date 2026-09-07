import type { Metadata } from 'next'
import { getProducts } from '../lib/supabase'
import ShopClient from './ShopClient'

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'All twenty Bite Baithak cookies and savouries. Pure desi ghee, small batches, shipped across India.',
}

/** Prices and stock change without a redeploy, so the shop revalidates
 *  rather than being frozen at build time. */
export const revalidate = 300

export default async function ShopPage({
  searchParams,
}: PageProps<'/shop'>) {
  const [products, params] = await Promise.all([getProducts(), searchParams])

  const flavour =
    typeof params.flavour === 'string' ? params.flavour : undefined
  const category =
    typeof params.category === 'string' ? params.category : undefined

  return (
    <div className="container-bb py-14 md:py-20">
      <header className="mb-10 md:mb-14">
        <p className="mb-3 text-xs uppercase tracking-[0.22em] text-ink-soft">
          The collection
        </p>
        <h1 className="serif text-5xl leading-[0.95] text-ink md:text-7xl">
          Everything we bake
        </h1>
        <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-ink-soft">
          Sixteen cookies and four savouries, made in small batches. Filter by
          flavour, or start with what sells out first.
        </p>
      </header>

      <ShopClient
        products={products}
        initialFlavour={flavour}
        initialCategory={category}
      />
    </div>
  )
}
