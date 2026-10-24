import type { Metadata } from "next";
import { SITE_URL } from "./site";
import { SOCIAL_PREVIEW } from "./social-metadata";

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const AUTHOR = { "@type": "Person", "@id": PERSON_ID, name: "Hamza Shakeel", url: SITE_URL };

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

export function pageMetadata({ title, description, path, article, publishedAt, updatedAt, image = SOCIAL_PREVIEW.image.url, noindex = false }: {
  title: string; description: string; path: string; article?: boolean;
  publishedAt?: string; updatedAt?: string; image?: string; noindex?: boolean;
}): Metadata {
  const url = new URL(path, SITE_URL).toString();
  const images = [{ url: new URL(image, SITE_URL).toString(), alt: title }];
  const socialTitle = `${title} | Hamza Shakeel`;
  return {
    title, description, alternates: { canonical: url },
    ...(noindex ? { robots: { index: false, follow: true, googleBot: { index: false, follow: true } } } : {}),
    openGraph: {
      title: socialTitle, description, url, siteName: "Hamza Shakeel", locale: "en_CA", images,
      ...(article ? { type: "article" as const, publishedTime: publishedAt, modifiedTime: updatedAt, authors: [SITE_URL] } : { type: "website" as const }),
    },
    twitter: { card: "summary_large_image", title: socialTitle, description, images },
  };
}

export function articleJsonLd({ type = "BlogPosting", title, description, path, image, publishedAt, updatedAt, about }: {
  type?: "BlogPosting" | "TechArticle"; title: string; description: string; path: string;
  image: string; publishedAt?: string; updatedAt?: string; about?: string[];
}) {
  const url = new URL(path, SITE_URL).toString();
  return {
    "@context": "https://schema.org", "@type": type, "@id": `${url}#article`,
    headline: title, description, url, mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: AUTHOR, publisher: AUTHOR, isPartOf: { "@id": WEBSITE_ID }, inLanguage: "en-CA",
    image: new URL(image, SITE_URL).toString(),
    ...(publishedAt ? { datePublished: publishedAt } : {}),
    ...(updatedAt ? { dateModified: updatedAt } : {}),
    ...(about ? { about: about.map(name => ({ "@type": "Thing", name })) } : {}),
  };
}
