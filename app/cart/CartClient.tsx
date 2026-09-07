'use client'

import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import type { Product } from '../lib/supabase'
import { formatPrice } from '../lib/supabase'
import {
  useCart,
  selectSubtotal,
  selectShipping,
  FREE_SHIPPING_THRESHOLD,
} from '../lib/store'
import ProductTile from '../components/ui/ProductTile'
import QuantityStepper from '../components/ui/QuantityStepper'
import { Button, ButtonLink } from '../components/ui/Button'
import ProductCard from '../components/ProductCard'
import { Input } from '../components/ui/Field'

export default function CartClient({
  recommendations,
}: {
  recommendations: Product[]
}) {
  const items = useCart((s) => s.items)
  const hasHydrated = useCart((s) => s.hasHydrated)
  const updateQuantity = useCart((s) => s.updateQuantity)
  const removeItem = useCart((s) => s.removeItem)
  const [coupon, setCoupon] = useState('')

  // The cart lives in localStorage, so nothing can be rendered honestly
  // until it has been read.
  if (!hasHydrated) {
    return (
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="flex flex-col gap-5 lg:col-span-7">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl bg-milk"
              aria-hidden
            />
          ))}
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <div className="h-64 animate-pulse rounded-2xl bg-milk" aria-hidden />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center md:py-28">
        <div className="relative grid h-32 w-32 place-items-center">
          <div className="absolute inset-0 rounded-full border border-dashed border-ink/20" />
          <div className="absolute inset-5 rounded-full border border-ink/10" />
          <span className="serif text-4xl text-ink-soft/70">₹0</span>
        </div>

        <h2 className="serif mt-8 text-3xl text-ink md:text-4xl">
          Your baithak is empty
        </h2>
        <p className="mt-3 max-w-[34ch] text-base text-ink-soft">
          Twenty flavours are waiting. Start with the ones that go first.
        </p>
        <ButtonLink href="/shop" size="lg" className="mt-8">
          Start shopping
        </ButtonLink>
      </div>
    )
  }

  const subtotal = selectSubtotal(items)
  const shipping = selectShipping(subtotal)
  const total = subtotal + shipping

  function applyCoupon(e: React.FormEvent) {
    e.preventDefault()
    if (!coupon.trim()) return
    // No coupon engine exists yet — this must not fake a discount.
    toast.error('That code isn’t recognised.')
  }

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        {/* ── Line items ─────────────────────────────────── */}
        <div className="lg:col-span-7">
          <ul className="flex flex-col divide-y divide-ink/10 border-y border-ink/10">
            {items.map((item) => (
              <li key={item.key} className="flex gap-5 py-6">
                <Link href={`/product/${item.slug}`} className="shrink-0">
                  <ProductTile
                    name={item.name}
                    heroColor={item.hero_color}
                    imageUrl={item.image_url}
                    rings={false}
                    sizes="112px"
                    className="h-24 w-24 rounded-xl md:h-28 md:w-28"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <Link
                        href={`/product/${item.slug}`}
                        className="serif block truncate text-xl text-ink transition-colors hover:text-claret md:text-2xl"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm text-ink-soft">
                        {item.weight} · {formatPrice(item.price)} each
                      </p>
                    </div>
                    <p className="shrink-0 text-base font-medium tabular-nums text-ink">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <QuantityStepper
                      value={item.quantity}
                      onChange={(q) => updateQuantity(item.key, q)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        removeItem(item.key)
                        toast('Removed from cart')
                      }}
                      className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs text-ink-soft transition-colors hover:text-claret"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/shop"
            className="mt-6 inline-block text-sm text-ink-soft underline-offset-4 transition-colors hover:text-claret hover:underline"
          >
            Continue shopping
          </Link>
        </div>

        {/* ── Summary ────────────────────────────────────── */}
        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="rounded-2xl bg-milk p-7 shadow-[var(--shadow-card)]">
            <h2 className="serif text-2xl text-ink">Order summary</h2>

            <dl className="mt-6 flex flex-col gap-3.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="tabular-nums text-ink">
                  {formatPrice(subtotal)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Shipping</dt>
                <dd className="tabular-nums text-ink">
                  {shipping === 0 ? (
                    <span className="text-jade">Free</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </dd>
              </div>
            </dl>

            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <p className="mt-4 rounded-xl bg-paper px-4 py-3 text-xs leading-relaxed text-ink-soft">
                Add{' '}
                <span className="font-medium text-claret">
                  {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}
                </span>{' '}
                more for free shipping.
              </p>
            )}

            <form onSubmit={applyCoupon} className="mt-6 flex gap-2">
              <label htmlFor="coupon" className="sr-only">
                Coupon code
              </label>
              <Input
                id="coupon"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Coupon code"
                className="bg-paper"
              />
              <Button type="submit" variant="outline" className="shrink-0">
                Apply
              </Button>
            </form>

            <div className="mt-6 flex items-baseline justify-between border-t border-ink/10 pt-5">
              <span className="text-sm text-ink-soft">Total</span>
              <span className="serif text-3xl tabular-nums text-ink">
                {formatPrice(total)}
              </span>
            </div>

            <ButtonLink
              href="/checkout"
              size="lg"
              className="mt-6 w-full"
            >
              Proceed to checkout
            </ButtonLink>
          </div>
        </aside>
      </div>

      {recommendations.length > 0 && (
        <section className="mt-24 md:mt-32">
          <h2 className="serif mb-10 text-3xl text-ink md:text-4xl">
            You may also like
          </h2>
          <div className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 md:mx-0 md:px-0">
            {recommendations.map((p, i) => (
              <div
                key={p.id}
                className="w-[260px] shrink-0 snap-start md:w-[300px]"
              >
                <ProductCard product={p} index={i} videoPlayback="inview" />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
