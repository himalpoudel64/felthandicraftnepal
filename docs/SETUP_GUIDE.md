# Setup and deployment guide

This guide takes the project from a fresh computer to a live website at felthandicraftnepal.com. Follow the sections in order the first time.

Dashboards change their wording from time to time. If a button has moved, look for the nearest match, and check that service's documentation if needed. This guide contains no real keys or passwords, and none should ever be added to it or committed to GitHub.

**How the system fits together**

1. The owner edits content in Sanity Studio and presses Publish.
2. Sanity calls a Cloudflare deploy hook through a webhook.
3. Cloudflare downloads the code from GitHub, fetches all published content from Sanity and builds plain HTML files into `dist/`.
4. Cloudflare serves those files. About one or two minutes after publishing, the new content is live.

**The website does not change the moment something is published.** It changes when the rebuild finishes. If several things are published quickly, several rebuilds run one after another, and the last one contains everything.

---

## A. Prerequisites

| What | Why | Where |
| --- | --- | --- |
| Node.js 24 LTS | Runs Astro and Sanity. Astro requires version 22.23.4 or newer. | nodejs.org |
| Git | Sends code to GitHub | git-scm.com |
| A code editor (optional) | Editing `.env` files | code.visualstudio.com |
| GitHub account | Stores the code | github.com |
| Sanity account | Content and images | sanity.io |
| Cloudflare account | Hosting and DNS | cloudflare.com |
| Web3Forms access key | Sends enquiry emails | web3forms.com |

Check that Node and Git are installed by opening a terminal and running each of these. Node must report `v24` or `v22.23.4` or newer.

```bash
node --version
```

```bash
git --version
```

---

## B. Local development

**1. Download the code.** Replace `YOUR-GITHUB-NAME` with the owner of the repository.

```bash
git clone https://github.com/YOUR-GITHUB-NAME/felthandicraftnepal.git
```

```bash
cd felthandicraftnepal
```

**2. Install the website's dependencies.** This reads `package.json` and downloads Astro and the other packages into `node_modules`.

```bash
npm install
```

**3. Install the Studio's dependencies.** The Studio is a separate project in the `studio` folder.

```bash
npm install --prefix studio
```

**4. Create your environment file.** On Windows Command Prompt, use `copy` in place of `cp`.

```bash
cp .env.example .env
```

Open `.env` and fill it in:

| Variable | Value |
| --- | --- |
| `PUBLIC_SANITY_PROJECT_ID` | From section C. Leave empty to preview with the included sample content. |
| `PUBLIC_SANITY_DATASET` | `production` |
| `SITE_URL` | `https://felthandicraftnepal.com` |
| `PUBLIC_WEB3FORMS_KEY` | From section F. Without it, forms offer an email link instead of sending. |

**5. Start the website.** It runs at http://localhost:4321 and refreshes as you edit code.

```bash
npm run dev
```

Press Ctrl+C in the terminal to stop it.

**6. Start the Studio** in a second terminal, after completing section C. It runs at http://localhost:3333.

```bash
npm run dev --prefix studio
```

**7. Build the production website.** This writes the finished site to `dist/`, and also lists any missing images, alt text and temporary stock photos.

```bash
npm run build
```

**8. Preview the production build** at http://localhost:4321.

```bash
npm run preview
```

**9. Check types** across the website code.

```bash
npm run check
```

---

## C. Sanity CMS setup

**1. Create an account** at sanity.io. Use an account the business owner will keep long-term, or add the owner as an Administrator later.

**2. Create a project.** Go to sanity.io/manage and create a new project, named `Bishnu Laxmi Felt Handicraft`. Choose the Free plan.

**3. Find the project ID.** It is the short code shown on the project's page in sanity.io/manage, such as `a1b2c3d4`. Put it in `.env` as `PUBLIC_SANITY_PROJECT_ID`.

**4. Configure the dataset.** Create a dataset named `production` with **public** visibility if one does not already exist. The Free plan only offers public datasets. "Public" means published content can be read without a key, which is fine because it all appears on the website anyway. Drafts are not public.

**5. API access.** The website only reads published content, at build time, so **no API token is needed**. Under API, then CORS origins, add `http://localhost:3333` with "Allow credentials" ticked, so the Studio can run on your computer.

