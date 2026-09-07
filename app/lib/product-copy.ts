/** Card-length copy for the home bestsellers.
 *
 *  These four override `short_description`, because the column holds one-line
 *  taglines ("Deep cocoa, twice the crunch") and the cards are designed for a
 *  fuller two-to-three line description. Every other product still reads from
 *  the DB. Delete an entry here once its row is backfilled with copy of the
 *  same length.
 *
 *  Keyed by slug, with a name fallback for the case where a row is re-slugged
 *  before this file catches up. */
const SHORT_DESCRIPTIONS: Record<string, string> = {
  'double-chocolate':
    'Rich, chocolatey cookies loaded with indulgent chocolate goodness, perfectly baked for a deliciously satisfying bite.',
  'jam-roll-cookies':
    'Soft, buttery rolls filled with a delicious fruity jam. Sweet, tender, and irresistibly nostalgic.',
  nankhatai:
    'Traditional Indian cookies with a rich, buttery texture, delicate sweetness, and a melt-in-the-mouth bite.',
  'mix-dry-fruits':
    'Buttery, delicious cookies packed with a delightful mix of crunchy dry fruits in every bite.',
}

const BY_NAME: Record<string, string> = {
  'double chocolate': SHORT_DESCRIPTIONS['double-chocolate'],
  'jam roll cookies': SHORT_DESCRIPTIONS['jam-roll-cookies'],
  nankhatai: SHORT_DESCRIPTIONS.nankhatai,
  'mix dry fruits': SHORT_DESCRIPTIONS['mix-dry-fruits'],
}

/** Returns the best available card description, or undefined when there is
 *  nothing to show — callers render no element rather than an empty one. */
export function productDescription(product: {
  slug: string
  name: string
  short_description?: string | null
}): string | undefined {
  const curated =
    SHORT_DESCRIPTIONS[product.slug] ??
    BY_NAME[product.name.trim().toLowerCase()]
  if (curated) return curated

  return product.short_description?.trim() || undefined
}
