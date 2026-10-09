import BlurFade from "@/components/magicui/blur-fade";
import { getBlogPosts } from "@/data/blog";
import { formatDate } from "@/lib/utils";
import { Accessibility, BarChart3, Database, Layers, Network, Terminal, Workflow, type LucideIcon } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Notes",
  description:
    "Thoughts on web design, accessibility, performance, content systems, and the behind-the-scenes work that makes digital projects feel simple for the people using them.",
};

const BLUR_FADE_DELAY = 0.04;
const NOTE_ICONS: Record<string, LucideIcon> = {
  "accessibility-is-part-of-the-build": Accessibility,
  "apis-are-where-systems-start-talking": Network,
  "building-data-tools-for-non-technical-teams": BarChart3,
  "data-quality-comes-before-the-dashboard": Database,
  "how-i-approach-production-problems": Terminal,
  "the-difference-between-a-website-and-a-digital-platform": Layers,
  "when-a-website-becomes-a-system": Workflow,
  "why-production-support-changes-how-you-build": Terminal,
  "the-work-behind-clean-digital-experiences": Layers,
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <section className="max-w-2xl">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="font-medium text-2xl mb-4 tracking-tighter">Notes</h1>
        <p className="text-sm text-muted-foreground mb-10 leading-relaxed">
          Thoughts on web design, accessibility, performance, content systems,
          and the behind-the-scenes work that makes digital projects feel simple
          for the people using them.
        </p>
      </BlurFade>
      <div className="flex flex-col">
        {posts.map((post, id) => {
          const Icon = NOTE_ICONS[post.slug] ?? Layers;
          return (
            <BlurFade
              delay={BLUR_FADE_DELAY * 2 + id * 0.05}
              key={post.slug}
              className="border-b border-border/60 last:border-b-0"
            >
              <Link
                className="group block rounded-sm px-3 py-5 transition-colors hover:bg-muted/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                href={`/blog/${post.slug}`}
              >
                <article className="flex items-start gap-3 sm:gap-4">
                  <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                  <div className="min-w-0 space-y-2">
                    <h2 className="font-semibold leading-snug tracking-tight group-hover:underline underline-offset-4">
                      {post.metadata.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {post.metadata.summary}
                    </p>
                    <time
                      dateTime={post.metadata.publishedAt}
                      className="block text-xs text-muted-foreground tabular-nums"
                    >
                      {formatDate(post.metadata.publishedAt)}
                    </time>
                  </div>
                </article>
              </Link>
            </BlurFade>
          );
        })}
      </div>
    </section>
  );
}