**6. Connect the Studio.**

```bash
cp studio/.env.example studio/.env
```

Open `studio/.env` and put the same project ID in `SANITY_STUDIO_PROJECT_ID`.

**7. Run the Studio locally.** Log in when asked.

```bash
npm run dev --prefix studio
```

**Load the starting content.** Run these from the `studio` folder. The import uploads 25 photographs and creates 36 documents, including the Privacy Policy and Terms and Conditions.

```bash
cd studio
```

```bash
npx sanity login
```

```bash
npm run seed
```

Return to the main folder.

```bash
cd ..
```

If you need to load the starting content again, note that `npm run seed` skips anything that already exists. It will not overwrite the owner's edits.

**8. Deploy the Studio.** From the `studio` folder, run the following. Sanity asks you to choose an address, for example `felthandicraftnepal.sanity.studio`.

```bash
npm run deploy --prefix studio
```

**9. Open the dashboard** at that address. Invite the owner under Members in sanity.io/manage. Choose the Editor role for day-to-day use, or Administrator if they should manage the project. The owner never needs GitHub, Cloudflare or the code.

Steps 10 to 17 are the everyday tasks, and they are written out for the owner in [CLIENT_GUIDE.md](CLIENT_GUIDE.md):

| Step | Where in the Studio |
| --- | --- |
| 10. Add categories | Categories, then the pencil icon |
| 11. Add products | Products by category, pick a category, then the pencil icon |
| 12. Upload images | Product, then the Photos tab |
| 13. Add alt text | Click a photo, then fill in Alt text. Publishing is blocked without it. |
| 14. Sizes | Product, then the Sizes tab. Optional. Prices are never shown on the website. |
| 15. Publish or hide | The green Publish button. To hide, set "Show on website?" to Hidden on the "Where it appears" tab, then Publish. |
| 16. Homepage | Home Page |
| 17. Site settings | Site Settings |
| Legal pages | Privacy Policy and Terms and Conditions, at the bottom of the sidebar. Each appears on the website, in the footer and in the sitemap only once it is published. |

---

## D. Cloudflare Pages deployment

First, put the code on GitHub: create an empty private repository, then follow the commands GitHub shows for pushing an existing repository.

1. Create an account at cloudflare.com.
2. In the dashboard, open **Workers & Pages** and choose to create an application. Select the **Pages** option, and then **Import an existing Git repository**. Make sure you are creating a Pages project and not a Worker.
3. Connect GitHub and select the repository.
4. Set the build configuration:

| Setting | Value |
| --- | --- |
| Project name | `felthandicraftnepal` |
| Production branch | `main` |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | leave empty |

5. Add these environment variables under the build settings, or later under Settings, then Variables and Secrets, for **Production**:

| Name | Value |
| --- | --- |
| `NODE_VERSION` | `24` |
| `PUBLIC_SANITY_PROJECT_ID` | your project ID |
| `PUBLIC_SANITY_DATASET` | `production` |
| `SITE_URL` | `https://felthandicraftnepal.com` |
| `PUBLIC_WEB3FORMS_KEY` | your access key |

6. Choose **Save and Deploy**. The first build takes a few minutes.
7. Open the `*.pages.dev` address Cloudflare gives you and check the home page, a category, a product and the contact page. Check the build log for lines beginning `[content]`, which list anything still missing.

Cloudflare builds automatically whenever code is pushed to `main`. A failed build leaves the previous version of the site online.

Security headers and caching are set in `public/_headers`. If an image or form ever stops working after a change of service, its Content-Security-Policy line is the first place to look. `public/_redirects` is ready for any future address changes.

**Connect the custom domain, DNS and HTTPS:** see section G.

---

## E. Sanity webhook configuration

This makes the website rebuild when content is published.

**1. Create the Cloudflare deploy hook.** In Cloudflare, open the Pages project, then Settings, then Builds, then **Deploy hooks**. Add a hook named `Sanity publish` for the `main` branch.

**2. Copy the URL.** Treat it like a password, because anyone who has it can trigger builds.

**3. Create the webhook.** In sanity.io/manage, open the project, then API, then **Webhooks**, and create one.

**4 to 6. Enter these settings:**

