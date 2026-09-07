import type { Metadata } from 'next'
import { getProducts } from '../lib/supabase'
import CartClient from './CartClient'

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Your Bite Baithak cart.',
}

export const revalidate = 300

export default async function CartPage() {
  const products = await getProducts()
  // Bestsellers make the strongest recommendations; fall back to the head
  // of the catalogue if none are flagged.
  const bestsellers = products.filter((p) => p.is_bestseller)
  const recommendations = (bestsellers.length > 0 ? bestsellers : products).slice(0, 6)

  return (
    <div className="container-bb py-14 md:py-20">
      <header className="mb-12">
        <h1 className="serif text-5xl leading-[0.95] text-ink md:text-7xl">
          Your baithak
        </h1>
      </header>

      <CartClient recommendations={recommendations} />
    </div>
  )
}
