const OWNER = "JustineDevs";
const REPO = "Public-Github-Repo";
const REF = "main";
const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}`;
const RAW_BASE = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${REF}`;
const REPO_HTML_URL = `https://github.com/${OWNER}/${REPO}`;

const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg", "avif"]);
const TEXT_EXTENSIONS = new Set([
  "txt",
  "js",
  "ts",
  "tsx",
  "jsx",
  "mjs",
  "cjs",
  "css",
  "html",
  "sh",
  "yaml",
  "yml",
]);
const ROOT_IGNORED_FILES = new Set(["README.md", "LICENSE", "SECURITY.md", "package.json"]);

export type CollectionItemKind =
  | "markdown"
  | "image"
  | "pdf"
  | "json"
  | "text"
  | "other";

export type CollectionItem = {
  path: string;
  name: string;
  category: string;
  extension: string;
  kind: CollectionItemKind;
  htmlUrl: string;
  rawUrl: string;
  size: number | null;
};

export type CollectionCategory = {
  slug: string;
  name: string;
  description: string;
  readmePath?: string | null;
  itemCount: number;
};

export type CollectionEntryBadge = {
  label: string;
  href: string | null;
  imageUrl: string | null;
};

export type CollectionEntry = {
  id: string;
  category: string;
  title: string;
  description: string;
  url: string;
  host: string | null;
  sourcePath: string;
  sourceHtmlUrl: string;
  sourceRawUrl: string;
  stars: CollectionEntryBadge | null;
  forks: CollectionEntryBadge | null;
};

export type CollectionIndex = {
  repo: {
    owner: string;
    repo: string;
    ref: string;
    htmlUrl: string;
    fetchedAt: string;
    totalItems: number;
    totalEntries: number;
    totalCategories: number;
  };
  categories: CollectionCategory[];
  entries: CollectionEntry[];
  items: CollectionItem[];
};

export type CollectionFile = {
  path: string;
  name: string;
  category: string;
  kind: CollectionItemKind;
  htmlUrl: string;
  rawUrl: string;
  size: number | null;
  content?: string | null;
};

function getGithubHeaders() {
  const token = process.env.GH_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "jstn-site-collection",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchGithubJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: getGithubHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status} ${url}`);
  }

  return response.json() as Promise<T>;
}

async function fetchGithubText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: getGithubHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GitHub raw request failed: ${response.status} ${url}`);
  }

  return response.text();
}

function toSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getPathSegments(path: string) {
  return path.split("/").filter(Boolean);
}

function hasHiddenSegment(path: string) {
  return getPathSegments(path).some((segment) => segment.startsWith("."));
}

function isCategoryReadmePath(path: string) {
  const segments = getPathSegments(path);
  return segments.length === 2 && /^readme\./i.test(segments[1] || "");
}

function isAllowedCollectionPath(path: string) {
  if (!path || path.includes("..")) return false;
  return !hasHiddenSegment(path);
}

function getKindFromPath(path: string): CollectionItemKind {
  const ext = path.split(".").pop()?.toLowerCase() || "";
  if (ext === "md" || ext === "mdx" || ext === "mdc") return "markdown";
  if (IMAGE_EXTENSIONS.has(ext)) return "image";
  if (ext === "pdf") return "pdf";
  if (ext === "json") return "json";
  if (TEXT_EXTENSIONS.has(ext)) return "text";
  return "other";
}

function buildItem(path: string, size?: number): CollectionItem {
  const parts = getPathSegments(path);
  const category = parts.length > 1 ? parts[0] : "Root";
  const name = parts[parts.length - 1];
  const extension = name.includes(".") ? name.split(".").pop()!.toLowerCase() : "";

  return {
    path,
    name,
    category,
    extension,
    kind: getKindFromPath(path),
    htmlUrl: `https://github.com/${OWNER}/${REPO}/blob/${REF}/${encodeURI(path).replace(/#/g, "%23")}`,
    rawUrl: `${RAW_BASE}/${path.split("/").map(encodeURIComponent).join("/")}`,
    size: typeof size === "number" ? size : null,
  };
}

function extractReadmeDescription(markdown: string) {
  const lines = markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith("#"))
    .filter((line) => !line.startsWith("|"))
    .filter((line) => !/^:?-{3,}:?$/.test(line.replace(/\s+/g, "")));

  const summaryLine = lines.find(
    (line) =>
      !line.startsWith("![") &&
      !line.startsWith("- ") &&
      !line.startsWith("* ") &&
      !line.startsWith("> "),
  );

  return summaryLine || "Curated repositories and developer resources.";
}

function compareCollectionItems(a: CollectionItem, b: CollectionItem) {
  if (a.category !== b.category) {
    return a.category.localeCompare(b.category, undefined, { sensitivity: "base" });
  }

  const aIsReadme = /^readme\./i.test(a.name);
  const bIsReadme = /^readme\./i.test(b.name);
  if (aIsReadme !== bIsReadme) {
    return aIsReadme ? -1 : 1;
  }

  return a.path.localeCompare(b.path, undefined, { sensitivity: "base" });
}

function splitMarkdownTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtml(value: string) {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function parseMarkdownLink(value: string) {
  const match = /\[([^\]]+)\]\(([^)]+)\)/.exec(value);
  if (!match) return null;

  return {
    label: match[1].trim(),
    url: match[2].trim(),
  };
}

