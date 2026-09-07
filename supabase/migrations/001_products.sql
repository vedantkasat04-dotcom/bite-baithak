-- ─────────────────────────────────────────────────────────────
-- Bite Baithak — products
-- ─────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id                uuid primary key default gen_random_uuid(),
  sort_order        integer      not null default 0,
  name              text         not null,
  slug              text         not null unique,
  category          text         not null check (category in ('cookies', 'snacks')),
  flavour           text         not null,
  price             numeric(10,2) not null check (price >= 0),
  weight            text         not null,
  short_description text,
  long_description  text,
  ingredients       text[]       not null default '{}',
  image_url         text,
  gallery_urls      text[]       not null default '{}',
  hero_color        text         not null default '#8B1E2C',
  tags              text[]       not null default '{}',
  in_stock          boolean      not null default true,
  is_bestseller     boolean      not null default false,
  created_at        timestamptz  not null default now()
);

-- Ordering and filtering hit these on every shop/home render.
create index if not exists products_sort_order_idx  on public.products (sort_order);
create index if not exists products_category_idx    on public.products (category);
create index if not exists products_flavour_idx     on public.products (flavour);
create index if not exists products_bestseller_idx  on public.products (is_bestseller) where is_bestseller;

-- ── Row Level Security ───────────────────────────────────────
-- The storefront reads with the anon key, so an explicit public
-- read policy is required. Writes stay closed to anon entirely;
-- seeding and admin edits go through the service role, which
-- bypasses RLS.
alter table public.products enable row level security;

drop policy if exists "Products are publicly readable" on public.products;
create policy "Products are publicly readable"
  on public.products
  for select
  to anon, authenticated
  using (true);
