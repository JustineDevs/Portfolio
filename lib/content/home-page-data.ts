import type { PublicAwardCard, PublicCertificateCard, PublicProject } from "@/lib/content/types";
import { isSafeLegalHref, type PublicLegalLinks } from "@/lib/legal-links-shared";
import {
  getFeaturedAwardCards,
  getFeaturedCertificateCards,
  getPublishedPosts,
  getPublishedProjects,
  getSiteSetting,
} from "@/lib/content/public";

export type HomeRecentPost = {
  slug: string;
  title: string;
  summary: string;
  postType: "native" | "external";
  canonicalUrl?: string | null;
};

export async function getHomePageData() {
  const [projects, awards, posts, certificates, privacyDb, termsDb] = await Promise.all([
    getPublishedProjects(),
    getFeaturedAwardCards(2),
    getPublishedPosts(),
    getFeaturedCertificateCards(3),
    getSiteSetting<string>("privacyPolicyUrl"),
    getSiteSetting<string>("termsUrl"),
  ]);

  const legalLinks: PublicLegalLinks = {
    privacyPolicyUrl: safeLegalUrl(process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL, privacyDb),
    termsUrl: safeLegalUrl(process.env.NEXT_PUBLIC_TERMS_URL, termsDb),
  };

  return {
    featuredProjects: projects.slice(0, 2),
    featuredAwards: awards,
    featuredPosts: posts.map<HomeRecentPost>((post) => ({
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      postType: post.postType,
      canonicalUrl: post.canonicalUrl,
    })),
    featuredCertificates: certificates,
    legalLinks,
  } satisfies {
    featuredProjects: PublicProject[];
    featuredAwards: PublicAwardCard[];
    featuredPosts: HomeRecentPost[];
    featuredCertificates: PublicCertificateCard[];
    legalLinks: PublicLegalLinks;
  };
}

function safeLegalUrl(fromEnv: string | undefined, fromDb: string | null) {
  for (const value of [fromEnv, fromDb]) {
    if (typeof value === "string" && isSafeLegalHref(value)) return value;
  }
  return null;
}
