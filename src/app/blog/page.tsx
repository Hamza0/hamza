import BlurFade from "@/components/magicui/blur-fade";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { getBlogPosts } from "@/data/blog";
import { AUTHOR, WEBSITE_ID, pageMetadata, serializeJsonLd } from "@/lib/seo";
import { getNotePresentation, readingMinutes } from "@/lib/note-presentation";
import { modificationDate } from "@/lib/publication";
import { NOTES_UPDATED_AT, SITE_URL } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { Accessibility, ArrowUpRight, BarChart3, Database, FormInput, Layers, LineChart, Mail, MapPin, Network, Search, ShoppingCart, Table2, Terminal, Workflow, type LucideIcon } from "lucide-react";
import Link from "next/link";

const title = "Software Development Notes";
const description = "Practical notes by Hamza Shakeel on website enquiries, Google search visibility, WordPress, WooCommerce, PostgreSQL and reliable business applications.";

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
  "why-a-dashboard-total-can-be-wrong": BarChart3,
  "designing-auditable-financial-corrections": Database,
  "google-business-profile-address-change-help": MapPin,
  "accessibility-is-part-of-the-build": Accessibility,
  "apis-are-where-systems-start-talking": Network,
  "building-data-tools-for-non-technical-teams": BarChart3,
  "how-i-approach-production-problems": Terminal,
  "when-a-website-becomes-a-system": Workflow,
  "database-changes-need-a-delivery-plan": Table2,
  "how-to-measure-google-ai-search-visibility": LineChart,
  "wordpress-form-sent-but-no-email": Mail,
  "woocommerce-payment-succeeded-order-pending": ShoppingCart,
};

function NoteList({ posts }: { posts: Awaited<ReturnType<typeof getBlogPosts>> }) {
  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      {posts.map((post, index) => {
        const Icon = NOTE_ICONS[post.slug] ?? Layers;
        const presentation = getNotePresentation(post.slug);
        return (
          <BlurFade key={post.slug} delay={BLUR_FADE_DELAY * 2 + Math.min(index, 4) * 0.05}
            className="h-full">
            <Link
              className={`note-theme note-tone-${presentation.tone} group block h-full rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4`}
              href={`/blog/${post.slug}`}
              aria-label={post.metadata.title}
            >
              <article className="h-full">
                <Card className="note-card flex h-full flex-col rounded-2xl border border-border/60 p-5 shadow-none">
                  <CardHeader className="flex-row items-center justify-between gap-3">
                    <span className="note-chip grid size-9 shrink-0 place-items-center rounded-xl"><Icon aria-hidden="true" className="size-4" strokeWidth={1.5} /></span>
                    <span className="text-xs text-muted-foreground">{readingMinutes(post.source)} min read</span>
                  </CardHeader>
                  <CardContent className="mt-4 space-y-2.5">
                    <p className="note-accent text-xs font-medium">{presentation.label}</p>
                    <h3 className="text-pretty text-lg font-semibold leading-snug tracking-tight text-foreground">{post.metadata.title}</h3>
                    <p className="line-clamp-3 text-sm leading-relaxed">{post.metadata.summary}</p>
                  </CardContent>
                  <CardFooter className="mt-auto justify-between gap-3 pt-5 text-xs">
                    <time dateTime={post.metadata.publishedAt} className="text-muted-foreground">{formatDate(post.metadata.publishedAt)}</time>
                    <span className="note-accent inline-flex shrink-0 items-center gap-1.5 font-medium">Read note <ArrowUpRight aria-hidden="true" className="size-3.5 transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" /></span>
                  </CardFooter>
                </Card>
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
          covering website enquiries, search visibility and the systems that keep
          a business running.
        </p>
        <p className="mb-8 text-xs text-muted-foreground">{posts.length} notes. Practical ideas, explained one at a time.</p>
      </BlurFade>
      <section id="all-notes" aria-labelledby="all-notes-title" className="scroll-mt-8">
        <h2 id="all-notes-title" className="text-xl font-semibold tracking-tight">All notes</h2>
        <p className="mt-2 text-xs text-muted-foreground">Pick a question. Find a useful next step.</p>
        <NoteList posts={posts} />
      </section>
    </main>
  );
}
