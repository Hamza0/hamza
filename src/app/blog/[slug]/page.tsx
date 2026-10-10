import { PulseHeart } from "@/components/ui/pulse-heart";
import { getBlogPosts, getPost } from "@/data/blog";
import { DATA } from "@/data/resume";
import { formatDate } from "@/lib/utils";
import { SOCIAL_PREVIEW } from "@/lib/social-metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

// Notes are published from local content at build time. Unknown slugs must 404
// before metadata generation tries to read a file that does not exist.
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
  };
}): Promise<Metadata | undefined> {
  let post = await getPost(params.slug);

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  const ogImage = image
    ? { url: new URL(image, DATA.url).toString(), alt: title }
    : SOCIAL_PREVIEW.image;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${DATA.url}/blog/${post.slug}`,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Blog({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  let post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const posts = await getBlogPosts();
  const index = posts.findIndex(entry => entry.slug === post.slug);
  const previous = posts[index + 1];
  const next = posts[index - 1];

  return (
    <section id="blog">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: new URL(
              post.metadata.image || SOCIAL_PREVIEW.image.url,
              DATA.url
            ).toString(),
            url: `${DATA.url}/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: DATA.name,
            },
          }),
        }}
      />
      <h1 className="title font-medium text-2xl tracking-tighter max-w-[650px]">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
        <Suspense fallback={<p className="h-5" />}>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {formatDate(post.metadata.publishedAt)}
          </p>
        </Suspense>
      </div>
      <article
        className="prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.source }}
      ></article>
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
    </section>
  );
}
