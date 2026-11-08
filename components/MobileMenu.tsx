"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react";

export function MobileMenu({ categories }: { categories: { title: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape" && open) {
      setOpen(false);
      button.current?.focus();
    }
  }

  function closeOnLink(event: MouseEvent) {
    if ((event.target as HTMLElement).closest("a")) setOpen(false);
  }

  return (
    <div className="lg:hidden" onKeyDown={onKeyDown}>
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(!open)}
        className="min-h-11 min-w-16 border border-current px-3 text-sm font-medium"
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav
        id="mobile-menu"
        aria-label="Mobile"
        hidden={!open}
        onClick={closeOnLink}
        className="fixed inset-x-0 bottom-0 top-(--header-h) overflow-y-auto bg-ivory px-(--gutter) pb-12 pt-6 text-ink"
      >
        <ul className="font-serif text-3xl leading-tight">
          <li><Link prefetch={false} href="/" className="block py-2">Home</Link></li>
          <li><Link prefetch={false} href="/about/" className="block py-2">About Us</Link></li>
          <li><Link prefetch={false} href="/products/" className="block py-2">Products</Link></li>
        </ul>
        <ul className="my-2 border-l border-rule pl-4">
          {categories.map((category) => (
            <li key={category.href}>
              <Link prefetch={false} href={category.href} className="block py-1.5">{category.title}</Link>
            </li>
          ))}
        </ul>
        <ul className="font-serif text-3xl leading-tight">
          <li><Link prefetch={false} href="/contact/" className="block py-2">Contact</Link></li>
        </ul>
        <Link prefetch={false} href="/contact/#enquiry" className="btn btn-primary mt-6 w-full">Enquire Now</Link>
      </nav>
    </div>
  );
}
