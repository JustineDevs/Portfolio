import { getSiteSetting } from "@/lib/content/public";

export type PublicLegalLinks = {
  privacyPolicyUrl: string | null;
  termsUrl: string | null;
};

function trimEnv(value: string | undefined): string | null {
  const t = value?.trim();
  return t && t.length > 0 ? t : null;
}

export function isSafeLegalHref(href: string): boolean {
  const t = href.trim();
  if (!t) return false;
  if (t.startsWith("/") && !t.startsWith("//") && t.length >= 2) {
    if (t.includes("<") || t.includes(">")) return false;
    return !/\s/.test(t);
  }
  try {
    const u = new URL(t);
    if (u.protocol === "https:") return true;
    if (u.protocol === "http:" && (u.hostname === "localhost" || u.hostname === "127.0.0.1")) return true;
    return false;
  } catch {
    return false;
  }
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
