"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminSession } from "@/lib/auth";
import { createProviderConnection, importProviderUsageCsv, setProviderConnectionRollup } from "@/lib/integrations/provider-usage";
import { MAX_PROVIDER_USAGE_CSV_BYTES, MAX_PROVIDER_USAGE_CSV_ROWS, parseProviderUsageCsv } from "@/lib/integrations/provider-usage-csv";

const providers = new Set(["openai", "claude", "cursor", "orca"]);

export async function registerProviderConnectionAction(formData: FormData) {
  await requireAdminSession();
  const provider = String(formData.get("provider") ?? "");
  const externalAccountId = String(formData.get("externalAccountId") ?? "").trim();
  const accountLabel = String(formData.get("accountLabel") ?? "").trim();
  const accountEmail = String(formData.get("accountEmail") ?? "").trim() || null;
  if (!providers.has(provider) || !externalAccountId || !accountLabel) {
    redirect("/admin/connections?error=Provider%2C%20account%20ID%2C%20and%20account%20label%20are%20required.");
  }
  try {
    await createProviderConnection({ provider: provider as "openai" | "claude" | "cursor" | "orca", externalAccountId, accountLabel, accountEmail });
  } catch (error) {
    const message = error instanceof Error && /unique|constraint/i.test(error.message)
      ? "That provider account is already registered."
      : "Unable to register the provider account right now.";
    redirect(`/admin/connections?error=${encodeURIComponent(message)}`);
  }
  revalidatePath("/admin/connections");
  redirect("/admin/connections");
}

export async function importProviderUsageCsvAction(formData: FormData) {
  await requireAdminSession();
  const file = formData.get("file");
  if (!(file instanceof File) || !file.size) {
    redirect("/admin/connections?error=Choose%20a%20CSV%20file%20to%20import.");
  }
  if (file.size > MAX_PROVIDER_USAGE_CSV_BYTES) {
    redirect("/admin/connections?error=CSV%20must%20be%205%20MB%20or%20smaller.");
  }
  try {
    const rows = parseProviderUsageCsv(await file.text());
    if (rows.length > MAX_PROVIDER_USAGE_CSV_ROWS) {
      redirect(`/admin/connections?error=${encodeURIComponent(`CSV cannot contain more than ${MAX_PROVIDER_USAGE_CSV_ROWS.toLocaleString()} usage rows.`)}`);
    }
    await importProviderUsageCsv(rows);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to import provider CSV.";
    redirect(`/admin/connections?error=${encodeURIComponent(message)}`);
  }
  revalidatePath("/admin/connections");
  revalidatePath("/admin");
  redirect("/admin/connections?imported=1");
}

export async function toggleProviderConnectionRollupAction(formData: FormData) {
  await requireAdminSession();
  const id = Number(formData.get("id"));
  const includeInRollup = formData.get("includeInRollup") !== "true";
  if (!Number.isInteger(id) || id < 1) redirect("/admin/connections?error=Invalid%20connection.");
  await setProviderConnectionRollup(id, includeInRollup);
  revalidatePath("/admin/connections");
  redirect("/admin/connections");
}
