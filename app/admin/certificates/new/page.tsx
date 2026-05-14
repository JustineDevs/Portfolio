import { CertificateForm } from "@/components/admin/CertificateForm";
import { requireAdminSession } from "@/lib/auth";

export default async function AdminCertificateNewPage({
  searchParams,
}: {
  searchParams?: { error?: string }
}) {
  await requireAdminSession();
  return <CertificateForm title="New Certificate" errorMessage={searchParams?.error} />;
}
