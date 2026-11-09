export type PortableSpan = { _type: "span"; _key?: string; text: string; marks?: string[] };

export type PortableBlock = {
  _type: "block";
  _key?: string;
  style?: string;
  listItem?: "bullet" | "number";
  children: PortableSpan[];
};

export type ImageData = {
  alt?: string;
  caption?: string;
  credit?: string;
  temporaryStock?: boolean;
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number };
  asset?: { _id: string; width: number; height: number } | null;
};

export type Size = { label: string; price: number };
export type Spec = { label: string; value: string };
export type TitledText = { title: string; text: string };

type Seo = { seoTitle?: string; seoDescription?: string };

export type RawCategory = Seo & {
  _id: string;
  _updatedAt?: string;
  title: string;
  slug: string;
  description?: PortableBlock[];
  image?: ImageData;
};

export type RawProduct = Seo & {
  _id: string;
  _updatedAt?: string;
  name: string;
  slug: string;
  category: string;
  additionalCategories?: string[];
  images?: ImageData[];
  shortDescription?: string;
  description?: PortableBlock[];
  tags?: string[];
  specifications?: Spec[];
  sizes?: Size[];
  samplePrice?: boolean;
  featured?: boolean;
  relatedProducts?: string[];
};

export type Product = Omit<RawProduct, "category" | "sizes" | "relatedProducts"> & {
  category: RawCategory;
  sizes: Size[];
  related: string[];
};

export type Category = RawCategory & { products: Product[] };

export type Address = {
  street?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
};

export type Settings = Seo & {
  _updatedAt?: string;
  businessName: string;
  email: string;
  phone?: string;
  whatsappNumber: string;
  address?: Address;
  socialLinks?: { label: string; url: string }[];
  footerDescription?: string;
  logo?: ImageData;
  defaultOgImage?: ImageData;
  googleVerification?: string;
};

export type RawHome = {
  _updatedAt?: string;
  heroSlides?: ImageData[];
  heroHeadline: string;
  heroText: string;
  heroPrimaryLabel: string;
  heroSecondaryLabel: string;
  storyTitle: string;
  storyText: string;
  storyLinkLabel: string;
  storyImage?: ImageData;
  storyDetailImage?: ImageData;
  categoriesTitle: string;
  featuredTitle: string;
  featuredProducts?: string[];
  impactTitle: string;
  impactText?: string;
  impactImage?: ImageData;
  impactItems?: TitledText[];
  impactStats?: { value: string; label: string }[];
  contactTitle: string;
  contactText: string;
};

export type About = {
  _updatedAt?: string;
  heading?: string;
  intro?: string;
  story?: PortableBlock[];
  mission?: string;
  vision?: string;
  socialImpact?: string;
  processSteps?: TitledText[];
  images?: ImageData[];
};

export type Content = {
  settings: Settings;
  home: Omit<RawHome, "featuredProducts"> & { featured: Product[]; more: Product[] };
  about: About;
  categories: Category[];
  products: Product[];
};
