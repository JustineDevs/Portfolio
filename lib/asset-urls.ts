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
