import type { Metadata } from "next";
import Link from "next/link";
import { categoryPath } from "@/lib/paths";
import { getContent } from "@/lib/sanity";

export const metadata: Metadata = {
  title: { absolute: "Page not found | Bishnu Laxmi Felt Handicraft" },
  robots: { index: false },
};

export default async function NotFound() {
  const { categories } = await getContent();
  return (
    <div className="wrap grid-12 gap-y-10 py-20 lg:py-32">
      <div className="col-span-12 lg:col-span-7">
        <h1 className="text-title">We can&rsquo;t find that page</h1>
        <p className="mt-6 max-w-md text-lead">It may have moved, or the product may no longer be listed.</p>
        <Link prefetch={false} href="/" className="btn btn-primary mt-8">Back to the home page</Link>
      </div>
      <nav aria-labelledby="browse" className="col-span-12 lg:col-span-4 lg:col-start-9">
        <h2 id="browse" className="mb-3 text-sub">Browse the collection</h2>
        <ul>
          {categories.map((category) => (
            <li key={category._id} className="border-t border-rule">
              <Link prefetch={false} href={categoryPath(category)} className="block py-2 hover:text-terracotta-ink">{category.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
