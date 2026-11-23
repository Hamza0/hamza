import { PulseHeart } from "@/components/ui/pulse-heart";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BusinessProfileInquiry } from "@/components/business-profile-inquiry";
import { contactFormAvailable } from "@/lib/contact/config";
import { getBlogPosts, getPost, getPublishedPosts } from "@/data/blog";
import { formatDate } from "@/lib/utils";
import { AUTHOR, articleJsonLd, pageMetadata, serializeJsonLd } from "@/lib/seo";
import { modificationDate } from "@/lib/publication";
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
  const previous = posts[index + 1];
  const next = posts[index - 1];
  const updatedAt = modificationDate(post.metadata);

  return (
    <main id="blog">
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
      <article>
        <header className="mb-8 max-w-[650px]">
          <h1 className="title font-medium text-2xl tracking-tighter">
            {post.metadata.title}
          </h1>
          <div className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <p>By <Link href="/#about" rel="author" className="underline underline-offset-4">{AUTHOR.name}</Link></p>
            <p>
              Published <time dateTime={post.metadata.publishedAt}>{formatDate(post.metadata.publishedAt)}</time>
              {updatedAt && <> · Updated <time dateTime={updatedAt}>{formatDate(updatedAt)}</time></>}
            </p>
            {post.metadata.dateLabel && <p>{post.metadata.dateLabel}</p>}
          </div>
        </header>
        <div
          className="prose dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: post.source }}
        />
      </article>
      {post.slug === "google-business-profile-address-change-help" && (
        <section id="get-help" aria-labelledby="profile-enquiry-heading" className="mt-10 scroll-mt-6">
          <h2 id="profile-enquiry-heading" className="mb-3 text-xl font-semibold">Have a similar address issue?</h2>
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">Answer a few short questions so I can understand what is happening with your Google Business Profile.</p>
          <BusinessProfileInquiry available={contactFormAvailable()} />
        </section>
      )}
      <div className="mt-10 flex items-center gap-3 border-t pt-5">
        <PulseHeart key={post.slug} noteSlug={post.slug} icon="heart" showCount={true} size={26} />
      </div>
      <nav aria-label="Note navigation" className="mt-6 grid grid-cols-2 gap-5 border-t pt-5 pb-16">
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
