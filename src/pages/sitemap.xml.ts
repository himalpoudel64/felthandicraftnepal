import type { APIRoute } from "astro";
import { absoluteUrl, categoryPath, productPath } from "../lib/paths";
import { getContent, reportContentProblems } from "../lib/sanity";

const escapeXml = (text: string) =>
  text.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c] as string);

export const GET: APIRoute = async () => {
  const content = await getContent();
  reportContentProblems(content);
  const { home, about, categories, products, settings, legal } = content;

  const entries: { path: string; updated?: string }[] = [
    { path: "/", updated: home._updatedAt },
    { path: "/about/", updated: about._updatedAt },
    { path: "/products/" },
    { path: "/contact/", updated: settings._updatedAt },
    ...categories.map((category) => ({ path: categoryPath(category), updated: category._updatedAt })),
    ...products.map((product) => ({ path: productPath(product), updated: product._updatedAt })),
    ...legal.map((page) => ({ path: page.path, updated: page._updatedAt })),
  ];

  const urls = entries
    .map(({ path, updated }) => {
      const lastmod = updated ? `<lastmod>${updated}</lastmod>` : "";
      return `<url><loc>${escapeXml(absoluteUrl(path))}</loc>${lastmod}</url>`;
    })
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
};
