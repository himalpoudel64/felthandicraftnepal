import type { Product, RawCategory } from "./types";

export const absoluteUrl = (path: string) => new URL(path, import.meta.env.SITE).href;
export const categoryPath = (category: Pick<RawCategory, "slug">) => `/products/${category.slug}/`;
export const productPath = (product: Pick<Product, "slug" | "category">) =>
  `${categoryPath(product.category)}${product.slug}/`;
