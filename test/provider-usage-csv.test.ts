import assert from "node:assert/strict";
import { parseProviderUsageCsv } from "../lib/integrations/provider-usage-csv";

const rows = parseProviderUsageCsv([
  "provider,external_account_id,account_label,period_date,total_tokens,cached_tokens,estimated_cost",
  "openai,acct-1,Personal Codex,2026-01-02,100,40,1.5",
  "claude,acct-2,\"Work, Claude\",2026-01-03,200,0,2.5",
].join("\n"));

assert.equal(rows.length, 2);
assert.equal(rows[1].accountLabel, "Work, Claude");
assert.throws(() => parseProviderUsageCsv("provider,external_account_id\nopenai,acct-1"), /Invalid provider usage row/);
assert.throws(() => parseProviderUsageCsv([
  "provider,external_account_id,period_date,total_tokens,cached_tokens,estimated_cost",
  "cursor,acct-1,2026-01-02,10,11,1",
].join("\n")), /Cached tokens exceed/);
assert.throws(() => parseProviderUsageCsv([
  "provider,external_account_id,period_date,total_tokens,cached_tokens,estimated_cost",
  "cursor,acct-1,2026-02-30,10,0,1",
].join("\n")), /Invalid provider usage row/);
const multiline = parseProviderUsageCsv([
  "provider,external_account_id,account_label,period_date,total_tokens,cached_tokens,estimated_cost",
  "cursor,acct-3,\"Work\nCursor\",2026-01-03,10,0,1",
].join("\n"));
assert.equal(multiline[0].accountLabel, "Work\nCursor");

console.log("provider-usage-csv.test: ok");
