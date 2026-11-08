import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PortableText } from "@/components/PortableText";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { SizePicker } from "@/components/SizePicker";
import { enquirySettings } from "@/lib/enquiry";
import { formatNPR } from "@/lib/format";
import { absoluteUrl, categoryPath, productPath } from "@/lib/paths";
import { getContent } from "@/lib/sanity";
import { breadcrumbLd, productLd, productMetadata } from "@/lib/seo";

export const dynamicParams = false;

type Params = { params: Promise<{ category: string; product: string }> };

export async function generateStaticParams() {
  const { products } = await getContent();
  return products.map((product) => ({ category: product.category.slug, product: product.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category, product: slug } = await params;
  const { products, settings } = await getContent();
  const product = products.find((p) => p.slug === slug && p.category.slug === category);
  return product ? productMetadata(product, settings) : {};
}

export default async function ProductPage({ params }: Params) {
  const { category: categorySlug, product: slug } = await params;
  const content = await getContent();
  const product = content.products.find((p) => p.slug === slug && p.category.slug === categorySlug);
  if (!product) notFound();

  const related = content.products
    .filter((p) => p._id !== product._id && p.category._id === product.category._id)
    .slice(0, 4);
  const path = productPath(product);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products/" },
    { name: product.category.title, path: categoryPath(product.category) },
    { name: product.name, path },
  ];

  return (
    <div className="wrap">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={productLd(product, content.settings)} />
      <Breadcrumbs items={crumbs} />

      <div className="grid-12 gap-y-8 pt-2">
        <div className="col-span-12 lg:col-span-7">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div className="col-span-12 lg:sticky lg:top-24 lg:col-span-4 lg:col-start-9 lg:self-start">
          <h1 className="text-section">{product.name}</h1>
          {product.shortDescription && <p className="mt-4 text-lead">{product.shortDescription}</p>}
          <div className="mt-6">
            <SizePicker
              {...enquirySettings(content)}
              productName={product.name}
              sizes={product.sizes}
              pageUrl={absoluteUrl(path)}
            />
          </div>
          <table className="mt-8 w-full text-left">
            <caption className="mb-2 text-left text-sm font-medium">All sizes and prices</caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">Size</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            <tbody>
              {product.sizes.map((size) => (
                <tr key={size.label} className="border-t border-rule">
                  <td className="py-2">{size.label}</td>
                  <td className="py-2 text-right">{formatNPR(size.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-12 gap-y-10 pt-14 lg:pt-24">
        <section className="col-span-12 lg:col-span-6">
          <h2 className="mb-5 text-sub">About this piece</h2>
          <PortableText value={product.description} />
        </section>
        {(product.specifications?.length ?? 0) > 0 && (
          <section className="col-span-12 lg:col-span-4 lg:col-start-9">
            <h2 className="mb-5 text-sub">Specifications</h2>
            <dl>
              {product.specifications?.map((spec) => (
                <div key={spec.label} className="flex justify-between gap-6 border-t border-rule py-2">
                  <dt className="text-ink-soft">{spec.label}</dt>
                  <dd className="text-right">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>

      {related.length > 0 && (
        <section className="border-t border-rule py-14 mt-20 lg:mt-32 lg:py-20">
          <h2 className="mb-8 text-section">More {product.category.title.toLowerCase()}</h2>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {related.map((item, i) => (
              <li key={item._id} data-reveal>
                <ProductCard product={item} sizes="(min-width: 1024px) 24vw, 50vw" tone={i + 1} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