| Setting | Value |
| --- | --- |
| Name | `Rebuild website` |
| URL | the deploy hook URL |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | `_type in ["category", "product", "siteSettings", "homePage", "aboutPage", "legalPage"]` |
| Projection | leave empty |
| HTTP method | POST |
| HTTP headers | none |
| Secret | leave empty |
| Trigger when drafts are modified | off |

Leaving the drafts option off means only published changes start a rebuild.

**7. Test it.** In the Studio, change one word in a product description and press Publish.

**8. Verify.** In Cloudflare, open the project's Deployments list. A new build should appear within a few seconds. When it finishes, reload the product page to see the change. In Sanity, the webhook's attempts log shows whether Cloudflare accepted the call.

---

## F. Email enquiry setup

Web3Forms receives the form from the visitor's browser and emails it to the inbox tied to the access key. **That inbox is decided when the key is created**, and the website code cannot redirect it.

1. Go to web3forms.com and create an access key.
2. Enter `felthandicraftnepal@gmail.com` as the recipient. Open that inbox and confirm, if asked.
3. Copy the access key from the email.
4. In Cloudflare, add it as `PUBLIC_WEB3FORMS_KEY` under Variables and Secrets, then redeploy, because variables are only read during a build.
5. Add the same key to your local `.env`.
6. **Turn on the captcha check.** Both email forms (the product enquiry and the contact page) show an hCaptcha check, using Web3Forms' own free-plan hCaptcha key. In the Web3Forms dashboard, open the access key's settings and choose **hCaptcha** as the spam protection, so that Web3Forms rejects any submission without a solved check. Without this step the check still appears, but Web3Forms does not enforce it.
7. Open any product page on the live site, choose a size, press **Enquire About This Product**, choose **Enquire via Email**, complete the check, and submit a test.
8. Confirm that the message reaches felthandicraftnepal@gmail.com with the subject `Product Enquiry – [Product Name]`, and check the Spam folder the first time. Mark it as "Not spam" if necessary.

Web3Forms' access key is designed to be visible in the page, and it can only send mail to its own inbox. It is not a private credential. Spam is reduced by the hCaptcha check and by a hidden honeypot field.

The hCaptcha script is loaded from hcaptcha.com only when a visitor starts filling in a form, so other pages load no third-party scripts. `public/_headers` allows `hcaptcha.com` and `*.hcaptcha.com` in its Content-Security-Policy for this. If the check cannot load, for example because of an ad blocker, the form shows the email and WhatsApp alternatives.

If a submission fails, the visitor sees a link to email the same details and a link to WhatsApp.

---

## G. Domain and email configuration

**DNS.** In Cloudflare, add `felthandicraftnepal.com` as a site on the Free plan. Cloudflare shows two nameservers. At the company where the domain is registered, replace the existing nameservers with those two. This can take from minutes to a day. Before switching, note any existing DNS records (email especially) and confirm that Cloudflare imported them.

**Connect the site.** In the Pages project, open **Custom domains**, and add `felthandicraftnepal.com`. Add `www.felthandicraftnepal.com` as well. Cloudflare creates the DNS records for you.

**One address only.** So that Google sees one version of the site, add a redirect rule in Cloudflare from `www.felthandicraftnepal.com` to `https://felthandicraftnepal.com`, keeping the path. Use the redirect templates under Rules.

**HTTPS.** Cloudflare issues the certificate automatically, usually within minutes. Under SSL/TLS, Edge Certificates, turn on **Always Use HTTPS**.

**Using the existing business email.** The site uses felthandicraftnepal@gmail.com and needs no email setup on the domain.

**Optional: Cloudflare Email Routing.** This can forward an address such as `info@felthandicraftnepal.com` to the Gmail inbox. It only receives and forwards. It cannot send outbound mail from that address, so replies would come from Gmail unless Gmail's "Send mail as" is set up with a separate outgoing mail service. Forwarding can also occasionally be delayed or marked as spam. Enquiries from the website go straight to Gmail and do not depend on this.

---

## H. Google Search Console

