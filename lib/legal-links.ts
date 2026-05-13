import { getSiteSetting } from "@/lib/content/public";

import { isSafeLegalHref, type PublicLegalLinks } from "@/lib/legal-links-shared";

export type { PublicLegalLinks } from "@/lib/legal-links-shared";

function trimEnv(value: string | undefined): string | null {
  const t = value?.trim();
  return t && t.length > 0 ? t : null;
}

function pickUrl(envRaw: string | undefined, db: unknown): string | null {
  const fromEnv = trimEnv(envRaw);
  if (fromEnv && isSafeLegalHref(fromEnv)) return fromEnv;
  if (typeof db === "string") {
    const fromDb = db.trim();
    if (fromDb && isSafeLegalHref(fromDb)) return fromDb;
  }
  return null;
}

/** Env (`NEXT_PUBLIC_*`) wins over CMS `site_settings` when both are set and valid. */
export async function getPublicLegalLinks(): Promise<PublicLegalLinks> {
  const [privacyDb, termsDb] = await Promise.all([
    getSiteSetting<string>("privacyPolicyUrl"),
    getSiteSetting<string>("termsUrl"),
  ]);

  return {
    privacyPolicyUrl: pickUrl(process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL, privacyDb),
    termsUrl: pickUrl(process.env.NEXT_PUBLIC_TERMS_URL, termsDb),
  };
}
