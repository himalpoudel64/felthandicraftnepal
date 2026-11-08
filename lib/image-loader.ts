import { absoluteUrl } from "./paths";
import type { ImageData } from "./types";

const CDN = "https://cdn.sanity.io/images";
const QUALITY = 72;
const DEFAULT_WIDTHS = [320, 480, 640, 828, 1080, 1440, 1920, 2400];

export type ImgProps = {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
  alt: string;
};

type Rect = { left: number; top: number; width: number; height: number };

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

/** Applies the editor's crop, then fits the requested aspect ratio around the hotspot. */
function cropRect(image: ImageData, aspect?: number): Rect | null {
  if (!image.asset?.width || !image.asset.height) return null;
  const { width: w, height: h } = image.asset;
  const crop = image.crop ?? { top: 0, bottom: 0, left: 0, right: 0 };

  let left = crop.left * w;
  let top = crop.top * h;
  let width = w - left - crop.right * w;
  let height = h - top - crop.bottom * h;

  if (aspect) {
    const centreX = (image.hotspot?.x ?? 0.5) * w;
    const centreY = (image.hotspot?.y ?? 0.5) * h;
    if (width / height > aspect) {
      const next = height * aspect;
      left = clamp(centreX - next / 2, left, left + width - next);
      width = next;
    } else {
      const next = width / aspect;
      top = clamp(centreY - next / 2, top, top + height - next);
      height = next;
    }
  }

  return {
    left: Math.round(left),
    top: Math.round(top),
    width: Math.round(width),
    height: Math.round(height),
  };
}

/** image-<id>-<w>x<h>-<ext> becomes <id>-<w>x<h>.<ext> */
function assetPath(assetId: string): string {
  return assetId.replace(/^image-/, "").replace(/-([a-z0-9]+)$/i, ".$1");
}

/** Seed photographs have pre-built variants in public/seed, so widths must match a file. */
const localName = (image: ImageData) =>
  image.asset?._id.startsWith("local:") ? image.asset._id.slice("local:".length) : null;

function buildUrl(image: ImageData, rect: Rect, width: number): string {
  const project = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const asset = image.asset as NonNullable<ImageData["asset"]>;
  const local = localName(image);
  if (local) return `/seed/${local}-${width}.webp`;
  const height = Math.round((width * rect.height) / rect.width);
  const params = new URLSearchParams();
  if (rect.width !== asset.width || rect.height !== asset.height) {
    params.set("rect", `${rect.left},${rect.top},${rect.width},${rect.height}`);
  }
  params.set("w", String(width));
  params.set("h", String(height));
  params.set("q", String(QUALITY));
  params.set("auto", "format");
  params.set("fit", "max");
  return `${CDN}/${project}/${dataset}/${assetPath(asset._id)}?${params}`;
}

/** Attributes for a native <img>, or null when the image has no usable asset. */
export function imageProps(
  image: ImageData | undefined,
  options: { sizes: string; aspect?: number; widths?: number[] },
): ImgProps | null {
  if (!image) return null;
  const rect = cropRect(image, options.aspect);
  if (!rect) return null;

  const maxWidth = localName(image) ? (image.asset as { width: number }).width : rect.width;
  const fits = (options.widths ?? DEFAULT_WIDTHS).filter((width) => width < maxWidth);
  const widths = [...fits, maxWidth];
  const largest = widths[widths.length - 1] as number;
  const fallback = widths.find((width) => width >= 1080) ?? largest;

  return {
    src: buildUrl(image, rect, fallback),
    srcSet: widths.map((width) => `${buildUrl(image, rect, width)} ${width}w`).join(", "),
    sizes: options.sizes,
    width: largest,
    height: Math.round((largest * rect.height) / rect.width),
    alt: image.alt?.trim() ?? "",
  };
}

/** A single 1200×630 URL for Open Graph and Twitter cards. */
export function ogImageUrl(image: ImageData | undefined): string | undefined {
  if (!image) return undefined;
  const local = localName(image);
  if (local) return `/seed/${local}-og.jpg`;
  const rect = cropRect(image, 1200 / 630);
  return rect ? buildUrl(image, rect, 1200) : undefined;
}

/** An uncropped URL, used for structured data. */
export function plainImageUrl(image: ImageData | undefined, width = 1200): string | undefined {
  if (!image) return undefined;
  const local = localName(image);
  if (local) return absoluteUrl(`/seed/${local}-og.jpg`);
  const rect = cropRect(image);
  return rect ? buildUrl(image, rect, Math.min(width, rect.width)) : undefined;
}
