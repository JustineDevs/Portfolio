import { and, asc, eq, inArray } from "drizzle-orm";

import { providerConnections, providerUsageSnapshots } from "@/db/schema";
import { db } from "@/db/client";
import type { AgentProviderId, AgentUsageMetrics } from "@/lib/usage/providers";

export type ProviderConnectionRecord = typeof providerConnections.$inferSelect;
export type ProviderUsageSyncInput = {
  provider: AgentProviderId;
  externalAccountId: string;
  snapshots: Array<{
    periodDate: string;
    totalTokens: number;
    cachedTokens: number;
    estimatedCost: number;
    sourceHash?: string | null;
  }>;
};

export async function listProviderConnectionsForAdmin() {
  return db.select().from(providerConnections).orderBy(asc(providerConnections.provider), asc(providerConnections.accountLabel));
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

  return (['openai', 'claude', 'cursor'] as AgentProviderId[]).map((provider) => {
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
  connectionRef?: string | null;
}) {
  return db.insert(providerConnections).values({
    provider: input.provider,
    externalAccountId: input.externalAccountId,
    accountLabel: input.accountLabel,
    accountEmail: input.accountEmail || null,
    connectionRef: input.connectionRef || null,
    status: input.connectionRef ? "connected" : "pending",
  }).returning({ id: providerConnections.id });
}

export async function setProviderConnectionRollup(id: number, includeInRollup: boolean) {
  return db.update(providerConnections).set({ includeInRollup, updatedAt: new Date().toISOString() }).where(eq(providerConnections.id, id));
}

export async function writeProviderUsageSnapshot(input: {
  connectionId: number;
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

export async function ingestProviderUsageSnapshots(input: ProviderUsageSyncInput) {
  const connection = await db.select().from(providerConnections).where(and(
    eq(providerConnections.provider, input.provider),
    eq(providerConnections.externalAccountId, input.externalAccountId),
  )).limit(1);
  if (!connection[0]) throw new Error("Provider account is not registered.");

  for (const snapshot of input.snapshots) {
    await writeProviderUsageSnapshot({ connectionId: connection[0].id, ...snapshot });
  }

  const syncedAt = new Date().toISOString();
  await db.update(providerConnections).set({ status: "connected", lastSyncedAt: syncedAt, lastError: null, updatedAt: syncedAt }).where(eq(providerConnections.id, connection[0].id));
  return { connectionId: connection[0].id, syncedAt, snapshotCount: input.snapshots.length };
}
