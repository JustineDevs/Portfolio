import { and, asc, eq, inArray } from "drizzle-orm";

import { providerConnections, providerUsageSnapshots, providerUsageSources } from "@/db/schema";
import { db } from "@/db/client";
import type { AgentProviderId, AgentUsageMetrics } from "@/lib/usage/providers";
import { getArchiveActivitySummary } from "@/lib/usage/archive-activity";

export type ProviderConnectionRecord = typeof providerConnections.$inferSelect;
export type ProviderUsageCsvRow = {
  provider: AgentProviderId;
  externalAccountId: string;
  accountLabel: string;
  accountEmail?: string | null;
  periodDate: string;
  totalTokens: number;
  cachedTokens: number;
  estimatedCost: number;
  sourceHash?: string | null;
};

export type ProviderUsageSourceInput = {
  sourceKey: string;
  provider: AgentProviderId;
  surface: string;
  authority: string;
  schemaVersion?: number;
  timezone?: string;
  sourceHash?: string | null;
};

export async function listProviderConnectionsForAdmin() {
  return db.select().from(providerConnections).orderBy(asc(providerConnections.provider), asc(providerConnections.accountLabel));
}

export async function listProviderUsageSourcesForAdmin() {
  const sources = await db.select().from(providerUsageSources).orderBy(asc(providerUsageSources.provider), asc(providerUsageSources.sourceKey));
  const archiveDates = Object.values([2025, 2026].map((year) => getArchiveActivitySummary(year)?.daily ?? {})).flatMap((daily) => Object.keys(daily)).sort();
  return [
    ...sources,
    {
      id: -1,
      sourceKey: "claude-code-archive",
      provider: "claude" as const,
      surface: "supplied archive",
      authority: "privacy-safe aggregate",
      schemaVersion: 1,
      timezone: "UTC",
      coverageStart: archiveDates[0] ?? null,
      coverageEnd: archiveDates.at(-1) ?? null,
      lastSourceHash: null,
      status: "verified" as const,
      lastValidatedAt: null,
      createdAt: null,
      updatedAt: null,
    },
  ];
}

export async function getProviderRollups() {
  const connections = await listProviderConnectionsForAdmin();
  const eligible = connections.filter((connection) => connection.includeInRollup && connection.status === "connected");
  const ids = eligible.map((connection) => connection.id);
  const snapshots = ids.length
    ? await db.select().from(providerUsageSnapshots).where(inArray(providerUsageSnapshots.connectionId, ids))
    : [];

  const byProvider = new Map<string, AgentUsageMetrics>();
  const activeDates = new Map<string, Set<string>>();
  for (const snapshot of snapshots) {
    const connection = eligible.find((item) => item.id === snapshot.connectionId);
    if (!connection) continue;
    const current = byProvider.get(connection.provider) ?? { totalTokens: 0, estimatedCost: 0, activeDays: 0, cacheShare: 0 };
    current.totalTokens = (current.totalTokens ?? 0) + snapshot.totalTokens;
    current.estimatedCost = (current.estimatedCost ?? 0) + snapshot.estimatedCost;
    const dates = activeDates.get(connection.provider) ?? new Set<string>();
    dates.add(snapshot.periodDate);
    activeDates.set(connection.provider, dates);
    const cachedTokens = (current as AgentUsageMetrics & { cachedTokens?: number }).cachedTokens ?? 0;
    (current as AgentUsageMetrics & { cachedTokens?: number }).cachedTokens = cachedTokens + snapshot.cachedTokens;
    byProvider.set(connection.provider, current);
  }

  return (['openai', 'claude', 'cursor', 'orca'] as AgentProviderId[]).map((provider) => {
    const metrics = byProvider.get(provider) ?? { totalTokens: null, estimatedCost: null, activeDays: null, cacheShare: null };
    const dates = activeDates.get(provider);
    const cachedTokens = (metrics as AgentUsageMetrics & { cachedTokens?: number }).cachedTokens ?? 0;
    const totalTokens = metrics.totalTokens ?? 0;
    return {
      provider,
      metrics: {
        totalTokens: metrics.totalTokens === null ? null : totalTokens,
        estimatedCost: metrics.estimatedCost,
        activeDays: dates?.size ?? (metrics.activeDays === null ? null : 0),
        cacheShare: metrics.totalTokens === null || totalTokens === 0 ? null : cachedTokens / totalTokens,
      },
      accountCount: eligible.filter((connection) => connection.provider === provider).length,
    };
  });
}

export async function getProviderUsageSummary(provider: AgentProviderId, year: number) {
  const connections = await db.select({ id: providerConnections.id }).from(providerConnections).where(and(eq(providerConnections.provider, provider), eq(providerConnections.includeInRollup, true), eq(providerConnections.status, "connected")));
  const ids = connections.map((connection) => connection.id);
  if (!ids.length) return { provider, year, totalTokens: null, estimatedCost: null, activeDays: null, cacheShare: null, daily: {} as Record<string, number> };
  const rows = await db.select().from(providerUsageSnapshots).where(inArray(providerUsageSnapshots.connectionId, ids));
  const daily: Record<string, number> = {};
  let totalTokens = 0;
  let cachedTokens = 0;
  let estimatedCost = 0;
  for (const row of rows) {
    if (!row.periodDate.startsWith(`${year}-`)) continue;
    daily[row.periodDate] = (daily[row.periodDate] ?? 0) + row.totalTokens;
    totalTokens += row.totalTokens;
    cachedTokens += row.cachedTokens;
    estimatedCost += row.estimatedCost;
  }
  const activeDays = Object.keys(daily).filter((date) => daily[date] > 0).length;
  return { provider, year, totalTokens, estimatedCost, activeDays, cacheShare: totalTokens ? cachedTokens / totalTokens : null, daily };
}

