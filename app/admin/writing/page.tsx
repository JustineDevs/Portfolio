import Link from "next/link";
import { requireAdminSession } from "@/lib/auth";

import { listPostsForAdmin } from "@/lib/content/admin";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminPageHeader, AdminPrimaryAction, AdminStatusBadge, AdminTable, AdminTableHeader, AdminTableRow, AdminTableToolbar } from "@/components/admin/CmsSurface";

export default async function AdminWritingPage({ searchParams }: { searchParams?: { q?: string; status?: string } }) {
  await requireAdminSession();
  const posts = await listPostsForAdmin();
  const search = searchParams?.q?.trim().toLowerCase() ?? "";
  const status = searchParams?.status ?? "";
  const visiblePosts = posts.filter((post) => (!search || `${post.title} ${post.slug} ${post.postType}`.toLowerCase().includes(search)) && (!status || post.status === status));

  return (
    <main className="space-y-8">
      <AdminPageHeader title="Writing" count={`${posts.length} records`} description="Manage native articles and external/social posts." actions={<AdminPrimaryAction href="/admin/writing/new">New post</AdminPrimaryAction>} />

      <AdminTable label="Writing"><AdminTableToolbar search={searchParams?.q} placeholder="Search writing..." filter={status} filterOptions={[{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }]} />
        <AdminTableHeader>
          <div>Post</div>
          <div>Type</div>
          <div>Status</div>
          <div>Actions</div>
        </AdminTableHeader>
        {visiblePosts.map((post) => (
          <AdminTableRow key={post.id}>
            <div>
              <div className="font-semibold text-[#18181b]">{post.title}</div>
              <div className="text-xs text-[#71717a]">{post.slug}</div>
            </div>
            <div className="capitalize text-[#52525b]">{post.postType}</div>
            <AdminStatusBadge value={post.status} />
            <div className="flex items-center gap-3">
              <Link href={`/admin/writing/${post.id}`} className="font-semibold text-[#1342FF] hover:underline">
                Edit
              </Link>
              <AdminDeleteButton type="post" id={post.id} />
            </div>
          </AdminTableRow>
        ))}{!visiblePosts.length ? <div className="px-5 py-14 text-center text-sm text-[#71717a]">No posts match the current filters.</div> : null}
      </AdminTable>
    </main>
  );
}
