-- ─────────────────────────────────────────────────────────────
-- 002 — Align the live table with the app schema, and close RLS.
--
-- Apply in the Supabase dashboard → SQL Editor → New query.
-- Safe to re-run: every statement is idempotent.
-- ─────────────────────────────────────────────────────────────

-- ── 1. Columns the app expects but the table predates ────────
alter table public.products
  add column if not exists flavour      text,
  add column if not exists ingredients  text[] not null default '{}',
  add column if not exists gallery_urls text[] not null default '{}';

-- ── 2. Backfill flavour for the existing 20 SKUs ─────────────
update public.products set flavour = case slug
    when 'double-chocolate' then 'chocolate'
    when 'nankhatai' then 'nankhatai'
    when 'jam-roll-cookies' then 'jam'
    when 'mix-dry-fruits' then 'dryfruit'
    when 'atta-ghee' then 'ghee'
    when 'atta-namkeen' then 'savoury'
    when 'chocolate-brownie' then 'chocolate'
    when 'chocolate-chip' then 'chocolate'
    when 'tooty-frooty' then 'fruit'
    when 'classic-coconut' then 'coconut'
    when 'oreo-cookies' then 'chocolate'
    when 'assorted-cookies' then 'assorted'
    when 'cashew-cookies' then 'nuts'
    when 'almond-cookies' then 'nuts'
    when 'cashew-pepper' then 'nuts'
    when 'almond-sticks' then 'nuts'
    when 'garlic-toast' then 'garlic'
    when 'oregano-lavash' then 'herb'
    when 'chilliflakes-lavash' then 'spice'
    when 'cheese-lavash' then 'cheese'
    else flavour
  end
where flavour is null;

-- Any row whose slug is not in the map above still needs a value, or the
-- NOT NULL below would abort the migration.
update public.products set flavour = 'assorted' where flavour is null;

-- Only enforce NOT NULL once every row is populated.
alter table public.products
  alter column flavour set not null;

create index if not exists products_flavour_idx on public.products (flavour);

-- ── 3. Row Level Security ────────────────────────────────────
-- IMPORTANT: without this, the anon key — which is public and shipped
-- to every browser in the JS bundle — can UPDATE and DELETE this table.
-- Enabling RLS with a select-only policy makes the catalogue read-only
-- to the storefront. Seeding and admin writes must use the service role
-- key, which bypasses RLS and must never appear in NEXT_PUBLIC_* vars.
alter table public.products enable row level security;

drop policy if exists "Products are publicly readable" on public.products;
create policy "Products are publicly readable"
  on public.products
  for select
  to anon, authenticated
  using (true);
