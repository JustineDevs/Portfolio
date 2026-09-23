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
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  bannerImageUrl?: string | null;
  authorName: string;
  authorUrl?: string | null;
  authors: { name: string; url: string }[];
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

export interface PublicAwardCard {
  id?: number;
  slug: string;
  title: string;
  eventName: string;
  description: string;
  year: string;
  proofUrl?: string | null;
  logoUrl?: string | null;
}

export interface PublicCertificateCard {
  id?: number;
  slug: string;
  title: string;
  issuer?: string | null;
  description: string;
  proofUrl?: string | null;
  logoUrl?: string | null;
}

export interface PublicProofOfWork {
  slug: string;
  title: string;
  summary: string;
  href?: string | null;
  brandName: string;
  brandLogoUrl?: string | null;
  startedAt?: string | null;
  endedAt?: string | null;
}
