import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { createClient } from "@libsql/client";

async function main() {
  const tempDir = mkdtempSync(join(tmpdir(), "portfolio-google-admin-"));
  const dbPath = join(tempDir, "verify.db");

  process.env.TURSO_DATABASE_URL = `file:${dbPath}`;
  process.env.AUTH_SECRET = "verify-auth-secret-1234567890";
  process.env.ADMIN_EMAIL = "owner@example.com";

  const client = createClient({ url: process.env.TURSO_DATABASE_URL });

  try {
    await client.execute(`
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
    await client.execute(`
      CREATE UNIQUE INDEX admin_users_email_hash_unique
      ON admin_users (email_hash)
    `);
    await client.execute(`
      CREATE UNIQUE INDEX admin_users_provider_subject_unique
      ON admin_users (provider_subject)
    `);
    await client.execute(`
      CREATE INDEX admin_users_status_idx
      ON admin_users (status)
    `);

    const adminUsers = await import("../lib/admin-users");
    const emailHash = adminUsers.computeAdminEmailHash("owner@example.com");
    await client.execute({
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

    await client.execute({
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
    client.close();
    rmSync(tempDir, { recursive: true, force: true });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
