import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import PageLayout from "@/components/layouts/PageLayout";
import { getPublishedPostBySlug } from "@/lib/content/public";
import { getPublicLegalLinks } from "@/lib/legal-links";

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
  const [post, legalLinks] = await Promise.all([getPublishedPostBySlug(params.slug), getPublicLegalLinks()]);

  if (!post) {
    notFound();
  }

  if (post.postType === "external" && post.canonicalUrl && isSafeExternalUrl(post.canonicalUrl)) {
    redirect(post.canonicalUrl);
  }

  return (
    <PageLayout legalLinks={legalLinks}>
      <article className="relative border-l border-r border-b border-[#d5d5d5] bg-white">
        <div className="p-4 xs:p-5 sm:p-6 md:p-8 lg:p-12">
          <Link href="/blog" className="text-sm text-[#1342FF] hover:underline">
            ← Back to writing
          </Link>

          <h1 className="mt-6 text-[28px] xs:text-[36px] sm:text-[42px] md:text-[48px] font-bold text-[#424242] tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="mt-4 max-w-3xl text-[14px] sm:text-[16px] leading-[1.8] text-[#555555]">
            {post.summary}
          </p>

          <div className="mt-10 max-w-3xl space-y-5 text-[14px] sm:text-[16px] leading-[1.9] text-[#424242]">
            {(post.bodyMd || "")
              .split(/\n\n+/)
              .filter(Boolean)
              .map((paragraph, index) => (
                <p key={index}>{paragraph.replace(/^##\s*/, "")}</p>
              ))}
          </div>
        </div>
      </article>
    </PageLayout>
  );
}
