/** Seeds the Supabase `products` table from scripts/products.data.mjs.
 *
 *  Run with:
 *    node --env-file=.env.local scripts/seed-products.mjs
 *
 *  Uses SUPABASE_SERVICE_ROLE_KEY when present (bypasses RLS, required if
 *  you later restrict writes); otherwise falls back to the anon key.
 */
import { createClient } from '@supabase/supabase-js'
import { products } from './products.data.mjs'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !key) {
  console.error(
    '✗ Missing Supabase credentials.\n' +
      '  Run with: node --env-file=.env.local scripts/seed-products.mjs'
  )
  process.exit(1)
}

const supabase = createClient(url, key)

async function seed() {
  console.log(`Seeding ${products.length} products…`)

  const { data, error } = await supabase
    .from('products')
    .upsert(products, { onConflict: 'slug' })
    .select()

  if (error) {
    console.error('✗ Seed failed:', error.message)
    process.exit(1)
  }

  console.log(`✓ ${data.length} products upserted.\n`)
  for (const p of data.sort((a, b) => a.sort_order - b.sort_order)) {
    const star = p.is_bestseller ? ' ★' : ''
    console.log(
      `  ${String(p.sort_order).padStart(2)}. ${p.name.padEnd(22)} ₹${String(p.price).padEnd(6)} ${p.weight}${star}`
    )
  }
}

seed()
