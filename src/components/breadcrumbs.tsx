import Link from "next/link";
import { breadcrumbJsonLd, serializeJsonLd, type BreadcrumbItem } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: readonly BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-xs leading-relaxed text-muted-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd(items)) }}
      />
      <ol className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        {items.map((item, index) => (
          <li key={item.path} className="inline-flex min-w-0 items-baseline gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            {index === items.length - 1 ? (
              <span aria-current="page" className="break-words">{item.name}</span>
            ) : (
              <Link href={item.path} className="underline underline-offset-4 hover:text-foreground">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
