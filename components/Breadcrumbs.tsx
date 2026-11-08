import Link from "next/link";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="py-5 text-sm">
      <ol className="flex flex-wrap gap-x-2">
        {items.map((item, i) => (
          <li key={item.path} className="flex gap-x-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === items.length - 1 ? (
              <span aria-current="page">{item.name}</span>
            ) : (
              <Link prefetch={false} href={item.path} className="link-rule">{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
