-- Import the repository-backed project catalog audited on 2026-09-23.
-- Project marks are copied into /assets/projects so public content does not depend on source checkouts.

INSERT INTO `media_assets` (`slug`, `name`, `kind`, `file_name`, `mime_type`, `source_url`, `alt_text`, `width`, `height`, `status`)
VALUES
  ('project.universal-music-store', 'Universal Music Store', 'project', 'universal-music-store.png', 'image/png', '/assets/projects/universal-music-store.png', 'Universal Music Store project mark', 1080, 1080, 'published'),
  ('project.meta-architect', 'Meta-Architect', 'project', 'meta-architect.png', 'image/png', '/assets/projects/meta-architect.png', 'Meta-Architect project mark', 1254, 1254, 'published'),
  ('project.lending-mind-protocol', 'Lending-Mind Protocol', 'project', 'lending-mind-protocol.png', 'image/png', '/assets/projects/lending-mind-protocol.png', 'Lending-Mind Protocol project mark', 1312, 1199, 'published'),
  ('project.kwago', 'Kwago', 'project', 'kwago.png', 'image/png', '/assets/projects/kwago.png', 'Kwago project mark', 1195, 896, 'published'),
  ('project.ambios-ai', 'AmbiOS AI', 'project', 'ambios-ai.png', 'image/png', '/assets/projects/ambios-ai.png', 'AmbiOS AI project mark', 1024, 1024, 'published'),
  ('project.roblox-ai-os', 'Roblox AI OS', 'project', 'roblox-ai-os.png', 'image/png', '/assets/projects/roblox-ai-os.png', 'Roblox AI OS project cover', 1600, 900, 'published'),
  ('project.go-mirofish', 'Go-Mirofish', 'project', 'go-mirofish.png', 'image/png', '/assets/projects/go-mirofish.png', 'Go-Mirofish project mark', 762, 762, 'published'),
  ('project.premortem', 'Premortem', 'project', 'premortem.png', 'image/png', '/assets/projects/premortem.png', 'Premortem project mark', 1024, 1024, 'published'),
  ('project.llmfaucet', 'llmfaucet', 'project', 'llmfaucet.png', 'image/png', '/assets/projects/llmfaucet.png', 'llmfaucet project mark', 1254, 1254, 'published'),
  ('project.hyperagent-source', 'HyperAgent', 'project', 'hyperagent-source.png', 'image/png', '/assets/projects/hyperagent-source.png', 'HyperAgent project mark', 1024, 1024, 'published')
ON CONFLICT (`slug`) DO UPDATE SET
  `name` = excluded.`name`, `file_name` = excluded.`file_name`, `mime_type` = excluded.`mime_type`,
  `source_url` = excluded.`source_url`, `alt_text` = excluded.`alt_text`, `width` = excluded.`width`,
  `height` = excluded.`height`, `status` = excluded.`status`, `updated_at` = CURRENT_TIMESTAMP;
--> statement-breakpoint

