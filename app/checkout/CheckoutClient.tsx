'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '../lib/store'

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill: { name: string; email: string; contact: string }
  theme: { color: string }
}

interface RazorpayInstance {
  open: () => void
}

interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export default function CheckoutClient() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const [coupon, setCoupon] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [couponError, setCouponError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: ''
  })

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = appliedCoupon ? Math.round(subtotal * appliedCoupon.discount / 100) : 0
  const total = subtotal - discount

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function applyCoupon() {
    if (!coupon.trim()) return
    if (subtotal < 799) { setCouponError('Minimum order ₹799 required'); return }
    const res = await fetch('/api/verify-coupon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const required = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode']
    for (const field of required) {
      if (!form[field as keyof typeof form]) {
        alert(`Please fill in ${field}`)
        return
      }
    }
    if (items.length === 0) { alert('Cart is empty'); return }

    setLoading(true)

    // Load Razorpay script
    if (!window.Razorpay) {
      await new Promise<void>((resolve) => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve()
        document.body.appendChild(script)
      })
    }

    // Create order
    const orderRes = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: total, receipt: `bb_${Date.now()}` })
    })
    const order = await orderRes.json()
    setLoading(false)

    const rzp = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: order.amount,
      currency: 'INR',
      name: 'Bite Baithak',
      description: 'Handcrafted cookies & savouries',
      order_id: order.id,
      handler: async (response: RazorpayResponse) => {
        setLoading(true)
        const verifyRes = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...response,
            orderData: {
              ...form,
              items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
              subtotal,
              discount,
              coupon_code: appliedCoupon?.code || null,
              total,
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
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center">
          <p className="serif text-3xl text-ink mb-4">Your cart is empty</p>
          <a href="/shop" className="rounded-full bg-claret px-8 py-3 text-milk text-sm">Shop now</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Left — Shipping form */}
        <div>
          <h1 className="serif text-3xl text-ink mb-8">Checkout</h1>

          <div className="space-y-4">
            {[
              { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Vedant Kasat' },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 98765 43210' },
              { name: 'address', label: 'Address', type: 'text', placeholder: 'Flat / Street / Area' },
              { name: 'city', label: 'City', type: 'text', placeholder: 'Bangalore' },
              { name: 'state', label: 'State', type: 'text', placeholder: 'Karnataka' },
              { name: 'pincode', label: 'Pincode', type: 'text', placeholder: '560001' },
            ].map(field => (
              <div key={field.name}>
                <label className="block text-xs tracking-widest text-ink-soft mb-1 uppercase">{field.label}</label>
                <input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-parchment bg-milk px-4 py-3 text-ink placeholder-ink/30 focus:border-claret focus:outline-none transition-colors"
                />
              </div>
            ))}
          </div>

          {/* Coupon */}
          <div className="mt-6">
            <label className="block text-xs tracking-widest text-ink-soft mb-1 uppercase">Coupon Code</label>
            <div className="flex gap-2">
              <input
                value={coupon}
                onChange={e => setCoupon(e.target.value)}
                placeholder="BB-XXXX-XXXX"
                className="flex-1 rounded-xl border border-parchment bg-milk px-4 py-3 text-ink placeholder-ink/30 focus:border-claret focus:outline-none transition-colors"
              />
              <button
                onClick={applyCoupon}
                className="rounded-xl bg-ink px-5 py-3 text-sm text-milk hover:bg-claret transition-colors"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
            {appliedCoupon && <p className="text-jade text-xs mt-1">✓ {appliedCoupon.discount}% discount applied!</p>}
          </div>
        </div>

        {/* Right — Order summary */}
        <div>
          <div className="bg-milk rounded-2xl p-6 border border-parchment sticky top-24">
            <h2 className="serif text-xl text-ink mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-paper flex items-center justify-center text-xs text-ink-soft">{item.quantity}×</div>
                  <div className="flex-1">
                    <p className="text-sm text-ink font-medium">{item.name}</p>
                    <p className="text-xs text-ink-soft">{item.weight}</p>
                  </div>
                  <p className="text-sm text-ink">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-parchment pt-4 space-y-2">
              <div className="flex justify-between text-sm text-ink-soft">
                <span>Subtotal</span><span>₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-jade">
                  <span>Discount ({appliedCoupon?.code})</span><span>−₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-ink-soft">
                <span>Shipping</span><span>{subtotal >= 999 ? 'Free' : '₹60'}</span>
              </div>
              <div className="flex justify-between text-lg font-medium text-ink pt-2 border-t border-parchment">
                <span>Total</span><span>₹{total + (subtotal >= 999 ? 0 : 60)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="mt-6 w-full rounded-full bg-claret py-4 text-milk font-medium hover:bg-claret-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Pay ₹${total + (subtotal >= 999 ? 0 : 60)}`}
            </button>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-ink-soft">
              <span>🔒 Secure checkout</span>
              <span>·</span>
              <span>Powered by Razorpay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
