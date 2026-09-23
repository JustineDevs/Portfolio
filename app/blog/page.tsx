import type { Metadata } from "next";
import PageLayout from "@/components/layouts/PageLayout";
import BlogIndexContent from "@/components/sections/BlogIndexContent";
import { getBlogIndexPageData } from "@/lib/content/page-data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Writing — AI, Blockchain & Software Development",
  description: "Field notes from Justine Lupasi on AI-native development, blockchain infrastructure, developer tools, and building practical software.",
  path: "/blog",
  keywords: ["AI software development", "blockchain engineering", "developer tools", "AI agents"],
});

export default async function BlogPage() {
  const { posts, legalLinks } = await getBlogIndexPageData();

  return (
    <PageLayout legalLinks={legalLinks} fullWidth>
      <BlogIndexContent posts={posts} />
    </PageLayout>
  );
}
