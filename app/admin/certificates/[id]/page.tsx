import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";

import { CertificateForm } from "@/components/admin/CertificateForm";
import { getCertificateForAdmin } from "@/lib/content/admin";

export default async function AdminCertificateEditPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { error?: string };
}) {
  await requireAdminSession();
  const certificate = await getCertificateForAdmin(Number.parseInt(params.id, 10));

  if (!certificate) {
    notFound();
  }

  return <CertificateForm title={`Edit Certificate: ${certificate.title}`} value={certificate} errorMessage={searchParams?.error} />;
}
