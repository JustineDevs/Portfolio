import { and, asc, desc, eq, like } from "drizzle-orm";
import { db } from "@/db/client";
import { assetRegistry, mediaAssets } from "@/db/schema";

export type PublicAsset = {
  id: number;
  semanticKey: string;
  label: string;
  category: string;
  slug: string;
  name: string;
  kind: string;
  mimeType: string;
  altText: string;
  url: string;
};

export type AdminAsset = PublicAsset & { registryId: number; status: "draft" | "published" | "archived"; previewUrl: string };

function parseAliases(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function toPublicAsset(registry: typeof assetRegistry.$inferSelect, asset: typeof mediaAssets.$inferSelect): PublicAsset {
  return {
    id: registry.id,
    semanticKey: registry.semanticKey,
    label: registry.label,
    category: registry.category,
    slug: asset.slug,
    name: asset.name,
    kind: asset.kind,
    mimeType: asset.mimeType,
    altText: asset.altText,
    url: `/api/assets/${encodeURIComponent(registry.semanticKey)}`,
  };
}

export async function listPublishedAssets() {
  const rows = await db
    .select({ registry: assetRegistry, asset: mediaAssets })
    .from(assetRegistry)
    .innerJoin(mediaAssets, eq(assetRegistry.assetId, mediaAssets.id))
    .where(eq(assetRegistry.status, "published"))
    .orderBy(asc(assetRegistry.category), asc(assetRegistry.label));

  return rows
    .filter(({ asset }) => asset.status === "published")
    .map(({ registry, asset }) => toPublicAsset(registry, asset));
}

export type AdminAssetFilters = {
  query?: string;
  category?: string;
  status?: "draft" | "published" | "archived";
};

export async function listAdminAssets(filters: AdminAssetFilters = {}): Promise<AdminAsset[]> {
  const query = filters.query?.trim();
  const conditions = [
    filters.category ? eq(assetRegistry.category, filters.category) : undefined,
    filters.status ? eq(assetRegistry.status, filters.status) : undefined,
    query ? like(assetRegistry.semanticKey, `%${query}%`) : undefined,
  ].filter((condition): condition is NonNullable<typeof condition> => Boolean(condition));

  const rows = await db
    .select({
      id: mediaAssets.id,
      slug: mediaAssets.slug,
      name: mediaAssets.name,
      kind: mediaAssets.kind,
      mimeType: mediaAssets.mimeType,
      altText: mediaAssets.altText,
      sourceUrl: mediaAssets.sourceUrl,
      dataUrl: mediaAssets.dataUrl,
      registryId: assetRegistry.id,
      semanticKey: assetRegistry.semanticKey,
      label: assetRegistry.label,
      category: assetRegistry.category,
      status: assetRegistry.status,
    })
    .from(assetRegistry)
    .innerJoin(mediaAssets, eq(assetRegistry.assetId, mediaAssets.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(mediaAssets.updatedAt));

  return rows.map((row) => ({
    id: row.id,
    registryId: row.registryId,
    semanticKey: row.semanticKey,
    label: row.label,
    category: row.category,
    slug: row.slug,
    name: row.name,
    kind: row.kind,
    mimeType: row.mimeType,
    altText: row.altText,
    url: `/api/assets/${encodeURIComponent(row.semanticKey)}`,
    previewUrl: row.dataUrl || row.sourceUrl || `/api/assets/${encodeURIComponent(row.semanticKey)}`,
    status: row.status,
  }));
}

export async function getPublishedAssetBySemanticKey(semanticKey: string) {
  const rows = await db
    .select({ registry: assetRegistry, asset: mediaAssets })
    .from(assetRegistry)
    .innerJoin(mediaAssets, eq(assetRegistry.assetId, mediaAssets.id))
    .where(eq(assetRegistry.semanticKey, semanticKey))
    .limit(1);
  const row = rows[0];
  if (!row || row.registry.status !== "published" || row.asset.status !== "published") return null;
  return { ...toPublicAsset(row.registry, row.asset), aliases: parseAliases(row.registry.aliasesJson), dataUrl: row.asset.dataUrl, sourceUrl: row.asset.sourceUrl };
}

export async function getAssetPayloadBySemanticKey(semanticKey: string) {
  const rows = await db
    .select({ registry: assetRegistry, asset: mediaAssets })
    .from(assetRegistry)
    .innerJoin(mediaAssets, eq(assetRegistry.assetId, mediaAssets.id))
    .where(eq(assetRegistry.semanticKey, semanticKey))
    .limit(1);
  const row = rows[0];
  if (!row || row.registry.status !== "published" || row.asset.status !== "published") return null;
  return row.asset;
}
