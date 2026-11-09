import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@sanity/client";
import { DEFAULT_EMAIL, DEFAULT_WHATSAPP } from "./contact";
import { siteQuery } from "./queries";
import type {
  About,
  Category,
  Content,
  ImageData,
  Product,
  RawCategory,
  RawHome,
  RawProduct,
  Settings,
} from "./types";

type Raw = {
  settings: Settings | null;
  home: RawHome | null;
  about: About | null;
  categories: RawCategory[];
  products: RawProduct[];
};

type Doc = Record<string, unknown> & { _id: string; _type: string };

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID as string | undefined;
const dataset = (import.meta.env.PUBLIC_SANITY_DATASET as string | undefined) || "production";

function fetchFromSanity(id: string): Promise<Raw> {
  const client = createClient({
    projectId: id,
    dataset,
    apiVersion: "2025-02-19",
    useCdn: false,
    perspective: "published",
  });
  return client.fetch<Raw>(siteQuery);
}

/** Lets the site render before a Sanity project exists. Mirrors the shape of siteQuery. */
async function readSeed(): Promise<Raw> {
  const seedDir = path.join(process.cwd(), "studio/seed");
  const text = await readFile(path.join(seedDir, "seed.ndjson"), "utf8");
  const manifest = JSON.parse(await readFile(path.join(seedDir, "images.json"), "utf8")) as Record<
    string,
    { width: number; height: number }
  >;

  // Seed images use Sanity's import syntax. Here they resolve to the variants in public/seed.
  const docs = text
    .split("\n")
    .filter(Boolean)
    .map(
      (line) =>
        JSON.parse(line, (_key, value: unknown) => {
          const asset = (value as { _sanityAsset?: string } | null)?._sanityAsset;
          const name = asset?.match(/images\/(.+)\.jpg$/)?.[1];
          const size = name ? manifest[name] : undefined;
          return name && size ? { ...(value as object), asset: { _id: `local:${name}`, ...size } } : value;
        }) as Doc,
    );

  const slug = (doc: Doc) => (doc.slug as { current: string }).current;
  const refs = (value: unknown) => ((value ?? []) as { _ref: string }[]).map((r) => r._ref);
  const order = (doc: Doc) => Number(doc.sortOrder ?? 999999);
  const ofType = (type: string) =>
    docs.filter((doc) => doc._type === type && doc.status === "published").sort((a, b) => order(a) - order(b));
  const find = (id: string) => docs.find((doc) => doc._id === id);
  const home = find("homePage");

  return {
    settings: (find("siteSettings") ?? null) as Settings | null,
    home: home ? ({ ...home, featuredProducts: refs(home.featuredProducts) } as unknown as RawHome) : null,
    about: (find("aboutPage") ?? null) as About | null,
    categories: ofType("category").map((doc) => ({ ...doc, slug: slug(doc) }) as unknown as RawCategory),
    products: ofType("product").map(
      (doc) =>
        ({
          ...doc,
          slug: slug(doc),
          category: (doc.category as { _ref: string })._ref,
          additionalCategories: refs(doc.additionalCategories),
          relatedProducts: refs(doc.relatedProducts),
        }) as unknown as RawProduct,
    ),
  };
}

function normalise(raw: Raw): Content {
  if (!raw.settings) throw new Error("Content error: publish the Site Settings document in the Studio.");
  if (!raw.home) throw new Error("Content error: publish the Home Page document in the Studio.");
  if (!raw.categories?.length) throw new Error("Content error: no published categories were found.");

  const categoriesById = new Map(raw.categories.map((c) => [c._id, c]));
  const products: Product[] = [];
  for (const { relatedProducts, ...product } of raw.products ?? []) {
    const category = categoriesById.get(product.category);
    // A product in a hidden category disappears with it.
    if (!category || !product.sizes?.length) continue;
    products.push({
      ...product,
      category,
      sizes: product.sizes,
      additionalCategories: (product.additionalCategories ?? []).filter((id) => categoriesById.has(id)),
      related: relatedProducts ?? [],
    });
  }
  if (!products.length) throw new Error("Content error: no published products were found.");

  const categories: Category[] = raw.categories.map((category) => ({
    ...category,
    products: products.filter(
      (p) => p.category._id === category._id || p.additionalCategories?.includes(category._id),
    ),
  }));

  const productsById = new Map(products.map((p) => [p._id, p]));
  const { featuredProducts, ...home } = raw.home;
  const chosen = (featuredProducts ?? []).flatMap((id) => productsById.get(id) ?? []);
  const featured = (chosen.length ? chosen : products.filter((p) => p.featured)).slice(0, 8);
  const more = products.filter((p) => p.images?.[0]?.asset && !featured.includes(p));

  return {
    settings: {
      ...raw.settings,
      email: raw.settings.email || DEFAULT_EMAIL,
      whatsappNumber: raw.settings.whatsappNumber || DEFAULT_WHATSAPP,
    },
    home: { ...home, featured, more },
    about: raw.about ?? {},
    categories,
    products,
  };
}

let content: Promise<Content> | undefined;

/** All site content, fetched once per build. A failed fetch fails the build, so the live site stays up. */
export function getContent(): Promise<Content> {
  content ??= (async () => normalise(projectId ? await fetchFromSanity(projectId) : await readSeed()))();
  return content;
}

export function relatedTo(product: Product, products: Product[], limit = 4): Product[] {
  const chosen = product.related.flatMap((id) => products.find((p) => p._id === id) ?? []);
  if (chosen.length) return chosen.slice(0, limit);
  const others = products.filter((p) => p._id !== product._id && p.images?.[0]?.asset);
  const sameCategory = others.filter((p) => p.category._id === product.category._id);
  return [...sameCategory, ...others.filter((p) => !sameCategory.includes(p))].slice(0, limit);
}

/** Printed once per build, from the sitemap route. */
export function reportContentProblems({ settings, home, about, categories, products }: Content): void {
  const problems: string[] = [];
  const stock: string[] = [];
  const check = (where: string, image: ImageData | undefined) => {
    if (!image?.asset) problems.push(`${where}: image missing`);
    else if (!image.alt?.trim()) problems.push(`${where}: alt text missing`);
    if (image?.temporaryStock) stock.push(where);
  };

  home.heroSlides?.forEach((slide, i) => check(`Home Page slide ${i + 1}`, slide));
  check("Home Page story photo", home.storyImage);
  check("Home Page close-up", home.storyDetailImage);
  check("Home Page impact photo", home.impactImage);
  about.images?.forEach((image, i) => check(`About Page photo ${i + 1}`, image));
  if (settings.logo) check("Site Settings logo", settings.logo);
  categories.forEach((c) => check(`Category "${c.title}"`, c.image));
  products.forEach((p) => {
    if (!p.images?.length) problems.push(`Product "${p.name}": no images`);
    p.images?.forEach((image, i) => check(`Product "${p.name}" photo ${i + 1}`, image));
  });

  const samples = products.filter((p) => p.samplePrice);
  if (samples.length) console.warn(`\n[content] ${samples.length} products are marked as having sample prices.`);
  if (stock.length) console.warn(`[content] Temporary stock photos still in use: ${stock.join("; ")}`);
  if (!projectId) console.warn("[content] Built from the seed file, not from Sanity.");
  if (!import.meta.env.PUBLIC_WEB3FORMS_KEY) console.warn("[content] PUBLIC_WEB3FORMS_KEY is not set: forms offer an email link.");
  if (problems.length) {
    console.warn(`[content] ${problems.length} missing images or alt text:`);
    problems.forEach((problem) => console.warn(`  - ${problem}`));
  }
}
