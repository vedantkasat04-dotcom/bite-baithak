import type { Product } from '../../lib/supabase'
import ProductCard from '../ProductCard'
import SectionHeading from './SectionHeading'

export default function Bestsellers({ products }: { products: Product[] }) {
  if (products.length === 0) return null

  return (
    <section className="section-bb">
      <div className="container-bb">
        <SectionHeading
          eyebrow="The ones that go first"
          title="Bestsellers"
          link={{ href: '/shop', label: 'Shop all' }}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              priority={i < 2}
              showDescription
            />
          ))}
        </div>
      </div>
    </section>
  )
}
