import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

type NotePinboardCardProps = {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
};

export function NotePinboardCard({ slug, title, summary, minutes }: NotePinboardCardProps) {
  const titleId = `note-${slug}`;

  return (
    <Link
      href={`/blog/${slug}`}
      aria-labelledby={titleId}
      className="group relative flex h-full flex-col rounded-[3px] border border-border/80 bg-card px-5 pb-4 pt-10 shadow-[0_2px_3px_rgba(0,0,0,0.035),0_8px_18px_-10px_rgba(0,0,0,0.18)] transition-[transform,box-shadow,border-color] duration-200 ease-out hover:border-foreground/20 hover:shadow-[0_4px_6px_rgba(0,0,0,0.04),0_14px_24px_-12px_rgba(0,0,0,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[hsl(var(--note-accent))] motion-safe:hover:-translate-y-1 motion-reduce:transition-none"
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-1 -bottom-[3px] h-[3px] rounded-b-[2px] border-x border-b border-border/60 bg-card" />
      <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-2.5 size-4 -translate-x-1/2">
        <span className="absolute bottom-0 left-1/2 h-2 w-px -translate-x-1/2 bg-foreground/25" />
        <span className="absolute left-1/2 top-0 size-3.5 -translate-x-1/2 rounded-full bg-[hsl(var(--note-accent))] shadow-[inset_0_1px_2px_rgba(255,255,255,0.55),0_2px_3px_rgba(0,0,0,0.18)]">
          <span className="absolute left-[3px] top-[2px] size-1 rounded-full bg-white/60" />
        </span>
      </span>
      <h2 id={titleId} className="text-pretty text-[17px] font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-[hsl(var(--note-accent))] motion-reduce:transition-none">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{summary}</p>
      <span className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs text-muted-foreground">
        <span>{minutes} min read</span>
        <ArrowUpRight aria-hidden="true" className="size-3.5 text-[hsl(var(--note-accent))]" />
      </span>
    </Link>
  );
}
