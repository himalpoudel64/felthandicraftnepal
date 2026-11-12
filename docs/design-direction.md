# Design direction

Bishnu Laxmi Felt Handicraft should feel like a confident artisan label that happens to have a website: large photographs of people and work, thick editorial type, and details taken from the craft itself.

## What the research showed

Reviewed in November 2026: nuptsecraft.com.np, kalpanacraft.com, subhasagun.com and handmadefeltnepal.com. helpinghandfeltcraft.com no longer resolves in DNS, so it could not be reviewed.

| Common in the industry | What this site does instead |
| --- | --- |
| Long keyword-named categories, up to 18 sub-groups | A few plain categories, shown as large image tiles |
| Products as image and title, with no link | Every product has its own page with sizes and an enquiry path |
| "Request a quote" wording that changes from page to page | One enquiry action, two clear routes: WhatsApp or email |
| Unverified claims: artisan counts, fair-wage statements, awards | No number appears unless the business enters it in the CMS |
| Artisans mentioned in passing | The artisan's hands and face lead the home page |
| Template blocks: slider, three columns, testimonials | An asymmetrical layout built from one material idea |

Subhasagun's short description of how an enquiry works is the one pattern worth keeping, and the contact page has a plain version of it.

## The idea: sewn from felt

Two details from the real products carry the identity:

1. **The stitched patch.** A flat colour panel with a running stitch inset from its edge, like a label sewn on by hand. It holds the hero headline and the category names, so text stays readable over any photograph a client uploads.
2. **The felt-ball strip.** A row of touching circles in the brand colours, taken from the client's felt ball mats. It appears as a section divider, never as decoration on top of content.

Everything else is quiet: ivory paper, thin rules, no shadows, no rounded cards.

## Colour

Defined as CSS variables through Tailwind's `@theme` in `src/styles/global.css`.

| Token | Value | Use |
| --- | --- | --- |
| `ivory` | `#F7F2E8` | Page background |
| `paper` | `#FCF9F2` | Fields and dialogs |
| `beige` | `#E9DFCE` | Alternate sections |
| `rule` | `#D4C7B1` | Hairlines |
| `line` | `#7D6B5C` | Form control borders |
| `ink` | `#302721` | Text |
| `ink-soft` | `#5D4E44` | Secondary text |
| `burgundy` | `#702A38` | Primary brand colour |
| `burgundy-deep` | `#57202B` | Hover state, footer accents |
| `terracotta` | `#C65F3A` | Fills and rules only |
| `terracotta-ink` | `#A8461F` | Terracotta used as text |
| `mustard` | `#D9AA45` | Fills, and text on burgundy or ink only |
| `forest` | `#405B48` | Impact section |
| `whatsapp` | `#1A9E4B` | WhatsApp button only |

The suggested palette is used unchanged, with `terracotta-ink` added because terracotta on ivory fails AA for body text. Vivid colour comes from the products. Most sections stay ivory.

## Type

Fraunces 400 and 400 italic for headings, DM Sans 400 and 500 for text and interface. All four files are self-hosted static Latin subsets in `src/assets/fonts`, about 18 to 23 KB each. Only the upright heading font and the regular body font are preloaded.

| Step | Size | Used for |
| --- | --- | --- |
| `display` | `clamp(2.5rem, 5.1vw, 5rem)` | Hero headline |
| `title` | `clamp(2.5rem, 6vw, 5rem)` | Page titles |
| `section` | `clamp(2rem, 4.2vw, 3.5rem)` | Section titles |
| `sub` | `clamp(1.375rem, 2vw, 1.75rem)` | Sub-sections |
| `lead` | `clamp(1.1875rem, 1.6vw, 1.4375rem)` | Introductions |
| body | `1.0625rem / 1.65` | Running text |

The second sentence of the hero headline is set in italic, which gives the page its voice.

## Layout

12 columns, maximum width 1440px, margins `clamp(1.25rem, 4vw, 3.5rem)`.

- **Hero:** full-bleed photograph, with a wide, shallow stitched patch overlapping only its lower edge, so the person in the photograph stays visible.
- **Our story:** a large statement on the left, a tall photograph offset on the right, with a small close-up overlapping it.
- **Collection:** a mosaic where every tile is a different size, each with a stitched name patch.
- **Featured:** a sticky heading beside two staggered columns of products.
- **Impact:** a forest band, with a full-height photograph on one side and a ruled list on the other.
- **Contact:** a burgundy band with WhatsApp and email as two large links.

## Photography

Real product photographs are from the client. Photographs of people are temporary stock, listed in `docs/SETUP_GUIDE.md` and marked in the CMS, and each shows a visible credit. They show Nepali women weaving, because no suitably licensed photograph of felt being made in Nepal could be found. See the "Temporary photographs" section of the setup guide.

## Motion

Crossfade on the hero, a slow zoom on image tiles, a soft reveal as sections enter, and a header that turns solid on scroll. The reveal and the header use CSS scroll timelines, so they need no JavaScript and simply show the final state in browsers without them. All of it is removed under `prefers-reduced-motion`.

## Component system

| Component | JavaScript | Purpose |
| --- | --- | --- |
| `BaseLayout` | None | Head, metadata, structured data, skip link, header, footer |
| `Header` | Small | Navigation, product dropdown, mobile dialog |
| `Footer` | None | Introduction, links, categories, contact |
| `HeroCarousel` | Small | One image at a time, previous, next, indicators, pause |
| `CategoryGrid` | None | Mosaic of category tiles |
| `ProductCard` | None | Image, name, category, summary, link |
| `ProductGrid` | Small | Search, tag filter and live count |
| `ProductGallery` | None | Scroll-snap on phones, stacked on desktop |
| `EnquiryDialog` | Small | Size picker link-up, WhatsApp or email choice |
| `EmailEnquiryForm` | Small | Validation and Web3Forms submission |
| `WhatsAppButton` | None | Fixed contact button on every page |
| `Breadcrumbs` | None | Visible trail on category and product pages |
| `SanityImage` | None | `srcset` from the Sanity image CDN, or a stitched placeholder |

Interactive parts are plain TypeScript inside Astro components, so no UI framework is sent to the browser.

## Prices

The client sells retail and wholesale, and agrees every price after contact, so the site shows no prices anywhere: not on cards, product pages, enquiry messages or structured data. Sizes remain, and the chosen size travels with the enquiry. Each product page says that prices depend on quantity and are agreed directly.

## Spam protection

Both email forms use hCaptcha through Web3Forms' free plan, plus a honeypot field. The hCaptcha script loads only when a visitor starts filling in a form, and a fixed-height slot keeps the page from moving when it appears.

## Footer base

The bottom row holds the copyright, links to the Privacy Policy and the Terms and Conditions, and "Designed by Himal Poudel", linking to himalpoudel.com. On desktop the row keeps clear space on the right so the fixed WhatsApp button never covers it. The legal pages are CMS documents, laid out like the other editorial pages: title and date on the left, text in a single readable column.
