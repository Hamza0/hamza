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
      className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-[0_2px_4px_rgba(0,0,0,0.025),0_8px_20px_-14px_rgba(0,0,0,0.16)] transition-[transform,box-shadow,border-color] duration-200 ease-out hover:border-foreground/20 hover:shadow-[0_4px_8px_rgba(0,0,0,0.035),0_14px_26px_-16px_rgba(0,0,0,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[hsl(var(--note-accent))] motion-safe:hover:-translate-y-1 motion-reduce:transition-none"
    >
      <h2 id={titleId} className="text-pretty text-[17px] font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-[hsl(var(--note-accent))] motion-reduce:transition-none">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{summary}</p>
      <span className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs text-muted-foreground">
        <span>{minutes} min read</span>
        <ArrowUpRight aria-hidden="true" className="size-3.5 text-[hsl(var(--note-accent))]" />
      </span>
    </Link>
  );
}
