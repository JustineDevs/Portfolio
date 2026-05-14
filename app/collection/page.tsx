import CollectionPageClient from "@/components/collection/CollectionPageClient";
import PageLayout from "@/components/layouts/PageLayout";
import { getCollectionPageData } from "@/lib/content/page-data";

export const dynamic = "force-dynamic";

export default async function CollectionPage() {
  const { collectionIndex, legalLinks } = await getCollectionPageData();

  return (
    <PageLayout legalLinks={legalLinks}>
      <CollectionPageClient initialIndex={collectionIndex} />
    </PageLayout>
  );
}
