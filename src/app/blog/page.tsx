import BlurFade from "@/components/magicui/blur-fade";
import { getBlogPosts } from "@/data/blog";
import { formatDate } from "@/lib/utils";
import { Accessibility, BarChart3, Bot, ClipboardCheck, Database, FormInput, GitPullRequest, Layers, LineChart, ListChecks, Network, Table2, Terminal, Workflow, type LucideIcon } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Notes",
  description:
    "Practical notes on building and supporting web applications, data tools and connected digital systems.",
  alternates: { canonical: "/blog" },
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
  "what-a-forecast-needs-around-the-number": LineChart,
  "database-changes-need-a-delivery-plan": Table2,
  "forms-are-part-of-the-workflow": FormInput,
  "documentation-that-helps-the-next-person": ListChecks,
  "ai-changes-the-development-process-not-just-the-code": GitPullRequest,
  "software-is-becoming-agent-ready": Bot,
  "healthcare-does-not-have-a-data-shortage": Database,
  "ai-in-healthcare-needs-traceability": ClipboardCheck,
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <section className="max-w-2xl lg:-mx-4 lg:w-[calc(100%+2rem)] lg:max-w-none">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="font-semibold text-3xl mb-3 tracking-tight">Notes</h1>
        <p className="max-w-lg text-sm text-muted-foreground mb-8 leading-relaxed">
          Practical notes on building and supporting web applications, data tools
          and connected digital systems.
        </p>
      </BlurFade>
      <div className="flex flex-col">
        {posts.map((post, id) => {
          const Icon = NOTE_ICONS[post.slug] ?? Layers;
          return (
            <BlurFade
              delay={BLUR_FADE_DELAY * 2 + id * 0.05}
              key={post.slug}
              className="border-b border-border/40 last:border-b-0"
            >
              <Link
                className="group -mx-3 block rounded-lg px-3 py-6 transition-colors hover:bg-muted/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                href={`/blog/${post.slug}`}
                aria-label={post.metadata.title}
              >
                <article className="flex items-start gap-3 sm:gap-4">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-muted/50 text-muted-foreground">
                    <Icon aria-hidden="true" className="size-4" strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                      <h2 className="text-base sm:text-[17px] font-semibold leading-snug tracking-tight text-pretty group-hover:underline underline-offset-4">
                        {post.metadata.title}
                      </h2>
                      <time
                        dateTime={post.metadata.publishedAt}
                        className="shrink-0 text-xs text-muted-foreground tabular-nums"
                      >
                        {formatDate(post.metadata.publishedAt)}
                      </time>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {post.metadata.summary}
                    </p>
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