INSERT INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'project.universal-music-store', 'Universal Music Store', 'project', id, '["brand.universal-studios"]', 'published' FROM `media_assets` WHERE slug = 'project.universal-music-store'
ON CONFLICT (`semantic_key`) DO UPDATE SET `label` = excluded.`label`, `category` = excluded.`category`, `asset_id` = excluded.`asset_id`, `aliases_json` = excluded.`aliases_json`, `status` = excluded.`status`, `updated_at` = CURRENT_TIMESTAMP;
--> statement-breakpoint
INSERT INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'project.meta-architect', 'Meta-Architect', 'project', id, '[]', 'published' FROM `media_assets` WHERE slug = 'project.meta-architect'
ON CONFLICT (`semantic_key`) DO UPDATE SET `asset_id` = excluded.`asset_id`, `status` = excluded.`status`, `updated_at` = CURRENT_TIMESTAMP;
--> statement-breakpoint
INSERT INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'project.lending-mind-protocol', 'Lending-Mind Protocol', 'project', id, '[]', 'published' FROM `media_assets` WHERE slug = 'project.lending-mind-protocol'
ON CONFLICT (`semantic_key`) DO UPDATE SET `asset_id` = excluded.`asset_id`, `status` = excluded.`status`, `updated_at` = CURRENT_TIMESTAMP;
--> statement-breakpoint
INSERT INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'project.kwago', 'Kwago', 'project', id, '[]', 'published' FROM `media_assets` WHERE slug = 'project.kwago'
ON CONFLICT (`semantic_key`) DO UPDATE SET `asset_id` = excluded.`asset_id`, `status` = excluded.`status`, `updated_at` = CURRENT_TIMESTAMP;
--> statement-breakpoint
INSERT INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'project.ambios-ai', 'AmbiOS AI', 'project', id, '[]', 'published' FROM `media_assets` WHERE slug = 'project.ambios-ai'
ON CONFLICT (`semantic_key`) DO UPDATE SET `asset_id` = excluded.`asset_id`, `status` = excluded.`status`, `updated_at` = CURRENT_TIMESTAMP;
--> statement-breakpoint
INSERT INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'project.roblox-ai-os', 'Roblox AI OS', 'project', id, '[]', 'published' FROM `media_assets` WHERE slug = 'project.roblox-ai-os'
ON CONFLICT (`semantic_key`) DO UPDATE SET `asset_id` = excluded.`asset_id`, `status` = excluded.`status`, `updated_at` = CURRENT_TIMESTAMP;
--> statement-breakpoint
INSERT INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'project.go-mirofish', 'Go-Mirofish', 'project', id, '[]', 'published' FROM `media_assets` WHERE slug = 'project.go-mirofish'
ON CONFLICT (`semantic_key`) DO UPDATE SET `asset_id` = excluded.`asset_id`, `status` = excluded.`status`, `updated_at` = CURRENT_TIMESTAMP;
--> statement-breakpoint
INSERT INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'project.premortem', 'Premortem', 'project', id, '[]', 'published' FROM `media_assets` WHERE slug = 'project.premortem'
ON CONFLICT (`semantic_key`) DO UPDATE SET `asset_id` = excluded.`asset_id`, `status` = excluded.`status`, `updated_at` = CURRENT_TIMESTAMP;
--> statement-breakpoint
INSERT INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'project.llmfaucet', 'llmfaucet', 'project', id, '[]', 'published' FROM `media_assets` WHERE slug = 'project.llmfaucet'
ON CONFLICT (`semantic_key`) DO UPDATE SET `asset_id` = excluded.`asset_id`, `status` = excluded.`status`, `updated_at` = CURRENT_TIMESTAMP;
--> statement-breakpoint
INSERT INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'project.hyperagent-source', 'HyperAgent source mark', 'project', id, '["project.hyperagent"]', 'published' FROM `media_assets` WHERE slug = 'project.hyperagent-source'
ON CONFLICT (`semantic_key`) DO UPDATE SET `asset_id` = excluded.`asset_id`, `status` = excluded.`status`, `updated_at` = CURRENT_TIMESTAMP;
--> statement-breakpoint

-- Keep existing consumers working while correcting the old semantic labels.
UPDATE `asset_registry`
SET `label` = 'Universal Music Store', `category` = 'project',
    `asset_id` = (SELECT id FROM `media_assets` WHERE slug = 'project.universal-music-store'),
    `aliases_json` = '["brand.universal-studios"]', `status` = 'published', `updated_at` = CURRENT_TIMESTAMP
WHERE `semantic_key` = 'brand.universal-studios';
--> statement-breakpoint
UPDATE `asset_registry`
SET `asset_id` = (SELECT id FROM `media_assets` WHERE slug = 'project.hyperagent-source'),
    `status` = 'published', `updated_at` = CURRENT_TIMESTAMP
WHERE `semantic_key` = 'project.hyperagent';
--> statement-breakpoint

