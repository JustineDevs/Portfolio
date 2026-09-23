import { NextResponse } from "next/server";

import { getProviderUsageSummary, importProviderUsageCsvFromSource } from "@/lib/integrations/provider-usage";
import { MAX_PROVIDER_USAGE_CSV_BYTES, MAX_PROVIDER_USAGE_CSV_ROWS, parseProviderUsageCsv } from "@/lib/integrations/provider-usage-csv";
import { getArchiveActivitySummary } from "@/lib/usage/archive-activity";
import { getPublicUsageSummary } from "@/lib/usage/public-ai-usage";
import { sha256Hex, verifyUsageSignature } from "@/lib/integrations/provider-usage-security";

const providerIds = ["openai", "claude", "cursor", "orca"] as const;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider");
  const year = Number(url.searchParams.get("year") ?? new Date().getUTCFullYear());
  if (!provider || !providerIds.includes(provider as (typeof providerIds)[number]) || !Number.isInteger(year)) {
    return NextResponse.json({ error: "Invalid provider or year." }, { status: 400 });
  }
  if (provider === "openai") {
    const codex = getPublicUsageSummary(year, "Codex");
    if (codex.activeDays !== null) return NextResponse.json({ provider, year, ...codex }, { headers: { "Cache-Control": "no-store" } });
  }
  if (provider === "orca") {
    return NextResponse.json({ provider, year, ...getPublicUsageSummary(year, "Orca") }, { headers: { "Cache-Control": "no-store" } });
  }
  if (provider === "cursor") {
    const cursor = getPublicUsageSummary(year, "Cursor");
    if (cursor.activeDays !== null) return NextResponse.json({ provider, year, ...cursor }, { headers: { "Cache-Control": "no-store" } });
  }
  const summary = await getProviderUsageSummary(provider as "openai" | "claude" | "cursor", year);
  if (provider === "claude" && summary.totalTokens === null) {
    const archive = getArchiveActivitySummary(year);
    if (archive) {
      return NextResponse.json({
        ...summary,
        activeDays: archive.activeDays,
        daily: archive.daily,
        activityType: "messages",
        totalMessages: archive.totalMessages,
        totalConversations: archive.totalConversations,
      }, { headers: { "Cache-Control": "no-store" } });
    }
  }
  return NextResponse.json(summary, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const body = await request.text();
  if (Buffer.byteLength(body, "utf8") > MAX_PROVIDER_USAGE_CSV_BYTES) return NextResponse.json({ error: "Usage import is limited to 5 MB." }, { status: 413 });
  const signature = verifyUsageSignature(request, body);
  if (!signature.ok) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const rows = parseProviderUsageCsv(body);
    if (rows.length > MAX_PROVIDER_USAGE_CSV_ROWS) return NextResponse.json({ error: `CSV cannot contain more than ${MAX_PROVIDER_USAGE_CSV_ROWS.toLocaleString()} usage rows.` }, { status: 400 });
    const providers = new Set(rows.map((row) => row.provider));
    if (providers.size !== 1) return NextResponse.json({ error: "Each ingestion request must contain one provider." }, { status: 400 });
    const sourceKey = request.headers.get("x-usage-source-key")?.trim() ?? "";
    const surface = request.headers.get("x-usage-surface")?.trim() ?? "";
    const authority = request.headers.get("x-usage-authority")?.trim() ?? "";
    if (!/^[a-z0-9][a-z0-9._:-]{2,127}$/.test(sourceKey) || !surface || !authority) {
      return NextResponse.json({ error: "Source key, surface, and authority headers are required." }, { status: 400 });
    }
    const result = await importProviderUsageCsvFromSource(rows, {
      sourceKey,
      provider: rows[0].provider,
      surface,
      authority,
      sourceHash: sha256Hex(body),
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to import provider usage CSV.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
