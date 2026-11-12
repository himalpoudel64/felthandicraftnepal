const image = `{
  alt, caption, credit, temporaryStock, crop, hotspot,
  "asset": asset->{ _id, "width": metadata.dimensions.width, "height": metadata.dimensions.height }
}`;

const seo = `seoTitle, seoDescription`;

/**
 * The whole site is one small query that runs once per build, so every page
 * sees the same snapshot. Relations stay as ids and are joined in sanity.ts.
 */
export const siteQuery = `{
  "settings": *[_id == "siteSettings"][0]{
    _updatedAt, businessName, email, phone, whatsappNumber, address, footerDescription, ${seo},
    socialLinks[]{ label, url },
    "logo": logo${image},
    "defaultOgImage": defaultOgImage${image},
    googleVerification
  },
  "home": *[_id == "homePage"][0]{
    ...,
    "heroSlides": heroSlides[]${image},
    "storyImage": storyImage${image},
    "storyDetailImage": storyDetailImage${image},
    "impactImage": impactImage${image},
    "featuredProducts": featuredProducts[]._ref
  },
  "about": *[_id == "aboutPage"][0]{
    ...,
    "images": images[]${image}
  },
  "legal": *[_id in ["privacyPolicy", "termsAndConditions"]]{
    _id, _updatedAt, title, lastUpdated, body, seoDescription
  },
  "categories": *[_type == "category" && status == "published"]
    | order(sortOrder asc, title asc){
      _id, _updatedAt, title, "slug": slug.current, description, "image": image${image}, ${seo}
    },
  "products": *[_type == "product" && status == "published"]
    | order(coalesce(sortOrder, 999999) asc, name asc){
      _id, _updatedAt, name, "slug": slug.current, "category": category._ref,
      "additionalCategories": additionalCategories[]._ref,
      "images": images[]${image},
      shortDescription, description, tags,
      specifications[]{ label, value },
      sizes[]{ label },
      featured,
      "relatedProducts": relatedProducts[]._ref,
      ${seo}
    }
}`;
