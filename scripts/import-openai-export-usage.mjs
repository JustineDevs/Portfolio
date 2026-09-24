#!/usr/bin/env node

/**
 * Import privacy-safe activity counts from nested OpenAI exports.
 *
 * This intentionally reads only conversation metadata and message timestamps.
 * It never persists titles, prompts, responses, account/profile data, billing,
 * authentication records, files, or export assets.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";
import { createClient } from "@libsql/client";

loadEnv({ path: path.resolve(process.cwd(), ".env") });
loadEnv({ path: path.resolve(process.cwd(), ".env.local"), override: true });

const exportRoot = path.resolve(process.env.OPENAI_EXPORT_ROOT || path.join(process.cwd(), ".internal", "openai"));
const provider = "openai";
const externalAccountId = "openai-export";
const accountLabel = "OpenAI export (privacy-safe activity)";

function walk(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(filePath));
    else files.push(filePath);
  }
  return files;
}

function epochToIso(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const milliseconds = value < 100_000_000_000 ? value * 1000 : value;
  const date = new Date(milliseconds);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function getConversationRows(filePath) {
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return Array.isArray(parsed) ? parsed : Array.isArray(parsed.conversations) ? parsed.conversations : [];
}

function getMessageActivity(conversation) {
  const activity = [];
  for (const node of Object.values(conversation.mapping || {})) {
    const message = node?.message;
    if (!message || !["user", "assistant", "tool"].includes(message.author?.role)) continue;
    const timestamp = epochToIso(message.create_time) || epochToIso(message.update_time);
    if (timestamp) activity.push(timestamp.slice(0, 10));
  }
  if (!activity.length) {
    const fallback = epochToIso(conversation.create_time) || epochToIso(conversation.update_time);
    if (fallback) activity.push(fallback.slice(0, 10));
  }
  return activity;
}

if (!fs.existsSync(exportRoot)) throw new Error(`OpenAI export directory not found: ${exportRoot}`);

const files = walk(exportRoot).filter((filePath) => /(?:^|\/)conversations(?:[-_]\d+)?\.json$/i.test(filePath)).sort();
if (!files.length) throw new Error("No nested OpenAI conversation export files were found.");

const conversations = new Map();
for (const filePath of files) {
  for (const conversation of getConversationRows(filePath)) {
    if (!conversation?.id) continue;
    const current = conversations.get(conversation.id);
    const currentTime = Number(current?.update_time) || Number(current?.create_time) || 0;
    const nextTime = Number(conversation.update_time) || Number(conversation.create_time) || 0;
    if (!current || nextTime >= currentTime) conversations.set(conversation.id, conversation);
  }
}

const daily = new Map();
for (const conversation of conversations.values()) {
  for (const date of getMessageActivity(conversation)) {
    daily.set(date, (daily.get(date) || 0) + 1);
  }
}

const sourceHash = crypto.createHash("sha256");
for (const filePath of files) {
  sourceHash.update(path.relative(exportRoot, filePath));
  sourceHash.update(fs.readFileSync(filePath));
}
const exportHash = sourceHash.digest("hex");

const rows = [...daily].sort(([left], [right]) => left.localeCompare(right)).map(([periodDate, activityCount]) => ({
  provider,
  externalAccountId,
  accountLabel,
  periodDate,
  totalTokens: 0,
  cachedTokens: 0,
  activityCount,
  estimatedCost: 0,
  sourceHash: exportHash,
}));

if (!rows.length) throw new Error("The OpenAI export contained no dated conversation activity.");

const now = new Date().toISOString();
const sourceKey = "openai-export-conversations";
const database = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) throw new Error("Turso credentials are required.");

await database.execute({
  sql: `INSERT INTO provider_usage_sources (source_key, provider, surface, authority, schema_version, timezone, coverage_start, coverage_end, last_source_hash, status, last_validated_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, 1, 'UTC', ?, ?, ?, 'verified', ?, ?, ?)
    ON CONFLICT(source_key) DO UPDATE SET coverage_start=excluded.coverage_start, coverage_end=excluded.coverage_end, last_source_hash=excluded.last_source_hash, status='verified', last_validated_at=excluded.last_validated_at, updated_at=excluded.updated_at`,
  args: [sourceKey, provider, "OpenAI export / User Online Activity", "local OpenAI account export", rows[0].periodDate, rows.at(-1).periodDate, rows[0].sourceHash, now, now, now],
});
const source = await database.execute({ sql: "SELECT id FROM provider_usage_sources WHERE source_key = ?", args: [sourceKey] });

await database.execute({
  sql: `INSERT INTO provider_connections (provider, external_account_id, account_label, status, include_in_rollup, last_synced_at, last_error, created_at, updated_at)
    VALUES (?, ?, ?, 'connected', 1, ?, NULL, ?, ?)
    ON CONFLICT(provider, external_account_id) DO UPDATE SET account_label=excluded.account_label, status='connected', include_in_rollup=1, last_synced_at=excluded.last_synced_at, last_error=NULL, updated_at=excluded.updated_at`,
  args: [provider, externalAccountId, accountLabel, now, now, now],
});
const connection = await database.execute({ sql: "SELECT id FROM provider_connections WHERE provider = ? AND external_account_id = ?", args: [provider, externalAccountId] });

for (const row of rows) {
  await database.execute({
    sql: `INSERT INTO provider_usage_snapshots (connection_id, source_id, period_date, total_tokens, cached_tokens, activity_count, estimated_cost, source_hash, synced_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(connection_id, period_date) DO UPDATE SET source_id=excluded.source_id, total_tokens=excluded.total_tokens, cached_tokens=excluded.cached_tokens, activity_count=excluded.activity_count, estimated_cost=excluded.estimated_cost, source_hash=excluded.source_hash, synced_at=excluded.synced_at`,
    args: [connection.rows[0].id, source.rows[0].id, row.periodDate, row.totalTokens, row.cachedTokens, row.activityCount, row.estimatedCost, row.sourceHash, now],
  });
}

const result = { accountCount: 1, snapshotCount: rows.length, syncedAt: now };

console.log(JSON.stringify({
  source: path.relative(process.cwd(), exportRoot),
  conversationFiles: files.length,
  uniqueConversations: conversations.size,
  coverage: `${rows[0].periodDate}..${rows.at(-1).periodDate}`,
  activityDays: rows.length,
  activityEvents: rows.reduce((total, row) => total + row.activityCount, 0),
  tokenData: "not present in export; stored as unavailable",
  imported: result,
}, null, 2));
await database.close();
