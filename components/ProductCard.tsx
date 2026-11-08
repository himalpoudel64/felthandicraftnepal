import Link from "next/link";
import { priceFrom } from "@/lib/format";
import { productPath } from "@/lib/paths";
import type { Product } from "@/lib/types";
import { SanityImage } from "./SanityImage";

export function ProductCard({
  product,
  sizes,
  aspect = 4 / 5,
  tone,
}: {
  product: Product;
  sizes: string;
  aspect?: number;
  tone?: number;
}) {
  return (
    <Link prefetch={false} href={productPath(product)} className="group block">
      <div className="tile-frame">
        <SanityImage image={product.images?.[0]} sizes={sizes} aspect={aspect} tone={tone} />
      </div>
      <h3 className="mt-3 font-serif text-sub group-hover:text-terracotta-ink">{product.name}</h3>
      <p className="mt-1 text-ink-soft">{priceFrom(product.sizes)}</p>
    </Link>
  );
}
