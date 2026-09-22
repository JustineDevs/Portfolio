import type { PublicAwardCard, PublicCertificateCard, PublicProject } from "@/lib/content/types";
import { isSafeLegalHref, type PublicLegalLinks } from "@/lib/legal-links-shared";
import {
  getFeaturedAwardCards,
  getFeaturedCertificateCards,
  getPublishedPosts,
  getPublishedProjects,
  getPublishedPageSections,
  getSiteSetting,
} from "@/lib/content/public";
import { getPublishedAssetBySemanticKey, type PublicAsset } from "@/lib/content/assets";

export type HomeRecentPost = {
  slug: string;
  title: string;
  summary: string;
  postType: "native" | "external";
  canonicalUrl?: string | null;
};

export type ProfessionalContent = {
  name: string;
  location: string;
  headline: string;
  about: string[];
  experiences: Array<{ company: string; role: string; period: string; description: string; website?: string }>;
  education: Array<{ institution: string; degree: string; specialization?: string; status?: string; period: string; year?: string; proofLabel?: string; proofHref?: string }>;
};

export async function getHomePageData() {
  const [projects, awards, posts, certificates, privacyDb, termsDb, projectOnePercentAsset, jstnAsset, platformAssets, sections] = await Promise.all([
    getPublishedProjects(),
    getFeaturedAwardCards(2),
    getPublishedPosts(),
    getFeaturedCertificateCards(3),
    getSiteSetting<string>("privacyPolicyUrl"),
    getSiteSetting<string>("termsUrl"),
    getPublishedAssetBySemanticKey("brand.project-one-percent"),
    getPublishedAssetBySemanticKey("brand.jstn"),
    Promise.all(["brand.platform-1", "brand.platform-2", "brand.platform-3", "brand.platform-4", "brand.platform-5", "brand.platform-6", "brand.platform-7", "brand.platform-8"].map((key) => getPublishedAssetBySemanticKey(key))),
    getPublishedPageSections("home"),
  ]);

  const howIWork = sections.find((section) => section.sectionKey === "how_i_work");
  const professionalSection = sections.find((section) => section.sectionKey === "professional");
  const paragraphs = (howIWork?.bodyMd || "").replaceAll("\\n", "\n").split(/\n\s*\n/).map((value) => value.trim()).filter(Boolean);
  let professional: ProfessionalContent = {
    name: "Justine Lupasi",
    location: "Metro Manila, Philippines",
    headline: "2yrs | Software Developer | Website Developer | Entry-Mid Level | Backend / Frontend | AI-native agents | blockchain infra, and developer experience.",
    about: [],
    experiences: [],
    education: [],
  };
  try {
    const meta = professionalSection?.metaJson ? JSON.parse(professionalSection.metaJson) as Partial<ProfessionalContent> : {};
    professional = {
      ...professional,
      ...meta,
      about: (professionalSection?.bodyMd || "").replaceAll("\\n", "\n").split(/\n\s*\n/).map((value) => value.trim()).filter(Boolean),
      experiences: Array.isArray(meta.experiences) ? meta.experiences : professional.experiences,
      education: Array.isArray(meta.education) ? meta.education : professional.education,
    };
  } catch {
    // Keep the typed presentation fallback if a CMS editor saves malformed metadata.
  }

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
    assets: { projectOnePercent: projectOnePercentAsset, jstn: jstnAsset, platforms: platformAssets },
    howIWork: {
      title: howIWork?.title || "How I work",
      paragraphs,
      linkLabel: howIWork?.subtitle?.split("|")[1]?.trim() || "Read the story",
      link: (() => { try { return howIWork?.metaJson ? (JSON.parse(howIWork.metaJson) as { link?: string }).link || "/about" : "/about"; } catch { return "/about"; } })(),
    },
    professional,
    legalLinks,
  } satisfies {
    featuredProjects: PublicProject[];
    featuredAwards: PublicAwardCard[];
    featuredPosts: HomeRecentPost[];
    featuredCertificates: PublicCertificateCard[];
    legalLinks: PublicLegalLinks;
    assets: { projectOnePercent: PublicAsset | null; jstn: PublicAsset | null; platforms: Array<PublicAsset | null> };
    howIWork: { title: string; paragraphs: string[]; linkLabel: string; link: string };
    professional: ProfessionalContent;
  };
}

function safeLegalUrl(fromEnv: string | undefined, fromDb: string | null) {
  for (const value of [fromEnv, fromDb]) {
    if (typeof value === "string" && isSafeLegalHref(value)) return value;
  }
  return null;
}
