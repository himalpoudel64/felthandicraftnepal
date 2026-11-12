# Bishnu Laxmi Felt Handicraft

Static website for felthandicraftnepal.com, built with Astro and Tailwind CSS, with content in Sanity, hosted on Cloudflare Pages.

- Full setup and deployment: [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md)
- For the business owner: [docs/CLIENT_GUIDE.md](docs/CLIENT_GUIDE.md)
- Design decisions: [docs/design-direction.md](docs/design-direction.md)

## Quick start

Requires Node 22.23.4 or newer. Node 24 LTS is recommended.

```bash
npm install
```

```bash
npm run dev
```

With no Sanity project ID in `.env`, the site builds from `studio/seed/seed.ndjson`, so it renders straight away.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server on port 4321 |
| `npm run build` | Production build in `dist/` |
| `npm run preview` | Serves the production build |
| `npm run check` | Type checks the project |

## Environment variables

| Variable | Purpose |
| --- | --- |
| `PUBLIC_SANITY_PROJECT_ID` | Sanity project. Blank uses the seed file. |
| `PUBLIC_SANITY_DATASET` | Usually `production`. |
| `SITE_URL` | Canonical origin, https, no trailing slash. |
| `PUBLIC_WEB3FORMS_KEY` | Web3Forms access key for felthandicraftnepal@gmail.com. Public by design. |
| `NODE_VERSION` | Cloudflare only. Set to `24`. |
| `SANITY_STUDIO_PROJECT_ID` | In `studio/.env`. |
| `SANITY_STUDIO_DATASET` | In `studio/.env`. |
| `SANITY_STUDIO_SITE_URL` | In `studio/.env`. Used by the "View on website" button. |

## Structure

```text
src/pages         Routes: home, about, products, categories, products, contact, 404, sitemap, robots
src/components    Astro components. Interactive parts are small inline scripts
src/layouts       BaseLayout: head, metadata, structured data, header, footer
src/lib           Sanity fetch and normalise, images, SEO, WhatsApp, formatting
src/styles        Design tokens and component classes
src/assets/fonts  Self-hosted fonts
studio            Sanity Studio, deployed separately
studio/seed       Starting content and photographs for import
public/seed       Image variants, used only when building from the seed file
```

All content comes from one GROQ query in `src/lib/queries.ts`, run once per build. The build stops if Sanity cannot be reached or nothing is published, so a broken build never replaces a working site, and it prints any missing images, alt text and temporary stock photos.

The site shows no prices: they are agreed after contact. Both email forms are protected by hCaptcha through Web3Forms, loaded only when a visitor starts filling in a form.

## Performance

Lighthouse 12.8, mobile, default simulated throttling, on a local server with gzip, using the seed content. Three runs on a development laptop.

| Page | Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- |
| Home | 97 to 99 | 100 | 100 | 100 |
| Category | 90 to 99 | 100 | 100 | 100 |
| Product | 97 to 100 | 100 | 100 | 100 |

Cumulative layout shift was 0 throughout. Re-measure on the live URL with PageSpeed Insights once images are served from Sanity's CDN.

## Dependencies

| Package | Why |
| --- | --- |
| `astro` | The framework |
| `tailwindcss`, `@tailwindcss/vite` | Styling |
| `@sanity/client` | Fetches content at build time. Not sent to browsers. |
| `typescript`, `@astrojs/check`, `@types/node` | Type checking |

Studio only: `sanity`, `react`, `react-dom`, `styled-components`, `typescript`.

No UI framework reaches the browser. `sitemap.xml` and `robots.txt` are small Astro routes, so no sitemap package is needed.
