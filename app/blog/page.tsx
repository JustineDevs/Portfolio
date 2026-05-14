import Link from "next/link";

import PageLayout from "@/components/layouts/PageLayout";
import { getBlogIndexPageData } from "@/lib/content/page-data";

export default async function BlogPage() {
  const { posts, legalLinks } = await getBlogIndexPageData();

  return (
    <PageLayout legalLinks={legalLinks}>
      <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
        <div className="p-4 xs:p-5 sm:p-6 md:p-8 lg:p-12">
          <h1 className="text-[28px] xs:text-[36px] sm:text-[42px] md:text-[48px] lg:text-[64px] font-bold text-[#424242] tracking-tight mb-4 xs:mb-5 sm:mb-6 leading-tight">
            Writing & Signals
          </h1>

          <p className="max-w-3xl text-[13px] xs:text-[14px] sm:text-[16px] lg:text-[18px] text-[#666666] mb-5 xs:mb-6 sm:mb-8">
            Notes from shipped work, public write-ups, and external posts that matter to how I build.
          </p>
        </div>
      </section>

      <section className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
        <div className="grid gap-0">
          {posts.map((post, index) => (
            <article
              key={post.slug}
              className={`p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 ${index < posts.length - 1 ? "border-b border-[#d5d5d5]" : ""}`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <div className="mb-3 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-[#666666]">
                    <span>{post.postType === "native" ? "Article" : "External Post"}</span>
                    {post.sourcePlatform ? <span>{post.sourcePlatform}</span> : null}
                  </div>

                  <h2 className="text-[22px] sm:text-[28px] font-bold tracking-tight text-[#424242]">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-[13px] sm:text-[15px] leading-[1.8] text-[#555555]">
                    {post.summary}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="rounded-lg border border-[#d5d5d5] px-4 py-2 text-sm font-medium text-[#424242] transition hover:bg-[#f8f8f8]"
                  >
                    Read more
                  </Link>
                  {post.canonicalUrl ? (
                    <a
                      href={post.canonicalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-[#424242] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#333333]"
                    >
                      Source
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
