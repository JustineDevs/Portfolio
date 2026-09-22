"use server";

import { createHash } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { assetRegistry, mediaAssets } from "@/db/schema";
import { requireAdminSession } from "@/lib/auth";

const MAX_ASSET_BYTES = 2 * 1024 * 1024;
const MIME_TO_KIND = new Map([
  ["image/svg+xml", "brand"],
  ["image/png", "brand"],
  ["image/jpeg", "brand"],
  ["image/webp", "brand"],
]);

function value(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() ?? "";
}

function cleanSvg(source: string) {
  return source
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "")
    .replace(/\s(?:on[a-z]+|href|xlink:href)\s*=\s*(["'])[^"']*\1/gi, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(/<!--([\s\S]*?)-->/g, "");
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function uploadAssetAction(formData: FormData) {
  await requireAdminSession();

  const file = formData.get("file");
  const name = value(formData, "name");
  const semanticKey = value(formData, "semanticKey");
  const category = value(formData, "category") || "brand";
  const altText = value(formData, "altText");
  const returnTo = "/admin/library";

  if (!(file instanceof File) || file.size === 0) redirect(`${returnTo}?error=Choose%20an%20asset%20file.`);
  if (file.size > MAX_ASSET_BYTES) redirect(`${returnTo}?error=Assets%20must%20be%202MB%20or%20smaller.`);
  if (!MIME_TO_KIND.has(file.type)) redirect(`${returnTo}?error=Use%20SVG,%20PNG,%20JPG,%20or%20WebP.`);
  if (!name || !semanticKey || !/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(semanticKey)) {
    redirect(`${returnTo}?error=Name%20and%20a%20valid%20semantic%20key%20are%20required.`);
  }
  if (!altText) redirect(`${returnTo}?error=Accessible%20alt%20text%20is%20required.`);

  const input = Buffer.from(await file.arrayBuffer());
  const content = file.type === "image/svg+xml" ? Buffer.from(cleanSvg(input.toString("utf8"))) : input;
  const dataUrl = `data:${file.type};base64,${content.toString("base64")}`;
  const slug = slugify(name);
  const checksum = createHash("sha256").update(content).digest("hex");

  try {
    const [asset] = await db.insert(mediaAssets).values({
      slug,
      name,
      kind: MIME_TO_KIND.get(file.type) as "brand",
      fileName: file.name,
      mimeType: file.type,
      dataUrl,
      altText,
      checksum,
      status: "draft",
    }).returning({ id: mediaAssets.id });

    await db.insert(assetRegistry).values({
      semanticKey,
      label: name,
      category,
      assetId: asset.id,
      aliasesJson: "[]",
      status: "draft",
    });
  } catch (error) {
    console.error("[admin/library] upload failed", error);
    redirect(`${returnTo}?error=The%20semantic%20key%20or%20asset%20slug%20already%20exists.`);
  }

  revalidatePath("/admin/library");
  revalidatePath("/", "layout");
  redirect(`${returnTo}?saved=draft`);
}

export async function publishAssetAction(formData: FormData) {
  await requireAdminSession();
  const id = Number(value(formData, "id"));
  if (!Number.isInteger(id)) redirect("/admin/library?error=Invalid%20asset.");

  const [registry] = await db.select({ assetId: assetRegistry.assetId }).from(assetRegistry).where(eq(assetRegistry.id, id)).limit(1);
  if (!registry) redirect("/admin/library?error=Asset%20not%20found.");

  await db.update(mediaAssets).set({ status: "published", updatedAt: new Date().toISOString() }).where(eq(mediaAssets.id, registry.assetId));
  await db.update(assetRegistry).set({ status: "published", updatedAt: new Date().toISOString() }).where(eq(assetRegistry.id, id));
  revalidatePath("/admin/library");
  revalidatePath("/", "layout");
  redirect("/admin/library?saved=published");
}

export async function replaceAssetAction(formData: FormData) {
  await requireAdminSession();
  const registryId = Number(value(formData, "registryId"));
  const file = formData.get("file");
  if (!Number.isInteger(registryId) || !(file instanceof File) || file.size === 0) redirect("/admin/library?error=Choose%20a%20replacement%20file.");
  if (file.size > MAX_ASSET_BYTES || !MIME_TO_KIND.has(file.type)) redirect("/admin/library?error=Use%20SVG,%20PNG,%20JPG,%20or%20WebP%20files%20under%202MB.");

  const [registry] = await db.select({ assetId: assetRegistry.assetId }).from(assetRegistry).where(eq(assetRegistry.id, registryId)).limit(1);
  if (!registry) redirect("/admin/library?error=Asset%20not%20found.");
  const input = Buffer.from(await file.arrayBuffer());
  const content = file.type === "image/svg+xml" ? Buffer.from(cleanSvg(input.toString("utf8"))) : input;
  await db.update(mediaAssets).set({ fileName: file.name, mimeType: file.type, dataUrl: `data:${file.type};base64,${content.toString("base64")}`, checksum: createHash("sha256").update(content).digest("hex"), kind: MIME_TO_KIND.get(file.type) as "brand", status: "draft", updatedAt: new Date().toISOString() }).where(eq(mediaAssets.id, registry.assetId));
  await db.update(assetRegistry).set({ status: "draft", updatedAt: new Date().toISOString() }).where(eq(assetRegistry.id, registryId));
  revalidatePath("/admin/library");
  revalidatePath("/", "layout");
  redirect("/admin/library?saved=draft");
}

export async function archiveAssetAction(formData: FormData) {
  await requireAdminSession();
  const id = Number(value(formData, "id"));
  if (!Number.isInteger(id)) redirect("/admin/library?error=Invalid%20asset.");
  await db.update(assetRegistry).set({ status: "archived", updatedAt: new Date().toISOString() }).where(eq(assetRegistry.id, id));
  revalidatePath("/admin/library");
  redirect("/admin/library?saved=1");
}
