# Product page section — Admin setup

This covers the Shopify Admin configuration needed to make the new product page
section fully functional. Everything else (content, images, text, block order) is
editable directly in the Theme Editor — no code changes needed for day-to-day edits.

## 1. Bundle selector (1 Bottle / 2+1 / 3+2)

The bundle selector is a real Shopify variant picker under the hood — each tier is
its own variant with its own real price, so Shopify's cart/checkout handles it
natively (no custom discount logic to maintain).

**Required setup per product:**
1. In the product's **Options**, add an option named **"Bundle"** with three values,
   in this exact spelling: `1 Bottle`, `2+1`, `3+2`.
2. For each of the resulting 3 variants, set:
   - **Price** — the actual discounted total for that tier (e.g. £19.00 / £38.00 / £57.00).
   - **Compare-at price** — the "was" price used to compute the "Save X%" badge
     (e.g. £39.00 / £117.00 / £195.00). Leave blank to hide the strikethrough/savings badge.
3. In the theme editor, on each "Bundle option" block (under the "Bundle selector"
   block), set:
   - **Variant option value** — must exactly match the option value above.
   - **Units in this tier** — how many bottles that tier represents (used for the
     "£X / bottle" line). E.g. 1 / 3 / 5.
   - **Banner text** / **Best Value ribbon** — optional marketing copy per tier.

If a product hasn't been set up this way yet, the bundle selector simply doesn't
render on the live page (no broken/empty box) — the rest of the page, including
Add to cart with the product's default variant, still works normally. A warning
is shown only inside the theme editor so you know what's missing.

## 2. Subscription toggle ("Save 20% on automatic refills")

The checkbox is only functional once the product has a subscription selling plan.
Install and configure the **Shopify Subscriptions** app (or any selling-plan app),
create a subscription plan on the product, and the toggle will automatically pick
up the first plan and apply it at checkout when checked. Until then, the checkbox
renders disabled.

## 3. Metafields

Two metafield definitions drive per-product content without touching the theme:

| Metafield | Type | Used for |
|---|---|---|
| `custom.badge_text` | Single line text | The ribbon over the main product image (e.g. "Bestseller"). Blank = hidden. Can be overridden per-block in the theme editor. |
| `custom.ingredients` | Multi-line text / Rich text | Intended for the "Ingredients & Nutrition" accordion row. |

Create these under **Settings → Custom data → Products** in Shopify Admin first.

- `custom.badge_text` is already wired up in the code — once the metafield exists
  and has a value, the badge appears automatically, no further steps.
- `custom.ingredients` is **not** pre-wired in the template (Shopify's theme
  validator rejects a metafield reference baked into a template file before the
  metafield exists, which would break the whole theme on sync). Once you've
  created it, open the product template in the theme editor, select the
  "Ingredients & Nutrition" accordion row's text block, and use **"Connect
  dynamic source"** to bind it to `custom.ingredients`. Takes 10 seconds per
  template, done once.

The trust badges (Joint Health Support / Third Party Tested / Inflammation
Relief) and their icons are plain theme editor block settings — you can also
"Connect dynamic source" on any of them in the theme editor to bind to a
metafield if you want the icon/label to vary per product.

## 4. Video testimonials ("Real Change for Real People")

This is a block (already added, right after the trust/delivery rows in the
product info column, matching the Figma layout) rather than a full-width
section — add one "Testimonial video" block inside it per customer video.
Each block lets you either upload a video file or paste a YouTube/Vimeo
link, plus an optional name/caption. No code involved.

## 5. Reviews / rating widget

The star rating shown in the design ("Rated 4.8 'Excellent' | 45k+ Customers")
was not built as part of this section — that's typically supplied by a reviews
app (Judge.me, Loox, Yotpo, etc.), which plugs in as an app block. Install your
preferred reviews app and add its block above the bundle selector in the theme
editor.
