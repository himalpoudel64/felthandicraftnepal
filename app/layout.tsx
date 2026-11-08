import type { ReactNode } from "react";
import { DM_Sans, Fraunces } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getContent } from "@/lib/sanity";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { settings, categories } = await getContent();
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body>
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