1. Go to search.google.com/search-console and add a **Domain** property for `felthandicraftnepal.com`.
2. Google shows a TXT record. In Cloudflare, go to DNS, Records, add it as type TXT at `@`, then press Verify. An alternative is a URL-prefix property verified with an HTML tag: paste only the token into the verification field in Site Settings, Google and sharing tab, publish and wait for the rebuild.
3. Under **Sitemaps**, submit `https://felthandicraftnepal.com/sitemap.xml`.
4. Check indexing under **Pages**. New sites can take days or weeks.
5. Paste a product address into the search bar at the top to inspect it, and choose **Request indexing** for important pages.
6. Run a live product page and the home page through Google's Rich Results Test at search.google.com/test/rich-results.

The site deliberately publishes no prices, because prices are agreed after contact. Product structured data therefore has no `offers`, so the Rich Results Test will report the products as not eligible for product rich results, with a warning about the missing offer. That is expected and does not affect normal search listings. Breadcrumbs remain eligible.

---

## I. Updating the website

Everything here is done in the Studio, followed by Publish. Wait a minute or two for the rebuild.

| Task | How |
| --- | --- |
| Change the homepage hero | Home Page, Top of page tab, Slideshow images |
| Replace photographs | Open the item, click the photo, then replace it, and update the alt text |
| Add a category | Categories, pencil icon. Set Display order. |
| Add a product | Products by category, pick one, pencil icon |
| Change sizes | Product, Sizes tab. Drag to reorder. The first is selected by default. |
| Update descriptions and tags | Product, Details tab |
| Hide a product | Product, Where it appears tab, set to Hidden |
| Update contact information | Site Settings. If the email changes, also create a new Web3Forms key for it. |
| Change SEO titles and descriptions | Google and sharing tab on any product or category, or on Site Settings for the home page |

---

## J. Troubleshooting

| Problem | What to do |
| --- | --- |
| **Sanity connection error during build** | Check `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET` in Cloudflare. Confirm the dataset is public and the project has not reached a usage limit. |
| **Studio will not load locally** | Add `http://localhost:3333` to CORS origins with credentials allowed. Check `studio/.env`. |
| **"Content error: no published categories"** | The build stops on purpose so an empty site never replaces a working one. Publish at least one category and product, and the Site Settings and Home Page documents. |
| **Missing images** | Check the `[content]` lines in the build log. Open the item, and confirm the photo is there and the document is published. |
| **Invalid or duplicate slug** | Each web address must be unique within products, and within categories. Press Generate, or add a word. |
| **Failed static build** | Open the failed deployment's log in Cloudflare and read the first error. Confirm `NODE_VERSION` is `24`. Run `npm run build` locally to reproduce it. |
| **Privacy or terms link missing from the footer** | The document is not published, or its text is empty. Open it in the Studio and publish it. |
| **Webhook does not fire** | In Sanity, read the webhook's attempts log. Confirm the URL, method POST, dataset and filter. Replace the deploy hook if it was deleted. |
| **Email submission error** | Confirm `PUBLIC_WEB3FORMS_KEY` is set for Production, then redeploy. Check for a monthly limit in Web3Forms and check Spam in Gmail. |
| **Captcha check does not appear** | Check the browser console for a Content-Security-Policy error and confirm `public/_headers` still allows `hcaptcha.com`. Ad blockers can also block it, and the form then offers email and WhatsApp links. |
| **Domain or DNS problems** | Confirm the nameservers at the registrar match Cloudflare's. Check Custom domains in the Pages project shows Active. Allow time for changes to spread. |
| **A product page is missing** | Confirm it is Published in Sanity, "Show on website?" is Published, its category is not Hidden, and it has at least one size. |
| **Stale content after publishing** | Check Deployments in Cloudflare and wait for the build to finish, then reload with Ctrl+F5. If no build started, see the webhook row above. |
| **An old address gives a 404** | Add a line to `public/_redirects`, such as `/products/old/item/ /products/new/item/ 301`. |

---

## K. Cost breakdown

The intended running cost is $0 per month, excluding domain registration. Free plans belong to those companies and can change without notice, so this is not a permanent guarantee. Check each pricing page once a year.