function getBadgeFromCell(value: string): CollectionEntryBadge | null {
  const normalized = value.trim();
  if (!normalized || normalized === "-") return null;

  const htmlAnchorMatch = /<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i.exec(normalized);
  const htmlImageMatch = /<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*\/?>/i.exec(normalized);
  if (htmlAnchorMatch || htmlImageMatch) {
    return {
      label: htmlImageMatch?.[2]?.trim() || stripHtml(normalized) || "View",
      href: htmlAnchorMatch?.[1]?.trim() || null,
      imageUrl: htmlImageMatch?.[1]?.trim() || null,
    };
  }

  const markdownLink = parseMarkdownLink(normalized);
  if (markdownLink) {
    return {
      label: markdownLink.label,
      href: markdownLink.url,
      imageUrl: null,
    };
  }

  return {
    label: stripHtml(normalized),
    href: null,
    imageUrl: null,
  };
}

function parseCollectionEntries(
  category: string,
  markdown: string,
  sourcePath: string,
): CollectionEntry[] {
  const sourceItem = buildItem(sourcePath);
  const lines = markdown.split(/\r?\n/);
  const entries: CollectionEntry[] = [];
  let inResourceTable = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|")) {
      if (inResourceTable && entries.length > 0) break;
      continue;
    }

    const cells = splitMarkdownTableRow(trimmed);
    if (cells.length < 2) continue;

    if (!inResourceTable) {
      const first = cells[0]?.toLowerCase();
      const second = cells[1]?.toLowerCase();
      if (first === "repository" && second === "description") {
        inResourceTable = true;
      }
      continue;
    }

    if (cells.every((cell) => /^:?-{3,}:?$/.test(cell.replace(/\s+/g, "")))) {
      continue;
    }

    const primaryLink = parseMarkdownLink(cells[0]);
    if (!primaryLink) continue;

    let host: string | null = null;
    try {
      host = new URL(primaryLink.url).hostname.replace(/^www\./, "");
    } catch {
      host = null;
    }

    entries.push({
      id: `${toSlug(category)}-${toSlug(primaryLink.label)}`,
      category,
      title: primaryLink.label,
      description: stripHtml(cells[1] || ""),
      url: primaryLink.url,
      host,
      sourcePath,
      sourceHtmlUrl: sourceItem.htmlUrl,
      sourceRawUrl: sourceItem.rawUrl,
      stars: getBadgeFromCell(cells[2] || ""),
      forks: getBadgeFromCell(cells[3] || ""),
    });
  }

  return entries;
}

function compareCollectionEntries(a: CollectionEntry, b: CollectionEntry) {
  if (a.category !== b.category) {
    return a.category.localeCompare(b.category, undefined, { sensitivity: "base" });
  }

  return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
}

export async function getCollectionIndex(): Promise<CollectionIndex> {
  const tree = await fetchGithubJson<{
    tree: Array<{ path: string; type: "blob" | "tree"; size?: number }>;
  }>(`${API_BASE}/git/trees/${REF}?recursive=1`);

  const topLevelDirs = tree.tree
    .filter((node) => node.type === "tree" && !node.path.includes("/") && !node.path.startsWith("."))
    .map((node) => node.path)
    .sort((a, b) => a.localeCompare(b));

  const itemNodes = tree.tree.filter((node) => {
    if (node.type !== "blob") return false;
    if (!isAllowedCollectionPath(node.path)) return false;
    if (ROOT_IGNORED_FILES.has(node.path)) return false;
    if (isCategoryReadmePath(node.path)) return false;
    return true;
  });

  const items = itemNodes.map((node) => buildItem(node.path, node.size)).sort(compareCollectionItems);

  const categoryResults = await Promise.all(
    topLevelDirs.map(async (dir) => {
      const readmePath = tree.tree.find(
        (node) => node.type === "blob" && node.path.toLowerCase() === `${dir}/readme.md`.toLowerCase(),
      )
        ? `${dir}/README.md`
        : null;
      const readmeContent = readmePath
        ? await fetchGithubText(`${RAW_BASE}/${readmePath.split("/").map(encodeURIComponent).join("/")}`)
        : null;
      const description = readmeContent ? extractReadmeDescription(readmeContent) : "Helpful resources and repositories.";
      const entries = readmeContent ? parseCollectionEntries(dir, readmeContent, readmePath) : [];

      return {
        category: {
          slug: toSlug(dir),
          name: dir,
          description,
          readmePath,
          itemCount: entries.length,
        } satisfies CollectionCategory,
        entries,
      };
    }),
  );

  const marketplaceResults = categoryResults.filter((result) => result.entries.length > 0);
  const categories = marketplaceResults.map((result) => result.category);
  const entries = marketplaceResults.flatMap((result) => result.entries).sort(compareCollectionEntries);

  return {
    repo: {
      owner: OWNER,
      repo: REPO,
      ref: REF,
      htmlUrl: REPO_HTML_URL,
      fetchedAt: new Date().toISOString(),
      totalItems: items.length,
      totalEntries: entries.length,
      totalCategories: categories.length,
    },
    categories,
    entries,
    items,
  };
}

export async function getCollectionFile(path: string): Promise<CollectionFile> {
  const normalizedPath = path.trim().replace(/^\/+/, "");
  if (!isAllowedCollectionPath(normalizedPath)) {
    throw new Error("Unsupported collection path.");
  }

  const item = buildItem(normalizedPath);
  const category = normalizedPath.includes("/") ? normalizedPath.split("/")[0] : "Root";

  if (item.kind === "markdown" || item.kind === "json" || item.kind === "text") {
    const content = await fetchGithubText(item.rawUrl);
    return {
      path: normalizedPath,
      name: item.name,
      category,
      kind: item.kind,
      htmlUrl: item.htmlUrl,
      rawUrl: item.rawUrl,
      size: item.size,
      content,
    };
  }

  return {
    path: normalizedPath,
    name: item.name,
    category,
    kind: item.kind,
    htmlUrl: item.htmlUrl,
    rawUrl: item.rawUrl,
    size: item.size,
    content: null,
  };
}
