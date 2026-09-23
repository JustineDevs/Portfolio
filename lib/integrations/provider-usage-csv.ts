import type { AgentProviderId } from "@/lib/usage/providers";
import type { ProviderUsageCsvRow } from "@/lib/integrations/provider-usage";

const providerIds = new Set<AgentProviderId>(["openai", "claude", "cursor", "orca"]);

export const MAX_PROVIDER_USAGE_CSV_BYTES = 5_000_000;
export const MAX_PROVIDER_USAGE_CSV_ROWS = 10_000;

function parseCsvLine(line: string) {
  const values: string[] = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && line[index + 1] === '"' && quoted) {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      values.push(value.trim());
      value = "";
    } else {
      value += character;
    }
  }
  values.push(value.trim());
  return values;
}

function requiredField(record: Record<string, string>, ...names: string[]) {
  for (const name of names) {
    const value = record[name]?.trim();
    if (value) return value;
  }
  return "";
}

function numberField(record: Record<string, string>, ...names: string[]) {
  const raw = requiredField(record, ...names);
  const value = Number(raw);
  return raw && Number.isFinite(value) && value >= 0 ? value : null;
}

function splitCsvRecords(csv: string) {
  const records: string[] = [];
  let record = "";
  let quoted = false;
  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];
    if (character === '"') {
      if (quoted && csv[index + 1] === '"') {
        record += '""';
        index += 1;
      } else {
        quoted = !quoted;
        record += character;
      }
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && csv[index + 1] === "\n") index += 1;
      if (record.trim()) records.push(record);
      record = "";
    } else {
      record += character;
    }
  }
  if (quoted) throw new Error("CSV contains an unterminated quoted field.");
  if (record.trim()) records.push(record);
  return records;
}

function isValidIsoDate(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function parseProviderUsageCsv(csv: string): ProviderUsageCsvRow[] {
  if (Buffer.byteLength(csv, "utf8") > MAX_PROVIDER_USAGE_CSV_BYTES) throw new Error("CSV must be 5 MB or smaller.");
  const lines = splitCsvRecords(csv.replace(/^\uFEFF/, ""));
  if (lines.length < 2) throw new Error("CSV must include a header and at least one usage row.");
  if (lines.length - 1 > MAX_PROVIDER_USAGE_CSV_ROWS) throw new Error(`CSV cannot contain more than ${MAX_PROVIDER_USAGE_CSV_ROWS.toLocaleString()} usage rows.`);

  const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase().replace(/\s+/g, "_"));
  if (headers.some((header) => !header) || new Set(headers).size !== headers.length) throw new Error("CSV headers must be unique and non-empty.");
  const rows: ProviderUsageCsvRow[] = [];
  const dataLines = lines.slice(1);
  for (let index = 0; index < dataLines.length; index += 1) {
    const line = dataLines[index];
    const values = parseCsvLine(line);
    const record = Object.fromEntries(headers.map((header, column) => [header, values[column] ?? ""]));
    const provider = requiredField(record, "provider") as AgentProviderId;
    const externalAccountId = requiredField(record, "external_account_id", "account_id", "externalaccountid");
    const accountLabel = requiredField(record, "account_label", "account", "accountlabel") || externalAccountId;
    const periodDate = requiredField(record, "period_date", "date", "perioddate");
    const totalTokens = numberField(record, "total_tokens", "tokens", "totaltokens");
    const cachedTokens = numberField(record, "cached_tokens", "cache_tokens", "cachedtokens") ?? 0;
    const estimatedCost = numberField(record, "estimated_cost", "cost", "estimatedcost");

    if (!providerIds.has(provider) || !externalAccountId || !/^\d{4}-\d{2}-\d{2}$/.test(periodDate) || !isValidIsoDate(periodDate) || totalTokens === null || estimatedCost === null) {
      throw new Error(`Invalid provider usage row ${index + 2}. Required columns: provider, external_account_id, period_date, total_tokens, estimated_cost.`);
    }
    if (cachedTokens > totalTokens) throw new Error(`Cached tokens exceed total tokens on row ${index + 2}.`);

    rows.push({
      provider,
      externalAccountId,
      accountLabel,
      accountEmail: requiredField(record, "account_email", "email") || null,
      periodDate,
      totalTokens,
      cachedTokens,
      estimatedCost,
    });
  }
  return rows;
}
