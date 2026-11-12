import type { LegalId, Product, RawCategory } from "./types";

/** Matches legalPages in studio/schemaTypes/index.ts. */
export const LEGAL_PATHS: Record<LegalId, string> = {
  privacyPolicy: "/privacy-policy/",
  termsAndConditions: "/terms-and-conditions/",
};

export const absoluteUrl = (path: string) => new URL(path, import.meta.env.SITE).href;
export const categoryPath = (category: Pick<RawCategory, "slug">) => `/products/${category.slug}/`;
export const productPath = (product: Pick<Product, "slug" | "category">) =>
  `${categoryPath(product.category)}${product.slug}/`;
