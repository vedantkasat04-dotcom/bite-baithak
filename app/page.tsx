import { getProducts, getBestsellers } from './lib/supabase'
import Hero from './components/Hero'
import Bestsellers from './components/home/Bestsellers'
import dynamic from 'next/dynamic'
const MemoryGame = dynamic(() => import('./components/sections/MemoryGame'))
const StoryTeaser = dynamic(() => import('./components/home/StoryTeaser'))
const GiftingTeaser = dynamic(() => import('./components/home/GiftingTeaser'))
const ProductGridPreview = dynamic(() => import('./components/home/ProductGridPreview'))
const Testimonials = dynamic(() => import('./components/home/Testimonials'))
const InstagramGrid = dynamic(() => import('./components/home/InstagramGrid'))

/** Product data changes without a redeploy, so the home page refreshes
 *  on the same cadence as the shop. */
export const revalidate = 300

export default async function HomePage() {
  const [bestsellers, products] = await Promise.all([
    getBestsellers(4),
    getProducts(),
  ])

  return (
    <>
      <Hero />
      <Bestsellers products={bestsellers} />
      <MemoryGame />
      <StoryTeaser />
      <GiftingTeaser />
      <ProductGridPreview products={products} />
      <Testimonials />
      <InstagramGrid />
    </>
  )
}
