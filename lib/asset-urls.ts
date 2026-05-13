const IMAGE_EXTENSION_RE =
  /\.(avif|bmp|gif|heic|heif|ico|jpe?g|jfif|pjpeg|pjp|png|svg|tiff?|webp)(?:$|[?#])/i;
const ASSET_OBJECT_KEY_RE =
  /(image|icon|logo|avatar|cover|banner|thumbnail|poster)(?:Url|Src|Path|Override)?$/i;

function normalizeLocalAssetPath(input: string): string {
  let value = input.trim().replace(/\\/g, "/");
  value = value.replace(/^(\.\/|\.\.\/)+/, "");
  value = value.replace(/^public\//, "");
  value = value.replace(/^\/+/, "/");
  return value.startsWith("/") ? value : `/${value}`;
}

function normalizeGithubAssetUrl(url: URL): string | null {
  if (url.hostname !== "github.com") return null;

  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length < 5) return null;

  const [owner, repo, kind, ref, ...pathParts] = parts;
  if ((kind !== "blob" && kind !== "raw") || pathParts.length === 0) {
    return null;
  }

  return new URL(
    `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${pathParts.join("/")}`,
  ).toString();
}

function normalizeGoogleDriveAssetUrl(url: URL): string | null {
  if (url.hostname !== "drive.google.com") return null;

  const fileMatch = /^\/file\/d\/([^/]+)\/view$/.exec(url.pathname);
  if (fileMatch) {
    return new URL(`https://drive.google.com/uc?export=view&id=${fileMatch[1]}`).toString();
  }

  if (url.pathname === "/open" || url.pathname === "/uc") {
    const id = url.searchParams.get("id");
    if (id) {
      return new URL(`https://drive.google.com/uc?export=view&id=${id}`).toString();
    }
  }

  return null;
}

function normalizeDropboxAssetUrl(url: URL): string | null {
  if (url.hostname !== "dropbox.com" && url.hostname !== "www.dropbox.com") return null;

  const normalized = new URL(url.toString());
  normalized.hostname = "dl.dropboxusercontent.com";
  normalized.searchParams.delete("dl");
  normalized.searchParams.set("raw", "1");
  return normalized.toString();
}

function decodeHtmlEntity(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function extractMetaContent(html: string, pattern: RegExp): string | null {
  const match = pattern.exec(html);
  return match?.[1] ? decodeHtmlEntity(match[1].trim()) : null;
}

function extractImageFromHtml(html: string, baseUrl: string): string | null {
  const candidates = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+itemprop=["']image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["'][^>]*>/i,
  ];

  for (const pattern of candidates) {
    const value = extractMetaContent(html, pattern);
    if (!value) continue;
    try {
      return normalizeAssetUrl(new URL(value, baseUrl).toString());
    } catch {
      return normalizeAssetUrl(value);
    }
  }

  return null;
}

function isHttpAssetUrl(value: string): boolean {
  return value.startsWith("http://") || value.startsWith("https://");
}

async function fetchWithFallback(url: string, init?: RequestInit) {
  const withSignal = {
    ...init,
    signal: AbortSignal.timeout(8_000),
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; JSTNImageResolver/1.0)",
      accept: "image/*,text/html;q=0.9,*/*;q=0.8",
      ...(init?.headers || {}),
    },
  } satisfies RequestInit;

  return fetch(url, withSignal);
}

export function normalizeAssetUrl(input: string): string {
  const value = input.trim();
  if (!value) return value;

  if (value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }

  if (value.startsWith("//")) {
    return `https:${value}`;
  }

  if (value.startsWith("/") || value.startsWith("./") || value.startsWith("../")) {
    return normalizeLocalAssetPath(value);
  }

  if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value) && (value.includes("/") || IMAGE_EXTENSION_RE.test(value))) {
    return normalizeLocalAssetPath(value);
  }

  try {
    const url = new URL(value);

    return (
      normalizeGithubAssetUrl(url) ||
      normalizeGoogleDriveAssetUrl(url) ||
      normalizeDropboxAssetUrl(url) ||
      url.toString()
    );
  } catch {
    return value;
  }
}

export function normalizeOptionalAssetUrl<T extends string | null | undefined>(input: T): T {
  if (input == null) return input;
  return normalizeAssetUrl(input) as T;
}

export function isDirectImageAssetUrl(input: string): boolean {
  const value = normalizeAssetUrl(input).toLowerCase();
  if (!value) return false;
  if (value.startsWith("data:image/")) return true;
  if (value.startsWith("blob:")) return true;
  return IMAGE_EXTENSION_RE.test(value);
}

export function getRenderableImageUrl(input: string): string {
  const value = normalizeAssetUrl(input);
  if (!value) return value;
  if (!isHttpAssetUrl(value)) return value;
  return `/api/image/resolve?url=${encodeURIComponent(value)}`;
}

export async function resolveImageAssetUrl(input: string): Promise<string> {
  const value = normalizeAssetUrl(input);
  if (!value || !isHttpAssetUrl(value)) return value;

  if (isDirectImageAssetUrl(value)) {
    return value;
  }

  try {
    const head = await fetchWithFallback(value, { method: "HEAD", redirect: "follow" });
    const headType = head.headers.get("content-type")?.toLowerCase() || "";
    if (head.ok && headType.startsWith("image/")) {
      return normalizeAssetUrl(head.url || value);
    }
  } catch {
    // Fall through to GET-based detection.
  }

  try {
    const response = await fetchWithFallback(value, { method: "GET", redirect: "follow" });
    const contentType = response.headers.get("content-type")?.toLowerCase() || "";

    if (!response.ok) {
      return value;
    }

    if (contentType.startsWith("image/")) {
      return normalizeAssetUrl(response.url || value);
    }

    if (contentType.includes("text/html")) {
      const html = await response.text();
      return extractImageFromHtml(html, response.url || value) || value;
    }
  } catch {
    return value;
  }

  return value;
}

export async function normalizeOptionalImageAssetUrl<T extends string | null | undefined>(input: T): Promise<T> {
  if (input == null) return input;
  return (await resolveImageAssetUrl(input)) as T;
}

export async function normalizeAssetFieldsInObjectAsync<T>(input: T): Promise<T> {
  if (Array.isArray(input)) {
    return (await Promise.all(input.map((value) => normalizeAssetFieldsInObjectAsync(value)))) as T;
  }

  if (input && typeof input === "object") {
    const entries = await Promise.all(
      Object.entries(input).map(async ([key, value]) => {
        if (typeof value === "string" && ASSET_OBJECT_KEY_RE.test(key)) {
          return [key, await resolveImageAssetUrl(value)] as const;
        }
        return [key, await normalizeAssetFieldsInObjectAsync(value)] as const;
      }),
    );
    return Object.fromEntries(entries) as T;
  }

  return input;
}

export function normalizeAssetFieldsInObject<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map((value) => normalizeAssetFieldsInObject(value)) as T;
  }

  if (input && typeof input === "object") {
    const output: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      if (typeof value === "string" && ASSET_OBJECT_KEY_RE.test(key)) {
        output[key] = normalizeAssetUrl(value);
      } else {
        output[key] = normalizeAssetFieldsInObject(value);
      }
    }
    return output as T;
  }

  return input;
}

export function isSvgAssetUrl(input: string): boolean {
  const value = input.trim().toLowerCase();
  return value.endsWith(".svg") || value.includes(".svg?");
}
