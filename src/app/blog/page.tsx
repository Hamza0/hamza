import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NotesBrowser } from "@/components/notes-browser";
import { getBlogPosts } from "@/data/blog";
import { AUTHOR, WEBSITE_ID, pageMetadata, serializeJsonLd } from "@/lib/seo";
import { getNotePresentation, readingMinutes } from "@/lib/note-presentation";
import { modificationDate } from "@/lib/publication";
import { NOTES_UPDATED_AT, SITE_URL } from "@/lib/site";

const title = "Software Development Notes";
const description = "Practical notes by Hamza Shakeel on website enquiries, Google search visibility, WordPress, WooCommerce, PostgreSQL and reliable business applications.";

export const metadata = pageMetadata({
  title,
  description,
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const url = `${SITE_URL}/blog`;

  return (
    <main className="note-theme pb-12">
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
      <header className="mb-7 space-y-2.5">
        <h1 id="notes-title" className="page-opening-title text-[2.5rem] font-semibold leading-[1.06] tracking-[-0.045em] sm:text-[3.25rem]">Notes</h1>
        <p className="max-w-lg text-[17px] leading-relaxed text-muted-foreground">Practical answers for your website, business tools and software.</p>
      </header>
      <Link href="/tools/business-email-checker" className="email-check-surface group mb-8 flex items-center gap-3 rounded-[22px] p-4 sm:gap-4 sm:p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-background text-[hsl(var(--note-accent))]"><Mail aria-hidden="true" className="size-5" strokeWidth={1.7} /></div>
        <div className="min-w-0 flex-1">
          <h2 className="text-[16px] font-semibold tracking-tight group-hover:text-[hsl(var(--note-accent))]">Free business email checker</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Check MX, SPF, DKIM and DMARC records.</p>
        </div>
        <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-[hsl(var(--note-accent))]" />
      </Link>
      <NotesBrowser notes={posts.map(post => ({
        slug: post.slug,
        title: post.metadata.title,
        summary: post.metadata.summary,
        minutes: readingMinutes(post.source),
        topic: getNotePresentation(post.slug).label,
      }))} />
    </main>
  );
}
