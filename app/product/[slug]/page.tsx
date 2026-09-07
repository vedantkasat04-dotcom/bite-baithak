import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import {
  getProductBySlug,
  getProducts,
  getRelatedProducts,
} from '../../lib/supabase'
import ProductDetail from './ProductDetail'
import ProductCard from '../../components/ProductCard'

export const revalidate = 300

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/product/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) return { title: 'Product not found' }

  return {
    title: product.name,
    description:
      product.short_description ??
      `${product.name} — ${product.weight} of small-batch baking from Bite Baithak.`,
  }
}

export default async function ProductPage({
  params,
}: PageProps<'/product/[slug]'>) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const related = await getRelatedProducts(product, 6)

  return (
    <div className="pb-20 pt-8 md:pt-12">
      <div className="container-bb">
        <Link
          href="/shop"
          className="group mb-8 inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-claret"
        >
          <ArrowLeft
            size={15}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          All products
        </Link>

        <ProductDetail product={product} />

        {/* ── Below the fold ───────────────────────────────── */}
        <div className="mt-20 grid gap-12 border-t border-ink/10 pt-14 md:mt-28 md:grid-cols-2 md:gap-16">
          {product.long_description && (
            <div>
              <h2 className="serif text-2xl text-ink md:text-3xl">
                About this one
              </h2>
              <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-ink-soft">
                {product.long_description}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-10">
            {/* Hidden until real ingredient data exists — invented
                ingredient lists would misstate allergens. */}
            {product.ingredients.length > 0 && (
              <div>
                <h2 className="serif text-2xl text-ink md:text-3xl">
                  Ingredients
                </h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {product.ingredients.map((ing) => (
                    <li
                      key={ing}
                      className="rounded-full bg-milk px-4 py-1.5 text-sm text-ink-soft"
                    >
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h2 className="serif text-2xl text-ink md:text-3xl">Storage</h2>
              <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-ink-soft">
                Keep in an airtight container, away from direct sunlight. Best
                within three weeks of opening — though it rarely lasts that
                long.
              </p>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section-bb mt-8">
          <div className="container-bb">
            <h2 className="serif mb-10 text-3xl text-ink md:text-4xl">
              Goes well with
            </h2>
          </div>

          {/* Horizontal rail — swipeable on touch, scrollable on desktop. */}
          <div className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 md:px-12">
            {related.map((p, i) => (
              <div
                key={p.id}
                className="w-[280px] shrink-0 snap-start md:w-[320px]"
              >
                <ProductCard product={p} index={i} videoPlayback="inview" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
