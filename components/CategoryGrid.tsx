import Link from "next/link";
import { categoryPath } from "@/lib/paths";
import type { Category } from "@/lib/types";
import { SanityImage } from "./SanityImage";

/** A mosaic: columns add up to 12 on each row and aspects keep row heights equal. */
const TILES = [
  { span: "col-span-12 lg:col-span-7", aspect: 7 / 5, sizes: "(min-width: 1024px) 57vw, 100vw" },
  { span: "col-span-6 lg:col-span-5", aspect: 1, sizes: "(min-width: 1024px) 41vw, 50vw" },
  { span: "col-span-6 lg:col-span-4", aspect: 4 / 5, sizes: "(min-width: 1024px) 32vw, 50vw" },
  { span: "col-span-12 lg:col-span-8", aspect: 8 / 5, sizes: "(min-width: 1024px) 66vw, 100vw" },
  { span: "col-span-6 lg:col-span-3", aspect: 3 / 4, sizes: "(min-width: 1024px) 24vw, 50vw" },
  { span: "col-span-6 lg:col-span-5", aspect: 5 / 4, sizes: "(min-width: 1024px) 41vw, 50vw" },
  { span: "col-span-6 lg:col-span-4", aspect: 1, sizes: "(min-width: 1024px) 32vw, 50vw" },
  { span: "col-span-6 lg:col-span-12", aspect: 12 / 4, sizes: "(min-width: 1024px) 96vw, 50vw" },
];

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <ul className="grid-12 gap-y-10 lg:gap-y-14">
      {categories.map((category, i) => {
        const tile = TILES[i % TILES.length] as (typeof TILES)[number];
        return (
          <li key={category._id} className={tile.span} data-reveal>
            <Link prefetch={false} href={categoryPath(category)} className="group block">
              <div className="tile-frame">
                <SanityImage image={category.image} sizes={tile.sizes} aspect={tile.aspect} tone={i} />
              </div>
              <h3 className="relative -mt-6 inline-block bg-ivory pr-5 pt-2 text-sub group-hover:text-terracotta-ink lg:-mt-8">
                {category.title}
              </h3>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
