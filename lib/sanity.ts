import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@sanity/client";
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

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const seedFile = process.env.SANITY_SEED_FILE;

async function fetchFromSanity(id: string): Promise<Raw> {
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
async function readSeed(file: string): Promise<Raw> {
  const text = await readFile(file, "utf8");
  const docs = text
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Record<string, unknown> & { _id: string; _type: string });

  const slug = (doc: Record<string, unknown>) => (doc.slug as { current: string }).current;
  const order = (doc: Record<string, unknown>) => Number(doc.sortOrder ?? 999999);
  const ofType = (type: string) =>
    docs
      .filter((doc) => doc._type === type && doc.status === "published")
      .sort((a, b) => order(a) - order(b));
  const home = docs.find((doc) => doc._id === "homePage");

  return {
    settings: (docs.find((doc) => doc._id === "siteSettings") ?? null) as Settings | null,
    home: home
      ? ({
          ...home,
          featuredProducts: ((home.featuredProducts ?? []) as { _ref: string }[]).map((r) => r._ref),
        } as RawHome)
      : null,
    about: (docs.find((doc) => doc._id === "aboutPage") ?? null) as About | null,
    categories: ofType("category").map((doc) => ({ ...doc, slug: slug(doc) }) as unknown as RawCategory),
    products: ofType("product").map(
      (doc) =>
        ({
          ...doc,
          slug: slug(doc),
          category: (doc.category as { _ref: string })._ref,
        }) as unknown as RawProduct,
    ),
  };
}

function normalise(raw: Raw): Content {
  if (!raw.settings) throw new Error("Content error: publish the Site Settings document in the Studio.");
  if (!raw.categories?.length) throw new Error("Content error: no published categories were found.");

  const categoriesById = new Map(raw.categories.map((c) => [c._id, c]));
  const products: Product[] = [];
  for (const product of raw.products ?? []) {
    const category = categoriesById.get(product.category);
    if (!category || !product.sizes?.length) continue;
    products.push({ ...product, category, sizes: product.sizes });
  }
  if (!products.length) throw new Error("Content error: no published products were found.");

  const categories: Category[] = raw.categories.map((category) => ({
    ...category,
    products: products.filter((p) => p.category._id === category._id),
  }));

  const productsById = new Map(products.map((p) => [p._id, p]));
  const chosen = (raw.home?.featuredProducts ?? []).flatMap((id) => productsById.get(id) ?? []);
  const featured = (chosen.length ? chosen : products.filter((p) => p.featured)).slice(0, 8);

  return {
    settings: raw.settings,
    home: {
      _updatedAt: raw.home?._updatedAt,
      heroSlides: raw.home?.heroSlides ?? [],
      impactItems: raw.home?.impactItems ?? [],
      featured,
    },
    about: raw.about ?? {},
    categories,
    products,
  };
}

let content: Promise<Content> | undefined;

/** All site content, fetched once per build worker. A failed fetch fails the build. */
export function getContent(): Promise<Content> {
  content ??= (async () => {
    if (seedFile) return normalise(await readSeed(seedFile));
    if (projectId) return normalise(await fetchFromSanity(projectId));
    return normalise(await readSeed(path.join(process.cwd(), "studio/seed/seed.ndjson")));
  })();
  return content;
}

export function usingSeed(): boolean {
  return Boolean(seedFile) || !projectId;
}

/** Prints missing images and alt text. Called from sitemap.ts, which runs exactly once per build. */
export function reportContentProblems({ settings, home, about, categories, products }: Content): void {
  const problems: string[] = [];
  const check = (where: string, image: ImageData | undefined) => {
    if (!image?.asset) problems.push(`${where}: image missing`);
    else if (!image.alt?.trim()) problems.push(`${where}: alt text missing`);
  };

  if (!home.heroSlides?.length) problems.push("Home Page hero: no images");
  home.heroSlides?.forEach((slide, i) => check(`Home Page hero slide ${i + 1}`, slide));
  if (!about.images?.length) problems.push("About Page: no images");
  about.images?.forEach((image, i) => check(`About Page image ${i + 1}`, image));
  if (settings.logo) check("Site Settings logo", settings.logo);
  categories.forEach((c) => check(`Category "${c.title}"`, c.image));
  products.forEach((p) => {
    if (!p.images?.length) problems.push(`Product "${p.name}": no images`);
    p.images?.forEach((image, i) => check(`Product "${p.name}" photo ${i + 1}`, image));
  });

  if (usingSeed()) console.warn("\n[content] Built from the sample seed file, not from Sanity.");
  if (!process.env.WEB3FORMS_KEY) console.warn("[content] WEB3FORMS_KEY is not set: forms fall back to email links.");
  if (problems.length) {
    console.warn(`\n[content] ${problems.length} missing images or alt text:`);
    problems.forEach((problem) => console.warn(`  - ${problem}`));
    console.warn("");
  }
}
