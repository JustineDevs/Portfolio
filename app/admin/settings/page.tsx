import { saveSiteSettingAction } from "@/app/admin/actions";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import { AdminErrorBanner } from "@/components/admin/FormPrimitives";
import { adminInputControlClass } from "@/components/admin/admin-styles";
import { listSiteSettingsForAdmin } from "@/lib/content/admin";
import { cn } from "@/lib/utils";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const settings = await listSiteSettingsForAdmin();
  const map = Object.fromEntries(settings.map((setting) => [setting.key, setting.valueJson]));
  const errorMessage = searchParams?.error;

  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-[#424242]">Settings</h1>
        <p className="mt-2 text-sm text-[#666666]">
          Small site-level values that should be editable without touching source files.
        </p>
        <AdminErrorBanner message={errorMessage} />
      </section>

      {["githubUsername", "availabilityText", "currentFocus", "privacyPolicyUrl", "termsUrl"].map((key) => (
        <form
          key={key}
          action={saveSiteSettingAction}
          className="space-y-4 rounded-2xl border border-[#d5d5d5] bg-white p-6 shadow-sm"
        >
          <input type="hidden" name="key" value={key} />
          <h2 className="text-lg font-semibold text-[#424242]">{key}</h2>
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
    </main>
  );
}
