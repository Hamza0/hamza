type Note = {
  slug: string;
  metadata: { featuredOrder?: unknown };
};

// Editorial selection is separate from the chronological list used by the
// archive, previous/next article links and sitemap. Never mutate that list.
export function getFeaturedNotes<T extends Note>(posts: readonly T[]): T[] {
  return posts
    .filter((post) => {
      const order = post.metadata.featuredOrder;
      return typeof order === "number" && Number.isSafeInteger(order) && order > 0;
    })
    .sort((a, b) =>
      (a.metadata.featuredOrder as number) - (b.metadata.featuredOrder as number) ||
      a.slug.localeCompare(b.slug)
    );
}
