import { plainText, truncate } from "./format";
import { ogImageUrl, plainImageUrl } from "./images";
import { absoluteUrl, categoryPath, productPath } from "./paths";
import type { Category, ImageData, Product, Settings } from "./types";

const DESCRIPTION_MAX = 155;
const CONTEXT = "https://schema.org";

export const describe = (text: string) => truncate(text.replace(/\s+/g, " ").trim(), DESCRIPTION_MAX);

export type PageSeo = {
  title: string;
  description: string;
  path: string;
  image?: ImageData;
  noindex?: boolean;
  jsonLd?: object[];
};

export const socialImage = (image: ImageData | undefined, settings: Settings) =>
  ogImageUrl(image) ?? ogImageUrl(settings.defaultOgImage);

export const categoryTitle = (category: Category) =>
  category.seoTitle || `${category.title}: Handmade Felt from Nepal | Bishnu Laxmi`;

export const categoryDescription = (category: Category) =>
  category.seoDescription || describe(plainText(category.description));

export const productTitle = (product: Product) =>
  product.seoTitle || `${product.name}: Handmade Felt | Bishnu Laxmi`;

export const productDescription = (product: Product) =>
  product.seoDescription || describe(product.shortDescription || plainText(product.description));

const organizationId = () => absoluteUrl("/#organization");

export function organizationLd(settings: Settings) {
  const { address } = settings;
  const postal =
    address && Object.values(address).some(Boolean)
      ? {
          "@type": "PostalAddress",
          streetAddress: address.street,
          addressLocality: address.city,
          addressRegion: address.region,
          postalCode: address.postalCode,
          addressCountry: address.country,
        }
      : undefined;
  const social = settings.socialLinks?.map((link) => link.url);

  return {
    "@context": CONTEXT,
    "@type": "Organization",
    "@id": organizationId(),
    name: settings.businessName,
    url: absoluteUrl("/"),
    logo: plainImageUrl(settings.logo, 512) ?? absoluteUrl("/logo/logo.png"),
    email: settings.email,
    telephone: settings.phone,
    address: postal,
    sameAs: social?.length ? social : undefined,
  };
}

export function websiteLd(settings: Settings) {
  return {
    "@context": CONTEXT,
    "@type": "WebSite",
    url: absoluteUrl("/"),
    name: settings.businessName,
    publisher: { "@id": organizationId() },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbLd(items: Crumb[]) {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function collectionLd(name: string, description: string, path: string, products: Product[]) {
  return {
    "@context": CONTEXT,
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: product.name,
        url: absoluteUrl(productPath(product)),
      })),
    },
  };
}

/** No offers: prices are agreed after contact, so none are published. */
export function productLd(product: Product, settings: Settings) {
  const images = (product.images ?? []).flatMap((image) => plainImageUrl(image) ?? []);
  return {
    "@context": CONTEXT,
    "@type": "Product",
    name: product.name,
    description: productDescription(product),
    url: absoluteUrl(productPath(product)),
    image: images.length ? images : undefined,
    category: product.category.title,
    keywords: product.tags?.length ? product.tags.join(", ") : undefined,
    brand: { "@type": "Brand", name: settings.businessName },
    size: product.sizes.length ? product.sizes.map((size) => size.label) : undefined,
  };
}

export const categoryCrumbs = (category: Category): Crumb[] => [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products/" },
  { name: category.title, path: categoryPath(category) },
];

export const productCrumbs = (product: Product): Crumb[] => [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products/" },
  { name: product.category.title, path: categoryPath(product.category) },
  { name: product.name, path: productPath(product) },
];
