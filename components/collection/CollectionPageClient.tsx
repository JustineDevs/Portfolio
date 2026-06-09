"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import Image from "next/image";

import MarkdownContent from "@/components/content/MarkdownContent";
import type {
  CollectionCategory,
  CollectionEntry,
  CollectionEntryBadge,
  CollectionFile,
  CollectionIndex,
  CollectionItem,
} from "@/lib/github/public-collection";
import { getRenderableImageUrl } from "@/lib/asset-urls";

function fileKindLabel(kind: CollectionItem["kind"]) {
  switch (kind) {
    case "markdown":
      return "Markdown";
    case "image":
      return "Image";
    case "pdf":
      return "PDF";
    case "json":
      return "JSON";
    case "text":
      return "Text";
    default:
      return "File";
  }
}

function formatBytes(size: number | null) {
  if (typeof size !== "number" || Number.isNaN(size)) {
    return "Unknown size";
  }

  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#d5d5d5] bg-[#fafafa] px-4 py-4">
      <div className="text-[11px] uppercase tracking-[0.2em] text-[#777777]">{label}</div>
      <div className="mt-2 text-xl font-semibold text-[#424242]">{value}</div>
    </div>
  );
}

function EntryBadge({ badge, fallbackLabel }: { badge: CollectionEntryBadge | null; fallbackLabel: string }) {
  if (!badge) return null;

  const label = badge.label || fallbackLabel;
  const content = badge.imageUrl ? (
    <Image
      src={getRenderableImageUrl(badge.imageUrl)}
      alt={label}
      width={96}
      height={20}
      className="h-5 w-auto"
      unoptimized
    />
  ) : (
    <span className="text-[10px] uppercase tracking-[0.16em] text-[#666666]">{label}</span>
  );

  if (!badge.href) {
    return <div className="border border-[#d5d5d5] px-2 py-1">{content}</div>;
  }

  return (
    <a
      href={badge.href}
      target="_blank"
      rel="noopener noreferrer"
      className="border border-[#d5d5d5] px-2 py-1 hover:bg-[#f8f8f8]"
    >
      {content}
    </a>
  );
}

