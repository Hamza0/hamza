import BlurFade from "@/components/magicui/blur-fade";
import { getBlogPosts } from "@/data/blog";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Notes",
  description:
    "Thoughts on web design, accessibility, performance, content systems, and the behind-the-scenes work that makes digital projects feel simple for the people using them.",
};

const BLUR_FADE_DELAY = 0.04;

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
      <div className="flex flex-col gap-6">
        {posts
          .sort((a, b) => {
            if (
              new Date(a.metadata.publishedAt) >
              new Date(b.metadata.publishedAt)
            ) {
              return -1;
            }
            return 1;
          })
          .map((post, id) => (
            <BlurFade delay={BLUR_FADE_DELAY * 2 + id * 0.05} key={post.slug}>
              <Link
                className="group block rounded-lg border border-transparent p-4 -mx-4 transition-colors hover:border-border hover:bg-muted/40"
                href={`/blog/${post.slug}`}
              >
                <article className="space-y-2">
                  <h2 className="font-medium tracking-tight group-hover:underline underline-offset-4">
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
                </article>
              </Link>
            </BlurFade>
          ))}
      </div>
    </section>
  );
}
