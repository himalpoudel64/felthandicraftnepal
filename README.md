# Bishnu Laxmi Felt Handicraft

Static website for felthandicraftnepal.com. Next.js static export on Cloudflare Pages, with content in Sanity. It runs on free tiers only.

Non-technical editing instructions are in [docs/client-guide.md](docs/client-guide.md). Design decisions are in [docs/design-direction.md](docs/design-direction.md).

## How it fits together

1. An editor publishes in Sanity Studio.
2. A Sanity webhook calls a Cloudflare deploy hook.
3. Cloudflare runs `npm run build`, which fetches all content once and writes static HTML to `out/`.

There is no server at runtime. Enquiries go from the browser to Web3Forms, which emails `info@`.

## Local setup

Requires Node 20.9 or newer.

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

With no Sanity project ID, the site builds from `studio/seed/seed.ndjson`, so it renders straight away. The build warns when it does this.

| Variable | Where | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Site | Sanity project. Blank means use the seed file. |
| `NEXT_PUBLIC_SANITY_DATASET` | Site | Usually `production`. |
| `SITE_URL` | Site | Canonical origin, https, no trailing slash. Change it to the `www` form only if the client prefers that. |
| `WEB3FORMS_KEY` | Site | Web3Forms access key. It is designed to be public and appears in the page HTML. If blank, forms offer an email link instead. |
| `SANITY_SEED_FILE` | Site, optional | Builds from a different `.ndjson` file, for previews. |
| `SANITY_STUDIO_PROJECT_ID` | `studio/.env` | Same project ID as above. |
| `SANITY_STUDIO_DATASET` | `studio/.env` | Usually `production`. |

Other commands: `npm run build`, `npm run lint`, `npm run typecheck`.

The build prints every missing image and missing alt text. It fails on purpose if Sanity cannot be reached, or if there are no published categories or products, so a broken build never replaces a working site.

## Sanity

1. Create a free project at sanity.io/manage. Use a public dataset named `production`.
2. Install and configure the Studio. It has its own `package.json`.

```bash
cd studio && npm install && cp .env.example .env
```

3. Put the project ID in `studio/.env`, then log in and load the sample content.

```bash
npx sanity login
```

```bash
npm run seed
```

4. Deploy the Studio. Sanity asks you to choose a `*.sanity.studio` address.

```bash
npm run deploy
```

5. Invite the client under Members in sanity.io/manage.

## Web3Forms

Enter `info@felthandicraftnepal.com` at web3forms.com, and put the emailed access key in `WEB3FORMS_KEY`.

## Cloudflare Pages

Create a Pages project connected to the Git repository.

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Build command | `npm run build` |
| Output directory | `out` |
| Root directory | leave empty |
| Environment variables | The site variables above, plus `NODE_VERSION` = `22` |

`public/_headers` sets long caching for hashed assets and the security headers. Its Content-Security-Policy allows `cdn.sanity.io` for images and `api.web3forms.com` for forms. Update it if either service changes. `public/_redirects` is ready for future URL changes.

### Rebuild on publish

1. In Cloudflare, go to the Pages project, then Settings, Builds, Deploy hooks. Create one for the production branch and copy the URL.
2. In sanity.io/manage, go to API, Webhooks, and create a webhook:
   - URL: the deploy hook
   - Dataset: `production`
   - Trigger on: Create, Update, Delete
   - Filter: `_type in ["category", "product", "siteSettings", "homePage", "aboutPage"]`
   - HTTP method: POST
   - Leave "Trigger webhook when drafts are modified" off

## Domain, email, Search Console

1. Add `felthandicraftnepal.com` as a custom domain on the Pages project.
2. Add `www` too, and redirect it to the apex with a Cloudflare redirect rule, so there is one canonical form.
3. In Cloudflare, turn on Email Routing and forward `info@felthandicraftnepal.com` to the client's inbox.
4. In Google Search Console, add the URL-prefix property `https://felthandicraftnepal.com/` and choose the HTML tag method. Paste only the token value into Site Settings in the Studio, and publish.
5. After the rebuild, verify the property and submit `https://felthandicraftnepal.com/sitemap.xml`.

## Before launch

- Replace everything marked "Sample" in the Studio, and all sample prices.
- Review the fixed wording in `lib/copy.ts` and the descriptions in `generateMetadata` in `app/page.tsx`, `app/products/page.tsx`, `app/about/page.tsx` and `app/contact/page.tsx`.
- Add the WhatsApp number in Site Settings. The WhatsApp buttons stay hidden until it is set.
- Upload real photographs, then re-run Lighthouse. See the note below.
- Paste a live product URL and the home page into Google's Rich Results Test.

## Performance

Measured with Lighthouse 12.8 (mobile, simulated throttling) on a local server with gzip, using the seed content.

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| Home | 98 | 100 | 100 | 100 | 2.2 s | 0 |
| Category | 98 | 100 | 100 | 100 | 2.2 s | 0 |
| Product | 97 | 100 | 100 | 100 | 2.2 s | 0 |

The seed has no photographs, so these runs show flat placeholders and the LCP element is text. Real photographs from the Sanity CDN have not been measured yet.

First-load JavaScript is about 136 to 139 KB gzipped, and most of that is the Next.js and React runtime. Sanity's client is build-time only and does not reach the browser.

## Dependencies

| Package | Why |
| --- | --- |
| `next`, `react`, `react-dom` | The required framework. |
| `@sanity/client` | Fetches content at build time. Not shipped to browsers. |
| `tailwindcss`, `@tailwindcss/postcss` | The required CSS system and its build step. |
| `typescript`, `@types/node`, `@types/react`, `@types/react-dom` | Strict type checking. |
| `eslint`, `eslint-config-next` | The lint step. |

Studio only (`studio/package.json`):

| Package | Why |
| --- | --- |
| `sanity` | The Studio itself. |
| `react`, `react-dom`, `styled-components` | Required peer dependencies of the Studio. |
| `typescript` | Type checks the schemas. |

Deliberately not used: `next/image` (needs a server), `@portabletext/react` (a 30-line renderer covers the styles the Studio allows), `@sanity/image-url` (`lib/image-loader.ts` is small and also computes aspect-ratio crops).