function CategoryCard({
  category,
  active,
  onClick,
}: {
  category: CollectionCategory;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full border px-4 py-4 text-left transition-colors ${
        active ? "border-[#424242] bg-white text-[#424242]" : "border-[#d5d5d5] bg-[#f8f8f8] text-[#666666] hover:bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.16em]">{category.name}</div>
          <p className="mt-2 text-sm leading-[1.7]">{category.description}</p>
        </div>
        <span className="shrink-0 border border-[#d5d5d5] px-2 py-1 text-xs text-[#666666]">{category.itemCount}</span>
      </div>
    </button>
  );
}

function EntryCard({
  entry,
  active,
  onClick,
}: {
  entry: CollectionEntry;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full border px-4 py-4 text-left transition-colors ${
        active ? "border-[#424242] bg-white" : "border-[#d5d5d5] bg-[#f8f8f8] hover:bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#777777]">{entry.category}</div>
          <div className="mt-1 text-sm font-semibold text-[#424242]">{entry.title}</div>
          <p className="mt-2 text-xs leading-[1.7] text-[#666666]">{entry.description}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="border border-[#d5d5d5] px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-[#666666]">
            {entry.host || "Link"}
          </div>
        </div>
      </div>
    </button>
  );
}

function SupportFileCard({
  item,
  active,
  onClick,
}: {
  item: CollectionItem;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full border px-4 py-4 text-left transition-colors ${
        active ? "border-[#424242] bg-white" : "border-[#d5d5d5] bg-[#f8f8f8] hover:bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-[#424242]">{item.name}</div>
          <div className="mt-2 break-all text-xs text-[#666666]">{item.path}</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="border border-[#d5d5d5] px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-[#666666]">
            {fileKindLabel(item.kind)}
          </div>
          <div className="mt-2 text-[10px] uppercase tracking-[0.16em] text-[#888888]">{formatBytes(item.size)}</div>
        </div>
      </div>
    </button>
  );
}

function EmptyDetail({
  category,
  repoLabel,
}: {
  category: CollectionCategory | null;
  repoLabel: string;
}) {
  return (
    <div className="border border-[#d5d5d5] bg-white px-5 py-6">
      <div className="text-[11px] uppercase tracking-[0.22em] text-[#777777]">
        {category ? category.name : repoLabel}
      </div>
      <h2 className="mt-3 text-lg font-semibold text-[#424242]">
        {category ? "Select a resource in this category" : "Select a resource from the collection"}
      </h2>
      <p className="mt-3 text-sm leading-[1.8] text-[#666666]">
        {category?.description ||
          "Browse the live repository on the left and open a curated resource to inspect its source and related files here."}
      </p>
    </div>
  );
}

function EntryDetail({ entry }: { entry: CollectionEntry | null }) {
  if (!entry) {
    return null;
  }

  return (
    <div className="border border-[#d5d5d5] bg-white">
      <div className="border-b border-[#d5d5d5] px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#777777]">{entry.category}</div>
            <h2 className="text-lg font-bold text-[#424242]">{entry.title}</h2>
            <p className="mt-2 text-sm leading-[1.8] text-[#666666]">{entry.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#d5d5d5] px-3 py-2 text-xs font-medium text-[#424242] hover:bg-[#f8f8f8]"
            >
              Open resource
            </a>
            <a
              href={entry.sourceHtmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#d5d5d5] px-3 py-2 text-xs font-medium text-[#424242] hover:bg-[#f8f8f8]"
            >
              Source README
            </a>
          </div>
        </div>
      </div>
      <div className="space-y-4 px-5 py-5">
        <div className="flex flex-wrap gap-2">
          <EntryBadge badge={entry.stars} fallbackLabel="Stars" />
          <EntryBadge badge={entry.forks} fallbackLabel="Forks" />
        </div>
        <div className="border border-[#d5d5d5] bg-[#fafafa] px-4 py-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#777777]">Destination</div>
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block break-all text-sm text-[#1342FF] underline decoration-[#1342FF]/35 underline-offset-2 hover:decoration-[#1342FF]"
          >
            {entry.url}
          </a>
        </div>
      </div>
    </div>
  );
}

function FileDetail({ file }: { file: CollectionFile | null }) {
  if (!file) {
    return null;
  }

  return (
    <div className="border border-[#d5d5d5] bg-white">
      <div className="border-b border-[#d5d5d5] px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#777777]">{file.category}</div>
            <h2 className="text-lg font-bold text-[#424242]">{file.name}</h2>
            <p className="mt-2 break-all text-xs text-[#666666]">{file.path}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-[#d5d5d5] px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[#666666]">
              {fileKindLabel(file.kind)}
            </span>
            <span className="border border-[#d5d5d5] px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-[#666666]">
              {formatBytes(file.size)}
            </span>
            <a
              href={file.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#d5d5d5] px-3 py-2 text-xs font-medium text-[#424242] hover:bg-[#f8f8f8]"
            >
              GitHub
            </a>
            <a
              href={file.rawUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#d5d5d5] px-3 py-2 text-xs font-medium text-[#424242] hover:bg-[#f8f8f8]"
            >
              Raw
            </a>
          </div>
        </div>
      </div>

      <div className="px-5 py-5">
        {file.kind === "markdown" && file.content ? (
          <MarkdownContent
            markdown={file.content}
            variant="collection"
            linkBaseUrl={file.htmlUrl}
            imageBaseUrl={file.rawUrl}
          />
        ) : null}
        {file.kind === "image" ? (
          <div className="relative min-h-[320px] border border-[#d5d5d5] bg-[#f8f8f8]">
            <Image src={getRenderableImageUrl(file.rawUrl)} alt={file.name} fill className="object-contain" unoptimized />
          </div>
        ) : null}
        {file.kind === "pdf" ? (
          <div className="border border-[#d5d5d5] bg-[#fafafa] px-4 py-4 text-sm leading-[1.8] text-[#666666]">
            PDF files are linked directly because GitHub raw responses are not reliable for inline iframe previews.
          </div>
        ) : null}
        {file.kind === "json" && file.content ? (
          <pre className="overflow-x-auto border border-[#d5d5d5] bg-[#f8f8f8] p-4 text-xs leading-[1.7] text-[#424242]">
            {file.content}
          </pre>
        ) : null}
        {file.kind === "text" && file.content ? (
          <pre className="overflow-x-auto border border-[#d5d5d5] bg-[#f8f8f8] p-4 text-xs leading-[1.7] text-[#424242] whitespace-pre-wrap">
            {file.content}
          </pre>
        ) : null}
        {file.kind === "other" ? (
          <p className="text-sm text-[#666666]">This file type is not previewed inline yet. Use the Raw or GitHub link above.</p>
        ) : null}
      </div>
    </div>
  );
}

export default function CollectionPageClient({ initialIndex }: { initialIndex: CollectionIndex }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [activeCategory, setActiveCategory] = useState<string>(initialIndex.categories[0]?.name || "All");
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<CollectionFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visibleEntries = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();
    return initialIndex.entries.filter((entry) => {
      const matchesCategory = activeCategory === "All" || entry.category === activeCategory;
      const haystack = `${entry.title} ${entry.description} ${entry.category} ${entry.url} ${entry.host || ""}`.toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, deferredQuery, initialIndex.entries]);

  const categoryOptions = useMemo(
    () => [{ slug: "all", name: "All", description: "Browse the full curated repository.", itemCount: initialIndex.entries.length }, ...initialIndex.categories],
    [initialIndex.categories, initialIndex.entries.length],
  );

  const activeCategoryData = useMemo(
    () => categoryOptions.find((category) => category.name === activeCategory) || null,
    [activeCategory, categoryOptions],
  );

  useEffect(() => {
    if (!visibleEntries[0]) {
      setSelectedEntryId(null);
      return;
    }

    if (!selectedEntryId || !visibleEntries.some((entry) => entry.id === selectedEntryId)) {
      setSelectedEntryId(visibleEntries[0].id);
    }
  }, [selectedEntryId, visibleEntries]);

  const selectedEntry = useMemo(
    () => visibleEntries.find((entry) => entry.id === selectedEntryId) || null,
    [selectedEntryId, visibleEntries],
  );

  const detailCategory = selectedEntry?.category || (activeCategory !== "All" ? activeCategory : null);

  const supportFiles = useMemo(() => {
    if (!detailCategory) return [];
    return initialIndex.items.filter((item) => item.category === detailCategory);
  }, [detailCategory, initialIndex.items]);

  const selectedSupportItem = useMemo(
    () => supportFiles.find((item) => item.path === selectedPath) || null,
    [selectedPath, supportFiles],
  );

  useEffect(() => {
    if (!selectedPath) return;

    if (!supportFiles.some((item) => item.path === selectedPath)) {
      setSelectedPath(null);
      setSelectedFile(null);
      setError(null);
    }
  }, [selectedPath, supportFiles]);

  useEffect(() => {
    if (!selectedPath) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/collection/file?path=${encodeURIComponent(selectedPath)}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          const payload = await response.json().catch(() => ({ error: "Failed to load file." }));
          throw new Error(payload.error || "Failed to load file.");
        }

        return response.json();
      })
      .then((payload) => {
        if (!cancelled) {
          setSelectedFile({
            ...payload,
            size: payload.size ?? selectedSupportItem?.size ?? null,
          });
        }
      })
      .catch((fetchError) => {
        if (!cancelled) {
          setSelectedFile(null);
          setError(fetchError instanceof Error ? fetchError.message : "Failed to load file.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedPath, selectedSupportItem]);

  const repoLabel = `${initialIndex.repo.owner}/${initialIndex.repo.repo}`;

  return (
    <section className="page-frame page-panel">
      <div className="border-b border-[#d5d5d5] px-4 py-6 sm:px-6 md:px-8 lg:px-10 bg-[radial-gradient(circle_at_top_left,rgba(19,66,255,0.05),transparent_36%)]">
        <p className="page-header-kicker">Collection</p>
        <h1 className="mt-3 text-[32px] font-black leading-[0.95] tracking-[-0.05em] text-[#424242] sm:text-[44px] md:text-[56px]">
          Curated repositories and developer resources
        </h1>
        <p className="mt-4 max-w-4xl text-sm leading-[1.8] text-[#58606d] sm:text-base">
          A structured index of repositories, tools, files, and reference material worth keeping in active reach. Browse the marketplace layer, then inspect the underlying source and support files in one place.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard label="Categories" value={String(initialIndex.repo.totalCategories)} />
          <StatCard label="Resources" value={String(initialIndex.repo.totalEntries)} />
          <StatCard label="Live Files" value={String(initialIndex.repo.totalItems)} />
        </div>
      </div>

      <div className="border-b border-[#d5d5d5] px-4 py-4 sm:px-6 md:px-8 lg:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#666666]">Live from `{repoLabel}`</div>
            <a
              href={initialIndex.repo.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex border border-[#d5d5d5] px-3 py-2 text-xs font-medium text-[#424242] hover:bg-[#f8f8f8]"
            >
              Open repository
            </a>
          </div>
          <div className="w-full lg:max-w-md">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search repositories, tools, courses, categories..."
              className="w-full border border-[#d5d5d5] bg-[#fafafa] px-4 py-3 text-sm text-[#424242] outline-none placeholder:text-[#8a8a8a] focus:border-[#424242]"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_minmax(0,420px)_minmax(0,1fr)]">
        <div className="border-b border-r border-[#d5d5d5] bg-[#fafafa] lg:border-b-0">
          <div className="border-b border-[#d5d5d5] px-4 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#666666] sm:px-6">
            Categories
          </div>
          <div className="space-y-0">
            {categoryOptions.map((category) => (
              <CategoryCard
                key={category.slug}
                category={category}
                active={activeCategory === category.name}
                onClick={() => setActiveCategory(category.name)}
              />
            ))}
          </div>
        </div>

        <div className="border-b border-r border-[#d5d5d5] bg-white lg:border-b-0">
          <div className="border-b border-[#d5d5d5] px-4 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#666666] sm:px-6">
            Marketplace
          </div>
          <div className="space-y-0">
            {visibleEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                active={selectedEntryId === entry.id}
                onClick={() => setSelectedEntryId(entry.id)}
              />
            ))}
            {visibleEntries.length === 0 ? (
              <div className="border border-[#d5d5d5] px-4 py-6 text-sm text-[#666666] sm:px-6">
                No curated resources matched this search.
              </div>
            ) : null}
          </div>
        </div>

        <div className="bg-[#fafafa]">
          <div className="border-b border-[#d5d5d5] px-4 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#666666] sm:px-6">
            Detail
          </div>
          <div className="space-y-4 p-4 sm:p-6">
            {!selectedEntry ? (
              <EmptyDetail category={activeCategoryData?.name === "All" ? null : activeCategoryData} repoLabel={repoLabel} />
            ) : (
              <EntryDetail entry={selectedEntry} />
            )}

            {detailCategory ? (
              <div className="border border-[#d5d5d5] bg-white">
                <div className="border-b border-[#d5d5d5] px-5 py-4">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[#777777]">Category files</div>
                  <h3 className="mt-2 text-base font-semibold text-[#424242]">
                    Live files from {detailCategory}
                  </h3>
                </div>
                <div className="space-y-0">
                  {supportFiles.length === 0 ? (
                    <div className="px-5 py-5 text-sm text-[#666666]">No additional live files are exposed for this category.</div>
                  ) : (
                    supportFiles.map((item) => (
                      <SupportFileCard
                        key={item.path}
                        item={item}
                        active={selectedPath === item.path}
                        onClick={() => setSelectedPath(item.path)}
                      />
                    ))
                  )}
                </div>
              </div>
            ) : null}

            {loading ? <div className="border border-[#d5d5d5] bg-white px-5 py-6 text-sm text-[#666666]">Loading file…</div> : null}
            {!loading && error ? <div className="border border-[#f3c2c2] bg-[#fff2f2] px-5 py-6 text-sm text-[#9f2d2d]">{error}</div> : null}
            {!loading && !error ? <FileDetail file={selectedFile} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
