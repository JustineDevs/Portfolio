import { saveSiteSettingAction } from "@/app/admin/actions";
import { requireAdminSession } from "@/lib/auth";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import { AdminErrorBanner } from "@/components/admin/FormPrimitives";
import { adminInputControlClass } from "@/components/admin/admin-styles";
import { listSiteSettingsForAdmin } from "@/lib/content/admin";
import { cn } from "@/lib/utils";

const settingMeta: Record<string, { label: string; description: string }> = {
  githubUsername: { label: "GitHub username", description: "The public account used for contribution activity." },
  availabilityText: { label: "Availability text", description: "Short status shown in the public contact areas." },
  currentFocus: { label: "Current focus", description: "The work or topic currently emphasized across the site." },
  privacyPolicyUrl: { label: "Privacy policy URL", description: "Route or external URL used by legal navigation." },
  termsUrl: { label: "Terms URL", description: "Route or external URL used by legal navigation." },
};

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  await requireAdminSession();
  const settings = await listSiteSettingsForAdmin();
  const map = Object.fromEntries(settings.map((setting) => [setting.key, setting.valueJson]));
  const errorMessage = searchParams?.error;

  return (
    <main className="space-y-8">
      <section className="border-b border-[#e4e4e7] pb-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#1342FF]">System / Configuration</p>
        <div className="mt-2 flex flex-wrap items-baseline gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-[#18181b]">Settings</h1>
          <span className="text-xs font-medium text-[#a1a1aa]">{Object.keys(settingMeta).length} values</span>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#71717a]">Small site-level values that should be editable without touching source files.</p>
      </section>
      <section className="rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_8px_30px_rgba(24,24,27,0.04)]">
        <AdminErrorBanner message={errorMessage} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
      {Object.keys(settingMeta).map((key) => (
        <form key={key} action={saveSiteSettingAction} className="space-y-4 rounded-xl border border-[#e4e4e7] bg-white p-5 shadow-[0_8px_30px_rgba(24,24,27,0.04)]">
          <input type="hidden" name="key" value={key} />
          <div><h2 className="text-base font-semibold text-[#18181b]">{settingMeta[key].label}</h2><p className="mt-1 text-sm leading-6 text-[#71717a]">{settingMeta[key].description}</p></div>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#424242]">Value (JSON)</span>
            <textarea
              name="valueJson"
              defaultValue={map[key] || "\"\""}
              rows={4}
              className={cn(adminInputControlClass, "font-mono")}
            />
          </label>
          <AdminFormSubmitButton>Save setting</AdminFormSubmitButton>
        </form>
      ))}
      </section>
    </main>
  );
}
