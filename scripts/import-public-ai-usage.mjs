#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";
import { config as loadEnv } from "dotenv";

loadEnv({ path: path.resolve(process.cwd(), ".env") });
loadEnv({ path: path.resolve(process.cwd(), ".env.local"), override: true });
const inputPath = process.env.PUBLIC_AI_USAGE_CSV || path.resolve(process.cwd(), "public/usage/ai-usage.csv");
const csv = fs.readFileSync(inputPath, "utf8");
const sourceHash = crypto.createHash("sha256").update(csv, "utf8").digest("hex");
const database = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

function parseLine(line) {
  const values = []; let value = ""; let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"' && quoted) { value += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { values.push(value); value = ""; }
    else value += char;
  }
  values.push(value); return values;
}

const lines = csv.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
const headers = parseLine(lines.shift()).map((header) => header.trim());
const providerMap = { Codex: "openai", Cursor: "cursor", Orca: "orca" };
const grouped = new Map();
for (const line of lines) {
  const values = parseLine(line);
  const row = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  const provider = providerMap[row.platform]; const date = row.date_time?.slice(0, 10);
  if (!provider || !/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
  const key = `${provider}:${date}`;
  const current = grouped.get(key) || { provider, date, tokens: 0, cached: 0, events: 0 };
  current.tokens += Math.max(0, Number(row.token_usage) || 0);
  current.cached += Math.max(0, Number(row.cached_input_tokens) || 0);
  current.events += Math.max(0, Number(row.tool_event_count) || 0);
  grouped.set(key, current);
}

async function importProvider(provider, rows) {
  const now = new Date().toISOString(); const sourceKey = `public-ai-usage:${provider}`;
  const accountId = `public-export:${provider}`; const dates = rows.map((row) => row.date).sort();
  await database.execute({ sql: `INSERT INTO provider_usage_sources (source_key, provider, surface, authority, schema_version, timezone, coverage_start, coverage_end, last_source_hash, status, last_validated_at, created_at, updated_at) VALUES (?, ?, ?, ?, 1, 'UTC', ?, ?, ?, 'verified', ?, ?, ?) ON CONFLICT(source_key) DO UPDATE SET coverage_start=excluded.coverage_start, coverage_end=excluded.coverage_end, last_source_hash=excluded.last_source_hash, status='verified', last_validated_at=excluded.last_validated_at, updated_at=excluded.updated_at`, args: [sourceKey, provider, "public anonymized CSV", "local export registry", dates[0], dates.at(-1), sourceHash, now, now, now] });
  const source = await database.execute({ sql: "SELECT id FROM provider_usage_sources WHERE source_key = ?", args: [sourceKey] });
  await database.execute({ sql: `INSERT INTO provider_connections (provider, external_account_id, account_label, status, include_in_rollup, last_synced_at, last_error, created_at, updated_at) VALUES (?, ?, ?, 'connected', 1, ?, NULL, ?, ?) ON CONFLICT(provider, external_account_id) DO UPDATE SET account_label=excluded.account_label, status='connected', include_in_rollup=1, last_synced_at=excluded.last_synced_at, last_error=NULL, updated_at=excluded.updated_at`, args: [provider, accountId, `Public anonymized ${provider} export`, now, now, now] });
  const connection = await database.execute({ sql: "SELECT id FROM provider_connections WHERE provider = ? AND external_account_id = ?", args: [provider, accountId] });
  for (const row of rows) await database.execute({ sql: `INSERT INTO provider_usage_snapshots (connection_id, source_id, period_date, total_tokens, cached_tokens, activity_count, estimated_cost, source_hash, synced_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?) ON CONFLICT(connection_id, period_date) DO UPDATE SET source_id=excluded.source_id, total_tokens=excluded.total_tokens, cached_tokens=excluded.cached_tokens, activity_count=excluded.activity_count, estimated_cost=0, source_hash=excluded.source_hash, synced_at=excluded.synced_at`, args: [connection.rows[0].id, source.rows[0].id, row.date, row.tokens, Math.min(row.cached, row.tokens), row.events, sourceHash, now] });
  return { provider, days: rows.length, tokens: rows.reduce((sum, row) => sum + row.tokens, 0), events: rows.reduce((sum, row) => sum + row.events, 0), coverage: `${dates[0]}..${dates.at(-1)}` };
}

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) throw new Error("Turso credentials are required.");
await database.execute("ALTER TABLE provider_usage_snapshots ADD COLUMN activity_count INTEGER NOT NULL DEFAULT 0").catch((error) => { if (!String(error.message).includes("duplicate column")) throw error; });
const rowsByProvider = new Map();
for (const row of grouped.values()) rowsByProvider.set(row.provider, [...(rowsByProvider.get(row.provider) || []), row]);
const results = [];
for (const [provider, rows] of rowsByProvider) results.push(await importProvider(provider, rows.sort((a, b) => a.date.localeCompare(b.date))));
console.log(JSON.stringify({ input: path.basename(inputPath), sourceHash, providers: results }, null, 2));
await database.close();
