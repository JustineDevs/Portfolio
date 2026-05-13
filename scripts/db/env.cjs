"use strict";

const { existsSync } = require("node:fs");
const { resolve } = require("node:path");
const { config: loadEnv } = require("dotenv");

const root = process.cwd();

function loadProjectEnv() {
  const envPath = resolve(root, ".env");
  const envLocalPath = resolve(root, ".env.local");
  if (existsSync(envPath)) {
    loadEnv({ path: envPath });
  }
  if (existsSync(envLocalPath)) {
    loadEnv({ path: envLocalPath, override: true });
  }
}

function getTursoUrl() {
  return process.env.TURSO_DATABASE_URL?.trim();
}

function createTursoClientOrThrow() {
  const { createClient } = require("@libsql/client");
  const url = getTursoUrl();
  if (!url) {
    const err = new Error("TURSO_DATABASE_URL is not set (check .env / .env.local)");
    err.code = "NO_TURSO_URL";
    throw err;
  }
  return createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
}

module.exports = { root, loadProjectEnv, getTursoUrl, createTursoClientOrThrow };
