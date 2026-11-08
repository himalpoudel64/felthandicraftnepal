import type { Metadata } from "next";
import Link from "next/link";
import { preload } from "react-dom";
import { CategoryGrid } from "@/components/CategoryGrid";
import { EnquiryForm } from "@/components/EnquiryForm";
import { HeroCarousel, type HeroSlide } from "@/components/HeroCarousel";
import { ProductCard } from "@/components/ProductCard";
import { SanityImage } from "@/components/SanityImage";
import { copy } from "@/lib/copy";
import { enquirySettings, interestGroups } from "@/lib/enquiry";
import { imageProps } from "@/lib/image-loader";
import { absoluteUrl } from "@/lib/paths";
import { getContent } from "@/lib/sanity";
import { pageMetadata } from "@/lib/seo";

const HERO_WIDTHS = [640, 828, 1080, 1440, 1920, 2400];

export async function generateMetadata(): Promise<Metadata> {
  const { settings, home } = await getContent();
  return pageMetadata({
    title: "Handmade Felt Products from Nepal | Bishnu Laxmi Felt Handicraft",
    description:
      "Handmade felt bags, hats, coasters and home pieces from Nepal, made by women artisans building skills and income. Browse the collection and enquire.",
    path: "/",
    image: home.heroSlides?.[0],
    settings,
  });
}

export default async function HomePage() {
  const content = await getContent();
  const { home, about, categories } = content;

  const slides: HeroSlide[] = (home.heroSlides ?? []).map((slide) => ({
    img: imageProps(slide, { sizes: "100vw", widths: HERO_WIDTHS }),
    caption: slide.caption,
    position: slide.hotspot ? `${slide.hotspot.x * 100}% ${slide.hotspot.y * 100}%` : undefined,
  }));
  if (!slides.length) slides.push({ img: null });

  const lcp = slides[0]?.img;
  if (lcp) {
    preload(lcp.src, { as: "image", imageSrcSet: lcp.srcSet, imageSizes: lcp.sizes, fetchPriority: "high" });
  }

  return (
    <>
      <section data-hero className="relative -mt-(--header-h) lg:mb-16">
        <HeroCarousel slides={slides} />
        <div className="wrap relative z-10 -mt-12 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:-bottom-16 lg:mt-0">
          <div className="bg-burgundy p-6 text-ivory sm:p-8 lg:pointer-events-auto lg:w-[min(68%,60rem)] lg:p-12">
            <h1 className="text-display">
              {copy.hero.headline.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </h1>
            <p className="mt-5 max-w-xl text-lead">{copy.hero.support}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link prefetch={false} href={copy.hero.primary.href} className="btn btn-mustard">{copy.hero.primary.label}</Link>
              <Link prefetch={false} href={copy.hero.secondary.href} className="btn btn-on-dark">{copy.hero.secondary.label}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap grid-12 items-end pb-10 pt-20 lg:pb-0 lg:pt-32">
        <div className="col-span-12 lg:col-span-7" data-reveal>
          <h2 className="text-section">{copy.about.title}</h2>
          {about.intro && <p className="mt-6 max-w-2xl text-lead">{about.intro}</p>}
          <Link prefetch={false} href="/about/" className="link-rule mt-6 inline-block font-medium">{copy.about.link}</Link>
        </div>
        <div className="col-span-8 col-start-5 mt-10 lg:relative lg:z-10 lg:col-span-4 lg:col-start-9 lg:-mb-24 lg:mt-0" data-reveal>
          <SanityImage image={about.images?.[0]} sizes="(min-width: 1024px) 32vw, 66vw" aspect={3 / 4} tone={2} />
        </div>
      </section>

      <section className="wrap pt-16 lg:pt-20">
        <div className="mb-8 flex flex-wrap items-baseline gap-x-8 gap-y-2 lg:mb-12 lg:max-w-[66%] lg:justify-between">
          <h2 className="text-section">{copy.collection.title}</h2>
          <Link prefetch={false} href="/products/" className="link-rule font-medium">{copy.collection.link}</Link>
        </div>
        <CategoryGrid categories={categories} />
      </section>

      {home.featured.length > 0 && (
        <section className="wrap grid-12 py-20 lg:py-32">
          <div className="col-span-12 mb-10 lg:sticky lg:top-28 lg:col-span-4 lg:mb-0 lg:self-start">
            <h2 className="text-section">{copy.featured.title}</h2>
            <Link prefetch={false} href="/products/" className="link-rule mt-5 inline-block font-medium">{copy.featured.link}</Link>
          </div>
          <ul className="col-span-12 grid grid-cols-2 gap-x-3 gap-y-10 lg:col-span-7 lg:col-start-6 lg:gap-x-6">
            {home.featured.map((product, i) => (
              <li key={product._id} className="lg:even:mt-24" data-reveal>
                <ProductCard product={product} sizes="(min-width: 1024px) 28vw, 50vw" tone={i + 3} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {(home.impactItems?.length ?? 0) > 0 && (
        <section className="bg-forest py-20 text-ivory lg:py-28">
          <div className="wrap">
            <h2 className="max-w-xl text-lead !font-sans tracking-normal text-mustard">{copy.impact.title}</h2>
            <ul className="mt-8">
              {home.impactItems?.map((item) => (
                <li key={item.title} className="grid-12 items-baseline gap-y-3 border-t border-ivory/30 py-8 lg:py-10" data-reveal>
                  <h3 className="col-span-12 text-title lg:col-span-7">{item.title}</h3>
                  <p className="col-span-12 max-w-md lg:col-span-5">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="wrap grid-12 gap-y-10 py-20 lg:py-32">
        <div className="col-span-12 lg:col-span-5">
          <h2 className="text-section">{copy.contact.title}</h2>
          <p className="mt-6 max-w-md">{copy.contact.text}</p>
        </div>
        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <EnquiryForm {...enquirySettings(content)} pageUrl={absoluteUrl("/")} interestGroups={interestGroups(content)} />
        </div>
      </section>
    </>
  );
}
