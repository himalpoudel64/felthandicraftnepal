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
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number };
  asset?: { _id: string; width: number; height: number } | null;
};

export type Size = { label: string; price: number };
export type Spec = { label: string; value: string };

type Seo = { seoTitle?: string; seoDescription?: string };

export type RawCategory = Seo & {
  _id: string;
  _updatedAt?: string;
  title: string;
  slug: string;
  intro?: PortableBlock[];
  image?: ImageData;
};

export type RawProduct = Seo & {
  _id: string;
  _updatedAt?: string;
  name: string;
  slug: string;
  category: string;
  images?: ImageData[];
  shortDescription?: string;
  description?: PortableBlock[];
  specifications?: Spec[];
  sizes?: Size[];
  featured?: boolean;
};

export type Category = RawCategory & { products: Product[] };
export type Product = Omit<RawProduct, "category" | "sizes"> & {
  category: Omit<Category, "products">;
  sizes: Size[];
};

export type Address = {
  street?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
};

export type Settings = {
  _updatedAt?: string;
  businessName: string;
  tagline?: string;
  email: string;
  phone?: string;
  whatsappNumber?: string;
  address?: Address;
  socialLinks?: { label: string; url: string }[];
  logo?: ImageData;
  defaultOgImage?: ImageData;
  googleVerification?: string;
};

export type TitledText = { title: string; text: string };

export type RawHome = {
  _updatedAt?: string;
  heroSlides?: ImageData[];
  featuredProducts?: string[];
  impactItems?: TitledText[];
};

export type About = {
  _updatedAt?: string;
  intro?: string;
  story?: PortableBlock[];
  mission?: string;
  vision?: string;
  commitment?: string;
  processSteps?: TitledText[];
  images?: ImageData[];
};

export type Content = {
  settings: Settings;
  home: Omit<RawHome, "featuredProducts"> & { featured: Product[] };
  about: About;
  categories: Category[];
  products: Product[];
};
