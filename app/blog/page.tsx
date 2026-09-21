import PageLayout from "@/components/layouts/PageLayout";
import BlogIndexContent from "@/components/sections/BlogIndexContent";
import { getBlogIndexPageData } from "@/lib/content/page-data";

export default async function BlogPage() {
  const { posts, legalLinks } = await getBlogIndexPageData();

  return (
    <PageLayout legalLinks={legalLinks} fullWidth>
      <BlogIndexContent posts={posts} />
    </PageLayout>
  );
}
