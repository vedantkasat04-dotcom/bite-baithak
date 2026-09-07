-- ─────────────────────────────────────────────────────────────
-- Bite Baithak — seed data (20 SKUs)
--
-- GENERATED FILE. Edit scripts/products.data.mjs and re-run:
--   node scripts/generate-seed-sql.mjs
--
-- Note: `ingredients` ships empty on purpose. Ingredient lists carry
-- allergen information, so they are left for real data rather than
-- being invented here. The product page hides the section until the
-- array is populated.
-- ─────────────────────────────────────────────────────────────

insert into public.products (sort_order, name, slug, category, flavour, price, weight, short_description, long_description, ingredients, image_url, gallery_urls, hero_color, tags, in_stock, is_bestseller)
values
  (1, 'Double Chocolate', 'double-chocolate', 'cookies', 'chocolate', 260, '200g', 'Deep cocoa, twice the crunch', 'Rich double-chocolate cookies made with pure desi ghee and a proper dose of cocoa. Intense, glossy, and the reason people call back.', '{}', null, '{}', '#5C2E0A', '{"bestseller","chocolate","kids-favourite"}', true, true),
  (2, 'Nankhatai', 'nankhatai', 'cookies', 'nankhatai', 240, '250g', 'The classic that started it all', 'Ghee-rich, cardamom-kissed nankhatai that crumbles the moment it touches your tongue. The recipe hasn''t changed in three generations.', '{}', null, '{}', '#C49030', '{"bestseller","classic","ghee"}', true, true),
  (3, 'Jam Roll Cookies', 'jam-roll-cookies', 'cookies', 'jam', 250, '250g', 'Flaky rolls with a fruity core', 'Hand-rolled shortbread wound around a stripe of real fruit jam. Every bite is a little swirl of nostalgia.', '{}', null, '{}', '#C2456B', '{"bestseller","handmade","fruit"}', true, true),
  (4, 'Mix Dry Fruits', 'mix-dry-fruits', 'cookies', 'dryfruit', 349, '250g', 'Loaded with cashew, almond & raisin', 'Premium cookies packed shoulder to shoulder with cashews, almonds, and raisins. This is the tin you keep for special guests.', '{}', null, '{}', '#8B4A2B', '{"bestseller","premium","gifting"}', true, true),
  (5, 'Atta Ghee', 'atta-ghee', 'cookies', 'ghee', 210, '250g', 'Wholesome atta, pure ghee', 'Whole-wheat atta cookies with a serious ghee backbone. Rustic, satisfying, and the kind of thing you want with morning chai.', '{}', null, '{}', '#A8823F', '{"classic","ghee","wholesome"}', true, false),
  (6, 'Atta Namkeen', 'atta-namkeen', 'cookies', 'savoury', 190, '250g', 'Lightly salted, savoury bite', 'Atta cookies with just enough salt and jeera. The reliable snack that pairs with everything from filter coffee to a game of cards.', '{}', null, '{}', '#7BA05B', '{"classic","savoury","jeera"}', true, false),
  (7, 'Chocolate Brownie', 'chocolate-brownie', 'cookies', 'chocolate', 250, '200g', 'Fudgy brownie in cookie form', 'Dense, fudgy brownie-cookies with a soft centre and slightly crisp edge. Best served slightly warm with cold milk.', '{}', null, '{}', '#5C2E0A', '{"chocolate","fudgy"}', true, false),
  (8, 'Chocolate Chip', 'chocolate-chip', 'cookies', 'chocolate', 250, '250g', 'Golden edges, gooey middles', 'The universally loved chocolate chip. Golden brown at the edges, still soft in the middle, generous with the chips.', '{}', null, '{}', '#8B4A2B', '{"classic","chocolate"}', true, false),
  (9, 'Tooty Frooty', 'tooty-frooty', 'cookies', 'fruit', 220, '250g', 'Rainbow fruit bits, pure joy', 'Buttery cookies studded with candied fruit bits in every colour. The one that makes kids grin and adults nostalgic.', '{}', null, '{}', '#E8873A', '{"nostalgic","kids-favourite","colourful"}', true, false),
  (10, 'Classic Coconut', 'classic-coconut', 'cookies', 'coconut', 240, '250g', 'Soft, sweet, tropical', 'Freshly grated coconut folded into a soft, mildly-sweet dough. A tropical whisper in every bite.', '{}', null, '{}', '#F5E6D3', '{"classic","coconut"}', true, false),
  (11, 'Oreo Cookies', 'oreo-cookies', 'cookies', 'chocolate', 240, '250g', 'Chocolate wafer, cream centre', 'Dark chocolate wafers sandwiched around a smooth vanilla cream. Classic in every way.', '{}', null, '{}', '#2A1409', '{"chocolate","classic"}', true, false),
  (12, 'Assorted Cookies', 'assorted-cookies', 'cookies', 'assorted', 270, '250g', 'A little of everything', 'Our curated pick of the bestsellers in one tin. Ideal for when you can''t decide, or when you''re gifting.', '{}', null, '{}', '#C49030', '{"variety","gifting"}', true, false),
  (13, 'Cashew Cookies', 'cashew-cookies', 'cookies', 'nuts', 299, '250g', 'Butter-rich with whole cashews', 'Buttery shortbread loaded with premium whole cashews in every bite. Delicate, nutty, and a little indulgent.', '{}', null, '{}', '#C49030', '{"premium","nuts"}', true, false),
  (14, 'Almond Cookies', 'almond-cookies', 'cookies', 'nuts', 299, '250g', 'Roasted almond, deep butter', 'Roasted almonds folded into a rich, buttery dough and baked until fragrant. Pairs beautifully with kahwa.', '{}', null, '{}', '#8B661C', '{"premium","nuts"}', true, false),
  (15, 'Cashew Pepper', 'cashew-pepper', 'cookies', 'nuts', 299, '250g', 'Sweet cashew, warm pepper kick', 'The unexpected hero — cashew cookies with cracked black pepper. Sweet, savoury, and grown-up.', '{}', null, '{}', '#4A8C8C', '{"premium","nuts","unusual"}', true, false),
  (16, 'Almond Sticks', 'almond-sticks', 'cookies', 'nuts', 250, '250g', 'Crunchy sticks, generous almonds', 'Long, crunchy almond sticks with a satisfying snap. The kind of thing you dip in coffee and lose track of time.', '{}', null, '{}', '#A8823F', '{"premium","nuts","crunchy"}', true, false),
  (17, 'Garlic Toast', 'garlic-toast', 'snacks', 'garlic', 220, '1 box (~250g)', 'Crispy, garlicky, addictive', 'Twice-baked toast rubbed with roasted garlic and a whisper of butter. Impossible to stop at one.', '{}', null, '{}', '#C2456B', '{"savoury","garlic"}', true, false),
  (18, 'Oregano Lavash', 'oregano-lavash', 'snacks', 'herb', 220, '1 box (~250g)', 'Thin, herby, perfect with dips', 'Paper-thin lavash flecked with dried oregano. The one you break out with hummus, cheese, or just a cold drink.', '{}', null, '{}', '#7BA05B', '{"savoury","herby"}', true, false),
  (19, 'ChilliFlakes Lavash', 'chilliflakes-lavash', 'snacks', 'spice', 220, '1 box (~250g)', 'A slow, spreading heat', 'Lavash with generous chilli flakes baked right in. Starts subtle, ends with a warm afterglow.', '{}', null, '{}', '#E8873A', '{"savoury","spicy"}', true, false),
  (20, 'Cheese Lavash', 'cheese-lavash', 'snacks', 'cheese', 220, '1 box (~250g)', 'Melted cheese, crackly crisp', 'Real cheese melted into the dough, baked until crackly and golden. The evening snack that disappears fastest.', '{}', null, '{}', '#C49030', '{"savoury","cheese"}', true, false)
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
