import type { Metadata } from "next";

// Vercel's production hostname is the www variant. Keeping every generated
// canonical, sitemap, Open Graph, and JSON-LD URL on that origin prevents
// crawlers from treating the apex redirect as a duplicate URL. Normalize an
// older apex environment value too, so deployment configuration cannot
// reintroduce the redirect mismatch.
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.jstn.site";
const parsedSiteUrl = new URL(configuredSiteUrl);
if (parsedSiteUrl.hostname === "jstn.site") parsedSiteUrl.hostname = "www.jstn.site";
export const SITE_URL = parsedSiteUrl.toString().replace(/\/$/, "");
export const SITE_NAME = "JSTN — Justine Lupasi";
export const DEFAULT_TITLE = "Justine Lupasi — Software Developer | AI Agents & Blockchain";
export const DEFAULT_DESCRIPTION =
  "Justine Lupasi is a software developer building AI-native agents, blockchain infrastructure, and practical web products from Metro Manila, Philippines.";
export const SOCIAL_IMAGE = "/assets/projects/curated/hyperkit-banner-readme.png";

export function absoluteUrl(path = "/") {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function cleanDescription(value: string | null | undefined, fallback = DEFAULT_DESCRIPTION) {
  const text = (value || fallback).replace(/[#*_`\n]+/g, " ").replace(/\s+/g, " ").trim();
  return text.length > 160 ? `${text.slice(0, 157).trimEnd()}…` : text;
}

export function pageMetadata({
  title,
  description,
  path,
  image = SOCIAL_IMAGE,
  type = "website",
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description: cleanDescription(description),
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      locale: "en_PH",
      title,
      description: cleanDescription(description),
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: cleanDescription(description),
      images: [imageUrl],
    },
  };
}

export function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
