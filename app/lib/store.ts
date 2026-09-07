'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product } from './supabase'

export type CartItem = {
  /** Stable identity: the same product in a different weight is a
   *  separate line, so the key has to include both. */
  key: string
  id: string
  slug: string
  name: string
  price: number
  weight: string
  image_url: string | null
  hero_color: string
  quantity: number
}

export const cartKey = (productId: string, weight: string) =>
  `${productId}::${weight}`

type CartState = {
  items: CartItem[]
  isDrawerOpen: boolean
  hasHydrated: boolean

  addItem: (product: Product, weight?: string, quantity?: number) => void
  removeItem: (key: string) => void
  updateQuantity: (key: string, quantity: number) => void
  clearCart: () => void

  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
  setHasHydrated: (value: boolean) => void
}

export const MAX_QUANTITY = 99

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isDrawerOpen: false,
      hasHydrated: false,

      addItem: (product, weight, quantity = 1) =>
        set((state) => {
          const w = weight ?? product.weight
          const key = cartKey(product.id, w)
          const existing = state.items.find((i) => i.key === key)

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.key === key
                  ? {
                      ...i,
                      quantity: Math.min(i.quantity + quantity, MAX_QUANTITY),
                    }
                  : i
              ),
            }
          }

          return {
            items: [
              ...state.items,
              {
                key,
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                weight: w,
                image_url: product.image_url,
                hero_color: product.hero_color,
                quantity: Math.min(quantity, MAX_QUANTITY),
              },
            ],
          }
        }),

      removeItem: (key) =>
        set((state) => ({ items: state.items.filter((i) => i.key !== key) })),

      updateQuantity: (key, quantity) =>
        set((state) => {
          // Stepping below 1 removes the line rather than stranding a zero.
          if (quantity < 1) {
            return { items: state.items.filter((i) => i.key !== key) }
          }
          return {
            items: state.items.map((i) =>
              i.key === key
                ? { ...i, quantity: Math.min(quantity, MAX_QUANTITY) }
                : i
            ),
          }
        }),

      clearCart: () => set({ items: [] }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'bite-baithak-cart',
      storage: createJSONStorage(() => localStorage),
      // Drawer state is ephemeral — never restore it open on page load.
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        // Fires after localStorage is read (and on read failure), which is
        // the signal that client cart counts are safe to render.
        state?.setHasHydrated(true)
      },
    }
  )
)

/* ── Derived selectors ──────────────────────────────────────────
   Kept as plain functions over `items` so components subscribe to
   the array only and don't re-render on drawer toggles. */

export const selectSubtotal = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.price * i.quantity, 0)

export const selectCount = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.quantity, 0)

/** Free shipping at ₹999; below that a flat ₹79. */
export const FREE_SHIPPING_THRESHOLD = 999
export const FLAT_SHIPPING = 79

export const selectShipping = (subtotal: number) =>
  subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING
