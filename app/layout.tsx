import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { DM_Sans, Fraunces } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/paths";
import { getContent } from "@/lib/sanity";
import { organizationLd, websiteLd } from "@/lib/seo";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fraunces",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getContent();
  return {
    metadataBase: new URL(SITE_URL),
    title: settings.businessName,
    verification: settings.googleVerification ? { google: settings.googleVerification } : undefined,
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6b1d2a",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { settings, categories } = await getContent();
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body>
        <JsonLd data={organizationLd(settings)} />
        <JsonLd data={websiteLd(settings)} />
        <a
          href="#main"
          className="fixed left-3 top-3 z-50 -translate-y-24 bg-ink px-4 py-2 text-ivory focus:translate-y-0"
        >
          Skip to main content
        </a>
        <Header settings={settings} categories={categories} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer settings={settings} categories={categories} />
      </body>
    </html>
  );
}
