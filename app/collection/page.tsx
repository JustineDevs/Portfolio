import CollectionPageClient from "@/components/collection/CollectionPageClient";
import PageLayout from "@/components/layouts/PageLayout";
import { getCollectionIndex } from "@/lib/github/public-collection";
import { getPublicLegalLinks } from "@/lib/legal-links";

export const dynamic = "force-dynamic";

export default async function CollectionPage() {
  const [collectionIndex, legalLinks] = await Promise.all([
    getCollectionIndex(),
    getPublicLegalLinks(),
  ]);

  return (
    <PageLayout legalLinks={legalLinks}>
      <CollectionPageClient initialIndex={collectionIndex} />
    </PageLayout>
  );
}
