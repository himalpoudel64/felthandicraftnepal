export const SITE_URL = (process.env.SITE_URL || "https://felthandicraftnepal.com").replace(/\/+$/, "");

export const absoluteUrl = (path: string) => `${SITE_URL}${path}`;

export const categoryPath = (category: { slug: string }) => `/products/${category.slug}/`;

export const productPath = (product: { slug: string; category: { slug: string } }) =>
  `/products/${product.category.slug}/${product.slug}/`;
