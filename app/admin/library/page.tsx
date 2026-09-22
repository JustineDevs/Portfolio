import Image from "next/image";
import { uploadAssetAction, archiveAssetAction, publishAssetAction, replaceAssetAction } from "@/app/admin/asset-actions";
import { requireAdminSession } from "@/lib/auth";
import { listAdminAssets } from "@/lib/content/assets";
import { AdminPageHeader, AdminStatusBadge } from "@/components/admin/CmsSurface";
import { adminInputControlClass } from "@/components/admin/admin-styles";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";

export default async function AdminLibraryPage({ searchParams }: { searchParams?: { error?: string; saved?: string; q?: string; category?: string; status?: "draft" | "published" | "archived" } }) {
  await requireAdminSession();
  const assets = await listAdminAssets({ query: searchParams?.q, category: searchParams?.category, status: searchParams?.status });

  return (
    <main className="space-y-8">
      <AdminPageHeader eyebrow="Operations / Registry" title="Asset library" count={`${assets.length} visible`} description="Upload reusable brand marks, icons, avatars, and content imagery once. Components reference semantic keys instead of scattered file paths." />
      <section className="rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_8px_30px_rgba(24,24,27,0.04)]">
        {searchParams?.error ? <p className="mt-4 rounded-lg border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-sm text-[#be123c]">{searchParams.error}</p> : null}
        {searchParams?.saved ? <p className="mt-4 rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-sm text-[#166534]">{searchParams.saved === "draft" ? "Asset saved as draft. Publish it after review." : "Asset published to the registry."}</p> : null}
        <form action={uploadAssetAction} className="mt-6 grid gap-4 border-t border-[#efefef] pt-6 md:grid-cols-2">
          <label className="text-sm font-medium text-[#424242]">File<input required name="file" type="file" accept="image/svg+xml,image/png,image/jpeg,image/webp" className="mt-2 block w-full text-sm" /></label>
          <label className="text-sm font-medium text-[#424242]">Name<input required name="name" placeholder="HyperKit" className={"mt-2 " + adminInputControlClass} /></label>
          <label className="text-sm font-medium text-[#424242]">Semantic key<input required name="semanticKey" placeholder="brand.hyperkit" pattern="[a-z0-9]+([.-][a-z0-9]+)*" className={"mt-2 font-mono " + adminInputControlClass} /></label>
          <label className="text-sm font-medium text-[#424242]">Category<select name="category" defaultValue="brand" className={"mt-2 cursor-pointer " + adminInputControlClass}><option value="brand">Brand</option><option value="icon">Icon</option><option value="avatar">Avatar</option><option value="project">Project</option><option value="award">Award</option><option value="certificate">Certificate</option><option value="decorative">Decorative</option></select></label>
          <label className="text-sm font-medium text-[#424242] md:col-span-2">Alt text<input required name="altText" placeholder="HyperKit logo" className={"mt-2 " + adminInputControlClass} /></label>
          <AdminFormSubmitButton pendingLabel="Uploading…" className="w-fit">Upload as draft</AdminFormSubmitButton>
        </form>
      </section>

      <section className="rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_8px_30px_rgba(24,24,27,0.04)]">
        <form method="get" className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto] md:items-end">
          <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[#666666]">Search semantic key<input name="q" defaultValue={searchParams?.q} placeholder="brand.hyperkit" className={"mt-2 font-mono normal-case tracking-normal " + adminInputControlClass} /></label>
          <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[#666666]">Category<select name="category" defaultValue={searchParams?.category || ""} className={"mt-2 cursor-pointer font-normal normal-case tracking-normal " + adminInputControlClass}><option value="">All categories</option><option value="brand">Brand</option><option value="icon">Icon</option><option value="avatar">Avatar</option><option value="project">Project</option><option value="award">Award</option><option value="certificate">Certificate</option><option value="decorative">Decorative</option></select></label>
          <label className="text-xs font-semibold uppercase tracking-[0.12em] text-[#666666]">Status<select name="status" defaultValue={searchParams?.status || ""} className={"mt-2 cursor-pointer font-normal normal-case tracking-normal " + adminInputControlClass}><option value="">All statuses</option><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
          <button type="submit" className="min-h-11 cursor-pointer rounded-lg border border-[#424242] px-4 text-sm font-semibold text-[#424242] transition-[background-color,transform] duration-150 hover:bg-[#f8f8f8] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181b]/20 focus-visible:ring-offset-2">Filter</button>
        </form>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.length ? assets.map((asset) => (
          <article key={asset.id} className="rounded-2xl border border-[#d5d5d5] bg-white p-5 shadow-sm">
            <div className="flex h-24 items-center justify-center rounded-xl bg-[#f8f8f8] p-4"><Image src={asset.previewUrl} alt={asset.altText} width={160} height={80} unoptimized className="max-h-16 w-auto object-contain" /></div>
            <div className="mt-4"><p className="font-semibold text-[#424242]">{asset.label}</p><p className="mt-1 font-mono text-xs text-[#1342FF]">{asset.semanticKey}</p><div className="mt-2 flex flex-wrap items-center gap-2"><span className="text-xs uppercase tracking-[0.12em] text-[#858585]">{asset.category} · {asset.mimeType}</span><AdminStatusBadge value={asset.status} /></div></div>
            <div className="mt-4 flex flex-wrap items-center gap-2"><form action={archiveAssetAction}><input type="hidden" name="id" value={asset.registryId} /><AdminFormSubmitButton pendingLabel="Archiving…" className="bg-transparent px-2 text-xs font-medium text-[#777b82] hover:bg-[#f8f8f8] hover:text-[#18181b]">Archive</AdminFormSubmitButton></form>{asset.status === "draft" ? <form action={publishAssetAction}><input type="hidden" name="id" value={asset.registryId} /><AdminFormSubmitButton pendingLabel="Publishing…" className="bg-transparent px-2 text-xs font-semibold text-[#1342FF] hover:bg-[#eff3ff] hover:text-[#1342FF]">Publish</AdminFormSubmitButton></form> : null}<details className="text-xs"><summary className="min-h-11 cursor-pointer px-2 py-3 text-[#777b82] underline-offset-2 hover:underline">Replace</summary><form action={replaceAssetAction} className="mt-2 flex items-center gap-2"><input type="hidden" name="registryId" value={asset.registryId} /><input required name="file" type="file" accept="image/svg+xml,image/png,image/jpeg,image/webp" className="max-w-[170px] text-[10px]" /><AdminFormSubmitButton pendingLabel="Saving…" className="bg-transparent px-2 text-xs font-semibold text-[#1342FF] hover:bg-[#eff3ff] hover:text-[#1342FF]">Save draft</AdminFormSubmitButton></form></details></div>
          </article>
        )) : <p className="rounded-2xl border border-dashed border-[#d5d5d5] px-5 py-10 text-sm text-[#777777] sm:col-span-2 lg:col-span-3">No assets match these filters.</p>}
      </section>
    </main>
  );
}
