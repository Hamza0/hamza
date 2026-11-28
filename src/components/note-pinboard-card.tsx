import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export type NotePinboardCardProps = {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  topic?: string;
};

export function NotePinboardCard({ slug, title, summary, minutes, topic }: NotePinboardCardProps) {
  const titleId = "note-" + slug;
  return (
    <Link
      href={"/blog/" + slug}
      aria-labelledby={titleId}
      className="group -mx-2 flex items-start gap-3 rounded-xl px-2 py-5 transition-colors hover:bg-muted/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none sm:gap-5"
    >
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-medium text-muted-foreground">
          {topic && <><span>{topic}</span><span aria-hidden="true">·</span></>}
          <span>{minutes} min read</span>
        </div>
        <h3 id={titleId} className="text-pretty text-[18px] font-semibold leading-snug tracking-[-0.02em] text-foreground group-hover:text-[hsl(var(--note-accent))] sm:text-[19px]">{title}</h3>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{summary}</p>
      </div>
      <ArrowUpRight aria-hidden="true" className="mt-7 size-4 shrink-0 text-muted-foreground group-hover:text-[hsl(var(--note-accent))]" />
    </Link>
  );
}
