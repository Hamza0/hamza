import { getBlogPosts } from "@/data/blog";
import { modificationDate } from "@/lib/publication";
import { CASE_STUDY } from "@/lib/case-study";
import { NOTES_UPDATED_AT, SITE_UPDATED_AT, SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts();

  return [
    {
      url: SITE_URL,
      // Last substantive update to the portfolio content.
      lastModified: SITE_UPDATED_AT,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/projects/${CASE_STUDY.slug}`,
      lastModified: CASE_STUDY.updatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/google-business-profile-help`,
      lastModified: "2026-11-23",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: posts.reduce(
        (latest, post) =>
          (modificationDate(post.metadata) || post.metadata.publishedAt) > latest
            ? (modificationDate(post.metadata) || post.metadata.publishedAt)
            : latest,
        // The archive has its own editorial date, independent of article dates.
        NOTES_UPDATED_AT
      ),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy`,
      // Last substantive privacy policy update, verified in Git history.
      lastModified: "2026-11-17",
      changeFrequency: "yearly",
      priority: 0.2,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: modificationDate(post.metadata) || post.metadata.publishedAt,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
