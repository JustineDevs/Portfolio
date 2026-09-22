import { NextResponse } from "next/server";

import { getProviderUsageSummary, ingestProviderUsageSnapshots, type ProviderUsageSyncInput } from "@/lib/integrations/provider-usage";

const providerIds = ["openai", "claude", "cursor"] as const;

function hasSyncSecret(request: Request) {
  const configured = process.env.PROVIDER_USAGE_SYNC_SECRET?.trim();
  const authorization = request.headers.get("authorization") ?? "";
  return Boolean(configured && authorization === `Bearer ${configured}`);
}

function isValidSnapshot(value: unknown): value is ProviderUsageSyncInput["snapshots"][number] {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Record<string, unknown>;
  return typeof snapshot.periodDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(snapshot.periodDate)
    && ["totalTokens", "cachedTokens", "estimatedCost"].every((key) => typeof snapshot[key] === "number" && Number.isFinite(snapshot[key]) && Number(snapshot[key]) >= 0);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider");
  const year = Number(url.searchParams.get("year") ?? new Date().getUTCFullYear());
  if (!provider || !providerIds.includes(provider as (typeof providerIds)[number]) || !Number.isInteger(year)) {
    return NextResponse.json({ error: "Invalid provider or year." }, { status: 400 });
  }
  return NextResponse.json(await getProviderUsageSummary(provider as "openai" | "claude" | "cursor", year), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!hasSyncSecret(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
  if (!payload || typeof payload !== "object") return NextResponse.json({ error: "Invalid sync payload." }, { status: 400 });
  const body = payload as Record<string, unknown>;
  const provider = body.provider;
  const externalAccountId = typeof body.externalAccountId === "string" ? body.externalAccountId.trim() : "";
  const snapshots = Array.isArray(body.snapshots) ? body.snapshots : [];
  if (!providerIds.includes(provider as (typeof providerIds)[number]) || !externalAccountId || !snapshots.length || snapshots.length > 1000 || !snapshots.every(isValidSnapshot)) {
    return NextResponse.json({ error: "Provider, external account ID, and 1–1000 valid snapshots are required." }, { status: 400 });
  }
  try {
    const result = await ingestProviderUsageSnapshots({ provider: provider as ProviderUsageSyncInput["provider"], externalAccountId, snapshots });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sync provider usage.";
    return NextResponse.json({ error: message }, { status: message === "Provider account is not registered." ? 404 : 500 });
  }
}
