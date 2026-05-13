import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";

function integrationTempBase() {
  if (process.platform === "win32" && process.env.LOCALAPPDATA) {
    return join(process.env.LOCALAPPDATA, "Temp");
  }
  return tmpdir();
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function rmDirWithRetries(dir: string, maxAttempts = 8) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      rmSync(dir, { recursive: true, force: true });
      return;
    } catch (error) {
      const code = error instanceof Error && "code" in error ? (error as NodeJS.ErrnoException).code : "";
      const retryable = code === "EBUSY" || code === "EPERM";
      if (!retryable || attempt === maxAttempts) {
        throw error;
      }
      await delay(25 * attempt);
    }
  }
}

async function main() {
  const tempDir = mkdtempSync(join(integrationTempBase(), "portfolio-google-admin-"));
  const dbPath = join(tempDir, "verify.db");

  // RFC 8089 `file:///…` URLs work reliably on Linux CI; a single DB client avoids Windows file locks.
  process.env.TURSO_DATABASE_URL = pathToFileURL(dbPath).href;
  process.env.AUTH_SECRET = "verify-auth-secret-1234567890";
  process.env.ADMIN_EMAIL = "owner@example.com";

  const { db } = await import("../db/client");
  const sql = db.$client;

  try {
    await sql.execute(`
      CREATE TABLE admin_users (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        email_hash text NOT NULL,
        email_encrypted text NOT NULL,
        provider_subject text,
        role text DEFAULT 'admin' NOT NULL,
        status text DEFAULT 'active' NOT NULL,
        last_login_at text,
        created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    await sql.execute(`
      CREATE UNIQUE INDEX admin_users_email_hash_unique
      ON admin_users (email_hash)
    `);
    await sql.execute(`
      CREATE UNIQUE INDEX admin_users_provider_subject_unique
      ON admin_users (provider_subject)
    `);
    await sql.execute(`
      CREATE INDEX admin_users_status_idx
      ON admin_users (status)
    `);

    const adminUsers = await import("../lib/admin-users");
    const emailHash = adminUsers.computeAdminEmailHash("owner@example.com");
    await sql.execute({
      sql: `
        INSERT INTO admin_users (
          email_hash,
          email_encrypted,
          role,
          status,
          created_at,
          updated_at
        ) VALUES (?, ?, 'admin', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
      args: [emailHash, "seeded-email"],
    });

    const firstGoogleLogin = await adminUsers.authorizeGoogleAdminSignIn({
      email: "owner@example.com",
      providerSubject: "google-sub-1",
    });
    assert.ok(firstGoogleLogin);
    assert.equal(firstGoogleLogin.providerSubject, "google-sub-1");

    const repeatGoogleLogin = await adminUsers.authorizeGoogleAdminSignIn({
      email: "owner@example.com",
      providerSubject: "google-sub-1",
    });
    assert.ok(repeatGoogleLogin);
    assert.equal(repeatGoogleLogin.id, firstGoogleLogin.id);

    const mismatchedGoogleLogin = await adminUsers.authorizeGoogleAdminSignIn({
      email: "owner@example.com",
      providerSubject: "google-sub-2",
    });
    assert.equal(mismatchedGoogleLogin, null);

    const wrongEmailLogin = await adminUsers.authorizeGoogleAdminSignIn({
      email: "other@example.com",
      providerSubject: "google-sub-3",
    });
    assert.equal(wrongEmailLogin, null);

    await sql.execute({
      sql: "UPDATE admin_users SET status = 'disabled' WHERE id = ?",
      args: [firstGoogleLogin.id],
    });

    const disabledSession = await adminUsers.findActiveAdminForSession({
      adminUserId: firstGoogleLogin.id,
    });
    assert.equal(disabledSession, null);

    console.log("admin-users.integration: ok");
  } finally {
    delete process.env.ADMIN_EMAIL;
    sql.close();
    const g = globalThis as typeof globalThis & { __portfolioDb?: unknown };
    delete g.__portfolioDb;
    try {
      await rmDirWithRetries(tempDir);
    } catch (error) {
      const code =
        error instanceof Error && "code" in error ? (error as NodeJS.ErrnoException).code : "";
      if (code === "EBUSY" || code === "EPERM") {
        console.warn(
          "admin-users.integration: skipped removing temp DB (still locked). Assertions already passed.",
          tempDir,
        );
        return;
      }
      throw error;
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
