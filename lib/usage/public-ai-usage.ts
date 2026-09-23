import fs from "node:fs";
import path from "node:path";

export type PublicUsageRow = { date: string; platform: string; modelProvider: string; projectCategory: string; sessionDurationSeconds: number; toolEventCount: number; inputTokens: number | null; cachedInputTokens: number | null; outputTokens: number | null; tokenUsage: number | null };

const standardApiPricing: Record<string, { input: number; cachedInput: number; output: number }> = {
  "gpt-5.6-luna": { input: 0.2, cachedInput: 0.02, output: 1.2 },
  "gpt-5.4-mini": { input: 0.75, cachedInput: 0.075, output: 4.5 },
  "gpt-5.5": { input: 5, cachedInput: 0.5, output: 30 },
};

function parseCsvLine(line: string) {
  const values: string[] = []; let value = ""; let quoted = false;
  for (let index = 0; index < line.length; index += 1) { const character = line[index]; if (character === '"' && line[index + 1] === '"' && quoted) { value += '"'; index += 1; } else if (character === '"') quoted = !quoted; else if (character === "," && !quoted) { values.push(value); value = ""; } else value += character; }
  values.push(value); return values;
}
function readRows() {
  const file = path.join(process.cwd(), "public", "usage", "ai-usage.csv");
  if (!fs.existsSync(file)) return [];
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean); if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => { const values = parseCsvLine(line); const record = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])); const numberOrNull = (value: string) => { const parsed = Number(value); return Number.isFinite(parsed) && parsed >= 0 && value !== "" ? parsed : null; }; const tokens = numberOrNull(record.token_usage); return { date: record.date_time.slice(0, 10), platform: record.platform, modelProvider: record.model_provider, projectCategory: record.project_category, sessionDurationSeconds: Number(record.session_duration_seconds) || 0, toolEventCount: Number(record.tool_event_count) || 0, inputTokens: numberOrNull(record.input_tokens), cachedInputTokens: numberOrNull(record.cached_input_tokens), outputTokens: numberOrNull(record.output_tokens), tokenUsage: tokens && tokens > 0 ? tokens : null }; }).filter((row) => /^\d{4}-\d{2}-\d{2}$/.test(row.date));
}
export function getPublicUsageSummary(year: number, platform: "Codex" | "Orca" | "Cursor") {
  const rows = readRows().filter((row) => row.platform === platform && row.date.startsWith(`${year}-`)); const daily: Record<string, number> = {}; let totalTokens = 0; let tokenRows = 0; let totalEvents = 0; let estimatedCost = 0; let pricedRows = 0; let pricedTokens = 0;
  for (const row of rows) { const value = row.tokenUsage ?? row.toolEventCount; if (value <= 0) continue; daily[row.date] = (daily[row.date] ?? 0) + value; totalEvents += row.toolEventCount; if (row.tokenUsage !== null) { totalTokens += row.tokenUsage; tokenRows += 1; } const pricing = standardApiPricing[row.modelProvider]; if (pricing && row.inputTokens !== null && row.cachedInputTokens !== null && row.outputTokens !== null) { const uncachedInput = Math.max(0, row.inputTokens - row.cachedInputTokens); estimatedCost += (uncachedInput * pricing.input + row.cachedInputTokens * pricing.cachedInput + row.outputTokens * pricing.output) / 1_000_000; pricedRows += 1; pricedTokens += row.inputTokens + row.outputTokens; } }
  return { totalTokens: tokenRows ? totalTokens : null, estimatedCost: pricedRows ? estimatedCost : null, costCoverage: { pricedRows, pricedTokens, basis: "standard_openai_api_rates" as const }, activeDays: Object.keys(daily).length || null, cacheShare: null, daily, activityType: tokenRows ? "tokens" as const : "events" as const, totalEvents: totalEvents || null, totalSessions: rows.length || null };
}
