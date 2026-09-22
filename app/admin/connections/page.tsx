import { Cable, KeyRound, LockKeyhole, Plus, RefreshCw, SlidersHorizontal } from "lucide-react";
import { requireAdminSession } from "@/lib/auth";

import { registerProviderConnectionAction, toggleProviderConnectionRollupAction } from "@/app/admin/connection-actions";
import { AdminErrorBanner } from "@/components/admin/FormPrimitives";
import { AdminPageHeader, AdminStatusBadge, AdminTable, AdminTableHeader, AdminTableRow } from "@/components/admin/CmsSurface";
import { adminInputControlClass } from "@/components/admin/admin-styles";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import BrandIcon from "@/components/ui/BrandIcon";
import { providerConnections } from "@/lib/integrations/provider-connections";
import { listProviderConnectionsForAdmin } from "@/lib/integrations/provider-usage";

export default async function AdminConnectionsPage({ searchParams }: { searchParams?: { error?: string } }) {
  await requireAdminSession();
  const accounts = await listProviderConnectionsForAdmin();
  const byProvider = new Map(providerConnections.map((provider) => [provider.id, accounts.filter((account) => account.provider === provider.id)]));

  return (
    <main className="space-y-8">
      <AdminPageHeader eyebrow="Operations / Integrations" title="Connections" description="Register read-only provider accounts once, then combine their normalized usage automatically" actions={<span className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#e4e4e7] bg-white px-3 text-xs font-semibold text-[#52525b]"><LockKeyhole className="size-3.5" aria-hidden="true" /> Secrets stay outside CMS</span>} />
      <AdminErrorBanner message={searchParams?.error} />

      <section className="grid gap-4 xl:grid-cols-3" aria-label="Provider connection summary">
        {providerConnections.map((provider) => {
          const providerAccounts = byProvider.get(provider.id) ?? [];
          const count = providerAccounts.length;
          const connectedCount = providerAccounts.filter((account) => account.status === "connected" && account.includeInRollup).length;
          return <article key={provider.id} className="rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_8px_30px_rgba(24,24,27,0.04)]"><div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-lg border border-[#e4e4e7] bg-[#fafafa]"><BrandIcon slug={provider.logoSlug} alt={`${provider.label} logo`} color="18181b" className="size-5" /></span><div><h2 className="font-semibold text-[#18181b]">{provider.label}</h2><p className="mt-1 text-xs text-[#71717a]">{count} account{count === 1 ? "" : "s"} registered</p></div></div><Cable className="size-4 text-[#a1a1aa]" aria-hidden="true" /></div><div className="mt-5 flex items-center justify-between border-t border-[#f1f1f2] pt-4 text-xs"><span className="text-[#71717a]">Combined rollup</span><span className="font-semibold text-[#18181b]">{connectedCount ? `${connectedCount} included` : "Waiting"}</span></div></article>;
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-3"><div><h2 className="text-base font-semibold text-[#18181b]">Connected accounts</h2><p className="mt-1 text-sm text-[#71717a]">Each account remains inspectable while provider analytics use the combined rollup.</p></div><AdminTable label="Connected provider accounts"><AdminTableHeader><div>Account</div><div>Provider</div><div>Status</div><div>Controls</div></AdminTableHeader>{accounts.map((account) => <AdminTableRow key={account.id}><div><p className="font-semibold text-[#18181b]">{account.accountLabel}</p><p className="mt-1 text-xs text-[#71717a]">{account.accountEmail || account.externalAccountId}</p></div><div className="capitalize text-[#52525b]">{account.provider}</div><AdminStatusBadge value={account.status} /><div className="flex items-center gap-3"><form action={toggleProviderConnectionRollupAction}><input type="hidden" name="id" value={account.id} /><input type="hidden" name="includeInRollup" value={String(account.includeInRollup)} /><AdminFormSubmitButton pendingLabel="Updating…" className="gap-1.5 bg-transparent px-2 text-xs text-[#1342FF] hover:bg-[#eff3ff] hover:text-[#1342FF]"><SlidersHorizontal className="size-3.5" aria-hidden="true" />{account.includeInRollup ? "Included" : "Excluded"}</AdminFormSubmitButton></form><span className="text-[#d4d4d8]" aria-hidden="true">·</span><span className="inline-flex min-h-11 items-center gap-1 text-xs text-[#a1a1aa]"><RefreshCw className="size-3.5" aria-hidden="true" />{account.lastSyncedAt ? "Synced" : "Not synced"}</span></div></AdminTableRow>)}{!accounts.length ? <div className="px-5 py-14 text-center text-sm text-[#71717a]">No provider accounts registered yet. Add the first account from the panel.</div> : null}</AdminTable></div>

        <form action={registerProviderConnectionAction} className="space-y-4 rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_8px_30px_rgba(24,24,27,0.04)]"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#1342FF]">New account</p><h2 className="mt-2 text-base font-semibold text-[#18181b]">Register provider connection</h2><p className="mt-1 text-sm leading-6 text-[#71717a]">Store metadata and the external connection reference. Access tokens never enter the CMS.</p></div><label className="block text-sm font-medium text-[#52525b]">Provider<select name="provider" defaultValue="openai" className={"mt-2 cursor-pointer " + adminInputControlClass}><option value="openai">OpenAI (Codex)</option><option value="claude">Claude Code</option><option value="cursor">Cursor</option></select></label><label className="block text-sm font-medium text-[#52525b]">Account label<input name="accountLabel" required placeholder="Personal Codex" className={"mt-2 " + adminInputControlClass} /></label><label className="block text-sm font-medium text-[#52525b]">External account ID<input name="externalAccountId" required placeholder="provider-account-id" className={"mt-2 " + adminInputControlClass} /></label><label className="block text-sm font-medium text-[#52525b]">Account email <span className="font-normal text-[#a1a1aa]">optional</span><input name="accountEmail" type="email" placeholder="name@example.com" className={"mt-2 " + adminInputControlClass} /></label><label className="block text-sm font-medium text-[#52525b]">Connection reference <span className="font-normal text-[#a1a1aa]">optional</span><input name="connectionRef" placeholder="workos-connection-id" className={"mt-2 " + adminInputControlClass} /></label><AdminFormSubmitButton pendingLabel="Adding account…" className="w-full"><Plus className="size-4" aria-hidden="true" />Add account</AdminFormSubmitButton><p className="flex items-center gap-2 text-[11px] leading-5 text-[#a1a1aa]"><KeyRound className="size-3.5 shrink-0" aria-hidden="true" />Usage sync becomes available when the external connection reference is active.</p></form>
      </section>
    </main>
  );
}
