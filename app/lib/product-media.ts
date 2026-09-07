/** Looping product videos, matched to products by slug.
 *
 *  A slug listed here is an intent, not a guarantee — if the file is
 *  missing or fails to decode, ProductVideo falls back to the gradient
 *  tile, so entries can be added before the asset lands.
 *
 *  Files live in /public/products/. */
export const PRODUCT_VIDEOS: Record<string, string> = {
  'double-chocolate': '/products/double-chocolate.mp4',
  'jam-roll-cookies': '/products/jam-roll.mp4',
  nankhatai: '/products/nankhatai.mp4',
  'mix-dry-fruits': '/products/mix-dry-fruits.mp4',
}

export const productVideo = (slug: string): string | undefined =>
  PRODUCT_VIDEOS[slug]
