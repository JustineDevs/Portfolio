"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminSession } from "@/lib/auth";
import { createProviderConnection, setProviderConnectionRollup } from "@/lib/integrations/provider-usage";

const providers = new Set(["openai", "claude", "cursor"]);

export async function registerProviderConnectionAction(formData: FormData) {
  await requireAdminSession();
  const provider = String(formData.get("provider") ?? "");
  const externalAccountId = String(formData.get("externalAccountId") ?? "").trim();
  const accountLabel = String(formData.get("accountLabel") ?? "").trim();
  const accountEmail = String(formData.get("accountEmail") ?? "").trim() || null;
  const connectionRef = String(formData.get("connectionRef") ?? "").trim() || null;
  if (!providers.has(provider) || !externalAccountId || !accountLabel) {
    redirect("/admin/connections?error=Provider%2C%20account%20ID%2C%20and%20account%20label%20are%20required.");
  }
  try {
    await createProviderConnection({ provider: provider as "openai" | "claude" | "cursor", externalAccountId, accountLabel, accountEmail, connectionRef });
  } catch {
    redirect("/admin/connections?error=That%20provider%20account%20is%20already%20registered.");
  }
  revalidatePath("/admin/connections");
  redirect("/admin/connections");
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
