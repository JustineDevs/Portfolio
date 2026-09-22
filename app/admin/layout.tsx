import ApplicationShell1 from "@/components/application-shell1";
import { getPublishedAssetBySemanticKey } from "@/lib/content/assets";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let brand: Awaited<ReturnType<typeof getPublishedAssetBySemanticKey>> = null;
  try {
    brand = await getPublishedAssetBySemanticKey("brand.jstn");
  } catch {
    // The login route must remain available when the content database is unavailable.
  }
  return <ApplicationShell1 brandSrc={brand?.url}>{children}</ApplicationShell1>;
}
