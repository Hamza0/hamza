import type { NoteHeading } from "@/lib/note-reading";

export function NoteReadingNav({ headings }: { headings: readonly NoteHeading[] }) {
  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page" className="my-6">
      <details className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
        <summary className="cursor-pointer rounded-sm text-sm font-medium marker:text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">On this page</summary>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm marker:text-muted-foreground">
          {headings.map((heading) => (
            <li key={heading.id} className="pl-1">
              <a href={`#${heading.id}`} className="block rounded-sm py-2 leading-relaxed text-muted-foreground underline-offset-4 hover:text-[hsl(var(--note-accent))] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">{heading.title}</a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
