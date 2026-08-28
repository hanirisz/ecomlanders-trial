BioRoot Labs — Horizon Theme Customizations

A running record of every customization made to the Shopify Horizon theme, what file each change lives in, and any gotchas to remember. Keep this updated as you go — it'll save you (or the next dev) hours.


1. Custom Font (Helvetica Now Display)

File: layout/theme.liquid


Uploaded .woff2 font files to the Assets folder.
Added a @font-face block (one per weight: 400 Regular, 500 Medium, 700 Bold, 900 Black) plus a global override before </head> that forces the font on all text.
Only .woff2 was needed. Format string in the src line is format('woff2').


Notes: Google Fonts downloads as .ttf; had to convert to .woff2 (via Google Webfonts Helper) for smaller files. Only 4 weights uploaded, not the whole family, to keep load time down.


2. Product Media Gallery

Files: snippets/product-media-gallery-content.liquid, snippets/slideshow-arrows.liquid, snippets/slideshow.liquid, snippets/slideshow-controls.liquid


Square image: forced main image to aspect-ratio: 1 / 1 with object-fit: cover (CSS override at bottom of gallery-content file), since the editor "Square" toggle wasn't sticking.
Arrows restyled: white circles, green border + arrow (#095946). The blocker was mix-blend-mode: difference on slideshow-arrows — changed to normal at the source, which fixed the inverted/transparent color.
Arrows enlarged: SVG scaled with transform: scale(1.4) (the arrows are filled shapes, so stroke-width did nothing).
Disabled arrow state: pale mint when at the end of the gallery. Required turning off looping — passed infinite: false into the render 'slideshow' call in product-media-gallery-content.liquid (the unless infinite == false default in slideshow.liquid was adding infinite automatically).
Thumbnails full height: attempted several times; the grid-based layout made this fragile. Left at a working state — revisit carefully (see Known Issues).


Notes: .media-gallery--carousel vs --grid — selectors scoped to --carousel won't match if the block is in Grid presentation.


3. Badge ("BESTSELLER")

Files: snippets/product-media-badge.liquid, snippets/product-badges-styles.liquid


Moved to top-right (hardcoded product-badges--top-right class + a scoped position override with 20px inset).
Star swapped for a filled 4-point sparkle SVG path.
Badge text set to bold.



4. Feature Checklist ("Ease everyday stiffness" etc.)

File: blocks/feature-checkmark.liquid


Replaced the inline SVG checkmark with an uploaded image (image_picker setting "Checkmark icon") so you control the badge art.
Icon sized 26px, object-fit: contain.
Text uses clamp(14px, 3.5vw, 18px) — 18px on desktop, scales down fluidly on mobile. Icon stays fixed size.



5. Star Rating Block

File: blocks/star-rating.liquid (new block)


Manual star rating (0–5, supports halves) + text line.
Settings: rating, richtext (so you can bold "Excellent"), alignment, star color, text color, star size, text size.
Stars + text forced onto one row at all sizes via white-space: nowrap and clamp() sizing (clamp(15px, 4.5vw, ...)).


Notes: This is a static display rating, not pulled from real reviews. Swap to a review-app metafield if you want live data.


6. Announcement Bar — Bold Text Color

File: the announcement/text block


Added a "Bold text color" setting. Anything bolded in the richtext (<strong>) picks up that color; the rest stays normal.


Notes: Only works on text bolded with the inline B button (<strong>), not text that's bold because the whole block's weight is set to Bold.


7. Bundle Selector

Files: blocks/bundle-selector.liquid, blocks/_bundle-option.liquid


Heading: changed from small/medium/large preset to a range size setting, bold by default, + heading color customizer.
Highlight color customizer for the accent (price/label highlight).
Save % pill centered on the product image (left: 50% + translateX(-50%)).
Borders: thicker (2.5px), 10px radius on tiles, matching selected + unselected.
Selected state: green border wraps the yellow banner too (banner pulled outward with negative margins + matching border, border-bottom: 0).
Banner text: switched to inline_richtext so you can bold parts.


Pricing model (IMPORTANT — read this)


All tiles point at the same £19 single-bottle variant. unit_count = quantity added to cart (1 / 3 / 5).
Variant prices were set to £19 each in Admin.
A JS fetch wrapper in bundle-selector.liquid rewrites the /cart/add quantity to the selected tier's data-bundle-quantity, because the cart drawer/morph kept resetting quantity to 1.
Discount decision still open: either use a Shopify automatic discount to charge the true bundle price, OR use per-tile display overrides (price/compare/save%/per-unit) and accept that the cart charges £19 × qty. Display overrides = display only, they don't change what's charged.


Notes: Two "Buy X Get Y" discounts collide (both are product-class discounts, overlap at 5 bottles). "Amount off products" with minimum-quantity conditions is cleaner but still needs "Combine with product discounts" unchecked and testing at both tiers (3 → £38, 5 → £57).


8. Custom CTA / Add to Cart Button

File: blocks/add-to-cart.liquid


Toggle "Use custom CTA with price" in block settings.
Layout: ADD TO CART + price + struck-through compare price in a pill.
Color customizers: button background, add-to-cart text, compare-price pill background, price & compare price color (shared), compare price at reduced opacity.
10px border radius to match bundle selectors.
Live price update: a delegated change listener on document reads the checked bundle input's data-variant-id, fetches the product .js, and updates the price. Wrapper looked up fresh each update (stale reference after morph was the bug).


Notes: Since all tiles now use the same £19 variant, the CTA may show £19 regardless of tier. If you want it to show the bundle price, it needs to read the tile's displayed price instead of the variant price.


9. Subscription Toggle ("Save 20% on automatic refills")

File: blocks/subscription-toggle.liquid


Checkbox never disabled (mockup mode) — set disabled: false.
Custom checkbox: the visible box is drawn on the .checkbox__label (the theme hides the real input). 26px box, colored fill when checked, white CSS-drawn tick centered via left:50%/top:45% + translate. Theme's SVG tick hidden.
Heading + description grouped into a text column beside the checkbox.
Color customizers: heading, description (full opacity), checkmark color.
Tight line-height (1.25) to reduce heading/description gap.


Notes: The checkbox is drawn from scratch (appearance overridden on the label), so it no longer uses the theme's native checkbox visuals — that's why the color finally obeyed.


10. Scrolling Marquee

File: sections/scrolling-marquee.liquid (new section)


Auto-scrolling infinite marquee. Each text is a block.
Settings: scroll speed, gap, font size, vertical padding, background/text color, separator character.
Bold text + separator.


Notes: Seamlessness rule — the translateX percentage must equal 100% ÷ number of copies. Currently 8 copies → -12.5%. Add more text blocks if the strip doesn't fill wide screens.


11. Trust Rows ("In stock", shipping, guarantee, ingredients)

Files: blocks/trust-row.liquid, the product inventory block


Icon fix: added object-fit: contain + img selector so uploaded icons don't distort.
In Stock line: "In stock" bolded, pulsating green background circle (radar ping via scale + opacity on circle:first-of-type), with overflow: visible so the ping isn't clipped.
Delivery estimate: "Available for delivery by: [date]" — prefers a custom.delivery_estimate product metafield, falls back to today + N days. Date is bold.
Flag support: toggle + flag image upload + bold text after the flag (for "Fast, Tracked Shipping to: [flag] United States").


Notes: Delivery date fallback uses calendar days and renders at page-build time (Shopify caches). Metafield route is more reliable. Flags use uploaded images, not emoji (emoji flags don't render on Windows).


12. Video Testimonials

Files: blocks/video-testimonials.liquid, blocks/video-testimonial-card.liquid


Heading: range size (28px default), bold, centered, + color customizer.
Thumbnail image setting (works before a video is linked — shows poster + play button).
Play button: semi-transparent frosted circle (rgba(255,255,255,0.25) + blur), bigger white triangle.
Custom slider controls built from scratch (theme's arrows were broken/mis-positioned): white circular arrows with green border (2.5px), line-arrow SVGs, pill of dots (white inactive, green active) — centered below the cards. Theme arrows turned off (show_arrows: false).
Dots = pages, not videos: count = ceil(slides ÷ columns). Active dot syncs on click, arrow, AND swipe (reads slideshow.current + a throttled scroll listener on the scroller).


Notes: Mobile breakpoint hardcoded to 749px assuming 1 card/page on mobile. Dot count generated server-side from desktop columns.


13. Custom Accordion

Files: blocks/custom-accordion.liquid (container), blocks/_custom-accordion-row.liquid (child rows)


Parent block holds child "Accordion row" blocks (add/reorder/edit each).
Color/style customizers: border, background, heading, body, icon color, corner radius, row gap.
"+" icon rotates to "×" on open.
Visibility toggle: "Show on" (Desktop & mobile / Desktop only / Mobile only) for device-specific placement.
Smooth expand/collapse: animated via max-height (JS measures scrollHeight) — smoother than the earlier grid-template-rows approach which lagged.


Notes:


The row file MUST be named _custom-accordion-row.liquid (leading underscore) to match the type in the parent schema and to be a private/nested block.
For device-specific placement, you add the block twice (one desktop-only, one mobile-only). For the same position on both, use one block set to "Desktop & mobile."
max-height animation reads content height; images loading late could offset it (fine for text).
