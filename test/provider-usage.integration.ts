import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";

async function main() {
  const tempDir = mkdtempSync(join(tmpdir(), "portfolio-provider-usage-"));
  const dbPath = join(tempDir, "verify.db");
  process.env.TURSO_DATABASE_URL = pathToFileURL(dbPath).href;

  const { db } = await import("../db/client");
  const sql = db.$client;
  try {
    await sql.execute(`
      CREATE TABLE provider_connections (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        provider text NOT NULL,
        external_account_id text NOT NULL,
        account_label text NOT NULL,
        account_email text,
        connection_ref text,
        scopes_json text DEFAULT '[]' NOT NULL,
        status text DEFAULT 'pending' NOT NULL,
        include_in_rollup integer DEFAULT 1 NOT NULL,
        last_synced_at text,
        last_error text,
        created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    await sql.execute("CREATE UNIQUE INDEX provider_connections_account_unique ON provider_connections (provider, external_account_id)");
    await sql.execute(`
      CREATE TABLE provider_usage_snapshots (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        connection_id integer NOT NULL,
        period_date text NOT NULL,
        total_tokens integer DEFAULT 0 NOT NULL,
        cached_tokens integer DEFAULT 0 NOT NULL,
        estimated_cost real DEFAULT 0 NOT NULL,
        source_hash text,
        synced_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (connection_id) REFERENCES provider_connections(id) ON DELETE CASCADE
      )
    `);
    await sql.execute("CREATE UNIQUE INDEX provider_usage_snapshots_connection_date_unique ON provider_usage_snapshots (connection_id, period_date)");

    const usage = await import("../lib/integrations/provider-usage");
    const first = await usage.createProviderConnection({ provider: "openai", externalAccountId: "acct-1", accountLabel: "Personal", connectionRef: "workos-1" });
    const second = await usage.createProviderConnection({ provider: "openai", externalAccountId: "acct-2", accountLabel: "Work", connectionRef: "workos-2" });
    const excluded = await usage.createProviderConnection({ provider: "openai", externalAccountId: "acct-3", accountLabel: "Excluded", connectionRef: "workos-3" });
    await usage.setProviderConnectionRollup(excluded[0].id, false);

    await usage.ingestProviderUsageSnapshots({
      provider: "openai",
      externalAccountId: "acct-1",
      snapshots: [{ periodDate: "2026-01-02", totalTokens: 100, cachedTokens: 40, estimatedCost: 1.5, sourceHash: "a" }],
    });
    await usage.ingestProviderUsageSnapshots({
      provider: "openai",
      externalAccountId: "acct-2",
      snapshots: [
        { periodDate: "2026-01-02", totalTokens: 200, cachedTokens: 100, estimatedCost: 2.5, sourceHash: "b" },
        { periodDate: "2026-02-03", totalTokens: 50, cachedTokens: 0, estimatedCost: 0.5, sourceHash: "c" },
      ],
    });
    await usage.ingestProviderUsageSnapshots({
      provider: "openai",
      externalAccountId: "acct-3",
      snapshots: [{ periodDate: "2026-01-02", totalTokens: 999, cachedTokens: 999, estimatedCost: 99, sourceHash: "excluded" }],
    });

    const summary = await usage.getProviderUsageSummary("openai", 2026);
    assert.equal(summary.totalTokens, 350);
    assert.equal(summary.estimatedCost, 4.5);
    assert.equal(summary.activeDays, 2);
    assert.equal(summary.cacheShare, 140 / 350);
    assert.deepEqual(summary.daily, { "2026-01-02": 300, "2026-02-03": 50 });

    console.log("provider-usage.integration: ok");
  } finally {
    sql.close();
    const globalState = globalThis as typeof globalThis & { __portfolioDb?: unknown };
    delete globalState.__portfolioDb;
    delete process.env.TURSO_DATABASE_URL;
    rmSync(tempDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
