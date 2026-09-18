'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle2, ShoppingBag, Home } from 'lucide-react'

function OrderConfirmedContent() {
  const params = useSearchParams()
  const orderId = params.get('id')

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="mx-auto max-w-md text-center">
        {/* Success icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-jade/10">
          <CheckCircle2 size={40} className="text-jade" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h1 className="serif text-4xl text-ink md:text-5xl">
          Order confirmed!
        </h1>

        <p className="mt-4 text-base leading-relaxed text-ink-soft">
          Thank you for your order. We're baking your cookies fresh and will
          dispatch within 48 hours. A confirmation email is on its way to you.
        </p>

        {orderId && (
          <p className="mt-4 rounded-2xl bg-milk px-5 py-3 text-xs text-ink-soft">
            Order ID: <span className="font-medium text-ink">{orderId}</span>
          </p>
        )}

        {/* Divider */}
        <div className="my-8 border-t border-ink/8" />

        {/* Brand message */}
        <p className="serif text-xl italic text-claret">
          "Every bite deserves a baithak."
        </p>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 rounded-full bg-claret px-6 py-3 text-sm font-medium text-milk transition-colors hover:bg-claret-dark"
          >
            <ShoppingBag size={15} strokeWidth={2} />
            Shop more
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-milk px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-ink/30"
          >
            <Home size={15} strokeWidth={2} />
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[80vh] items-center justify-center"><p className="text-ink-soft">Loading...</p></div>}>
      <OrderConfirmedContent />
    </Suspense>
  )
}
