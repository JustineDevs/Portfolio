/**
 * CMS/public content shapes only — no DB imports so client bundles can import safely.
 */

export interface PublicProject {
  id?: number;
  slug: string;
  title: string;
  summary: string;
  bodyMd?: string | null;
  category: string;
  publishedAt?: string | null;
  featured?: boolean;
  coverImageUrl?: string | null;
  bannerImageUrl?: string | null;
  authorName: string;
  authorUrl?: string | null;
  websiteUrl?: string | null;
  sortOrder?: number;
  tags: string[];
  technologies: string[];
  responsibilities: string[];
  networks: string[];
  links: { type: string; label?: string | null; url: string }[];
}

export interface PublicPost {
  id?: number;
  slug: string;
  title: string;
  summary: string;
  bodyMd?: string | null;
  postType: "native" | "external";
  sourcePlatform?: string | null;
  canonicalUrl?: string | null;
  coverImageUrl?: string | null;
  featured?: boolean;
  publishedAt?: string | null;
}