INSERT INTO `projects` (`slug`, `title`, `summary`, `body_md`, `category`, `status`, `published_at`, `featured`, `cover_image_url`, `banner_image_url`, `author_name`, `author_url`, `website_url`, `sort_order`)
VALUES
  ('universal-music-store', 'Universal Music Store', 'Worker-native music commerce platform with storefront, admin operations, Medusa commerce, and Supabase-backed workflows.', 'Universal Music Store is a Worker-native commerce monorepo for product discovery, checkout, customer accounts, catalog operations, fulfillment, CMS, and staff workflows.', 'Commerce / Platform', 'published', '2026-03-20T00:00:00.000Z', 0, '/assets/projects/universal-music-store.png', '/assets/projects/universal-music-store.png', 'Justine Lupasi', 'https://github.com/JustineDevs', 'https://universalmusic.vercel.app', 110),
  ('meta-architect', 'Meta-Architect', 'Quality gates and evidence verification for AI coding agents.', 'Meta-Architect makes agent work prove each stage before the next one opens: design, evidence, logic, security, experience, and build.', 'Developer Tools / AI', 'published', '2026-04-30T00:00:00.000Z', 0, '/assets/projects/meta-architect.png', '/assets/projects/meta-architect.png', 'Justine Lupasi', 'https://github.com/JustineDevs', NULL, 111),
  ('lending-mind-protocol', 'Lending-Mind Protocol', 'A local-first control plane that makes engineering judgment executable.', 'Lending-Mind Protocol turns explicit engineering preferences into signed Mind Packages, bounded evaluations, and reviewable evidence for AI-assisted software development.', 'Developer Tools / Governance', 'published', '2026-08-25T00:00:00.000Z', 0, '/assets/projects/lending-mind-protocol.png', '/assets/projects/lending-mind-protocol.png', 'Justine Lupasi', 'https://github.com/JustineDevs', 'https://lendmind-protocol.github.io/LMP/', 112),
  ('kwago', 'Kwago', 'A private local-first calendar with on-device AI drafting, conflict review, and encrypted sync.', 'Kwago keeps core calendar intelligence on-device with a small language model and local database, helping users parse intent, detect conflicts, and improve routines without sending schedule data to the cloud.', 'Mobile / AI', 'published', '2026-05-13T00:00:00.000Z', 0, '/assets/projects/kwago.png', '/assets/projects/kwago.png', 'Justine Lupasi', 'https://github.com/JustineDevs', NULL, 113),
  ('ambios-ai', 'AmbiOS AI', 'An operational workspace for human judgment and governed agent action.', 'AmbiOS combines operational context, incident response, guardrails, approvals, documentation proposals, budgets, integrations, and WebMCP tools behind shared server-side governance.', 'AI / Operations', 'published', '2026-08-30T00:00:00.000Z', 0, '/assets/projects/ambios-ai.png', '/assets/projects/ambios-ai.png', 'Justine Lupasi', 'https://github.com/JustineDevs', 'https://ambios-ai.vercel.app', 114),
  ('roblox-ai-os', 'Roblox AI OS', 'A Roblox Studio operating layer for disciplined Codex-powered creator workflows.', 'RCS gives Roblox creators briefing, planning, building, review, verification, and psychology-aware design workflows in Roblox-native terms.', 'Creator Tools / AI', 'published', '2026-02-02T00:00:00.000Z', 0, '/assets/projects/roblox-ai-os.png', '/assets/projects/roblox-ai-os.png', 'Justine Lupasi', 'https://github.com/JustineDevs', NULL, 115),
  ('go-mirofish', 'Go-Mirofish', 'A lightweight local-first swarm-intelligence workflow for prediction and simulation.', 'Go-Mirofish uploads documents, builds a graph, runs simulations, and produces prediction reports through a Go gateway and Vue interface without a Python process on the product hot path.', 'AI / Simulation', 'published', '2025-11-26T00:00:00.000Z', 0, '/assets/projects/go-mirofish.png', '/assets/projects/go-mirofish.png', 'Justine Lupasi', 'https://github.com/JustineDevs', 'https://go-mirofish.vercel.app', 116),
  ('premortem', 'Premortem', 'A reviewer-first predictive audit system for repositories.', 'Premortem ingests bounded repository context, runs a fixed specialist swarm, synthesizes traceable issue candidates, and requires human approval before publication to GitLab.', 'Developer Tools / Audit', 'published', '2026-06-07T00:00:00.000Z', 0, '/assets/projects/premortem.png', '/assets/projects/premortem.png', 'Justine Lupasi', 'https://github.com/JustineDevs', 'https://premortem.jstn.site', 117),
  ('llmfaucet', 'llmfaucet', 'One OpenAI-compatible endpoint for available free AI capacity.', 'llmfaucet aggregates provider capacity without buying credits or funding paid balances, with smart routing, fallback, streaming, model selectors, and transparent limits.', 'AI Infrastructure', 'published', '2026-08-24T00:00:00.000Z', 0, '/assets/projects/llmfaucet.png', '/assets/projects/llmfaucet.png', 'Justine Lupasi', 'https://github.com/JustineDevs', 'https://llmfaucet.dev', 118),
  ('hyperagent', 'HyperAgent', 'AI-assisted smart-contract development from natural-language specifications to audited deployment preparation.', 'HyperAgent turns natural-language specifications into draft contracts and artifacts, runs automated audit stages and simulation, and prepares verified workflows for supported SKALE networks.', 'Blockchain / AI / Developer Tools', 'published', '2025-11-18T00:00:00.000Z', 1, '/assets/projects/hyperagent-source.png', '/assets/projects/hyperagent-source.png', 'Justine Lupasi', 'https://github.com/Hyperkit-Labs/hyperagent', NULL, 2)