| Service | Free allowance | What could cause a charge or a stop | Checked |
| --- | --- | --- | --- |
| Sanity (Free) | 20 user seats, 2 public datasets, 10,000 documents, 1 million API CDN requests and 250,000 API requests a month, 100 GB assets, 100 GB bandwidth a month | Heavy image traffic could reach the bandwidth limit. The Free plan does not permit overage: service is restricted until the quota resets or you upgrade. | sanity.io/pricing and Sanity's quota documentation, November 2026 |
| Cloudflare Pages (Free) | 500 builds a month, 1 build at a time, 20-minute build timeout, 20,000 files per site, 25 MiB per file, 100 custom domains per project | More than 500 publishes in a month would queue no further builds until the next month. Cloudflare's limits page does not state a request limit for static files. | developers.cloudflare.com/pages/platform/limits, November 2026 |
| Web3Forms (Free) | Reported by third-party sites as 250 submissions a month. **Not confirmed**, because the official pricing page could not be read when this guide was written. | Check the current limit on web3forms.com. A busy month could exceed it, after which forms may fail and show the fallback links. | Third-party sources only |
| hCaptcha through Web3Forms | Included with the Web3Forms free plan, using Web3Forms' site key. Other captcha providers such as Turnstile and reCAPTCHA are Web3Forms Pro features. | None while the free hCaptcha is used | docs.web3forms.com, November 2026 |
| WhatsApp click-to-chat | No charge for wa.me links | None | n/a |
| GitHub | Private repositories on the free plan | None expected at this size | n/a |
| Cloudflare Email Routing (optional) | Receiving and forwarding only. Sending to arbitrary recipients requires a paid Workers plan. | Only if outbound sending is added | developers.cloudflare.com, November 2026 |
| Domain name | Not free | Annual renewal at the registrar | Check your registrar |

No Cloudflare Workers, Functions, server or database are used.

---

## Temporary photographs

No real workshop photographs were available. These five stock photographs stand in for them. They are ticked as "temporary stock photo" in the Studio, listed in every build log, and each displays a credit on the page.

| Used on | Replace with | Source | Licence and credit |
| --- | --- | --- | --- |
| Home Page, slide 1 | An artisan actively working on felt | [Dhaka Weaving Center 10692229944](https://commons.wikimedia.org/wiki/File:Dhaka_Weaving_Center,_Nepal_(10692229944).jpg) | CC BY 2.0, Jim Holmes/AusAID |
| Home Page, slide 3 | Hands shaping or stitching felt | [Dhaka Weaving Center 10691904535](https://commons.wikimedia.org/wiki/File:Dhaka_Weaving_Center,_Nepal_(10691904535).jpg) | CC BY 2.0, Jim Holmes/AusAID |
| Home Page, Our story, main photo | A portrait of an artisan at work | [Weaving at a MEDEP business, 10706419796](https://commons.wikimedia.org/wiki/File:Kesu_Magar_weaving_cloth_at_a_MEDEP_supported_business,_Triyuga_Municipality,_Bokse,_Udayapur,_NEPAL._(10706419796).jpg) | CC BY 2.0, Jim Holmes/Department of Foreign Affairs and Trade |
| Home Page, Our impact | Women working together in the workshop | [Dhaka Weaving Center 10692106583](https://commons.wikimedia.org/wiki/File:Dhaka_Weaving_Center,_Nepal_(10692106583).jpg) | CC BY 2.0, Jim Holmes/AusAID |
| About Page, first photo | The workshop or the team | [Dhaka Weaving Center 10691935355](https://commons.wikimedia.org/wiki/File:Dhaka_Weaving_Center,_Nepal_(10691935355).jpg) | CC BY 2.0, Jim Holmes/AusAID |

Things to know:

- They show Nepali women **weaving at other enterprises, not making felt**, and not employees of this business. No suitably licensed photograph of felt being made in Nepal was found. The credits and alt text say so.
- The copyright licence covers the photographs. It does not give permission from the people shown for their image to promote a business. **Replace these before the site is promoted publicly.**
- To replace one: upload the real photo, write alt text, clear the credit, untick "temporary stock photo" and publish.
- Purse, Bags and Hats have no photographs yet and show a labelled colour panel. All other product and category photographs are the client's own.

## What is still sample content

- The 6 products beginning with "Sample" are demonstration items. Delete them once real products exist.
- Text beginning "Sample text" on the Home Page and About Page needs the owner's own words.
- Category descriptions begin with "Sample text" and need checking.

After real photographs are in Sanity, the folder `public/seed` is no longer used and can be deleted.
