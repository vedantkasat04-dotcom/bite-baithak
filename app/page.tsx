import { getProducts, getBestsellers } from './lib/supabase'
import Hero from './components/Hero'
import Bestsellers from './components/home/Bestsellers'
import MemoryGame from './components/sections/MemoryGame'
import StoryTeaser from './components/home/StoryTeaser'
import GiftingTeaser from './components/home/GiftingTeaser'
import ProductGridPreview from './components/home/ProductGridPreview'
import Testimonials from './components/home/Testimonials'
import InstagramGrid from './components/home/InstagramGrid'

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
