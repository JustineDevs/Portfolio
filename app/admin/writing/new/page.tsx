import { PostForm } from "@/components/admin/PostForm";
import { requireAdminSession } from "@/lib/auth";

export default async function AdminWritingNewPage({
  searchParams,
}: {
  searchParams?: { error?: string }
}) {
  await requireAdminSession();
  return <PostForm title="New Post" errorMessage={searchParams?.error} />;
}
