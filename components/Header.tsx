import Link from "next/link";
import { categoryPath } from "@/lib/paths";
import type { Category, Settings } from "@/lib/types";
import { MobileMenu } from "./MobileMenu";
import { SanityImage } from "./SanityImage";

const navLink = "inline-flex min-h-11 items-center hover:underline underline-offset-[6px] decoration-1";

export function Header({ settings, categories }: { settings: Settings; categories: Category[] }) {
  return (
    <header className="site-header">
      <div className="wrap flex h-full items-center justify-between gap-4">
        <Link prefetch={false} href="/" className="max-w-[60%] font-serif text-lg leading-tight lg:max-w-none lg:text-xl">
          {settings.logo?.asset ? (
            <SanityImage image={settings.logo} sizes="180px" className="h-11 !w-auto" />
          ) : (
            settings.businessName
          )}
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            <li><Link prefetch={false} href="/" className={navLink}>Home</Link></li>
            <li><Link prefetch={false} href="/about/" className={navLink}>About Us</Link></li>
            <li className="group relative">
              <Link prefetch={false} href="/products/" className={navLink}>
                Products
                <svg aria-hidden="true" viewBox="0 0 10 6" className="ml-1.5 h-1.5 w-2.5 fill-none stroke-current">
                  <path d="M1 1l4 4 4-4" />
                </svg>
              </Link>
              <ul className="invisible absolute -left-5 top-full w-72 border border-rule bg-ivory py-2 text-ink opacity-0 transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                {categories.map((category) => (
                  <li key={category._id}>
                    <Link prefetch={false} href={categoryPath(category)} className="block px-5 py-1.5 hover:bg-sand">
                      {category.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li><Link prefetch={false} href="/contact/" className={navLink}>Contact</Link></li>
          </ul>
        </nav>

        <Link prefetch={false} href="/contact/#enquiry" className="btn hidden !min-h-11 !py-1 lg:inline-flex">
          Enquire Now
        </Link>

        <MobileMenu categories={categories.map((c) => ({ title: c.title, href: categoryPath(c) }))} />
      </div>
    </header>
  );
}
