import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SanityImage } from "@/components/SanityImage";
import { plainText, truncate } from "@/lib/format";
import { categoryPath, productPath } from "@/lib/paths";
import { getContent } from "@/lib/sanity";

export default async function ProductsPage() {
  const { categories } = await getContent();

  return (
    <div className="wrap pb-20 lg:pb-32">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Products", path: "/products/" }]} />
      <h1 className="max-w-5xl pt-6 text-title">Handmade felt products from Nepal</h1>

      <div className="mt-14 lg:mt-24">
        {categories.map((category, i) => {
          const flipped = i % 2 === 1;
          return (
            <section key={category._id} className="grid-12 items-center gap-y-6 border-t border-rule py-10 lg:py-16" data-reveal>
              <div className={`col-span-12 lg:col-span-6 ${flipped ? "lg:order-2 lg:col-start-7" : ""}`}>
                <Link prefetch={false} href={categoryPath(category)} tabIndex={-1} aria-hidden="true" className="block">
                  <div className="tile-frame">
                    <SanityImage image={category.image} sizes="(min-width: 1024px) 50vw, 100vw" aspect={3 / 2} tone={i} />
                  </div>
                </Link>
              </div>
              <div className={`col-span-12 lg:col-span-5 ${flipped ? "lg:order-1" : "lg:col-start-8"}`}>
                <h2 className="text-section">
                  <Link prefetch={false} href={categoryPath(category)} className="hover:text-terracotta-ink">{category.title}</Link>
                </h2>
                <p className="mt-4">{truncate(plainText(category.intro), 200)}</p>
                {category.products.length > 0 && (
                  <ul className="mt-5 border-t border-rule">
                    {category.products.slice(0, 4).map((product) => (
                      <li key={product._id} className="border-b border-rule">
                        <Link prefetch={false} href={productPath(product)} className="block py-2 hover:text-terracotta-ink">{product.name}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
