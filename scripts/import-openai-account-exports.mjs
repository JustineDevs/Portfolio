#!/usr/bin/env node

/**
 * Import three OpenAI exports as privacy-safe, database-backed rollups.
 * Only conversation timestamps/counts and successful paid charges are stored.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { config as loadEnv } from "dotenv";
import { createClient } from "@libsql/client";

loadEnv({ path: path.resolve(process.cwd(), ".env") });
loadEnv({ path: path.resolve(process.cwd(), ".env.local"), override: true });

const root = path.resolve(process.env.OPENAI_EXPORT_ROOT || path.join(process.cwd(), ".internal", "openai"));
const accounts = fs.readdirSync(root, { withFileTypes: true }).filter((entry) => entry.isDirectory() && /^OpenAI-export(?: \(\d+\))?$/.test(entry.name)).sort((a, b) => a.name.localeCompare(b.name));
if (accounts.length !== 3) throw new Error("Expected 3 OpenAI export directories; found " + accounts.length + ".");
if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) throw new Error("Turso credentials are required.");

function epochToDate(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  const date = new Date(number < 100000000000 ? number * 1000 : number);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}
function zipEntries(zipPath) {
  return execFileSync("unzip", ["-Z1", zipPath], { encoding: "utf8" }).split(/\r?\n/).filter(Boolean);
}
function zipText(zipPath, entry) {
  return execFileSync("unzip", ["-p", zipPath, entry], { encoding: "utf8", maxBuffer: 512 * 1024 * 1024 });
}
function parseCsv(text) {
  const rows = [];
  for (const line of text.split(/\r?\n/).filter(Boolean)) {
    const cells = [];
    let cell = "";
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      if (char === "\"") {
        if (quoted && line[index + 1] === "\"") { cell += "\""; index += 1; } else quoted = !quoted;
      } else if (char === "," && !quoted) { cells.push(cell); cell = ""; } else cell += char;
    }
    cells.push(cell);
    rows.push(cells);
  }
  const headers = rows.shift()?.map((header) => header.trim().toLowerCase()) ?? [];
  return rows.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index]?.trim() ?? ""])));
}
function chargeAmount(row) {
  const status = (row.status + " " + row.payment_status).toLowerCase();
  if (!status.includes("succeeded") || (row.paid && row.paid.toLowerCase() !== "true") || row.refunded?.toLowerCase() === "true") return null;
  const amount = Number(row.amount);
  return Number.isFinite(amount) && amount > 0 ? amount / 100 : null;
}
function addDaily(daily, date) {
  if (date && !daily.has(date)) daily.set(date, { activityCount: 0, costs: {} });
}
function addConversationActivity(daily, conversation) {
  const dates = [];
  for (const node of Object.values(conversation?.mapping ?? {})) {
    const message = node?.message;
    if (!message || !["user", "assistant", "tool"].includes(message.author?.role)) continue;
    const date = epochToDate(message.create_time) || epochToDate(message.update_time);
    if (date) dates.push(date);
  }
  if (!dates.length) dates.push(epochToDate(conversation?.create_time) || epochToDate(conversation?.update_time));
  for (const date of dates) { addDaily(daily, date); if (date) daily.get(date).activityCount += 1; }
}

const database = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
const now = new Date().toISOString();
const totals = { accounts: [], activityEvents: 0, costs: {} };
await database.execute("UPDATE provider_connections SET include_in_rollup = 0, status = 'paused', updated_at = ? WHERE provider = 'openai'", [now]);

for (const [index, account] of accounts.entries()) {
  const accountNumber = index + 1;
  const accountRoot = path.join(root, account.name);
  const conversationZip = fs.readdirSync(path.join(accountRoot, "User Online Activity")).map((name) => path.join(accountRoot, "User Online Activity", name)).find((file) => /Conversations.*\.zip$/i.test(file));
  if (!conversationZip) throw new Error("Conversation archive missing for " + account.name + ".");
  const entries = zipEntries(conversationZip).filter((entry) => /(?:^|\/)conversations(?:-\d+)?\.json$/i.test(entry));
  const conversations = new Map();
  const hash = crypto.createHash("sha256").update(fs.readFileSync(conversationZip));
  for (const entry of entries) {
    const parsed = JSON.parse(zipText(conversationZip, entry));
    for (const conversation of Array.isArray(parsed) ? parsed : []) {
      const id = conversation?.id || conversation?.conversation_id;
      if (!id) continue;
      const previous = conversations.get(id);
      if (!previous || Number(conversation.update_time || conversation.create_time || 0) >= Number(previous.update_time || previous.create_time || 0)) conversations.set(id, conversation);
    }
  }
  const daily = new Map();
  for (const conversation of conversations.values()) addConversationActivity(daily, conversation);
  const chargePath = path.join(accountRoot, "Financial", "Charge History.csv");
  const chargeRows = parseCsv(fs.readFileSync(chargePath, "utf8"));
  hash.update(fs.readFileSync(chargePath));
  for (const row of chargeRows) {
    const amount = chargeAmount(row);
    const currency = (row.currency || "USD").toUpperCase();
    const date = epochToDate(row.created) || epochToDate(row.created_at);
    if (amount === null || !date) continue;
    addDaily(daily, date);
    daily.get(date).costs[currency] = (daily.get(date).costs[currency] ?? 0) + amount;
  }
  const sourceHash = hash.digest("hex");
  const rows = [...daily.entries()].sort(([left], [right]) => left.localeCompare(right));
  const sourceKey = "openai-account-export:" + accountNumber;
  await database.execute({ sql: "INSERT INTO provider_usage_sources (source_key, provider, surface, authority, schema_version, timezone, coverage_start, coverage_end, last_source_hash, status, last_validated_at, created_at, updated_at) VALUES (?, 'openai', 'OpenAI export / activity + financial', 'local account export', 2, 'UTC', ?, ?, ?, 'verified', ?, ?, ?) ON CONFLICT(source_key) DO UPDATE SET coverage_start=excluded.coverage_start, coverage_end=excluded.coverage_end, last_source_hash=excluded.last_source_hash, status='verified', last_validated_at=excluded.last_validated_at, updated_at=excluded.updated_at", args: [sourceKey, rows[0]?.[0] ?? null, rows.at(-1)?.[0] ?? null, sourceHash, now, now, now] });
  const source = await database.execute({ sql: "SELECT id FROM provider_usage_sources WHERE source_key = ?", args: [sourceKey] });
  const externalAccountId = "openai-export-account-" + accountNumber;
  await database.execute({ sql: "INSERT INTO provider_connections (provider, external_account_id, account_label, status, include_in_rollup, last_synced_at, last_error, created_at, updated_at) VALUES ('openai', ?, ?, 'connected', 1, ?, NULL, ?, ?) ON CONFLICT(provider, external_account_id) DO UPDATE SET account_label=excluded.account_label, status='connected', include_in_rollup=1, last_synced_at=excluded.last_synced_at, last_error=NULL, updated_at=excluded.updated_at", args: [externalAccountId, "OpenAI account " + accountNumber, now, now, now] });
  const connection = await database.execute({ sql: "SELECT id FROM provider_connections WHERE provider = ? AND external_account_id = ?", args: ["openai", externalAccountId] });
  for (const [periodDate, value] of rows) {
    const currencies = Object.entries(value.costs);
    if (currencies.length > 1) throw new Error("Multiple billing currencies on " + account.name + " " + periodDate + "; refusing ambiguous rollup.");
    const costCurrency = currencies[0]?.[0] ?? "USD";
    const estimatedCost = currencies[0]?.[1] ?? 0;
    await database.execute({ sql: "INSERT INTO provider_usage_snapshots (connection_id, source_id, period_date, total_tokens, cached_tokens, activity_count, estimated_cost, cost_currency, source_hash, synced_at) VALUES (?, ?, ?, 0, 0, ?, ?, ?, ?, ?) ON CONFLICT(connection_id, period_date) DO UPDATE SET source_id=excluded.source_id, total_tokens=0, cached_tokens=0, activity_count=excluded.activity_count, estimated_cost=excluded.estimated_cost, cost_currency=excluded.cost_currency, source_hash=excluded.source_hash, synced_at=excluded.synced_at", args: [connection.rows[0].id, source.rows[0].id, periodDate, value.activityCount, estimatedCost, costCurrency, sourceHash, now] });
  }
  const accountCosts = {};
  for (const [, value] of rows) for (const [currency, amount] of Object.entries(value.costs)) { accountCosts[currency] = (accountCosts[currency] ?? 0) + amount; totals.costs[currency] = (totals.costs[currency] ?? 0) + amount; }
  const activityEvents = rows.reduce((total, [, value]) => total + value.activityCount, 0);
  totals.activityEvents += activityEvents;
  totals.accounts.push({ account: accountNumber, source: account.name, conversations: conversations.size, activityEvents, activityDays: rows.filter(([, value]) => value.activityCount > 0).length, cost: accountCosts, coverage: rows.length ? rows[0][0] + ".." + rows.at(-1)[0] : null });
}

console.log(JSON.stringify({ ...totals, tokenData: "not present in OpenAI export; stored as unavailable" }, null, 2));
await database.close();
