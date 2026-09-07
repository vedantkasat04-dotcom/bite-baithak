'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { ShoppingBag } from 'lucide-react'
import type { Product } from '../lib/supabase'
import { formatPrice } from '../lib/supabase'
import { useCart } from '../lib/store'
import { productDescription } from '../lib/product-copy'
import ProductVideo from './ui/ProductVideo'

type Props = {
  product: Product
  priority?: boolean
  index?: number
  videoPlayback?: 'auto' | 'inview'
  showDescription?: boolean
}

export default function ProductCard({
  product,
  priority,
  index = 0,
  videoPlayback = 'auto',
  showDescription = false,
}: Props) {
  const addItem = useCart((s) => s.addItem)
  const openDrawer = useCart((s) => s.openDrawer)
  const description = showDescription ? productDescription(product) : undefined

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    openDrawer()
    toast.success('Added to cart', {
      description: `${product.name} · ${product.weight}`,
    })
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.06, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group rounded-2xl bg-milk shadow-[var(--shadow-card)] transition-shadow duration-500 hover:shadow-[var(--shadow-card-lift)]"
    >
      {/* ── Video area — NOT a link, just plays inline ── */}
      <div className="relative">
        <ProductVideo
          slug={product.slug}
          name={product.name}
          heroColor={product.hero_color}
          imageUrl={product.image_url}
          priority={priority}
          playback={videoPlayback}
          className="aspect-[4/5] rounded-t-2xl"
        />

        {product.is_bestseller && (
          <span className="accent absolute left-4 top-4 z-20 rounded-full bg-turmeric px-3 py-1 text-sm text-ink">
            Bestseller
          </span>
        )}

        {!product.in_stock && (
          <span className="absolute right-4 top-4 z-20 rounded-full bg-ink/85 px-3 py-1 text-xs text-milk">
            Sold out
          </span>
        )}

        <div className="absolute inset-x-3 bottom-3 z-20 translate-y-2 opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.in_stock}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-claret px-5 py-3 text-sm font-medium text-milk transition-colors hover:bg-claret-dark disabled:opacity-40"
          >
            <ShoppingBag size={15} strokeWidth={2} />
            {product.in_stock ? 'Add to cart' : 'Sold out'}
          </button>
        </div>
      </div>

      {/* ── Info area — IS a link to product page ── */}
      <Link href={`/product/${product.slug}`} className="block p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="serif text-xl leading-snug text-ink">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-ink-soft">{product.weight}</p>
          </div>
          <p className="shrink-0 text-base font-medium tabular-nums text-ink">
            {formatPrice(product.price)}
          </p>
        </div>

        {description && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-soft">
            {description}
          </p>
        )}
      </Link>
    </motion.article>
  )
}
