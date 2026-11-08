import type { MetadataRoute } from "next";
import { absoluteUrl, categoryPath, productPath } from "@/lib/paths";
import { getContent, reportContentProblems } from "@/lib/sanity";

export const dynamic = "force-static";

const newest = (dates: (string | undefined)[]) =>
  dates.filter(Boolean).sort().at(-1);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getContent();
  reportContentProblems(content);
  const { settings, home, about, categories, products } = content;

  const entry = (path: string, lastModified: string | undefined) => ({
    url: absoluteUrl(path),
    lastModified,
  });

  return [
    entry("/", home._updatedAt),
    entry("/about/", about._updatedAt),
    entry("/products/", newest(categories.map((c) => c._updatedAt))),
    entry("/contact/", settings._updatedAt),
    ...categories.map((c) => entry(categoryPath(c), c._updatedAt)),
    ...products.map((p) => entry(productPath(p), p._updatedAt)),
  ];
}
