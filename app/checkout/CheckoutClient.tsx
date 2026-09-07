'use client'

import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { ShieldCheck, Truck, Sparkles } from 'lucide-react'
import { formatPrice } from '../lib/supabase'
import { useCart, selectSubtotal, selectShipping } from '../lib/store'
import { Field, Input, Textarea, Select } from '../components/ui/Field'
import { Button, ButtonLink } from '../components/ui/Button'
import ProductTile from '../components/ui/ProductTile'

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Lakshadweep', 'Puducherry',
]

const TRUST = [
  { icon: ShieldCheck, label: 'Secure checkout' },
  { icon: Truck, label: 'Free shipping over ₹999' },
  { icon: Sparkles, label: 'Baked fresh' },
]

export default function CheckoutClient() {
  const items = useCart((s) => s.items)
  const hasHydrated = useCart((s) => s.hasHydrated)
  const [pending, setPending] = useState(false)

  const subtotal = selectSubtotal(items)
  const shipping = selectShipping(subtotal)
  const total = subtotal + shipping

  function handlePay(e: React.FormEvent) {
    e.preventDefault()

    /* ── Razorpay integration point ────────────────────────────
       Scaffold only — no keys, no order creation, no payment.
       To finish it:
         1. Add RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET to .env.local
            (secret is server-only — never NEXT_PUBLIC_*).
         2. POST the cart to a route handler that creates a Razorpay
            order server-side and returns { orderId, amount }.
            Amounts must be computed on the server from the database,
            never trusted from this client payload.
         3. Load checkout.razorpay.com/v1/checkout.js and open it with
            the returned orderId.
         4. Verify the payment signature in a webhook before marking
            the order paid.
       ──────────────────────────────────────────────────────── */
    setPending(true)
    setTimeout(() => {
      setPending(false)
      toast.error('Payment isn’t connected yet', {
        description: 'Razorpay is scaffolded but has no keys configured.',
      })
    }, 500)
  }

  if (hasHydrated && items.length === 0) {
    return (
      <div className="py-20 text-center md:py-28">
        <h2 className="serif text-3xl text-ink md:text-4xl">
          Nothing to check out
        </h2>
        <p className="mt-3 text-base text-ink-soft">
          Your baithak is empty.
        </p>
        <ButtonLink href="/shop" size="lg" className="mt-8">
          Start shopping
        </ButtonLink>
      </div>
    )
  }

  return (
    <form onSubmit={handlePay} className="grid gap-10 lg:grid-cols-12 lg:gap-8">
      {/* ── Shipping details ───────────────────────────────── */}
      <div className="lg:col-span-7">
        <h2 className="serif text-2xl text-ink md:text-3xl">Shipping details</h2>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="co-name">
            <Input id="co-name" name="name" required autoComplete="name" />
          </Field>

          <Field label="Email" htmlFor="co-email">
            <Input
              id="co-email"
              name="email"
              type="email"
              required
              autoComplete="email"
            />
          </Field>

          <Field label="Phone" htmlFor="co-phone">
            <Input
              id="co-phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              title="10-digit mobile number"
              required
              autoComplete="tel"
            />
          </Field>

          <Field label="Pincode" htmlFor="co-pincode">
            <Input
              id="co-pincode"
              name="pincode"
              inputMode="numeric"
              pattern="[0-9]{6}"
              title="6-digit pincode"
              required
              autoComplete="postal-code"
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Address" htmlFor="co-address">
              <Textarea
                id="co-address"
                name="address"
                rows={3}
                required
                autoComplete="street-address"
                placeholder="Flat, building, street, area"
              />
            </Field>
          </div>

          <Field label="City" htmlFor="co-city">
            <Input
              id="co-city"
              name="city"
              required
              autoComplete="address-level2"
            />
          </Field>

          <Field label="State" htmlFor="co-state">
            <Select
              id="co-state"
              name="state"
              required
              defaultValue="Karnataka"
              autoComplete="address-level1"
            >
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>

          <div className="sm:col-span-2">
            <Field
              label="Order note"
              htmlFor="co-note"
              hint="Optional — gift message, delivery instructions, a date to hold for."
            >
              <Textarea id="co-note" name="note" rows={3} />
            </Field>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="serif text-2xl text-ink md:text-3xl">Payment</h2>
          <div className="mt-5 flex items-center gap-4 rounded-2xl border border-claret/30 bg-milk p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-claret text-sm font-medium text-milk">
              R
            </span>
            <div>
              <p className="text-sm font-medium text-ink">Razorpay</p>
              <p className="text-xs text-ink-soft">
                UPI, cards, netbanking, and wallets.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky summary ─────────────────────────────────── */}
      <aside className="lg:col-span-4 lg:col-start-9">
        <div className="lg:sticky lg:top-28">
          <div className="rounded-2xl bg-milk p-7 shadow-[var(--shadow-card)]">
            <h2 className="serif text-2xl text-ink">Order summary</h2>

            {!hasHydrated ? (
              <div className="mt-6 h-40 animate-pulse rounded-xl bg-paper" />
            ) : (
              <>
                <ul className="mt-6 flex flex-col gap-4">
                  {items.map((item) => (
                    <li key={item.key} className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        <ProductTile
                          name={item.name}
                          heroColor={item.hero_color}
                          imageUrl={item.image_url}
                          rings={false}
                          sizes="56px"
                          className="h-14 w-14 rounded-lg"
                        />
                        <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] tabular-nums text-milk">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="serif truncate text-base text-ink">
                          {item.name}
                        </p>
                        <p className="text-xs text-ink-soft">{item.weight}</p>
                      </div>

                      <p className="shrink-0 text-sm tabular-nums text-ink">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>

                <dl className="mt-6 flex flex-col gap-3 border-t border-ink/10 pt-5 text-sm">
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

                <div className="mt-5 flex items-baseline justify-between border-t border-ink/10 pt-5">
                  <span className="text-sm text-ink-soft">Total</span>
                  <span className="serif text-3xl tabular-nums text-ink">
                    {formatPrice(total)}
                  </span>
                </div>
              </>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={pending || !hasHydrated}
              className="mt-6 w-full"
            >
              {pending ? 'Opening Razorpay…' : `Pay ${formatPrice(total)}`}
            </Button>

            <Link
              href="/cart"
              className="mt-3 block text-center text-xs text-ink-soft underline-offset-4 transition-colors hover:text-claret hover:underline"
            >
              Back to cart
            </Link>
          </div>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {TRUST.map((t) => {
              const Icon = t.icon
              return (
                <li
                  key={t.label}
                  className="flex items-center gap-2 text-xs text-ink-soft"
                >
                  <Icon size={14} strokeWidth={1.75} />
                  {t.label}
                </li>
              )
            })}
          </ul>
        </div>
      </aside>
    </form>
  )
}
