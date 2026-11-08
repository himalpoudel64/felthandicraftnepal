import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PortableText } from "@/components/PortableText";
import { ProductCard } from "@/components/ProductCard";
import { categoryPath } from "@/lib/paths";
import { getContent } from "@/lib/sanity";

export const dynamicParams = false;

type Params = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  const { categories } = await getContent();
  return categories.map((category) => ({ category: category.slug }));
}

/** Rows of 6 + 5 (offset) and 3 + 5 + 4, so the grid never reads as uniform cards. */
const LAYOUT = [
  { span: "col-span-12 lg:col-span-6", aspect: 4 / 5, sizes: "(min-width: 1024px) 48vw, 100vw" },
  { span: "col-span-6 lg:col-span-5 lg:col-start-8 lg:mt-24", aspect: 1, sizes: "(min-width: 1024px) 41vw, 50vw" },
  { span: "col-span-6 lg:col-span-3", aspect: 3 / 4, sizes: "(min-width: 1024px) 24vw, 50vw" },
  { span: "col-span-6 lg:col-span-5", aspect: 5 / 4, sizes: "(min-width: 1024px) 41vw, 50vw" },
  { span: "col-span-6 lg:col-span-4", aspect: 1, sizes: "(min-width: 1024px) 32vw, 50vw" },
];

export default async function CategoryPage({ params }: Params) {
  const { category: slug } = await params;
  const { categories } = await getContent();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();
  const others = categories.filter((c) => c._id !== category._id);

  return (
    <div className="wrap">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Products", path: "/products/" },
          { name: category.title, path: categoryPath(category) },
        ]}
      />
      <div className="grid-12 gap-y-6 pt-6">
        <h1 className="col-span-12 text-title lg:col-span-6">{category.title}</h1>
        <PortableText value={category.intro} className="col-span-12 lg:col-span-5 lg:col-start-8 lg:pt-3" />
      </div>

      {category.products.length > 0 ? (
        <ul className="grid-12 gap-y-10 pt-14 lg:gap-y-16 lg:pt-24">
          {category.products.map((product, i) => {
            const cell = LAYOUT[i % LAYOUT.length] as (typeof LAYOUT)[number];
            return (
              <li key={product._id} className={cell.span} data-reveal>
                <ProductCard product={product} sizes={cell.sizes} aspect={cell.aspect} tone={i} />
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="pt-14">New pieces for this category are on their way.</p>
      )}

      <nav aria-labelledby="other-categories" className="mt-20 border-t border-rule py-14 lg:mt-32 lg:py-20">
        <h2 id="other-categories" className="mb-6 text-lead !font-sans tracking-normal">More from the collection</h2>
        <ul className="flex flex-wrap gap-x-10 gap-y-3 font-serif text-sub lg:text-section">
          {others.map((other) => (
            <li key={other._id}>
              <Link prefetch={false} href={categoryPath(other)} className="hover:text-terracotta-ink">{other.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
