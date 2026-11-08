const image = `{
  alt, caption, crop, hotspot,
  "asset": asset->{ _id, "width": metadata.dimensions.width, "height": metadata.dimensions.height }
}`;

const seo = `seoTitle, seoDescription`;

/**
 * The whole site is one small query: it runs once per build worker, and every
 * page sees the same snapshot. Relations stay as ids and are joined in sanity.ts.
 */
export const siteQuery = `{
  "settings": *[_id == "siteSettings"][0]{
    _updatedAt, businessName, tagline, email, phone, whatsappNumber, address,
    socialLinks[]{ label, url },
    "logo": logo${image},
    "defaultOgImage": defaultOgImage${image},
    googleVerification
  },
  "home": *[_id == "homePage"][0]{
    _updatedAt,
    "heroSlides": heroSlides[]${image},
    "featuredProducts": featuredProducts[]._ref,
    "impactItems": impactItems[]{ title, text }
  },
  "about": *[_id == "aboutPage"][0]{
    _updatedAt, intro, story, mission, vision, commitment,
    "processSteps": processSteps[]{ title, text },
    "images": images[]${image}
  },
  "categories": *[_type == "category" && status == "published"]
    | order(sortOrder asc, title asc){
      _id, _updatedAt, title, "slug": slug.current, intro, "image": image${image}, ${seo}
    },
  "products": *[_type == "product" && status == "published"]
    | order(coalesce(sortOrder, 999999) asc, name asc){
      _id, _updatedAt, name, "slug": slug.current, "category": category._ref,
      "images": images[]${image},
      shortDescription, description,
      specifications[]{ label, value },
      sizes[]{ label, price },
      featured, ${seo}
    }
}`;
