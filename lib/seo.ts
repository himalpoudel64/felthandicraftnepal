import type { Metadata } from "next";
import { ogImageUrl, plainImageUrl } from "./image-loader";
import { plainText, truncate } from "./format";
import { absoluteUrl, categoryPath, productPath, SITE_URL } from "./paths";
import type { Category, ImageData, Product, Settings } from "./types";

const DESCRIPTION_MAX = 155;

export const describe = (text: string) => truncate(text.replace(/\s+/g, " ").trim(), DESCRIPTION_MAX);

export function pageMetadata({
  title,
  description,
  path,
  image,
  settings,
}: {
  title: string;
  description: string;
  path: string;
  image?: ImageData;
  settings: Settings;
}): Metadata {
  const og = ogImageUrl(image) ?? ogImageUrl(settings.defaultOgImage);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: settings.businessName,
      type: "website",
      images: og ? [{ url: og, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: og ? "summary_large_image" : "summary",
      title,
      description,
      images: og ? [og] : undefined,
    },
  };
}

export function categoryMetadata(category: Category, settings: Settings): Metadata {
  return pageMetadata({
    title: category.seoTitle || `${category.title} – Handmade Felt from Nepal | Bishnu Laxmi Felt Handicraft`,
    description: category.seoDescription || describe(plainText(category.intro)),
    path: categoryPath(category),
    image: category.image,
    settings,
  });
}

export function productMetadata(product: Product, settings: Settings): Metadata {
  return pageMetadata({
    title: product.seoTitle || `${product.name} – Handmade Felt ${product.category.title} | Bishnu Laxmi`,
    description: product.seoDescription || describe(product.shortDescription || plainText(product.description)),
    path: productPath(product),
    image: product.images?.[0],
    settings,
  });
}

const CONTEXT = "https://schema.org";
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export function organizationLd(settings: Settings) {
  const { address } = settings;
  const postal = address && Object.values(address).some(Boolean)
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
    "@type": address?.street ? "LocalBusiness" : "Organization",
    "@id": ORGANIZATION_ID,
    name: settings.businessName,
    url: `${SITE_URL}/`,
    logo: plainImageUrl(settings.logo, 512) ?? absoluteUrl("/logo.png"),
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
    url: `${SITE_URL}/`,
    name: settings.businessName,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
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

export function collectionLd(category: Category) {
  return {
    "@context": CONTEXT,
    "@type": "CollectionPage",
    name: category.title,
    description: category.seoDescription || describe(plainText(category.intro)),
    url: absoluteUrl(categoryPath(category)),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: category.products.length,
      itemListElement: category.products.map((product, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: product.name,
        url: absoluteUrl(productPath(product)),
      })),
    },
  };
}

export function productLd(product: Product, settings: Settings) {
  const prices = product.sizes.map((size) => size.price);
  const images = (product.images ?? []).flatMap((image) => plainImageUrl(image) ?? []);
  return {
    "@context": CONTEXT,
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || describe(plainText(product.description)),
    url: absoluteUrl(productPath(product)),
    image: images.length ? images : undefined,
    category: product.category.title,
    brand: { "@type": "Brand", name: settings.businessName },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "NPR",
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: prices.length,
    },
  };
}
