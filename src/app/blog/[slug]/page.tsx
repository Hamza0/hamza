import { PulseHeart } from "@/components/ui/pulse-heart";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BusinessProfileInquiry } from "@/components/business-profile-inquiry";
import { NoteContactCTA } from "@/components/note-contact-cta";
import { contactFormAvailable } from "@/lib/contact/config";
import { getBlogPosts, getPost, getPublishedPosts } from "@/data/blog";
import { AUTHOR, articleJsonLd, pageMetadata, serializeJsonLd } from "@/lib/seo";
import { modificationDate } from "@/lib/publication";
import { getNotePresentation, readingMinutes } from "@/lib/note-presentation";
import { splitNoteLead } from "@/lib/note-reading";
import { getNoteStarters, getErrorExample, hasContextualStarters } from "@/lib/note-helpers";
import { NoteErrorExample } from "@/components/note-error-example";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

// Notes are published from local content at build time. Unknown slugs must 404
// before metadata generation tries to read a file that does not exist.
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  return pageMetadata({
    title: post.metadata.title, description: post.metadata.summary, path: `/blog/${post.slug}`,
    article: true, publishedAt: post.metadata.publishedAt, updatedAt: modificationDate(post.metadata),
    image: post.metadata.image || `/og/${post.slug}`, noindex: post.metadata.noindex,
  });
}

export default async function Blog({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  let post = await getPost((await params).slug);

  if (!post) {
    notFound();
  }

  const posts = await getBlogPosts();
  const index = posts.findIndex(entry => entry.slug === post.slug);
  const previous = index >= 0 ? posts[index + 1] : undefined;
  const next = index > 0 ? posts[index - 1] : undefined;
  const presentation = getNotePresentation(post.slug);
  const errorExample = getErrorExample(post.slug);
  const { lead, body } = splitNoteLead(post.source);

  return (
    <main id="blog" className={`note-theme note-reading-page note-tone-${presentation.tone}`}>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(articleJsonLd({
            title: post.metadata.title, description: post.metadata.summary, path: `/blog/${post.slug}`,
            publishedAt: post.metadata.publishedAt, updatedAt: modificationDate(post.metadata),
            image: post.metadata.image || `/og/${post.slug}`,
          })),
        }}
      />
      <Breadcrumbs items={[
        { name: "Home", path: "/" },
        { name: "Notes", path: "/blog" },
        { name: post.metadata.title, path: `/blog/${post.slug}` },
      ]} />
      <article className="note-article">
        <header className="mb-7 sm:mb-9">
          <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-medium text-muted-foreground">
            <span className="text-[hsl(var(--note-accent))]">{presentation.label}</span>
            <span aria-hidden="true">·</span>
            <span>{readingMinutes(post.source)} min read</span>
            {post.metadata.dateLabel && <><span aria-hidden="true">·</span><span>{post.metadata.dateLabel}</span></>}
          </div>
          <h1 className="text-pretty text-[2rem] font-semibold leading-[1.13] tracking-[-0.04em] sm:text-[2.75rem]">
            {post.metadata.title}
          </h1>
          <div className="mt-5 border-b border-border/70 pb-5">
            <p className="text-[14px] font-medium">By <Link href="/#about" rel="author" className="underline decoration-border underline-offset-4 hover:decoration-current">{AUTHOR.name}</Link></p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              Software developer in the Greater Toronto Area · Founder of{" "}
              <Link href="https://www.codedsquare.com/" className="underline underline-offset-4">Coded Square</Link>.
            </p>
          </div>
        </header>
        {lead && <div className="note-lead prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: lead }} />}
        {errorExample && <NoteErrorExample example={errorExample} />}
        {!errorExample && hasContextualStarters(post.slug) && <p className="mb-6 text-sm"><a href="#get-help" className="font-medium text-[hsl(var(--note-accent))] underline underline-offset-4">Dealing with this right now? Tell me what’s happening.</a></p>}
        <div
          className="note-prose prose max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </article>
      {post.slug === "google-business-profile-address-change-help" && (
        <section id="get-help" aria-labelledby="profile-enquiry-heading" className="mt-10 scroll-mt-6">
          <h2 id="profile-enquiry-heading" className="mb-3 text-xl font-semibold">Have a similar address issue?</h2>
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">Tell me what happened using the short form below.</p>
          <BusinessProfileInquiry available={contactFormAvailable()} />
        </section>
      )}
      {post.slug !== "google-business-profile-address-change-help" && (
        <NoteContactCTA title={presentation.ctaTitle} description={presentation.ctaDescription} context={post.metadata.title} starters={getNoteStarters(post.slug)} />
      )}
      <div className="mt-10 flex items-center gap-3 border-t pt-5">
        <PulseHeart key={post.slug} noteSlug={post.slug} icon="heart" showCount={true} size={26} />
      </div>
      <nav aria-label="Note navigation" className="mt-6 grid grid-cols-2 gap-5 border-t pt-5 pb-16">
        {index < 0 && (
          <Link href="/blog" className="text-sm font-medium underline underline-offset-4">Explore current notes</Link>
        )}
        {previous && (
          <Link href={`/blog/${previous.slug}`} rel="prev" className="min-w-0 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
            <span className="block text-xs text-muted-foreground">← Previous note</span>
            <span className="mt-2 block text-sm font-medium break-words hover:underline underline-offset-4">{previous.metadata.title}</span>
          </Link>
        )}
        {next && (
          <Link href={`/blog/${next.slug}`} rel="next" className="col-start-2 min-w-0 rounded-sm text-right focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
            <span className="block text-xs text-muted-foreground">Next note →</span>
            <span className="mt-2 block text-sm font-medium break-words hover:underline underline-offset-4">{next.metadata.title}</span>
          </Link>
        )}
      </nav>
    </main>
  );
}
