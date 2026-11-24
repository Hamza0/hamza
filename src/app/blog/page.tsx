import BlurFade from "@/components/magicui/blur-fade";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getBlogPosts } from "@/data/blog";
import { AUTHOR, WEBSITE_ID, pageMetadata, serializeJsonLd } from "@/lib/seo";
import { getNotePresentation, readingMinutes } from "@/lib/note-presentation";
import { modificationDate } from "@/lib/publication";
import { NOTES_UPDATED_AT, SITE_URL } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { Accessibility, BarChart3, Bot, ClipboardCheck, Database, FormInput, GitPullRequest, Layers, LineChart, ListChecks, MapPin, Network, Search, Table2, Terminal, Workflow, type LucideIcon } from "lucide-react";
import Link from "next/link";

const title = "Software Development Notes";
const description = "Software development notes by Hamza Shakeel on production troubleshooting, PostgreSQL, API integrations and building reliable business applications.";

export const metadata = pageMetadata({
  title,
  description,
  path: "/blog",
});

const BLUR_FADE_DELAY = 0.04;
const NOTE_ICONS: Record<string, LucideIcon> = {
  "a-fast-website-still-needs-a-clear-next-step": FormInput,
  "seo-and-aeo-start-with-clear-answers": Search,
  "how-to-choose-the-first-workflow-to-automate": Workflow,
  "why-an-api-timeout-does-not-always-mean-failure": Network,
  "why-a-dashboard-total-can-be-wrong": BarChart3,
  "designing-auditable-financial-corrections": Database,
  "google-business-profile-address-change-help": MapPin,
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

function NoteList({ posts }: { posts: Awaited<ReturnType<typeof getBlogPosts>> }) {
  return (
    <div className="flex flex-col">
      {posts.map((post, index) => {
        const Icon = NOTE_ICONS[post.slug] ?? Layers;
        const presentation = getNotePresentation(post.slug);
        return (
          <BlurFade key={post.slug} delay={BLUR_FADE_DELAY * 2 + Math.min(index, 4) * 0.05}
            className="border-b border-border/40 last:border-b-0">
            <Link
              className={`note-theme note-tone-${presentation.tone} note-list-link group -mx-3 block rounded-xl px-3 py-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2`}
              href={`/blog/${post.slug}`}
              aria-label={post.metadata.title}
            >
              <article className="flex items-start gap-3 sm:gap-4">
                <span className="note-chip mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl">
                  <Icon aria-hidden="true" className="size-4" strokeWidth={1.5} />
                </span>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className="note-accent font-medium">{presentation.label}</span>
                    <span className="text-muted-foreground">{readingMinutes(post.source)} min read</span>
                  </div>
                  <h3 className="text-base sm:text-[17px] font-semibold leading-snug tracking-tight text-pretty group-hover:underline underline-offset-4">
                    {post.metadata.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{post.metadata.summary}</p>
                  <time dateTime={post.metadata.publishedAt} className="block text-xs text-muted-foreground tabular-nums">{formatDate(post.metadata.publishedAt)}</time>
                </div>
              </article>
            </Link>
          </BlurFade>
        );
      })}
    </div>
  );
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const url = `${SITE_URL}/blog`;

  return (
    <main className="max-w-2xl lg:-mx-4 lg:w-[calc(100%+2rem)] lg:max-w-none">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        author: AUTHOR,
        isPartOf: { "@id": WEBSITE_ID },
        inLanguage: "en-CA",
        dateModified: NOTES_UPDATED_AT,
        mainEntity: {
          "@type": "ItemList",
          "@id": `${url}#notes`,
          numberOfItems: posts.length,
          itemListElement: posts.map((post, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "BlogPosting",
              "@id": `${SITE_URL}/blog/${post.slug}#article`,
              url: `${SITE_URL}/blog/${post.slug}`,
              headline: post.metadata.title,
              description: post.metadata.summary,
              author: AUTHOR,
              datePublished: post.metadata.publishedAt,
              ...(modificationDate(post.metadata) ? { dateModified: modificationDate(post.metadata) } : {}),
            },
          })),
        },
      }) }} />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Notes", path: "/blog" }]} />
      <BlurFade delay={BLUR_FADE_DELAY}>
        <h1 className="font-semibold text-3xl mb-3 tracking-tight">Notes</h1>
        <p className="max-w-lg text-sm text-muted-foreground mb-4 leading-relaxed">
          Software development notes by <Link href="/#about" rel="author" className="underline underline-offset-4">Hamza Shakeel</Link>,
          covering production troubleshooting, PostgreSQL, API integrations and
          building reliable business applications.
        </p>
        <p className="mb-8 text-xs text-muted-foreground">{posts.length} notes, with practical examples and a clear next step.</p>
      </BlurFade>
      <section id="all-notes" aria-labelledby="all-notes-title" className="scroll-mt-8">
        <h2 id="all-notes-title" className="text-xl font-semibold tracking-tight">All notes</h2>
        <p className="mt-2 text-xs text-muted-foreground">Newest first. Choose the topic that meets you where you are.</p>
        <NoteList posts={posts} />
      </section>
    </main>
  );
}
