import type { PortableBlock, Product } from "./types";

const number = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export const formatPrice = (price: number) => `NPR ${number.format(price)}`;

export const plainText = (blocks: PortableBlock[] | undefined) =>
  (blocks ?? [])
    .flatMap((block) => block.children ?? [])
    .map((span) => span.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 40))}…`;
}

/** The label on product cards. Sample prices are never shown there. */
export function startingPrice(product: Product): string | undefined {
  if (product.samplePrice) return undefined;
  const lowest = Math.min(...product.sizes.map((size) => size.price));
  return `${product.sizes.length > 1 ? "From " : ""}${formatPrice(lowest)}`;
}

export const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;
