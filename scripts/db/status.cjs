/**
 * Prints __drizzle_migrations rows and admin_users columns (Turso / libSQL).
 * @see docs/DATABASE.md
 */
const { loadProjectEnv, getTursoUrl, createTursoClientOrThrow } = require("./env.cjs");

loadProjectEnv();

const url = getTursoUrl();
if (!url) {
  console.error("TURSO_DATABASE_URL is not set.");
  process.exit(1);
}

let host = "(unparsed)";
try {
  host = new URL(url).hostname;
} catch {
  /* ignore */
}
console.log("DB host:", host);

const client = createTursoClientOrThrow();

async function main() {
  const migTable = await client.execute(
    "SELECT sql FROM sqlite_master WHERE type='table' AND name='__drizzle_migrations'",
  );
  console.log("\n__drizzle_migrations DDL:\n", migTable.rows[0]?.sql ?? "(missing table)");

  const migRows = await client.execute("SELECT * FROM __drizzle_migrations ORDER BY id");
  console.log("\n__drizzle_migrations rows:", migRows.rows.length);
  for (const row of migRows.rows) {
    console.log(row);
  }

  const cols = await client.execute("PRAGMA table_info('admin_users')");
  console.log("\nadmin_users columns:");
  for (const row of cols.rows) {
    console.log(`  ${row.name}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
