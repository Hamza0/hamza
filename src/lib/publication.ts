export type Publication = {
  publishedAt: string;
  updatedAt?: string;
  draft?: boolean;
  published?: boolean;
  private?: boolean;
  noindex?: boolean;
};

// Content uses calendar dates, not build timestamps. Reject impossible dates.
export function isContentDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}

export function isPublished(metadata: Publication, today = new Date().toISOString().slice(0, 10)) {
  return metadata.draft !== true && metadata.published !== false && metadata.private !== true &&
    isContentDate(metadata.publishedAt) && metadata.publishedAt <= today;
}

export function isIndexable(metadata: Publication, today?: string) {
  return isPublished(metadata, today) && metadata.noindex !== true;
}

export function modificationDate(metadata: Publication) {
  return isContentDate(metadata.updatedAt) && metadata.updatedAt >= metadata.publishedAt
    ? metadata.updatedAt : undefined;
}
