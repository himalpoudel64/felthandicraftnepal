import type { PortableBlock, Size } from "./types";

const number = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export const formatNPR = (price: number) => `NPR ${number.format(price)}`;

/** "From NPR 450", or the plain price when there is only one. */
export function priceFrom(sizes: Size[]): string {
  const prices = sizes.map((size) => size.price);
  const low = Math.min(...prices);
  return new Set(prices).size > 1 ? `From ${formatNPR(low)}` : formatNPR(low);
}

export function plainText(blocks: PortableBlock[] | undefined): string {
  return (blocks ?? [])
    .map((block) => block.children?.map((span) => span.text).join("") ?? "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:\s]+$/, "")}…`;
}
