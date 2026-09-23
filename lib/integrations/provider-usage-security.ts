import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const MAX_CLOCK_SKEW_SECONDS = 300;

export type UsageIngestionHeaders = {
  keyId: string;
  timestamp: string;
  signature: string;
};

export function sha256Hex(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function signUsagePayload(input: { keyId: string; timestamp: string; body: string; secret: string }) {
  return createHmac("sha256", input.secret)
    .update(`${input.keyId}.${input.timestamp}.${sha256Hex(input.body)}`, "utf8")
    .digest("hex");
}

export function verifyUsageSignature(request: Request, body: string) {
  const keyId = request.headers.get("x-usage-key-id")?.trim() ?? "";
  const timestamp = request.headers.get("x-usage-timestamp")?.trim() ?? "";
  const signature = request.headers.get("x-usage-signature")?.trim().toLowerCase() ?? "";
  const configuredKeyId = process.env.PROVIDER_USAGE_INGEST_KEY_ID?.trim() ?? "";
  const secret = process.env.PROVIDER_USAGE_INGEST_SECRET?.trim() ?? "";

  if (!keyId || !timestamp || !signature || !configuredKeyId || !secret || keyId !== configuredKeyId) {
    return { ok: false as const, reason: "Missing or invalid ingestion credentials." };
  }

  const timestampMs = Number(timestamp);
  if (!Number.isInteger(timestampMs)) {
    return { ok: false as const, reason: "Invalid ingestion timestamp." };
  }
  const timestampSeconds = timestampMs > 10_000_000_000 ? timestampMs / 1000 : timestampMs;
  if (Math.abs(Date.now() / 1000 - timestampSeconds) > MAX_CLOCK_SKEW_SECONDS) {
    return { ok: false as const, reason: "Expired ingestion request." };
  }

  const expected = signUsagePayload({ keyId, timestamp, body, secret });
  const actualBytes = Buffer.from(signature, "utf8");
  const expectedBytes = Buffer.from(expected, "utf8");
  if (actualBytes.length !== expectedBytes.length || !timingSafeEqual(actualBytes, expectedBytes)) {
    return { ok: false as const, reason: "Invalid ingestion signature." };
  }

  return { ok: true as const, keyId, timestamp: new Date(timestampSeconds * 1000).toISOString() };
}

export function getUsageRequestHeaders(input: { keyId: string; secret: string; body: string; timestamp?: string }) {
  const timestamp = input.timestamp ?? String(Date.now());
  return {
    "x-usage-key-id": input.keyId,
    "x-usage-timestamp": timestamp,
    "x-usage-signature": signUsagePayload({ keyId: input.keyId, timestamp, body: input.body, secret: input.secret }),
    "content-type": "text/csv; charset=utf-8",
  };
}
