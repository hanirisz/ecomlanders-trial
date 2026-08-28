BioRoot Labs — Horizon Theme Customizations

A running record of every customization made to the Shopify Horizon theme: what changed, which file it lives in, and the gotchas worth remembering. Keep it current — it'll save hours later.

1. Custom Font (Helvetica Now Display)

File: layout/theme.liquid

Uploaded .woff2 files to Assets, then added a @font-face block per weight (400, 500, 700, 900) plus a global override before </head> that forces the font across all text.

Only .woff2 was needed; the format string in src is format('woff2').

Google Fonts serves .ttf, so files were converted via Google Webfonts Helper. Only four weights uploaded rather than the full family, to keep load time down.

2. Product Media Gallery

Files: snippets/product-media-gallery-content.liquid, snippets/slideshow-arrows.liquid, snippets/slideshow-arrow.liquid, snippets/slideshow.liquid, snippets/slideshow-controls.liquid

Square main image. Forced aspect-ratio: 1 / 1 with object-fit: cover via a CSS override at the bottom of the gallery-content file, since the editor's "Square" toggle wasn't sticking.

Arrows restyled. White circles, green border and icon (
#095946). The blocker was mix-blend-mode: difference on slideshow-arrows; changing it to normal at the source fixed the inverted colors.

Arrow sizing. SVG scaled with transform: scale(1.4). The arrows are filled shapes, so stroke-width had no effect. On mobile the scale is cancelled and the buttons are reduced to 32px.

Disabled arrow state. Pale mint at either end of the gallery. Required disabling looping by passing infinite: false into the render 'slideshow' call, since the unless infinite == false default in slideshow.liquid was adding it automatically.

Mobile vertical thumbnail rail. flex-direction: row-reverse on slideshow-component plus flex-direction: column on .slideshow-controls__thumbnails. Two declarations, no grid rewrite needed.

Gotchas worth knowing. Selectors scoped to .media-gallery--carousel won't match if the block is set to Grid presentation. Horizon's own vertical rail only exists above 750px; below that, thumbnails default to a horizontal strip and pagination-position is hardcoded to center, so any [pagination-position='left'] selector silently fails on mobile. Avoid height: 0 plus min-height: 100% on slideshow-controls outside the desktop grid — it collapses the whole gallery; use a fixed max-height on .slideshow-controls__thumbnails-container with overflow: hidden auto instead. And thumbnail width comes from clamp(44px, 7vw, var(--thumbnail-width)), so any override needs width: auto or an explicit !important value to win.

3. Badge ("BESTSELLER")

Files: snippets/product-media-badge.liquid, snippets/product-badges-styles.liquid

Moved to top-right via a hardcoded product-badges--top-right class plus a scoped position override with 20px inset. Star swapped for a filled four-point sparkle SVG. Text set bold.

4. Feature Checklist ("Ease everyday stiffness" etc.)

File: blocks/feature-checkmark.liquid

Replaced the inline SVG checkmark with an uploaded image (image_picker setting, "Checkmark icon") so the badge art is controllable. Icon is 26px with object-fit: contain.

Text uses clamp(14px, 3.5vw, 18px) — 18px on desktop, scaling down fluidly on mobile. Icon size stays fixed.

5. Star Rating Block

File: blocks/star-rating.liquid (new block)

Manual rating from 0–5 with half-star support, plus a text line.

Settings: rating, richtext (so "Excellent" can be bolded), alignment, star color, text color, star size, text size.

Stars and text are held on one row at all widths via white-space: nowrap and clamp(15px, 4.5vw, ...) sizing.

This is a static display rating, not live review data. Swap to a review-app metafield if real numbers are needed.

6. Announcement Bar — Bold Text Color

File: the announcement/text block

Added a "Bold text color" setting. Anything bolded in the richtext picks up that color; the rest stays normal.

Only applies to text bolded with the inline B button (<strong>), not text that's bold because the block's overall weight is set to Bold.

7. Bundle Selector

Files: blocks/bundle-selector.liquid, blocks/_bundle-option.liquid

Heading changed from a small/medium/large preset to a range size setting, bold by default, with a color customizer. Added a highlight color customizer for the price/label accent.

Save-% pill centered on the product image via left: 50% and translateX(-50%).

Borders thickened to 2.5px with a 10px radius on tiles, matching across selected and unselected states. On the selected state the green border wraps the yellow banner too — the banner is pulled outward with negative margins, given a matching border, and border-bottom: 0.

Banner text switched to inline_richtext so parts can be bolded.

Pricing model — read before changing anything

All tiles point at the same £19 single-bottle variant. unit_count is the quantity added to cart (1 / 3 / 5), and variant prices are set to £19 each in Admin.

A JS fetch wrapper in bundle-selector.liquid rewrites the /cart/add quantity to the selected tier's data-bundle-quantity, because the cart drawer's morph kept resetting quantity to 1.

Still open: either apply a Shopify automatic discount to charge the true bundle price, or use per-tile display overrides (price / compare / save% / per-unit) and accept that the cart charges £19 × quantity. Display overrides are cosmetic — they don't change what's charged.

Two "Buy X Get Y" discounts collide, since both are product-class discounts and overlap at 5 bottles. "Amount off products" with minimum-quantity conditions is cleaner, but still needs "Combine with product discounts" unchecked and testing at both tiers (3 → £38, 5 → £57).

8. Custom CTA / Add to Cart Button

File: blocks/add-to-cart.liquid

Toggle: "Use custom CTA with price."

Layout is ADD TO CART, price, and struck-through compare price in a pill. Color customizers cover button background, add-to-cart text, compare-price pill background, and price/compare colors (shared, with compare at reduced opacity). 10px radius to match the bundle tiles.

Live price updates come from a delegated change listener on document that reads the checked bundle input's data-variant-id, fetches the product .js, and updates the price. The wrapper is looked up fresh on each update — a stale reference after morph was the original bug.

Since all tiles use the same £19 variant, the CTA may show £19 regardless of tier. To show the bundle price it needs to read the tile's displayed price rather than the variant price.

9. Subscription Toggle ("Save 20% on automatic refills")

File: blocks/subscription-toggle.liquid

Checkbox never disabled (mockup mode) — disabled: false.

The custom checkbox is drawn on .checkbox__label, since the theme hides the real input: a 26px box with a colored fill when checked and a white CSS-drawn tick centered via left: 50% / top: 45% plus translate. The theme's SVG tick is hidden.

Heading and description are grouped into a text column beside the checkbox, with tight line-height (1.25) to close the gap between them. Color customizers cover heading, description (full opacity), and checkmark.

The checkbox is drawn from scratch with appearance overridden on the label, so it no longer uses the theme's native visuals — which is why the color finally obeyed.

10. Scrolling Marquee

File: sections/scrolling-marquee.liquid (new section)

Auto-scrolling infinite marquee where each text is a block. Settings: scroll speed, gap, font size, vertical padding, background and text color, separator character. Bold text and separator.

Seamlessness rule: the translateX percentage must equal 100% ÷ number of copies. Currently 8 copies → -12.5%. Add more text blocks if the strip doesn't fill wide screens.

11. Trust Rows ("In stock", shipping, guarantee, ingredients)

Files: blocks/trust-row.liquid, the product inventory block

Icons fixed with object-fit: contain and an img selector so uploads don't distort.

The In Stock line bolds "In stock" and adds a pulsating green circle — a radar ping via scale and opacity on circle:first-of-type, with overflow: visible so it isn't clipped.

Delivery estimate reads "Available for delivery by: [date]", preferring a custom.delivery_estimate product metafield and falling back to today + N days. The date is bold.

Flag support: a toggle, a flag image upload, and bold text after the flag (for "Fast, Tracked Shipping to: 🇺🇸 United States").

The delivery fallback counts calendar days and renders at page-build time, which Shopify caches — the metafield route is more reliable. Flags use uploaded images rather than emoji, since emoji flags don't render on Windows.

12. Video Testimonials

Files: blocks/video-testimonials.liquid, blocks/video-testimonial-card.liquid

Heading uses a range size (28px default), bold and centered, with a color customizer.

Thumbnail image setting works before a video is linked, showing poster plus play button. The play button is a semi-transparent frosted circle (rgba(255,255,255,0.25) with blur) and a larger white triangle.

Slider controls are built from scratch, since the theme's arrows were broken and mis-positioned: white circular arrows with a 2.5px green border, line-arrow SVGs, and a pill of dots (white inactive, green active) centered below the cards. Theme arrows disabled with show_arrows: false.

Dots represent pages, not videos — count is ceil(slides ÷ columns). The active dot syncs on click, arrow, and swipe, reading slideshow.current plus a throttled scroll listener on the scroller.

Mobile breakpoint hardcoded to 749px, assuming one card per page on mobile. Dot count is generated server-side from desktop columns.

13. Custom Accordion

Files: blocks/custom-accordion.liquid (container), blocks/_custom-accordion-row.liquid (child rows)

The parent block holds child "Accordion row" blocks that can be added, reordered, and edited individually.

Customizers: border, background, heading, body, icon color, corner radius, row gap. The "+" icon rotates to "×" on open.

A "Show on" visibility toggle (Desktop & mobile / Desktop only / Mobile only) handles device-specific placement.

Expand and collapse are animated via max-height, with JS measuring scrollHeight — smoother than the earlier grid-template-rows approach, which lagged.

The row file must be named _custom-accordion-row.liquid with the leading underscore, to match the type in the parent schema and register as a private nested block. For device-specific placement, add the block twice (one desktop-only, one mobile-only); for the same position on both, use a single block set to "Desktop & mobile." The max-height animation reads content height, so late-loading images could throw it off — fine for text.
