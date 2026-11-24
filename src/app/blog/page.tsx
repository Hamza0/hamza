import BlurFade from "@/components/magicui/blur-fade";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NotePinboardCard } from "@/components/note-pinboard-card";
import { getBlogPosts } from "@/data/blog";
import { AUTHOR, WEBSITE_ID, pageMetadata, serializeJsonLd } from "@/lib/seo";
import { readingMinutes } from "@/lib/note-presentation";
import { modificationDate } from "@/lib/publication";
import { NOTES_UPDATED_AT, SITE_URL } from "@/lib/site";

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
    <ul className="mt-7 grid gap-x-4 gap-y-5 rounded-3xl border border-border/40 bg-muted/40 p-3 sm:grid-cols-2 sm:gap-5 sm:p-5">
      {posts.map((post, index) => (
        <li key={post.slug} className="min-w-0">
          <BlurFade delay={Math.min(index, 4) * BLUR_FADE_DELAY} className="h-full">
            <NotePinboardCard slug={post.slug} title={post.metadata.title} summary={post.metadata.summary} minutes={readingMinutes(post.source)} />
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
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Questions about your website or software? Here’s where I’d start.</p>
      </BlurFade>
      <section id="all-notes" aria-labelledby="notes-title">
        <NoteList posts={posts} />
      </section>
    </main>
  );
}
