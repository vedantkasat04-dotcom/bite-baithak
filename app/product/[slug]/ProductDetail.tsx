'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Check, ShoppingBag, Truck } from 'lucide-react'
import type { Product } from '../../lib/supabase'
import { formatPrice, CATEGORY_LABEL } from '../../lib/supabase'
import { useCart } from '../../lib/store'
import ProductTile from '../../components/ui/ProductTile'
import QuantityStepper from '../../components/ui/QuantityStepper'
import { Button } from '../../components/ui/Button'

export default function ProductDetail({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem)
  const openDrawer = useCart((s) => s.openDrawer)

  // Data carries one weight per SKU today; the selector is built to take
  // more the moment a product offers them.
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
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      {/* ── Left: visual ─────────────────────────────────── */}
      <div>
        <div className="group relative aspect-square overflow-hidden rounded-2xl bg-milk shadow-[var(--shadow-card)]">
          {images.length > 0 ? (
            <Image
              src={images[active]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-110"
            />
          ) : (
            <ProductTile
              name={product.name}
              heroColor={product.hero_color}
              className="h-full w-full"
              priority
            />
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
                aria-current={i === active}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                  i === active ? 'border-claret' : 'border-transparent'
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Right: buy box ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="lg:pt-4"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs uppercase tracking-[0.22em] text-ink-soft">
            {CATEGORY_LABEL[product.category] ?? product.category}
          </span>
          {product.is_bestseller && (
            <span className="accent rounded-full bg-turmeric px-3 py-0.5 text-sm text-ink">
              Bestseller
            </span>
          )}
        </div>

        <h1 className="serif mt-4 text-5xl leading-[0.95] text-ink md:text-7xl">
          {product.name}
        </h1>

        {product.short_description && (
          <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-ink-soft md:text-lg">
            {product.short_description}
          </p>
        )}

        <p className="mt-7 flex items-baseline gap-3">
          <span className="serif text-4xl tabular-nums text-ink">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm text-ink-soft">incl. of all taxes</span>
        </p>

        <div className="mt-8">
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

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <QuantityStepper value={quantity} onChange={setQuantity} />
          <Button
            onClick={handleAdd}
            disabled={!product.in_stock}
            size="lg"
            className="min-w-[210px] flex-1 sm:flex-none"
          >
            <ShoppingBag size={17} strokeWidth={2} />
            {product.in_stock ? 'Add to bag' : 'Sold out'}
          </Button>
        </div>

        <div className="mt-8 flex flex-col gap-2.5 border-t border-ink/10 pt-7 text-sm text-ink-soft">
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
