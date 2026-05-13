import { createHash, createHmac } from "crypto";
import { and, eq, isNull, sql } from "drizzle-orm";

import { db } from "@/db/client";
import { adminUsers } from "@/db/schema";
import { readEnvString } from "@/lib/env";

function normalizeAdminEmail(email: string) {
  return email.trim().toLowerCase();
}

function getConfiguredAdminEmail() {
  const email = readEnvString("ADMIN_EMAIL");
  return email ? normalizeAdminEmail(email) : null;
}

function getEncryptionSecret() {
  const secret = readEnvString("AUTH_SECRET");
  if (!secret) {
    throw new Error("Missing AUTH_SECRET for admin user lookup.");
  }
  return secret;
}

function getLookupKey() {
  return createHash("sha256")
    .update(`admin-lookup:${getEncryptionSecret()}`)
    .digest();
}

export function computeAdminEmailHash(email: string) {
  const normalized = normalizeAdminEmail(email);
  return createHmac("sha256", getLookupKey()).update(normalized).digest("hex");
}

export async function findAdminUserByEmail(email: string) {
  const emailHash = computeAdminEmailHash(email);
  const rows = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.emailHash, emailHash))
    .limit(1);
  return rows[0] ?? null;
}

export async function findAdminUserById(id: number) {
  const rows = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function findAdminUserByProviderSubject(providerSubject: string) {
  const subject = providerSubject.trim();
  if (!subject) {
    return null;
  }
  // LibSQL can treat very long digit-only params as INTEGER (i64 overflow → SQL_INPUT_ERROR).
  // sql`… = ${subject}` keeps the bind as TEXT for Google `sub` values.
  const rows = await db
    .select()
    .from(adminUsers)
    .where(sql`${adminUsers.providerSubject} = ${subject}`)
    .limit(1);

  return rows[0] ?? null;
}

export async function hasRegisteredAdminUser() {
  try {
    const rows = await db.select({ id: adminUsers.id }).from(adminUsers).limit(1);
    return rows.length > 0;
  } catch {
    return false;
  }
}

async function markAdminLogin(adminUserId: number) {
  const now = new Date().toISOString();

  await db
    .update(adminUsers)
    .set({
      lastLoginAt: now,
      updatedAt: now,
    })
    .where(eq(adminUsers.id, adminUserId));

  return findAdminUserById(adminUserId);
}

export async function authorizeGoogleAdminSignIn(input: {
  email: string;
  providerSubject: string;
}) {
  const normalizedEmail = normalizeAdminEmail(input.email);
  const providerSubject = input.providerSubject.trim();
  const configuredAdminEmail = getConfiguredAdminEmail();

  if (!configuredAdminEmail || normalizedEmail !== configuredAdminEmail) {
    return null;
  }

  const boundUser = await findAdminUserByProviderSubject(providerSubject);
  if (boundUser) {
    if (boundUser.status !== "active") {
      return null;
    }

    return markAdminLogin(boundUser.id);
  }

  const userByEmail = await findAdminUserByEmail(normalizedEmail);
  if (!userByEmail || userByEmail.status !== "active") {
    return null;
  }

  if (userByEmail.providerSubject && userByEmail.providerSubject !== providerSubject) {
    return null;
  }

  if (!userByEmail.providerSubject) {
    await db
      .update(adminUsers)
      .set({
        providerSubject,
        lastLoginAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(adminUsers.id, userByEmail.id),
          isNull(adminUsers.providerSubject),
        ),
      );

    const reboundUser = await findAdminUserById(userByEmail.id);
    if (!reboundUser || reboundUser.providerSubject !== providerSubject) {
      return null;
    }

    if (reboundUser.status !== "active") {
      return null;
    }

    return markAdminLogin(reboundUser.id);
  }

  return markAdminLogin(userByEmail.id);
}

export async function findActiveAdminForSession(input: {
  adminUserId?: number | null;
  email?: string | null;
}) {
  const configuredAdminEmail = getConfiguredAdminEmail();
  const normalizedEmail = input.email ? normalizeAdminEmail(input.email) : null;

  if (!configuredAdminEmail) {
    return null;
  }

  if (normalizedEmail && normalizedEmail !== configuredAdminEmail) {
    return null;
  }

  const user =
    typeof input.adminUserId === "number"
      ? await findAdminUserById(input.adminUserId)
      : normalizedEmail
        ? await findAdminUserByEmail(normalizedEmail)
        : null;

  if (!user || user.status !== "active" || user.role !== "admin") {
    return null;
  }

  return user;
}
