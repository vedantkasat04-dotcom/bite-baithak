'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Trash2 } from 'lucide-react'
import {
  useCart,
  selectSubtotal,
  selectCount,
  FREE_SHIPPING_THRESHOLD,
} from '../lib/store'
import { formatPrice } from '../lib/supabase'
import ProductTile from './ui/ProductTile'
import QuantityStepper from './ui/QuantityStepper'
import { ButtonLink } from './ui/Button'

export default function CartDrawer() {
  const pathname = usePathname()
  const isOpen = useCart((s) => s.isDrawerOpen)
  const closeDrawer = useCart((s) => s.closeDrawer)
  const items = useCart((s) => s.items)
  const updateQuantity = useCart((s) => s.updateQuantity)
  const removeItem = useCart((s) => s.removeItem)

  // Spec: the drawer appears on every page except checkout, where it would
  // compete with the order summary.
  const hidden = pathname.startsWith('/checkout')

  useEffect(() => {
    if (hidden && isOpen) closeDrawer()
  }, [hidden, isOpen, closeDrawer])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer()
    }
    window.addEventListener('keydown', onKey)

    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [isOpen, closeDrawer])

  if (hidden) return null

  const subtotal = selectSubtotal(items)
  const count = selectCount(items)
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[60] bg-cocoa/40 backdrop-blur-[2px]"
            aria-hidden
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-[70] flex h-[100dvh] w-full max-w-[440px] flex-col bg-paper shadow-[var(--shadow-drawer)]"
          >
            <header className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className="serif text-2xl text-ink">
                Your baithak
                {count > 0 && (
                  <span className="ml-2 text-base text-ink-soft">({count})</span>
                )}
              </h2>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close cart"
                className="rounded-full p-2 text-ink-soft transition-colors hover:bg-ink/[0.06] hover:text-ink"
              >
                <X size={19} />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="grid h-24 w-24 place-items-center rounded-full border border-dashed border-ink/20">
                  <span className="serif text-3xl text-ink-soft">₹0</span>
                </div>
                <p className="serif text-2xl text-ink">Your baithak is empty</p>
                <p className="max-w-[28ch] text-sm text-ink-soft">
                  Twenty flavours are waiting. Start with the bestsellers.
                </p>
                <ButtonLink href="/shop" onClick={closeDrawer} className="mt-2">
                  Start shopping
                </ButtonLink>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  {subtotal < FREE_SHIPPING_THRESHOLD && (
                    <p className="mb-5 rounded-xl bg-milk px-4 py-3 text-xs text-ink-soft">
                      Add{' '}
                      <span className="font-medium text-claret">
                        {formatPrice(remaining)}
                      </span>{' '}
                      more for free shipping.
                    </p>
                  )}

                  <ul className="flex flex-col gap-5">
                    {items.map((item) => (
                      <li key={item.key} className="flex gap-4">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={closeDrawer}
                          className="shrink-0"
                        >
                          <ProductTile
                            name={item.name}
                            heroColor={item.hero_color}
                            imageUrl={item.image_url}
                            rings={false}
                            sizes="80px"
                            className="h-20 w-20 rounded-xl"
                          />
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link
                                href={`/product/${item.slug}`}
                                onClick={closeDrawer}
                                className="serif block truncate text-lg text-ink hover:text-claret"
                              >
                                {item.name}
                              </Link>
                              <p className="text-xs text-ink-soft">
                                {item.weight}
                              </p>
                            </div>
                            <p className="shrink-0 text-sm font-medium tabular-nums text-ink">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <QuantityStepper
                              size="sm"
                              value={item.quantity}
                              onChange={(q) => updateQuantity(item.key, q)}
                            />
                            <button
                              type="button"
                              onClick={() => removeItem(item.key)}
                              aria-label={`Remove ${item.name}`}
                              className="rounded-full p-2 text-ink-soft transition-colors hover:text-claret"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <footer className="border-t border-ink/10 px-6 py-5">
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-sm text-ink-soft">Subtotal</span>
                    <span className="serif text-2xl tabular-nums text-ink">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <p className="mb-4 text-xs text-ink-soft">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <ButtonLink
                    href="/checkout"
                    onClick={closeDrawer}
                    size="lg"
                    className="w-full"
                  >
                    Proceed to checkout
                  </ButtonLink>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="mt-3 w-full text-center text-xs text-ink-soft underline-offset-4 transition-colors hover:text-claret hover:underline"
                  >
                    Continue shopping
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