ON CONFLICT (`slug`) DO UPDATE SET
  `title` = excluded.`title`, `summary` = excluded.`summary`, `body_md` = excluded.`body_md`, `category` = excluded.`category`,
  `status` = excluded.`status`, `published_at` = excluded.`published_at`, `cover_image_url` = excluded.`cover_image_url`,
  `banner_image_url` = excluded.`banner_image_url`, `author_name` = excluded.`author_name`, `author_url` = excluded.`author_url`,
  `website_url` = excluded.`website_url`, `updated_at` = CURRENT_TIMESTAMP;
--> statement-breakpoint

INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'Next.js', 0 FROM `projects` WHERE slug = 'universal-music-store' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Next.js');
--> statement-breakpoint
INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'Cloudflare Workers', 1 FROM `projects` WHERE slug = 'universal-music-store' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Cloudflare Workers');
--> statement-breakpoint
INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'Medusa', 2 FROM `projects` WHERE slug = 'universal-music-store' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Medusa');
--> statement-breakpoint
INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'Supabase', 3 FROM `projects` WHERE slug = 'universal-music-store' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Supabase');
--> statement-breakpoint

INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'TypeScript', 0 FROM `projects` WHERE slug = 'meta-architect' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'TypeScript');
--> statement-breakpoint
INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'Codex', 1 FROM `projects` WHERE slug = 'meta-architect' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Codex');
--> statement-breakpoint
INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'MCP', 2 FROM `projects` WHERE slug = 'meta-architect' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'MCP');
--> statement-breakpoint

INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'Rust', 0 FROM `projects` WHERE slug = 'lending-mind-protocol' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Rust');
--> statement-breakpoint
INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'Node.js', 1 FROM `projects` WHERE slug = 'lending-mind-protocol' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Node.js');
--> statement-breakpoint

INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'React Native', 0 FROM `projects` WHERE slug = 'kwago' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'React Native');
--> statement-breakpoint
INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'ExecuTorch', 1 FROM `projects` WHERE slug = 'kwago' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'ExecuTorch');
--> statement-breakpoint
INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'SQLite', 2 FROM `projects` WHERE slug = 'kwago' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'SQLite');
--> statement-breakpoint

INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'Next.js', 0 FROM `projects` WHERE slug = 'ambios-ai' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Next.js');
--> statement-breakpoint
INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'WebMCP', 1 FROM `projects` WHERE slug = 'ambios-ai' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'WebMCP');
--> statement-breakpoint
INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'Cloudflare Workers', 2 FROM `projects` WHERE slug = 'ambios-ai' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Cloudflare Workers');
--> statement-breakpoint

INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'Codex', 0 FROM `projects` WHERE slug = 'roblox-ai-os' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Codex');
--> statement-breakpoint
INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'Roblox Studio', 1 FROM `projects` WHERE slug = 'roblox-ai-os' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Roblox Studio');
--> statement-breakpoint
INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'TypeScript', 2 FROM `projects` WHERE slug = 'roblox-ai-os' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'TypeScript');
--> statement-breakpoint

INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'Go', 0 FROM `projects` WHERE slug = 'go-mirofish' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Go');
--> statement-breakpoint
INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'Vue.js', 1 FROM `projects` WHERE slug = 'go-mirofish' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Vue.js');
--> statement-breakpoint
INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'Vite', 2 FROM `projects` WHERE slug = 'go-mirofish' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Vite');
--> statement-breakpoint

INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'Next.js', 0 FROM `projects` WHERE slug = 'premortem' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Next.js');
--> statement-breakpoint
INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'Prisma', 1 FROM `projects` WHERE slug = 'premortem' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Prisma');
--> statement-breakpoint
INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'GitLab', 2 FROM `projects` WHERE slug = 'premortem' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'GitLab');
--> statement-breakpoint

INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'OpenAI-compatible API', 0 FROM `projects` WHERE slug = 'llmfaucet' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'OpenAI-compatible API');
--> statement-breakpoint
INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'Cloudflare Workers', 1 FROM `projects` WHERE slug = 'llmfaucet' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Cloudflare Workers');
--> statement-breakpoint

INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'Python', 0 FROM `projects` WHERE slug = 'hyperagent' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Python');
--> statement-breakpoint
INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'Solidity', 1 FROM `projects` WHERE slug = 'hyperagent' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Solidity');
--> statement-breakpoint
INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT id, 'Supabase', 2 FROM `projects` WHERE slug = 'hyperagent' AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Supabase');
