-- Add the audited project catalog to the existing Independent practice milestone.
-- Each statement is idempotent so a partially applied migration can be safely retried.

UPDATE `page_sections`
SET `meta_json` = json_insert(`meta_json`, '$.entries[#]', json_object(
  'id', 'universal-music-store', 'parentId', 'fullstack', 'year', '2026', 'company', 'Independent practice', 'status', 'PROJECT', 'role', 'Platform Engineer',
  'description', 'Worker-native music commerce platform with storefront, admin operations, commerce workflows, and Supabase-backed services.', 'logoKey', 'project.universal-music-store', 'logoUrl', NULL, 'project', 'Universal Music Store',
  'projectDescription', 'Product discovery, checkout, customer accounts, catalog operations, fulfillment, and staff workflows.', 'icons', json_array(json_object('name', 'Next.js', 'key', 'nextjs'), json_object('name', 'Cloudflare Workers', 'key', 'cloudflare-workers'), json_object('name', 'Medusa', 'key', 'medusa'), json_object('name', 'Supabase', 'key', 'supabase'))
))
WHERE `page_key` = 'experience' AND `section_key` = 'progress'
  AND NOT EXISTS (SELECT 1 FROM json_each(`meta_json`, '$.entries') WHERE json_extract(json_each.value, '$.id') = 'universal-music-store');
--> statement-breakpoint

UPDATE `page_sections`
SET `meta_json` = json_insert(`meta_json`, '$.entries[#]', json_object(
  'id', 'meta-architect', 'parentId', 'fullstack', 'year', '2026', 'company', 'Independent practice', 'status', 'PROJECT', 'role', 'AI Systems Engineer',
  'description', 'Quality gates and evidence verification for AI coding agents, making each stage of agent work reviewable before the next one opens.', 'logoKey', 'project.meta-architect', 'logoUrl', NULL, 'project', 'Meta-Architect',
  'projectDescription', 'Design, evidence, logic, security, experience, and build verification for agent workflows.', 'icons', json_array(json_object('name', 'TypeScript', 'key', 'typescript'), json_object('name', 'Codex', 'key', 'codex'), json_object('name', 'MCP', 'key', 'mcp'))
))
WHERE `page_key` = 'experience' AND `section_key` = 'progress'
  AND NOT EXISTS (SELECT 1 FROM json_each(`meta_json`, '$.entries') WHERE json_extract(json_each.value, '$.id') = 'meta-architect');
--> statement-breakpoint

UPDATE `page_sections`
SET `meta_json` = json_insert(`meta_json`, '$.entries[#]', json_object(
  'id', 'lending-mind-protocol', 'parentId', 'fullstack', 'year', '2026', 'company', 'Independent practice', 'status', 'PROJECT', 'role', 'Systems Engineer',
  'description', 'A local-first control plane that makes engineering judgment executable through signed packages, bounded evaluations, and reviewable evidence.', 'logoKey', 'project.lending-mind-protocol', 'logoUrl', NULL, 'project', 'Lending-Mind Protocol',
  'projectDescription', 'Explicit engineering preferences turned into bounded, auditable AI-assisted software decisions.', 'icons', json_array(json_object('name', 'Rust', 'key', 'rust'), json_object('name', 'Node.js', 'key', 'node'))
))
WHERE `page_key` = 'experience' AND `section_key` = 'progress'
  AND NOT EXISTS (SELECT 1 FROM json_each(`meta_json`, '$.entries') WHERE json_extract(json_each.value, '$.id') = 'lending-mind-protocol');
--> statement-breakpoint

UPDATE `page_sections`
SET `meta_json` = json_insert(`meta_json`, '$.entries[#]', json_object(
  'id', 'kwago', 'parentId', 'fullstack', 'year', '2026', 'company', 'Independent practice', 'status', 'PROJECT', 'role', 'Mobile / AI Engineer',
  'description', 'A private local-first calendar with on-device AI drafting, conflict review, and encrypted sync.', 'logoKey', 'project.kwago', 'logoUrl', NULL, 'project', 'Kwago',
  'projectDescription', 'On-device schedule intelligence that parses intent, detects conflicts, and protects calendar data.', 'icons', json_array(json_object('name', 'React Native', 'key', 'react-native'), json_object('name', 'ExecuTorch', 'key', 'executorch'), json_object('name', 'SQLite', 'key', 'sqlite'))
))
WHERE `page_key` = 'experience' AND `section_key` = 'progress'
  AND NOT EXISTS (SELECT 1 FROM json_each(`meta_json`, '$.entries') WHERE json_extract(json_each.value, '$.id') = 'kwago');
