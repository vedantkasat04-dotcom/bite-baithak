'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShoppingBag, Tag, CheckCircle2, Truck, Lock } from 'lucide-react'
import { useCart } from '../lib/store'

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

interface RazorpayOptions {
  key: string; amount: number; currency: string; name: string
  description: string; order_id: string; handler: (r: RazorpayResponse) => void
  prefill: { name: string; email: string; contact: string }; theme: { color: string }
}
interface RazorpayInstance { open: () => void }
interface RazorpayResponse {
  razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string
}

const FIELDS = [
  { name: 'name', label: 'Full Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel' },
  { name: 'address', label: 'Delivery Address', type: 'text' },
  { name: 'city', label: 'City', type: 'text' },
  { name: 'state', label: 'State', type: 'text' },
  { name: 'pincode', label: 'Pincode', type: 'text' },
]

export default function CheckoutClient() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [couponError, setCouponError] = useState('')
  const [loading, setLoading] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: ''
  })

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const discount = appliedCoupon ? Math.round(subtotal * appliedCoupon.discount / 100) : 0
  const shipping = subtotal <= 1 ? 0 : subtotal >= 1499 ? 0 : 179
  const total = subtotal - discount + shipping

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function applyCoupon() {
    if (!coupon.trim()) return
    // No minimum order required
    const res = await fetch('/api/verify-coupon', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: coupon.trim().toUpperCase() })
    })
    const data = await res.json()
    if (data.valid) {
      setAppliedCoupon({ code: coupon.trim().toUpperCase(), discount: data.discount_pct })
      setCouponError('')
    } else {
      setCouponError(data.error || 'Invalid or already used coupon')
    }
  }

  async function handleCheckout() {
    for (const f of FIELDS) {
      if (!form[f.name as keyof typeof form]) {
        alert(`Please fill in ${f.label}`); return
      }
    }
    if (items.length === 0) { alert('Cart is empty'); return }
    setLoading(true)

    if (!window.Razorpay) {
      await new Promise<void>(res => {
        const s = document.createElement('script')
        s.src = 'https://checkout.razorpay.com/v1/checkout.js'
        s.onload = () => res()
        document.body.appendChild(s)
      })
    }

    const orderRes = await fetch('/api/create-order', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: total, receipt: `bb_${Date.now()}` })
    })
    const order = await orderRes.json()
    setLoading(false)

    const rzp = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: order.amount, currency: 'INR',
      name: 'Bite Baithak',
      description: 'Handcrafted cookies & savouries',
      order_id: order.id,
      handler: async (response) => {
        setLoading(true)
        const verifyRes = await fetch('/api/verify-payment', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...response,
            orderData: {
              ...form,
              items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
              subtotal, discount, coupon_code: appliedCoupon?.code || null, total,
            }
          })
        })
        const result = await verifyRes.json()
        if (result.success) {
          clearCart()
          router.push(`/order-confirmed?id=${result.order.id}`)
        } else {
          alert('Payment verification failed. Please contact support.')
        }
        setLoading(false)
      },
      prefill: { name: form.name, email: form.email, contact: form.phone },
      theme: { color: '#8B1E2C' },
    })
    rzp.open()
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="text-center">
          <ShoppingBag size={48} className="mx-auto mb-4 text-ink-soft" strokeWidth={1} />
          <p className="serif mb-6 text-3xl text-ink">Your cart is empty</p>
          <a href="/shop" className="rounded-full bg-claret px-8 py-3 text-sm text-milk">Shop now</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_440px]">

          {/* ── Left: form ── */}
          <div>
            {/* Header */}
            <div className="mb-10">
              <p className="mb-1 text-xs uppercase tracking-[0.22em] text-ink-soft">Almost there</p>
              <h1 className="serif text-4xl text-ink md:text-5xl">Delivery details</h1>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {FIELDS.map((field, i) => (
                <div key={field.name} className={field.name === 'address' ? 'sm:col-span-2' : ''}>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-ink-soft">
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    type={field.type}
                    value={form[field.name as keyof typeof form]}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-ink/10 bg-milk px-5 py-4 text-ink placeholder-ink/25 transition-colors focus:border-claret focus:outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="mt-8">
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-ink-soft">
                Coupon Code
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Tag size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
                  <input
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    placeholder="BB-XXXX-XXXX"
                    className="w-full rounded-2xl border border-ink/10 bg-milk py-4 pl-10 pr-5 text-ink placeholder-ink/25 transition-colors focus:border-claret focus:outline-none"
                  />
                </div>
                <button
                  onClick={applyCoupon}
                  className="rounded-2xl bg-ink px-6 py-4 text-sm font-medium text-milk transition-colors hover:bg-claret"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="mt-2 text-xs text-red-500">{couponError}</p>}
              {appliedCoupon && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-jade">
                  <CheckCircle2 size={13} /> {appliedCoupon.discount}% discount applied!
                </p>
              )}
            </div>

            {/* Trust row */}
            <div className="mt-10 flex flex-wrap gap-6 border-t border-ink/8 pt-8 text-xs text-ink-soft">
              <span className="flex items-center gap-2"><Lock size={13} /> Secure 256-bit SSL</span>
              <span className="flex items-center gap-2"><Truck size={13} /> Ships within 2–3 days</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={13} /> 100% fresh guarantee</span>
            </div>
          </div>

          {/* ── Right: order summary ── */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-ink/8 bg-milk shadow-[var(--shadow-card)]">
              {/* Header */}
              <div className="border-b border-ink/8 px-6 py-5">
                <h2 className="serif text-xl text-ink">Order Summary</h2>
              </div>

              {/* Items */}
              <div className="divide-y divide-ink/6 px-6">
                {items.map(item => (
                  <div key={item.key} className="flex items-center gap-4 py-4">
                    {/* Product image */}
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-paper">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-ink-soft">
                          {item.quantity}×
                        </div>
                      )}
                      {/* Quantity badge */}
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-claret text-[10px] font-medium text-milk">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{item.name}</p>
                      <p className="text-xs text-ink-soft">{item.weight}</p>
                    </div>
                    <p className="shrink-0 text-sm font-medium text-ink">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-ink/8 px-6 py-5 space-y-3">
                {subtotal < 1499 && (
                  <p className="rounded-xl bg-paper px-4 py-3 text-xs text-ink-soft">
                    Add <span className="font-medium text-claret">₹{1499 - subtotal}</span> more for free shipping!
                  </p>
                )}
                <div className="flex justify-between text-sm text-ink-soft">
                  <span>Subtotal</span><span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-jade">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>−₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-ink-soft">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-jade">Free</span> : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between border-t border-ink/8 pt-3 text-base font-semibold text-ink">
                  <span>Total</span><span>₹{total}</span>
                </div>
              </div>

              {/* Pay button */}
              <div className="px-6 pb-6">
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-claret py-4 text-base font-medium text-milk transition-all hover:bg-claret-dark disabled:opacity-50"
                >
                  <Lock size={15} strokeWidth={2} />
                  {loading ? 'Processing...' : `Pay ₹${total}`}
                </button>
                <p className="mt-3 text-center text-xs text-ink-soft">
                  🔒 Secure checkout · Powered by Razorpay
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
