import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PortableText } from "@/components/PortableText";
import { SanityImage } from "@/components/SanityImage";
import { getContent } from "@/lib/sanity";
import { breadcrumbLd, describe, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { about, settings } = await getContent();
  return pageMetadata({
    title: "About Us: Women Artisans of Nepal | Bishnu Laxmi Felt Handicraft",
    description: describe(
      about.intro ||
        "Bishnu Laxmi Felt Handicraft is a Nepal-based maker of handmade felt, giving women skills, employment and income.",
    ),
    path: "/about/",
    image: about.images?.[0],
    settings,
  });
}

export default async function AboutPage() {
  const { about, settings } = await getContent();

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "About Us", path: "/about/" }])} />
      <section className="wrap grid-12 pt-14 lg:pt-24">
        <h1 className="col-span-12 text-title lg:col-span-10">About {settings.businessName}</h1>
        {about.intro && <p className="col-span-12 mt-6 text-lead lg:col-span-6 lg:col-start-7 lg:mt-10">{about.intro}</p>}
      </section>

      <section className="wrap grid-12 gap-y-10 pt-14 lg:pt-20">
        <div className="col-span-12 lg:col-span-8">
          <SanityImage image={about.images?.[0]} sizes="(min-width: 1024px) 66vw, 100vw" aspect={3 / 2} tone={1} priority />
        </div>
        {(about.story?.length ?? 0) > 0 && (
          <div className="col-span-12 lg:col-span-6 lg:col-start-4 lg:pt-10" data-reveal>
            <h2 className="mb-6 text-section">Our story</h2>
            <PortableText value={about.story} />
          </div>
        )}
      </section>

      <section className="wrap grid-12 gap-y-6 py-20 lg:py-32">
        {about.mission && (
          <div className="col-span-12 bg-sand p-8 lg:col-span-7 lg:p-14" data-reveal>
            <h2 className="text-section">Mission</h2>
            <p className="mt-5 text-lead">{about.mission}</p>
          </div>
        )}
        {about.vision && (
          <div className="col-span-12 bg-forest p-8 text-ivory lg:col-span-5 lg:mt-24 lg:p-12" data-reveal>
            <h2 className="text-section">Vision</h2>
            <p className="mt-5">{about.vision}</p>
          </div>
        )}
      </section>

      {(about.processSteps?.length ?? 0) > 0 && (
        <section className="wrap grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-4">
            <h2 className="text-section">How felt is made here</h2>
            <div className="mt-10 hidden lg:block">
              <SanityImage image={about.images?.[1]} sizes="32vw" aspect={4 / 5} tone={3} />
            </div>
          </div>
          <ol className="col-span-12 lg:col-span-7 lg:col-start-6">
            {about.processSteps?.map((step, i) => (
              <li key={step.title} className="flex gap-6 border-t border-rule py-8 lg:gap-10" data-reveal>
                <span aria-hidden="true" className="w-12 shrink-0 font-serif text-section text-terracotta-ink">{i + 1}</span>
                <div>
                  <h3 className="text-sub">{step.title}</h3>
                  <p className="mt-2">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {about.commitment && (
        <section className="wrap grid-12 py-20 lg:py-32">
          <div className="col-span-12 bg-burgundy p-8 text-ivory lg:col-span-9 lg:col-start-4 lg:p-14" data-reveal>
            <h2 className="text-section">Our commitment</h2>
            <p className="mt-5 max-w-2xl text-lead">{about.commitment}</p>
            <Link prefetch={false} href="/products/" className="btn btn-mustard mt-8">Explore the Collection</Link>
          </div>
        </section>
      )}
    </>
  );
}
