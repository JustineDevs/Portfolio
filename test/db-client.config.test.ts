import assert from "node:assert/strict";

async function main() {
  const { resolveDatabaseUrl } = await import("../db/client");

  assert.equal(
    resolveDatabaseUrl({
      TURSO_DATABASE_URL: " libsql://prod-db.turso.io ",
      NODE_ENV: "production",
    }),
    "libsql://prod-db.turso.io",
  );

  assert.equal(
    resolveDatabaseUrl({
      NODE_ENV: "development",
    }),
    "file:./db/local.db",
  );

  assert.equal(
    resolveDatabaseUrl({
      NODE_ENV: "test",
    }),
    "file:./db/local.db",
  );

  assert.throws(
    () =>
      resolveDatabaseUrl({
        NODE_ENV: "production",
      }),
    /TURSO_DATABASE_URL is required in production/,
  );

  console.log("db-client.config: ok");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
