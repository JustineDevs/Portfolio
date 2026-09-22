import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";

import { PostForm } from "@/components/admin/PostForm";
import { getPostForAdmin } from "@/lib/content/admin";

export default async function AdminWritingEditPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { error?: string };
}) {
  await requireAdminSession();
  const post = await getPostForAdmin(Number.parseInt(params.id, 10));

  if (!post) {
    notFound();
  }

  return <PostForm title={`Edit Post: ${post.title}`} value={post} errorMessage={searchParams?.error} />;
}