--> statement-breakpoint

UPDATE `page_sections`
SET `meta_json` = json_insert(`meta_json`, '$.entries[#]', json_object(
  'id', 'ambios-ai', 'parentId', 'fullstack', 'year', '2026', 'company', 'Independent practice', 'status', 'PROJECT', 'role', 'AI Systems Engineer',
  'description', 'An operational workspace for human judgment and governed agent action, with shared server-side controls.', 'logoKey', 'project.ambios-ai', 'logoUrl', NULL, 'project', 'AmbiOS AI',
  'projectDescription', 'Operational context, incident response, approvals, guardrails, budgets, integrations, and WebMCP tools.', 'icons', json_array(json_object('name', 'Next.js', 'key', 'nextjs'), json_object('name', 'WebMCP', 'key', 'webmcp'))
))
WHERE `page_key` = 'experience' AND `section_key` = 'progress'
  AND NOT EXISTS (SELECT 1 FROM json_each(`meta_json`, '$.entries') WHERE json_extract(json_each.value, '$.id') = 'ambios-ai');
--> statement-breakpoint

UPDATE `page_sections`
SET `meta_json` = json_insert(`meta_json`, '$.entries[#]', json_object(
  'id', 'roblox-ai-os', 'parentId', 'fullstack', 'year', '2026', 'company', 'Independent practice', 'status', 'PROJECT', 'role', 'Creator Tools Engineer',
  'description', 'A Roblox Studio operating layer for disciplined Codex-powered creator workflows.', 'logoKey', 'project.roblox-ai-os', 'logoUrl', NULL, 'project', 'Roblox AI OS',
  'projectDescription', 'Briefing, planning, building, review, verification, and psychology-aware design workflows for creators.', 'icons', json_array(json_object('name', 'Codex', 'key', 'codex'), json_object('name', 'Roblox Studio', 'key', 'roblox-studio'), json_object('name', 'TypeScript', 'key', 'typescript'))
))
WHERE `page_key` = 'experience' AND `section_key` = 'progress'
  AND NOT EXISTS (SELECT 1 FROM json_each(`meta_json`, '$.entries') WHERE json_extract(json_each.value, '$.id') = 'roblox-ai-os');
--> statement-breakpoint

UPDATE `page_sections`
SET `meta_json` = json_insert(`meta_json`, '$.entries[#]', json_object(
  'id', 'premortem', 'parentId', 'fullstack', 'year', '2026', 'company', 'Independent practice', 'status', 'PROJECT', 'role', 'Developer Tools Engineer',
  'description', 'A reviewer-first predictive audit system for repositories with bounded context, specialist analysis, and human approval.', 'logoKey', 'project.premortem', 'logoUrl', NULL, 'project', 'Premortem',
  'projectDescription', 'Traceable issue candidates and reviewable repository audits before changes are published.', 'icons', json_array(json_object('name', 'Next.js', 'key', 'nextjs'), json_object('name', 'Prisma', 'key', 'prisma'), json_object('name', 'GitLab', 'key', 'gitlab'))
))
WHERE `page_key` = 'experience' AND `section_key` = 'progress'
  AND NOT EXISTS (SELECT 1 FROM json_each(`meta_json`, '$.entries') WHERE json_extract(json_each.value, '$.id') = 'premortem');
--> statement-breakpoint

UPDATE `page_sections`
SET `meta_json` = json_insert(`meta_json`, '$.entries[#]', json_object(
  'id', 'llmfaucet', 'parentId', 'fullstack', 'year', '2026', 'company', 'Independent practice', 'status', 'PROJECT', 'role', 'AI Infrastructure Engineer',
  'description', 'One OpenAI-compatible endpoint for available free AI capacity, with routing, fallback, streaming, and transparent limits.', 'logoKey', 'project.llmfaucet', 'logoUrl', NULL, 'project', 'llmfaucet',
  'projectDescription', 'Aggregated provider capacity through one compatible API surface with smart model selection.', 'icons', json_array(json_object('name', 'OpenAI-compatible API', 'key', 'openai-compatible-api'), json_object('name', 'Cloudflare Workers', 'key', 'cloudflare-workers'))
))
WHERE `page_key` = 'experience' AND `section_key` = 'progress'
  AND NOT EXISTS (SELECT 1 FROM json_each(`meta_json`, '$.entries') WHERE json_extract(json_each.value, '$.id') = 'llmfaucet');
