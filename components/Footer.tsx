import Link from "next/link";
import { categoryPath } from "@/lib/paths";
import type { Category, Settings } from "@/lib/types";

const heading = "mb-3 text-sm text-mustard";
const row = "inline-block py-1 hover:underline underline-offset-4";

export function Footer({ settings, categories }: { settings: Settings; categories: Category[] }) {
  return (
    <footer className="mt-auto bg-ink text-ivory">
      <div className="wrap grid-12 gap-y-12 py-16 lg:py-24">
        <div className="col-span-12 lg:col-span-5">
          <p className="max-w-md font-serif text-section">{settings.businessName}</p>
          {settings.tagline && <p className="mt-4">{settings.tagline}</p>}
        </div>

        <nav aria-label="Product categories" className="col-span-12 sm:col-span-6 lg:col-span-3 lg:col-start-7">
          <h2 className={`${heading} font-sans tracking-normal`}>Products</h2>
          <ul>
            {categories.map((category) => (
              <li key={category._id}>
                <Link prefetch={false} href={categoryPath(category)} className={row}>{category.title}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <nav aria-label="Site">
            <h2 className={`${heading} font-sans tracking-normal`}>Explore</h2>
            <ul>
              <li><Link prefetch={false} href="/" className={row}>Home</Link></li>
              <li><Link prefetch={false} href="/about/" className={row}>About Us</Link></li>
              <li><Link prefetch={false} href="/products/" className={row}>All Products</Link></li>
              <li><Link prefetch={false} href="/contact/" className={row}>Contact</Link></li>
            </ul>
          </nav>
          <h2 className={`${heading} mt-8 font-sans tracking-normal`}>Get in touch</h2>
          <ul>
            <li><a href={`mailto:${settings.email}`} className={`${row} break-all`}>{settings.email}</a></li>
            {settings.phone && <li><a href={`tel:${settings.phone.replace(/\s/g, "")}`} className={row}>{settings.phone}</a></li>}
            {settings.socialLinks?.map((link) => (
              <li key={link.url}><a href={link.url} rel="noopener" className={row}>{link.label}</a></li>
            ))}
          </ul>
        </div>

        <p className="col-span-12 border-t border-ink-soft pt-6 text-sm">
          © {new Date().getFullYear()} {settings.businessName}. Handmade in Nepal.
        </p>
      </div>
    </footer>
  );
}
