import Link from "next/link";

import PageIntro from "@/components/layouts/PageIntro";
import PageLayout from "@/components/layouts/PageLayout";
import { getBlogIndexPageData } from "@/lib/content/page-data";

export default async function BlogPage() {
  const { posts, legalLinks } = await getBlogIndexPageData();

  return (
    <PageLayout legalLinks={legalLinks}>
      <PageIntro
        tone="soft"
        kicker="Writing & Signals"
        title="Notes, proof points, and public thinking behind the work."
        description="A running index of native writing and external posts that explain how I ship interfaces, structure product work, and evaluate technical systems in practice."
        actions={[
          { label: "Browse Projects", href: "/projects" },
          { label: "Open GitHub", href: "https://github.com/JustineDevs/Portfolio", external: true, emphasis: "primary" },
        ]}
      />

      <section className="page-frame page-panel">
        <div className="border-b border-[#d5d5d5] px-4 py-4 xs:px-5 sm:px-6 md:px-8 lg:px-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-3xl text-[13px] sm:text-[14px] leading-[1.8] text-[#58606d]">
              Every entry here is meant to add implementation context, not filler. Read the native piece or jump to the canonical source.
            </p>
            <div className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#6a7280]">
              {posts.length} entries
            </div>
          </div>
        </div>

        <div className="grid gap-0">
          {posts.map((post, index) => (
            <article
              key={post.slug}
              className={`px-4 py-5 xs:px-5 sm:px-6 md:px-8 lg:px-10 ${index < posts.length - 1 ? "border-b border-[#d5d5d5]" : ""}`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <div className="mb-3 flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6a7280]">
                    <span>{post.postType === "native" ? "Article" : "External Post"}</span>
                    {post.sourcePlatform ? <span>{post.sourcePlatform}</span> : null}
                  </div>

                  <h2 className="text-[24px] sm:text-[30px] font-black tracking-[-0.03em] text-[#424242]">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-[13px] sm:text-[15px] leading-[1.85] text-[#58606d]">
                    {post.summary}
                  </p>
                </div>

                <div className="flex gap-3 lg:pt-1">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="page-action-chip"
                  >
                    Read more
                  </Link>
                  {post.canonicalUrl ? (
                    <a
                      href={post.canonicalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="page-action-chip bg-[#424242] text-white border-[#424242] hover:bg-[#333333] hover:border-[#333333]"
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
