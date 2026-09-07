/** Regenerates supabase/seed.sql from scripts/products.data.mjs.
 *  Run with: node scripts/generate-seed-sql.mjs */
import { writeFileSync } from 'node:fs'
import { products } from './products.data.mjs'

const q = (v) => (v == null ? 'null' : `'${String(v).replace(/'/g, "''")}'`)
const arr = (v) =>
  !v || v.length === 0
    ? `'{}'`
    : `'{${v.map((s) => `"${String(s).replace(/"/g, '\\"')}"`).join(',')}}'`

const cols = [
  'sort_order', 'name', 'slug', 'category', 'flavour', 'price', 'weight',
  'short_description', 'long_description', 'ingredients', 'image_url',
  'gallery_urls', 'hero_color', 'tags', 'in_stock', 'is_bestseller',
]

const rows = products.map((p) =>
  '  (' + [
    p.sort_order,
    q(p.name),
    q(p.slug),
    q(p.category),
    q(p.flavour),
    p.price,
    q(p.weight),
    q(p.short_description),
    q(p.long_description),
    arr(p.ingredients),          // intentionally empty — see header note
    q(p.image_url ?? null),
    arr(p.gallery_urls),
    q(p.hero_color),
    arr(p.tags),
    p.in_stock ?? true,
    p.is_bestseller ?? false,
  ].join(', ') + ')'
)

const sql = `-- ─────────────────────────────────────────────────────────────
-- Bite Baithak — seed data (${products.length} SKUs)
--
-- GENERATED FILE. Edit scripts/products.data.mjs and re-run:
--   node scripts/generate-seed-sql.mjs
--
-- Note: \`ingredients\` ships empty on purpose. Ingredient lists carry
-- allergen information, so they are left for real data rather than
-- being invented here. The product page hides the section until the
-- array is populated.
-- ─────────────────────────────────────────────────────────────

insert into public.products (${cols.join(', ')})
values
${rows.join(',\n')}
on conflict (slug) do update set
  sort_order        = excluded.sort_order,
  name              = excluded.name,
  category          = excluded.category,
  flavour           = excluded.flavour,
  price             = excluded.price,
  weight            = excluded.weight,
  short_description = excluded.short_description,
  long_description  = excluded.long_description,
  hero_color        = excluded.hero_color,
  tags              = excluded.tags,
  in_stock          = excluded.in_stock,
  is_bestseller     = excluded.is_bestseller;
`

writeFileSync('supabase/seed.sql', sql)
console.log(`wrote supabase/seed.sql — ${products.length} rows`)
