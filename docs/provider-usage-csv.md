# Provider usage CSV

The CMS usage dashboard is backed by normalized daily data. Upload a CSV from the admin Connections page, or send one provider at a time to the remote `POST /api/usage` endpoint using an HMAC-signed server-to-server request. The browser never receives provider credentials or raw source files.

Required columns:

```csv
provider,external_account_id,period_date,total_tokens,cached_tokens,estimated_cost
openai,personal-codex,2026-01-02,120000,24000,1.85
claude,work-claude,2026-01-02,80000,12000,0.92
cursor,desktop-cursor,2026-01-02,45000,0,0.40
```

Optional columns are `account_label` and `account_email`. The accepted provider IDs are `openai`, `claude`, and `cursor`. Rows are upserted by provider, account ID, and date, so repeated imports are safe and multiple accounts are combined automatically. Remote imports also create a source-registry record containing the provider, collection surface, authority, coverage dates, schema version, validation time, and SHA-256 source hash.

Remote requests require these headers:

```text
x-usage-key-id: <PROVIDER_USAGE_INGEST_KEY_ID>
x-usage-timestamp: <milliseconds since epoch>
x-usage-signature: HMAC-SHA256(key-id.timestamp.sha256(body), PROVIDER_USAGE_INGEST_SECRET)
x-usage-source-key: codex-local-orca
x-usage-surface: cli-index
x-usage-authority: local-index
```

The timestamp must be within five minutes of the server clock. Payloads are limited to 5 MB, must contain exactly one provider, and are rejected when the signature, dates, token totals, or source headers are invalid.

Suggested source preparation:

- Cursor: use the Cursor dashboard CSV, Admin API, or Enterprise OpenTelemetry export. Do not treat the local editor database as an authoritative billing ledger.
- OpenAI Codex: aggregate the local Codex usage index or session records into daily totals before export. Keep this separate from OpenAI API Usage exports.
- Claude Code: export conversation/activity data and normalize it into daily totals.

The importer intentionally stores normalized metrics rather than provider credentials or raw conversation content.
