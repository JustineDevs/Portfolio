#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const codexDb = process.env.CODEX_HISTORY_DB || path.join(os.homedir(), ".codex", "thread_history_1.sqlite");
const orcaUsagePath = process.env.ORCA_USAGE_FILE || path.join(os.homedir(), ".config", "orca", "orca-codex-usage.json");
const cursorUsagePath = process.env.CURSOR_USAGE_FILE || path.join(os.homedir(), "Downloads", "ai-usage-export", "cursor-usage-public.csv");
const codexSessionsPath = process.env.CODEX_SESSIONS_DIR || path.join(os.homedir(), ".codex", "sessions");
const outputPath = process.env.PUBLIC_AI_USAGE_CSV || path.join(repoRoot, "public", "usage", "ai-usage.csv");
const exportSalt = process.env.AI_USAGE_EXPORT_SALT;
if (!exportSalt || exportSalt.length < 16) throw new Error("AI_USAGE_EXPORT_SALT must be set to a deployment secret of at least 16 characters.");

const csvColumns = ["date_time", "platform", "model_provider", "project_category", "session_duration_seconds", "tool_event_count", "input_tokens", "cached_input_tokens", "output_tokens", "token_usage", "anonymized_session_id", "source"];

function csv(value) {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
function dateTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
function safeCategory(value, fallback) {
  if (typeof value !== "string" || !value.trim()) return fallback;
  const normalized = value.trim().replaceAll("\\", "/").split("/").at(-1)?.replace(/\.(git|jsonl|zst)$/i, "") ?? "";
  return normalized.replace(/[^a-zA-Z0-9 ._-]/g, "").replace(/\s+/g, " ").trim().slice(0, 80) || fallback;
}
function anonymousId(provider, sourceId, date) {
  return crypto.createHmac("sha256", exportSalt).update(`${provider}:${sourceId}:${date}`).digest("hex").slice(0, 24);
}
function querySqlite(sql) {
  const output = execFileSync("sqlite3", ["-json", codexDb, sql], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  return output.trim() ? JSON.parse(output) : [];
}
function codexRows() {
  if (!fs.existsSync(codexDb)) return [];
  return querySqlite(`SELECT thread_id AS source_id, datetime(MIN(created_at_ms) / 1000, 'unixepoch') AS date_time, MIN(created_at_ms) AS first_ms, MAX(created_at_ms) AS last_ms, SUM(CASE WHEN item_type IN ('commandExecution','mcpToolCall','webSearch','functionCallOutput','collabAgentToolCall') THEN 1 ELSE 0 END) AS tool_event_count FROM thread_items GROUP BY thread_id, date(created_at_ms / 1000, 'unixepoch') ORDER BY date_time, source_id`).map((row) => ({
    date_time: row.date_time,
    platform: "Codex",
    model_provider: "OpenAI",
    project_category: "Codex development",
    session_duration_seconds: Math.max(0, Math.round((Number(row.last_ms) - Number(row.first_ms)) / 1000)),
    tool_event_count: Number(row.tool_event_count) || 0,
    input_tokens: "",
    cached_input_tokens: "",
    output_tokens: "",
    token_usage: "",
    anonymized_session_id: anonymousId("codex", row.source_id, row.date_time),
    source: "codex-thread-history",
  }));
}
function orcaRows() {
  if (!fs.existsSync(orcaUsagePath)) return [];
  const data = JSON.parse(fs.readFileSync(orcaUsagePath, "utf8"));
  return (Array.isArray(data.sessions) ? data.sessions : []).flatMap((session) => {
    const date = dateTime(session.firstTimestamp);
    if (!date || !session.sessionId) return [];
    const first = new Date(session.firstTimestamp).getTime();
    const last = new Date(session.lastTimestamp).getTime();
    return [{ date_time: date, platform: "Orca", model_provider: safeCategory(session.primaryModel, "Codex-compatible model"), project_category: safeCategory(session.primaryProjectLabel, "Orca development"), session_duration_seconds: Number.isFinite(first) && Number.isFinite(last) ? Math.max(0, Math.round((last - first) / 1000)) : 0, tool_event_count: Number(session.eventCount) || 0, input_tokens: Number(session.totalInputTokens) || 0, cached_input_tokens: Number(session.totalCachedInputTokens) || 0, output_tokens: Number(session.totalOutputTokens) || 0, token_usage: Number(session.totalTokens) || 0, anonymized_session_id: anonymousId("orca", session.sessionId, date), source: "orca-usage-index" }];
  });
}
function cursorRows() {
  if (!fs.existsSync(cursorUsagePath)) return [];
  const lines = fs.readFileSync(cursorUsagePath, "utf8").split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",");
  const eventMetrics = new Set(["scored_commits", "ai_code_tracking_events", "ai_code_tracking_conversations", "composer_sessions", "composer_archived_sessions", "composer_subagent_sessions", "composer_sessions_created", "composer_subagent_sessions_created"]);
  return lines.slice(1).flatMap((line, index) => {
    const values = line.split(",");
    const record = Object.fromEntries(headers.map((header, headerIndex) => [header, values[headerIndex] ?? ""]));
    const date = dateTime(record.date_utc);
    const value = Number(record.value);
    if (!date || !eventMetrics.has(record.metric) || !Number.isFinite(value) || value < 0) return [];
    return [{ date_time: date, platform: "Cursor", model_provider: "Cursor", project_category: "Cursor development", session_duration_seconds: 0, tool_event_count: Math.round(value), input_tokens: "", cached_input_tokens: "", output_tokens: "", token_usage: "", anonymized_session_id: anonymousId("cursor", `${record.date_utc}:${record.metric}:${index}`, date), source: "cursor-public-metadata" }];
  });
}
function dedupeSessionFiles() {
  if (!fs.existsSync(codexSessionsPath)) return { files: 0, uniqueInodes: 0 };
  const inodes = new Set(); let files = 0;
  const visit = (directory) => { for (const entry of fs.readdirSync(directory, { withFileTypes: true })) { const file = path.join(directory, entry.name); if (entry.isDirectory()) visit(file); else if (/\.jsonl(?:\.zst)?$/.test(entry.name)) { const stat = fs.statSync(file); files += 1; inodes.add(`${stat.dev}:${stat.ino}`); } } };
  visit(codexSessionsPath);
  return { files, uniqueInodes: inodes.size };
}
const codex = codexRows(); const orca = orcaRows(); const cursor = cursorRows(); const rows = [...codex, ...orca, ...cursor].sort((a, b) => `${a.date_time}:${a.platform}:${a.anonymized_session_id}`.localeCompare(`${b.date_time}:${b.platform}:${b.anonymized_session_id}`));
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${csvColumns.join(",")}\n${rows.map((row) => csvColumns.map((column) => csv(row[column])).join(",")).join("\n")}\n`, { mode: 0o600 });
console.log(JSON.stringify({ outputPath, rows: rows.length, codexRows: codex.length, orcaRows: orca.length, cursorRows: cursor.length, ...dedupeSessionFiles(), exportSaltSource: "environment" }, null, 2));
