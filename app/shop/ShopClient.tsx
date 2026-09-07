'use client'

import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Product, SortKey } from '../lib/supabase'
import { sortProducts, CATEGORY_LABEL } from '../lib/supabase'
import ProductCard from '../components/ProductCard'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'newest', label: 'Newest' },
]

/** Turns a raw flavour value into a chip label. */
const FLAVOUR_LABEL: Record<string, string> = {
  chocolate: 'Chocolate',
  nankhatai: 'Nankhatai',
  jam: 'Jam',
  dryfruit: 'Dry fruit',
  ghee: 'Ghee',
  savoury: 'Savoury',
  fruit: 'Fruit',
  coconut: 'Coconut',
  assorted: 'Assorted',
  nuts: 'Nuts',
  garlic: 'Garlic',
  herb: 'Herb',
  spice: 'Spice',
  cheese: 'Cheese',
}

const label = (f: string) =>
  FLAVOUR_LABEL[f] ?? f.charAt(0).toUpperCase() + f.slice(1)

type Props = {
  products: Product[]
  initialFlavour?: string
  initialCategory?: string
}

export default function ShopClient({
  products,
  initialFlavour,
  initialCategory,
}: Props) {
  const [flavour, setFlavour] = useState<string | null>(
    initialFlavour ?? null
  )
  const [category, setCategory] = useState<string | null>(
    initialCategory ?? null
  )
  const [sort, setSort] = useState<SortKey>('featured')

  // Chips are built from the data, so adding a SKU with a new flavour
  // surfaces a new filter without touching this file.
  const flavours = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of products) {
      if (!p.flavour) continue
      counts.set(p.flavour, (counts.get(p.flavour) ?? 0) + 1)
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }, [products])

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products]
  )

  const visible = useMemo(() => {
    let rows = products
    if (flavour) rows = rows.filter((p) => p.flavour === flavour)
    if (category) rows = rows.filter((p) => p.category === category)
    return sortProducts(rows, sort)
  }, [products, flavour, category, sort])

  const chipClass = (active: boolean) =>
    `shrink-0 rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
      active
        ? 'border-claret bg-claret text-milk'
        : 'border-ink/15 bg-milk text-ink-soft hover:border-ink/40 hover:text-ink'
    }`

  return (
    <>
      <div className="mb-8 flex flex-col gap-5 border-b border-ink/10 pb-6 md:flex-row md:items-center md:justify-between">
        {/* Horizontally scrolling filter rail. */}
        <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 md:mx-0 md:flex-wrap md:px-0">
          <button
            type="button"
            onClick={() => {
              setFlavour(null)
              setCategory(null)
            }}
            className={chipClass(!flavour && !category)}
          >
            All flavours
          </button>

          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCategory(category === c ? null : c)
                setFlavour(null)
              }}
              className={chipClass(category === c)}
            >
              {CATEGORY_LABEL[c] ?? c}
            </button>
          ))}

          {flavours.map(([f, count]) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setFlavour(flavour === f ? null : f)
                setCategory(null)
              }}
              className={chipClass(flavour === f)}
            >
              {label(f)}
              <span className="ml-1.5 text-xs opacity-60">{count}</span>
            </button>
          ))}
        </div>

        <div className="relative shrink-0">
          <label htmlFor="sort" className="sr-only">
            Sort products
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="appearance-none rounded-full border border-ink/15 bg-milk py-2.5 pl-4 pr-10 text-sm text-ink outline-none transition-colors hover:border-ink/40"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-soft"
          />
        </div>
      </div>

      <p className="mb-8 text-sm text-ink-soft">
        {visible.length} {visible.length === 1 ? 'product' : 'products'}
      </p>

      {visible.length === 0 ? (
        <div className="py-24 text-center">
          <p className="serif text-2xl text-ink">Nothing here yet</p>
          <p className="mt-2 text-sm text-ink-soft">
            Try a different flavour.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              priority={i < 3}
              videoPlayback="inview"
            />
          ))}
        </div>
      )}
    </>
  )
}
