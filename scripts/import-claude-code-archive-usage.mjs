#!/usr/bin/env node

/**
 * Import the already-redacted Claude Code aggregate archive.
 *
 * This contains only daily counts and aggregate conversation totals. It does
 * not read or persist prompts, responses, titles, paths, account metadata, or
 * credentials.
 */
import crypto from "node:crypto";
import { createClient } from "@libsql/client";
import { config as loadEnv } from "dotenv";
import path from "node:path";

loadEnv({ path: path.resolve(process.cwd(), ".env") });
loadEnv({ path: path.resolve(process.cwd(), ".env.local"), override: true });

const archive = {
  2025: {
    daily: { "2025-06-23": 6, "2025-06-25": 4 },
    totalMessages: 10,
    totalConversations: 2,
  },
  2026: {
    daily: {
      "2026-01-19": 8,
      "2026-01-22": 16,
      "2026-02-14": 10,
      "2026-02-15": 14,
      "2026-02-18": 6,
      "2026-02-23": 12,
      "2026-03-01": 4,
    },
    totalMessages: 70,
    totalConversations: 10,
  },
};

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  throw new Error("Turso credentials are required.");
}

const sourcePayload = JSON.stringify(archive);
const sourceHash = crypto.createHash("sha256").update(sourcePayload).digest("hex");
const database = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
const provider = "claude";
const sourceKey = "claude-code-redacted-archive";
const accountId = "claude-code-archive";
const accountLabel = "Claude Code export (privacy-safe activity)";
const rows = Object.entries(archive).flatMap(([year, value]) => Object.entries(value.daily).map(([periodDate, activityCount]) => ({ periodDate, activityCount })));
const now = new Date().toISOString();

await database.execute({
  sql: `INSERT INTO provider_usage_sources (source_key, provider, surface, authority, schema_version, timezone, coverage_start, coverage_end, last_source_hash, status, last_validated_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, 1, 'UTC', ?, ?, ?, 'verified', ?, ?, ?)
    ON CONFLICT(source_key) DO UPDATE SET coverage_start=excluded.coverage_start, coverage_end=excluded.coverage_end, last_source_hash=excluded.last_source_hash, status='verified', last_validated_at=excluded.last_validated_at, updated_at=excluded.updated_at`,
  args: [sourceKey, provider, "redacted aggregate archive", "local Claude Code archive", rows[0].periodDate, rows.at(-1).periodDate, sourceHash, now, now, now],
});
const source = await database.execute({ sql: "SELECT id FROM provider_usage_sources WHERE source_key = ?", args: [sourceKey] });

await database.execute({
  sql: `INSERT INTO provider_connections (provider, external_account_id, account_label, status, include_in_rollup, last_synced_at, last_error, created_at, updated_at)
    VALUES (?, ?, ?, 'connected', 1, ?, NULL, ?, ?)
    ON CONFLICT(provider, external_account_id) DO UPDATE SET account_label=excluded.account_label, status='connected', include_in_rollup=1, last_synced_at=excluded.last_synced_at, last_error=NULL, updated_at=excluded.updated_at`,
  args: [provider, accountId, accountLabel, now, now, now],
});
const connection = await database.execute({ sql: "SELECT id FROM provider_connections WHERE provider = ? AND external_account_id = ?", args: [provider, accountId] });

for (const row of rows) {
  await database.execute({
    sql: `INSERT INTO provider_usage_snapshots (connection_id, source_id, period_date, total_tokens, cached_tokens, activity_count, estimated_cost, source_hash, synced_at)
      VALUES (?, ?, ?, 0, 0, ?, 0, ?, ?)
      ON CONFLICT(connection_id, period_date) DO UPDATE SET source_id=excluded.source_id, total_tokens=0, cached_tokens=0, activity_count=excluded.activity_count, estimated_cost=0, source_hash=excluded.source_hash, synced_at=excluded.synced_at`,
    args: [connection.rows[0].id, source.rows[0].id, row.periodDate, row.activityCount, sourceHash, now],
  });
}

console.log(JSON.stringify({ provider, sourceKey, coverage: `${rows[0].periodDate}..${rows.at(-1).periodDate}`, snapshotCount: rows.length, activityEvents: rows.reduce((sum, row) => sum + row.activityCount, 0), sourceHash }, null, 2));
await database.close();
