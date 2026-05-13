/**
 * Recomputes admin_users.email_hash from ADMIN_EMAIL + AUTH_SECRET (matches lib/admin-users.ts).
 * Run after rotating AUTH_SECRET. @see docs/DATABASE.md
 */
const crypto = require("node:crypto");
const { loadProjectEnv, getTursoUrl, createTursoClientOrThrow } = require("./env.cjs");

loadProjectEnv();

const secret = process.env.AUTH_SECRET?.trim();
const adminEmail = process.env.ADMIN_EMAIL?.trim();
const url = getTursoUrl();

if (!secret || !adminEmail || !url) {
  console.error("Need AUTH_SECRET, ADMIN_EMAIL, and TURSO_DATABASE_URL in .env / .env.local");
  process.exit(1);
}

function normalizeAdminEmail(email) {
  return email.trim().toLowerCase();
}

function getLookupKey() {
  return crypto.createHash("sha256").update(`admin-lookup:${secret}`).digest();
}

function computeAdminEmailHash(email) {
  const normalized = normalizeAdminEmail(email);
  return crypto.createHmac("sha256", getLookupKey()).update(normalized).digest("hex");
}

async function main() {
  const hash = computeAdminEmailHash(adminEmail);
  const client = createTursoClientOrThrow();
  const updatedAt = new Date().toISOString();

  const before = await client.execute("SELECT id, email_hash FROM admin_users");
  console.log("Rows before:", before.rows);

  await client.execute({
    sql: "UPDATE admin_users SET email_hash = ?, updated_at = ?",
    args: [hash, updatedAt],
  });

  const after = await client.execute("SELECT id, email_hash FROM admin_users");
  console.log("Rows after:", after.rows);
  console.log("\nDone. Try Google sign-in again.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