export async function createProviderConnection(input: {
  provider: AgentProviderId;
  externalAccountId: string;
  accountLabel: string;
  accountEmail?: string | null;
}) {
  return db.insert(providerConnections).values({
    provider: input.provider,
    externalAccountId: input.externalAccountId,
    accountLabel: input.accountLabel,
    accountEmail: input.accountEmail || null,
    status: "pending",
  }).returning({ id: providerConnections.id });
}

export async function setProviderConnectionRollup(id: number, includeInRollup: boolean) {
  return db.update(providerConnections).set({ includeInRollup, updatedAt: new Date().toISOString() }).where(eq(providerConnections.id, id));
}

export async function registerProviderUsageSource(input: ProviderUsageSourceInput, rows: ProviderUsageCsvRow[]) {
  const dates = rows.map((row) => row.periodDate).sort();
  const now = new Date().toISOString();
  const existing = await db.select({ id: providerUsageSources.id }).from(providerUsageSources).where(eq(providerUsageSources.sourceKey, input.sourceKey)).limit(1);
  const values = {
    sourceKey: input.sourceKey,
    provider: input.provider,
    surface: input.surface,
    authority: input.authority,
    schemaVersion: input.schemaVersion ?? 1,
    timezone: input.timezone ?? "UTC",
    coverageStart: dates[0] ?? null,
    coverageEnd: dates.at(-1) ?? null,
    lastSourceHash: input.sourceHash ?? null,
    status: "verified" as const,
    lastValidatedAt: now,
    updatedAt: now,
  };
  if (existing[0]) {
    await db.update(providerUsageSources).set(values).where(eq(providerUsageSources.id, existing[0].id));
    return existing[0].id;
  }
  const inserted = await db.insert(providerUsageSources).values(values).returning({ id: providerUsageSources.id });
  return inserted[0].id;
}

export async function writeProviderUsageSnapshot(input: {
  connectionId: number;
  sourceId?: number | null;
  periodDate: string;
  totalTokens: number;
  cachedTokens: number;
  estimatedCost: number;
  sourceHash?: string | null;
}) {
  const existing = await db.select({ id: providerUsageSnapshots.id }).from(providerUsageSnapshots).where(and(eq(providerUsageSnapshots.connectionId, input.connectionId), eq(providerUsageSnapshots.periodDate, input.periodDate))).limit(1);
  if (existing[0]) {
    return db.update(providerUsageSnapshots).set({ ...input, syncedAt: new Date().toISOString() }).where(eq(providerUsageSnapshots.id, existing[0].id));
  }
  return db.insert(providerUsageSnapshots).values(input);
}

export async function importProviderUsageCsv(rows: ProviderUsageCsvRow[]) {
  const grouped = new Map<AgentProviderId, ProviderUsageCsvRow[]>();
  for (const row of rows) grouped.set(row.provider, [...(grouped.get(row.provider) ?? []), row]);
  const results = await Promise.all(Array.from(grouped, ([provider, providerRows]) => importProviderUsageCsvFromSource(providerRows, {
    sourceKey: `admin-csv:${provider}`,
    provider,
    surface: "admin-upload",
    authority: "manual-export",
  })));
  return {
    accountCount: results.reduce((total, result) => total + result.accountCount, 0),
    snapshotCount: results.reduce((total, result) => total + result.snapshotCount, 0),
    syncedAt: new Date().toISOString(),
  };
}

export async function importProviderUsageCsvFromSource(rows: ProviderUsageCsvRow[], source?: ProviderUsageSourceInput) {
  const connectionIds = new Map<string, number>();
  let snapshotCount = 0;
  const sourceId = source ? await registerProviderUsageSource(source, rows) : null;

  for (const row of rows) {
    const key = `${row.provider}:${row.externalAccountId}`;
    let connectionId = connectionIds.get(key);
    if (!connectionId) {
      const existing = await db.select({ id: providerConnections.id }).from(providerConnections).where(and(
        eq(providerConnections.provider, row.provider),
        eq(providerConnections.externalAccountId, row.externalAccountId),
      )).limit(1);
      connectionId = existing[0]?.id ?? (await createProviderConnection({
        provider: row.provider,
        externalAccountId: row.externalAccountId,
        accountLabel: row.accountLabel,
        accountEmail: row.accountEmail,
      }))[0].id;
      connectionIds.set(key, connectionId);
    }

    await writeProviderUsageSnapshot({
      connectionId,
      sourceId,
      periodDate: row.periodDate,
      totalTokens: row.totalTokens,
      cachedTokens: row.cachedTokens,
      estimatedCost: row.estimatedCost,
      sourceHash: row.sourceHash ?? source?.sourceHash,
    });
    snapshotCount += 1;
  }

  const syncedAt = new Date().toISOString();
  for (const id of Array.from(connectionIds.values())) {
    await db.update(providerConnections).set({ status: "connected", lastSyncedAt: syncedAt, lastError: null, updatedAt: syncedAt }).where(eq(providerConnections.id, id));
  }
  return { accountCount: connectionIds.size, snapshotCount, syncedAt };
}
