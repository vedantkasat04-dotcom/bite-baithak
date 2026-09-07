import type { Product } from '../../lib/supabase'
import ProductCard from '../ProductCard'
import SectionHeading from './SectionHeading'

export default function ProductGridPreview({
  products,
}: {
  products: Product[]
}) {
  if (products.length === 0) return null

  return (
    <section className="section-bb bg-milk">
      <div className="container-bb">
        <SectionHeading
          eyebrow={`${products.length} things to sit down with`}
          title="The full collection"
          link={{ href: '/shop', label: 'Shop all' }}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              videoPlayback="inview"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
