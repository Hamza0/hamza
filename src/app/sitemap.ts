import { getBlogPosts } from "@/data/blog";
import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = (await getBlogPosts()).filter((post) => {
    const publishedAt = new Date(post.metadata.publishedAt);
    return (
      post.metadata.draft !== true &&
      post.metadata.published !== false &&
      post.metadata.private !== true &&
      post.metadata.noindex !== true &&
      Number.isFinite(publishedAt.getTime()) &&
      publishedAt <= new Date()
    );
  });

  return [
    {
      url: SITE_URL,
      // Last substantive update to the portfolio content.
      lastModified: "2026-10-09",
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: posts.reduce(
        (latest, post) =>
          post.metadata.publishedAt > latest
            ? post.metadata.publishedAt
            : latest,
        "2026-10-09"
      ),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.metadata.updatedAt || post.metadata.publishedAt,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
