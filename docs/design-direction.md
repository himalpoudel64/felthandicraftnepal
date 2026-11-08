# Design direction

Bishnu Laxmi Felt Handicraft is an independent artisan label. The site should read like a printed lookbook from a small workshop: big photographs, confident type, thin rules and a lot of ivory paper.

## Status of the brief

`brief.md` was not available when this site was built. Section order and copy come from the build prompt. Seven category names (Purse, Bags, Hats, Ornaments, Key Rings and Key Chains, Hotpot, Tea Coaster) were supplied by the client, and Animals and Figures was added for the free-standing pieces in the client's photographs. Product names and descriptions were written from those photographs. Everything that would need real knowledge of the business is labelled "Sample text" in the seed data. The few fixed lines in `lib/copy.ts` restate only what the build prompt says about the business and should be checked against the real brief.

## Colour tokens

Defined in `app/globals.css` as CSS variables through Tailwind's `@theme`.

| Token | Value | Use | Contrast on ivory |
| --- | --- | --- | --- |
| `ivory` | `#F6EEDF` | Page background | n/a |
| `paper` | `#FBF6EC` | Form fields, dialog | n/a |
| `sand` | `#E8DCC6` | Quiet panels | n/a |
| `rule` | `#CFC1A8` | Hairlines, input-adjacent rules | decorative |
| `line` | `#7D6B5C` | Form control borders | 4.4:1 |
| `ink` | `#2A1F1B` | Text | 13.9:1 |
| `ink-soft` | `#5A4A41` | Secondary text | 7.3:1 |
| `burgundy` | `#6B1D2A` | Brand: hero plate, primary button, sparingly | 9.9:1 |
| `terracotta` | `#C4572F` | Fills and rules only | 3.8:1, fails for body text |
| `terracotta-ink` | `#A3401C` | Terracotta as text and links | 5.5:1 |
| `mustard` | `#D9A441` | Fills, and text on burgundy or ink only | 1.95:1 on ivory and 4.3:1 on forest, so never text there. 5.1:1 on burgundy |
| `forest` | `#2F4A3A` | Impact band | 8.4:1 |

No gradients. Dark bands are flat colour. Text never sits directly on a photograph: the hero headline is on a solid burgundy plate that overlaps the image. The header sits over the hero on a flat tint.

## Type

Fraunces 400 (headings) and DM Sans 400 and 500 (UI and body), self-hosted through `next/font`. The variable Fraunces with optical sizing cost 68 KB against 18 KB for the static weight, and pushed LCP over budget, so the static weight is used.

| Step | Size | Used for |
| --- | --- | --- |
| `display` | `clamp(2.375rem, 5.6vw, 5.25rem)` | Hero headline, on its plate |
| `h1` | `clamp(2.5rem, 6vw, 5rem)` | Page titles |
| `h2` | `clamp(2rem, 4.2vw, 3.5rem)` | Section titles |
| `h3` | `clamp(1.375rem, 2vw, 1.75rem)` | Sub-sections, process steps |
| `lead` | `clamp(1.1875rem, 1.6vw, 1.4375rem)` | Intros |
| body | `1.0625rem / 1.65` | Running text |
| small | `0.875rem` | Labels, captions, breadcrumbs |

Headings are set tight (line-height about 1, slight negative tracking). No all-caps eyebrow labels above every heading.

## Grid

12 columns, `1.5rem` gutter on desktop, side margin `clamp(1.25rem, 4vw, 3.5rem)`, maximum width 1440px. Sections deliberately break the grid differently:

- **Hero:** full-bleed image with a burgundy plate overlapping its lower edge.
- **About teaser:** statement across seven columns, image offset and overlapping the next section.
- **Collection:** mosaic of eight tiles with spans 7/5, 4/8, 3/5/4, 12.
- **Featured:** sticky heading on the left, two staggered columns on the right.
- **Impact:** full-bleed forest band, ruled list with very large words.
- **Contact:** text left, form right, on bare ivory.

## Corners, borders, motion

- Radius is 0 throughout, 2px on form controls.
- Thin rules instead of shadows.
- Motion is CSS only. `animation-timeline: view()` fades content in as it scrolls, and `scroll(root)` turns the header solid. Browsers without scroll timelines simply show the final state. Both are removed under `prefers-reduced-motion`.
- The header state uses CSS `:has([data-hero])`, so no JavaScript is needed.

## JavaScript islands

Only these four are client components: `HeroCarousel`, `SizePicker`, `EnquiryDialog` with `EnquiryForm`, and `MobileMenu`. The product gallery is scroll-snap on mobile and a stack on desktop, with no JavaScript.

## Component inventory

| Component | Kind | Purpose |
| --- | --- | --- |
| `Header` | Server | Logo, nav, CSS dropdown of categories |
| `MobileMenu` | Client | Disclosure menu below 1024px |
| `Footer` | Server | All categories, pages, contact |
| `HeroCarousel` | Client | One image at a time, previous, next, dots, pause |
| `CategoryGrid` | Server | Mosaic of category tiles |
| `ProductCard` | Server | Image, name, lowest price |
| `ProductGallery` | Server | Scroll-snap and stacked photographs |
| `SizePicker` | Client | Native select, live price, opens enquiry |
| `EnquiryDialog` | Client | Native `<dialog>` wrapper around the form |
| `EnquiryForm` | Client | Web3Forms POST, WhatsApp link, mailto fallback |
| `Breadcrumbs` | Server | Visible breadcrumb trail |
| `JsonLd` | Server | Safe structured-data output |
| `SanityImage` | Server | Native `<img>` with Sanity CDN `srcset`, or a flat placeholder |
| `PortableText` | Server | Small renderer for CMS rich text |

## Content model

As specified in the build prompt, with two additions that the "reorder and unpublish" rule needs:

- `product.sortOrder`: optional number for manual ordering inside a category.
- `category.status`: published or hidden, because Sanity will not unpublish a category while products reference it.

Documents: `category`, `product`, `siteSettings` (singleton), `homePage` (singleton), `aboutPage` (singleton). See `studio/schemas`.

Home page featured products: the list on the Home Page document is used when it has entries. Otherwise products ticked "Featured" are shown, up to eight.

## Image priority

One image per page gets `fetchpriority="high"`: the first hero slide on the home page, and the primary photograph on product pages, which is that page's LCP element. Everything below the fold is lazy-loaded.
