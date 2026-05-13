/**
 * Applies 0003 + 0004 SQL when drizzle-kit migrate skips them (journal/snapshot gap).
 * Idempotent. @see docs/DATABASE.md
 */
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const crypto = require("node:crypto");
const { root, loadProjectEnv, createTursoClientOrThrow } = require("./env.cjs");

loadProjectEnv();

const client = createTursoClientOrThrow();

function sha256File(relPath) {
  const buf = readFileSync(resolve(root, relPath));
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function splitStatements(sql) {
  return sql
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function adminColumnExists(name) {
  const r = await client.execute("PRAGMA table_info('admin_users')");
  return r.rows.some((row) => row.name === name);
}

async function migrationHashApplied(hash) {
  const r = await client.execute({
    sql: "SELECT 1 AS ok FROM __drizzle_migrations WHERE hash = ? LIMIT 1",
    args: [hash],
  });
  return r.rows.length > 0;
}

async function recordMigration(hash, createdAt) {
  if (await migrationHashApplied(hash)) {
    return;
  }
  await client.execute({
    sql: "INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)",
    args: [hash, createdAt],
  });
}

async function runFileStatements(relPath) {
  const sql = readFileSync(resolve(root, relPath), "utf8");
  const statements = splitStatements(sql);
  for (const stmt of statements) {
    await client.execute(stmt);
  }
}

async function main() {
  const h3 = sha256File("db/migrations/0003_admin_google_oauth.sql");
  const h4 = sha256File("db/migrations/0004_admin_google_only.sql");
  const when3 = 1778654149000;
  const when4 = 1778656898000;

  const hasProviderSubject = await adminColumnExists("provider_subject");
  const hasPasswordHash = await adminColumnExists("password_hash");

  if (!hasProviderSubject && hasPasswordHash) {
    console.log("Applying 0003_admin_google_oauth.sql …");
    await runFileStatements("db/migrations/0003_admin_google_oauth.sql");
    await recordMigration(h3, when3);
    console.log("0003 applied and recorded.");
  } else if (!hasProviderSubject) {
    console.error(
      "Unexpected schema: no provider_subject and no password_hash. Fix manually or restore backup.",
    );
    process.exit(1);
  } else {
    console.log("0003 already applied (provider_subject exists). Skipping 0003.");
  }

  const stillHasPasswordHash = await adminColumnExists("password_hash");
  if (stillHasPasswordHash) {
    console.log("Applying 0004_admin_google_only.sql …");
    await runFileStatements("db/migrations/0004_admin_google_only.sql");
    await recordMigration(h4, when4);
    console.log("0004 applied and recorded.");
  } else {
    console.log("0004 already applied (no password_hash column). Skipping 0004.");
  }

  if (!(await migrationHashApplied(h3)) || !(await migrationHashApplied(h4))) {
    console.log("Recording any missing __drizzle_migrations rows …");
    await recordMigration(h3, when3);
    await recordMigration(h4, when4);
  }

  console.log("\nDone. Run: pnpm db:status");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
