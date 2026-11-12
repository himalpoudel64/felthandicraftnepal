import type { PortableBlock } from "./types";

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

export const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;
