/** Pure helpers + types for legal URLs — safe to import from Client Components (no DB). */

export type PublicLegalLinks = {
  privacyPolicyUrl: string | null;
  termsUrl: string | null;
};

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
