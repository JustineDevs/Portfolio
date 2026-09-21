import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

import MarkdownContent from "@/components/content/MarkdownContent";
import PageLayout from "@/components/layouts/PageLayout";
import { getBlogPostPageData } from "@/lib/content/page-data";

function formatDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date);
}

function getTableOfContents(markdown: string) {
  return markdown
    .split("\n")
    .map((line) => line.match(/^(##|###)\s+(.+)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => {
      const title = match[2].replace(/[*_`]/g, "").trim();
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      return { id, title, depth: match[1] === "###" ? 3 : 2 };
    });
}

function isSafeExternalUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { post, legalLinks } = await getBlogPostPageData(params.slug);

  if (!post) {
    notFound();
  }

  if (post.postType === "external" && post.canonicalUrl && isSafeExternalUrl(post.canonicalUrl)) {
    redirect(post.canonicalUrl);
  }

  const markdown = post.bodyMd || "";
  const tableOfContents = getTableOfContents(markdown);
  const publishedDate = formatDate(post.publishedAt);

  return (
    <PageLayout legalLinks={legalLinks} fullWidth>
      <article className="blog-editorial relative overflow-hidden border-x border-b border-[#d5d5d5] bg-white text-[#424242]">
        <nav aria-label="Breadcrumb" className="border-b border-[#d5d5d5] px-5 py-4 text-[11px] uppercase tracking-[0.16em] text-[#6a7280] sm:px-8 lg:px-12">
          <Link href="/blog" className="transition-colors hover:text-[#222]">Writing</Link>
          <span className="px-2 text-[#a0a0a0]">/</span>
          <span className="text-[#58606d]">{post.title}</span>
        </nav>

        <header className="grid min-h-[520px] grid-cols-1 border-b border-[#d5d5d5] lg:grid-cols-2">
          <div className="flex flex-col justify-end p-6 sm:p-10 lg:p-14 xl:p-16">
            <Link href="/blog" className="mb-auto w-fit text-xs uppercase tracking-[0.16em] text-[#6a7280] transition-colors hover:text-[#222]">
              ← Back to writing
            </Link>
            <div className="mt-16">
              <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.24em] text-[#6a7280]">{post.postType === "native" ? "Field notes" : "External post"}</p>
              <h1 className="max-w-[720px] text-[40px] font-medium leading-[1.04] tracking-[-0.045em] text-[#222] sm:text-[52px] lg:text-[58px]">
                {post.title}
              </h1>
              <p className="mt-7 max-w-[620px] text-[15px] leading-[1.7] text-[#58606d] sm:text-[17px]">{post.summary}</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[#6a7280]">
                {publishedDate ? <time dateTime={post.publishedAt || undefined}>Published: {publishedDate}</time> : null}
                <span>By Justine Lupasi</span>
              </div>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden border-t border-[#d5d5d5] bg-[#f1f3f6] lg:border-l lg:border-t-0">
            {post.coverImageUrl ? (
              <Image src={post.coverImageUrl} alt={post.title} fill sizes="(min-width: 1024px) 50vw, 100vw" unoptimized className="object-cover grayscale" />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,rgba(19,66,255,0.08),transparent_24%),linear-gradient(135deg,#f8f9fb_0%,#eef1f5_55%,#e4e8ee_100%)]">
                <div className="absolute inset-8 border border-[#d5d5d5] bg-[linear-gradient(135deg,transparent_49%,rgba(66,66,66,0.08)_50%,transparent_51%)] bg-[length:34px_34px]" />
                <div className="absolute bottom-8 left-8 max-w-[260px] text-[11px] uppercase tracking-[0.2em] text-[#6a7280]">JSTN / Writing / {post.title}</div>
              </div>
            )}
            <div className="absolute inset-0 bg-white/10" />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0 border-b border-[#d5d5d5] p-5 sm:p-8 lg:border-b-0 lg:p-12 xl:p-16">
            <details className="group mb-10 border border-[#d5d5d5] bg-[#fafafa]">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-4 py-4 text-sm text-[#424242] marker:hidden sm:px-5">
                <span>Click me for the TL;DR (too long; didn’t read)</span>
                <span className="text-[#6a7280] transition-transform group-open:rotate-180">⌄</span>
              </summary>
              <div className="border-t border-[#d5d5d5] px-4 py-5 text-sm leading-[1.8] text-[#58606d] sm:px-5">{post.summary}</div>
            </details>

            <div className="blog-post-content max-w-[760px]">
              <MarkdownContent markdown={markdown} className="blog-editorial-markdown" />
            </div>
          </div>

          <aside className="order-first border-b border-[#d5d5d5] p-5 sm:p-8 lg:order-none lg:border-b-0 lg:border-l lg:p-8">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-base font-normal text-[#222]">Table of contents</h2>
              {tableOfContents.length > 0 ? (
                <ol className="mt-5 space-y-3">
                  {tableOfContents.map((item, index) => (
                    <li key={`${item.id}-${index}`} className={item.depth === 3 ? "pl-5" : ""}>
                      <a href={`#${item.id}`} className="flex gap-3 text-[12px] leading-[1.45] text-[#6a7280] transition-colors hover:text-[#222]">
                        <span className="font-mono text-[#a0a0a0]">{String(index + 1).padStart(2, "0")}</span>
                        <span>{item.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-5 text-sm leading-7 text-[#6a7280]">This note is intentionally short.</p>
              )}
            </div>
          </aside>
        </div>
      </article>
    </PageLayout>
  );
}
