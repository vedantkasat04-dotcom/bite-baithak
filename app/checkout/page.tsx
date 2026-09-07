import type { Metadata } from 'next'
import Link from 'next/link'
import CheckoutClient from './CheckoutClient'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your Bite Baithak order.',
}

export default function CheckoutPage() {
  return (
    <div className="container-bb py-14 md:py-20">
      <header className="mb-12">
        <Link href="/" className="serif text-2xl text-ink">
          Bite <span className="italic">Baithak</span>
        </Link>
        <h1 className="serif mt-6 text-4xl leading-[0.95] text-ink md:text-6xl">
          Checkout
        </h1>
      </header>

      <CheckoutClient />
    </div>
  )
}
