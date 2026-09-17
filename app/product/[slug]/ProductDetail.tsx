'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Check, ShoppingBag, Truck, Leaf, Flame, Droplets } from 'lucide-react'
import type { Product } from '../../lib/supabase'
import { formatPrice, CATEGORY_LABEL } from '../../lib/supabase'
import { useCart } from '../../lib/store'
import ProductTile from '../../components/ui/ProductTile'
import QuantityStepper from '../../components/ui/QuantityStepper'
import { Button } from '../../components/ui/Button'

const TRUST_BADGES = [
  { icon: Leaf, label: 'No Preservatives', sub: 'Always fresh' },
  { icon: Droplets, label: 'No Palm Oil', sub: 'Never, not once' },
  { icon: Flame, label: 'Baked Fresh', sub: 'Small batches only' },
]

export default function ProductDetail({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem)
  const openDrawer = useCart((s) => s.openDrawer)

  const weights = [product.weight]
  const [weight, setWeight] = useState(product.weight)
  const [quantity, setQuantity] = useState(1)

  const images = [product.image_url, ...product.gallery_urls].filter(
    (u): u is string => Boolean(u)
  )
  const [active, setActive] = useState(0)

  function handleAdd() {
    addItem(product, weight, quantity)
    openDrawer()
    toast.success('Added to cart', {
      description: `${product.name} · ${weight} · ${quantity} ${
        quantity === 1 ? 'tin' : 'tins'
      }`,
    })
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
      {/* ── Left: visuals ── */}
      <div>
        <div className="group relative aspect-square overflow-hidden rounded-3xl bg-milk shadow-[var(--shadow-card)]">
          {images.length > 0 ? (
            <Image
              src={images[active]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
            />
          ) : (
            <ProductTile
              name={product.name}
              heroColor={product.hero_color}
              className="h-full w-full"
              priority
            />
          )}

          {product.is_bestseller && (
            <span className="accent absolute left-5 top-5 rounded-full bg-turmeric px-4 py-1.5 text-sm text-ink">
              Bestseller
            </span>
          )}
        </div>

        {images.length > 1 && (
          <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                  i === active
                    ? 'border-claret shadow-sm'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <Image src={src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Right: buy box ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col justify-center lg:pt-2"
      >
        {/* Category + badges row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-[0.22em] text-ink-soft">
            {CATEGORY_LABEL[product.category] ?? product.category}
          </span>
        </div>

        {/* Name */}
        <h1 className="serif mt-3 text-5xl leading-[0.95] text-ink md:text-6xl">
          {product.name}
        </h1>

        {/* Short description */}
        {product.short_description && (
          <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-ink-soft">
            {product.short_description}
          </p>
        )}

        {/* Price */}
        <div className="mt-6 flex items-baseline gap-3">
          <span className="serif text-4xl tabular-nums text-ink">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm text-ink-soft">incl. of all taxes</span>
        </div>

        {/* Trust badges */}
        <div className="mt-7 grid grid-cols-3 gap-3">
          {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 rounded-2xl border border-ink/8 bg-milk px-3 py-4 text-center"
            >
              <Icon size={18} strokeWidth={1.75} className="text-claret" />
              <p className="text-xs font-medium leading-tight text-ink">{label}</p>
              <p className="text-[10px] leading-tight text-ink-soft">{sub}</p>
            </div>
          ))}
        </div>

        {/* Weight selector */}
        <div className="mt-7">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-ink-soft">
            Weight
          </p>
          <div className="flex flex-wrap gap-2">
            {weights.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWeight(w)}
                className={`rounded-full border px-5 py-2.5 text-sm transition-all duration-300 ${
                  weight === w
                    ? 'border-claret bg-claret text-milk'
                    : 'border-ink/15 bg-milk text-ink-soft hover:border-ink/40'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity + Add to bag */}
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <QuantityStepper value={quantity} onChange={setQuantity} />
          <Button
            onClick={handleAdd}
            disabled={!product.in_stock}
            size="lg"
            className="min-w-[200px] flex-1 sm:flex-none"
          >
            <ShoppingBag size={17} strokeWidth={2} />
            {product.in_stock ? 'Add to bag' : 'Sold out'}
          </Button>
        </div>

        {/* Shipping info */}
        <div className="mt-7 flex flex-col gap-2.5 border-t border-ink/10 pt-6 text-sm text-ink-soft">
          {product.in_stock && (
            <p className="flex items-center gap-2.5">
              <Check size={15} className="text-jade" strokeWidth={2.25} />
              In stock — baked to order
            </p>
          )}
          <p className="flex items-center gap-2.5">
            <Truck size={15} strokeWidth={1.75} />
            Free shipping on orders above ₹999
          </p>
        </div>
      </motion.div>
    </div>
  )
}
