import assert from "node:assert/strict";
import { getUsageRequestHeaders, verifyUsageSignature } from "../lib/integrations/provider-usage-security";

const body = "provider,c\n";
const secret = "test-secret";
const timestamp = String(Date.now());
const headers = getUsageRequestHeaders({ keyId: "collector-1", secret, body, timestamp });

process.env.PROVIDER_USAGE_INGEST_KEY_ID = "collector-1";
process.env.PROVIDER_USAGE_INGEST_SECRET = secret;

const request = new Request("https://portfolio.example/api/usage", { method: "POST", headers, body });
assert.equal(verifyUsageSignature(request, body).ok, true);

const tampered = new Request("https://portfolio.example/api/usage", { method: "POST", headers, body: `${body}x` });
assert.equal(verifyUsageSignature(tampered, `${body}x`).ok, false);

const expiredHeaders = getUsageRequestHeaders({ keyId: "collector-1", secret, body, timestamp: String(Date.now() - 301_000) });
const expired = new Request("https://portfolio.example/api/usage", { method: "POST", headers: expiredHeaders, body });
assert.equal(verifyUsageSignature(expired, body).ok, false);

console.log("provider-usage-security.test: ok");
