import BlurFade from "@/components/magicui/blur-fade";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getBlogPosts } from "@/data/blog";
import { AUTHOR, WEBSITE_ID, pageMetadata, serializeJsonLd } from "@/lib/seo";
import { readingMinutes } from "@/lib/note-presentation";
import { modificationDate } from "@/lib/publication";
import { NOTES_UPDATED_AT, SITE_URL } from "@/lib/site";
import Link from "next/link";

const title = "Software Development Notes";
const description = "Practical notes by Hamza Shakeel on website enquiries, Google search visibility, WordPress, WooCommerce, PostgreSQL and reliable business applications.";

export const metadata = pageMetadata({
  title,
  description,
  path: "/blog",
});

const BLUR_FADE_DELAY = 0.04;

function NoteList({ posts }: { posts: Awaited<ReturnType<typeof getBlogPosts>> }) {
  return (
    <ul className="mt-7 grid gap-3 sm:grid-cols-2">
      {posts.map((post, index) => (
        <li key={post.slug} className="min-w-0">
          <BlurFade delay={Math.min(index, 4) * BLUR_FADE_DELAY} className="h-full">
            <Link
              href={`/blog/${post.slug}`}
              aria-label={post.metadata.title}
              className="group block h-full rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-foreground/20 hover:bg-muted/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none sm:p-5"
            >
              <h2 className="text-pretty text-base font-semibold leading-snug tracking-tight transition-colors group-hover:text-[hsl(var(--note-accent))] motion-reduce:transition-none">{post.metadata.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{post.metadata.summary}</p>
              <span className="mt-3 block text-xs text-muted-foreground">{readingMinutes(post.source)} min read</span>
            </Link>
          </BlurFade>
        </li>
      ))}
    </ul>
  );
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const url = `${SITE_URL}/blog`;

  return (
    <main className="note-theme max-w-2xl lg:-mx-4 lg:w-[calc(100%+2rem)] lg:max-w-none">
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
        <h1 id="notes-title" className="text-3xl font-semibold tracking-tight">Notes</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Practical answers for websites and business systems.</p>
      </BlurFade>
      <section id="all-notes" aria-labelledby="notes-title">
        <NoteList posts={posts} />
      </section>
    </main>
  );
}
