-- Finalize public project metadata against the current project repositories.

UPDATE `projects` SET
  `title` = 'HyperKit Labs — HyperAgent',
  `summary` = 'A verifiable developer workflow that turns natural-language contract ideas into audited, simulated, and deployment-ready artifacts.',
  `cover_image_url` = '/assets/projects/curated/hyperkit-banner-readme.png',
  `banner_image_url` = '/assets/projects/curated/hyperkit-banner-readme.png',
  `body_md` = '## Overview\n\nHyperAgent is HyperKit Labs'' smart-contract development workflow. It turns a contract idea written in natural language into a structured path through specification, generation, compilation, security analysis, simulation, approval, and deployment preparation.\n\nThe system combines a Next.js and React studio with Python services, Supabase-backed state, isolated execution, and explicit human checkpoints around high-risk decisions.\n\n## What I built\n\n- Natural-language specifications into Solidity contracts, tests, and artifacts\n- Agent orchestration across compile, audit, fuzzing, simulation, and deployment stages\n- BYOK model access so user keys remain separate from shared server configuration\n- Evidence and approval boundaries for security findings and deployment gates\n- Multi-chain workflow foundations for EVM, Sui, and Solana development\n\n## Stack\n\nPython, FastAPI, Next.js, React, TypeScript, Solidity, Supabase/PostgreSQL, Qdrant, Foundry, Hardhat, Slither, Mythril, Echidna, Tenderly, Thirdweb, and IPFS-compatible storage.\n\n## What I learned\n\nAI-assisted development becomes useful when every important transition remains inspectable. Generation is only one stage; compilation, security evidence, simulation, and human approval are what make the workflow dependable.'
WHERE `slug` = 'hyperkit';

UPDATE `projects` SET
  `body_md` = '## Overview\n\nMetaWalletGen CLI is a Python command-line utility for creating and managing Ethereum-compatible wallets without hiding the security model behind a graphical interface. It supports BIP-39 and BIP-44 conventions, EIP-55 addresses, validation, batch generation, encrypted storage, and automation-friendly exports.\n\n## What I built\n\n- Wallet generation with BIP-39 mnemonics and EIP-55 addresses\n- Batch operations with progress reporting and validation\n- AES-256 encryption with PBKDF2-derived keys\n- JSON, CSV, and YAML export paths\n- Import, list, validate, and diagnostic commands for repeatable workflows\n\n## Stack\n\nPython 3.8+, BIP-39, BIP-44, EIP-55, AES-256, PBKDF2, YAML, JSON, and CSV.\n\n## What I learned\n\nSecurity-focused tooling has to make the safe path the easy path. Clear validation, explicit file formats, careful secret handling, and useful terminal feedback matter as much as the cryptographic primitives.'
WHERE `slug` = 'wallet';

UPDATE `projects` SET
  `body_md` = '## Overview\n\nUniversal Music Store is a Worker-native commerce platform for discovering and buying music equipment while giving staff a dependable operational surface behind the storefront. It connects customer-facing commerce with catalog, inventory, checkout, fulfillment, content, and administration workflows.\n\n## What I built\n\n- Product discovery, storefront, and customer-account experiences\n- Catalog, inventory, checkout, and order operations\n- Medusa-backed commerce workflows and Supabase-backed application data\n- Fulfillment and internal staff surfaces\n- Edge delivery with Cloudflare Workers, Hyperdrive, and Queues\n\n## Stack\n\nTurborepo, pnpm workspaces, Next.js, React, Tailwind CSS, Cloudflare Workers, Hyperdrive, Queues, Medusa, Supabase, and PostgreSQL.\n\n## What I learned\n\nCommerce is a systems problem, not only a storefront problem. Catalog truth, customer state, checkout, fulfillment, and staff tooling need clear boundaries and dependable shared data.'
WHERE `slug` = 'universal-music-store';

UPDATE `projects` SET
  `body_md` = '## Overview\n\nLending-Mind Protocol makes engineering judgment executable without turning it into invisible prompt context. A Mind Package records the decisions, constraints, and evaluation rules that should govern an AI-assisted change.\n\nRust owns the protocol semantics, policy evaluation, signing, artifacts, registry operations, daemon, and MCP behavior. Node.js provides delivery and onboarding glue, while the Python orchestrator handles sandboxed qualification and benchmark workflows.\n\n## What I built\n\n- Local-first control-plane concepts for engineering judgment\n- Signed preference and evaluation packages\n- Bounded execution with explicit review evidence\n- Rust parsing, policy evaluation, artifacts, registry, daemon, and MCP boundaries\n- A foundation for repeatable AI-assisted software decisions\n\n## Stack\n\nRust, Node.js, Python, MCP, signed packages, local persistence, and protocol-oriented tooling.\n\n## What I learned\n\nThe most useful AI systems are not only more capable; they are more accountable. Encoding preferences, evidence, and approval boundaries makes a system easier to audit and safer to evolve.'
WHERE `slug` = 'lending-mind-protocol';

UPDATE `projects` SET
  `website_url` = 'https://kwago.vercel.app',
  `body_md` = '## Overview\n\nKwago is a draft local-first calendar that understands intent without sending a person''s schedule to a remote service by default. It combines on-device small-language-model inference, local persistence, conflict review, and encrypted synchronization.\n\n## What I built\n\n- Natural-language intent parsing for calendar actions\n- Conflict detection with a review step before changes are accepted\n- On-device intelligence for private schedule data\n- Synchronous local persistence with SQLite and full-text search\n- A mobile interaction model for editing and confirming proposed events\n\n## Stack\n\nReact Native, Expo, ExecuTorch, Llama 3.2 1B, react-native-op-sqlite, SQLite FTS5, and local-first mobile architecture.\n\n## What I learned\n\nPrivacy is an architectural choice. Keeping intelligence close to the data changes the product constraints, but it also creates a more respectful and understandable experience for personal information.\n\n## Status\n\nKwago is currently presented as a draft product direction and prototype, not as a finished production calendar.'
WHERE `slug` = 'kwago';

UPDATE `projects` SET
  `summary` = 'A WebMCP-native operations workspace where human approval governs context, incident response, budgets, integrations, and safe agent inspection.',
  `body_md` = '## Overview\n\nAmbiOS AI is a WebMCP-native collaboration and operations workspace for teams that need AI assistance without surrendering control. It brings context, incident response, documentation proposals, guardrails, approvals, budgets, and integrations behind shared server-side policy.\n\nThe current release catalogs 29 tools and mounts an explicitly safe read-only subset in compatible browsers. Write-capable actions remain gated until their provider adapters, approval paths, verification evidence, and external side effects are proven.\n\n## What I built\n\n- Operational context and incident-response surfaces\n- Guardrails and approvals around governed workflows\n- Budget and integration controls for agent inspection\n- Documentation proposals that remain reviewable before publication\n- WebMCP tools behind shared server-side authentication and governance\n\n## Stack\n\nNext.js, Hono, TypeScript, WebMCP, Cloudflare Workers, D1, KV, R2, Queues, Supabase Auth, and policy-aware server-side adapters.\n\n## What I learned\n\nAgent products need an operating model, not only a chat interface. Context, permissions, budgets, approval states, and audit evidence are product primitives when an agent can inspect or affect real systems.'
WHERE `slug` = 'ambios-ai';

UPDATE `projects` SET
  `body_md` = '## Overview\n\nPremortem helps teams inspect a proposed change before it becomes an incident. It ingests bounded repository context, runs a fixed specialist review workflow, synthesizes traceable issue candidates, and keeps a human approval step before publication to GitLab.\n\n## What I built\n\n- Bounded repository-context ingestion\n- Specialist review passes with explicit responsibilities\n- Traceable issue candidates linked to supporting evidence\n- Human approval, editing, publication, and reconciliation workflows\n- A reviewer-first interface for GitLab projects and audit history\n\n## Stack\n\nNext.js, Prisma, Supabase/PostgreSQL, GitLab OAuth and REST, Alibaba Cloud ECS, Neo4j graph snapshots, and the Premortem orchestrator with Gemini and Qwen-compatible model routes.\n\n## What I learned\n\nReview quality improves when the system narrows the question. Bounded context, stable specialist roles, evidence links, and human approval make AI review easier to challenge and much easier to trust.'
WHERE `slug` = 'premortem';

UPDATE `projects` SET
  `body_md` = '## Overview\n\nLLM Faucet gives developers one OpenAI-compatible API surface for model capacity that is otherwise fragmented across providers. It focuses on honest availability: route requests to usable capacity, stream responses, fall back when a provider is unavailable, and make limits visible.\n\n## What I built\n\n- OpenAI-compatible `/v1` chat-completions surface\n- Provider-capacity aggregation and model selection\n- Smart routing with fallback behavior\n- Streaming responses for interactive clients\n- Transparent availability and usage limits for coding tools\n\n## Stack\n\nOpenAI-compatible APIs, TypeScript, Cloudflare Workers, edge routing, streaming, and provider adapters.\n\n## What I learned\n\nInfrastructure products earn trust through predictable failure behavior. Compatibility is only the beginning; routing decisions, limits, and fallbacks must be understandable to the people building on top of them.'
WHERE `slug` = 'llmfaucet';

UPDATE `projects` SET
  `body_md` = '## Overview\n\nMandate402 is a Morph-native governance and treasury control layer for x402 machine commerce. It sits between an agent payment request and settlement, defining who an agent may pay, how much it may spend, which vendors are approved, when authority expires, and what evidence remains reviewable.\n\nThe current repository documents the v0.2.0 production-hardening milestone and a deployed Morph Hoodi treasury contract. It does not replace the x402 facilitator or the paid vendor; it adds the policy boundary between payment intent and value leaving the treasury.\n\n## What I built\n\n- Mandate creation, approval, expiry, and revocation workflows\n- Budget reservation before a paid vendor request is dispatched\n- Vendor, facilitator, receipt, spend-limit, and treasury policy gates\n- Reconciliation for ambiguous payment outcomes instead of guessing final truth\n- Operator-facing audit trails for allowed, blocked, and unresolved attempts\n- Morph-native contract anchors for mandate and treasury lifecycle events\n\n## Stack\n\nNext.js, TypeScript, Solidity, Foundry, Morph Hoodi, x402, Pyth, Postgres, and a Go x402 merchant.\n\n## What I learned\n\nAgentic payments need governance before they need more autonomy. The key design lesson was to separate payment transport from organizational policy, then preserve enough evidence for a human to understand why a payment was allowed, blocked, or held for reconciliation.'
WHERE `slug` = 'mandate402';

DELETE FROM `project_technologies` WHERE `project_id` IN (1, 4, 5, 7, 9, 10, 11, 14, 15, 27);
INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`) VALUES
  (1, 'Roblox Studio', 0), (1, 'Luau', 1), (1, 'TypeScript', 2), (1, 'Codex', 3),
  (4, 'Python / FastAPI', 0), (4, 'Next.js / React', 1), (4, 'TypeScript', 2), (4, 'Solidity', 3), (4, 'Supabase / PostgreSQL', 4), (4, 'Foundry / Slither', 5),
  (5, 'Python', 0), (5, 'BIP-39 / BIP-44', 1), (5, 'EIP-55', 2), (5, 'AES-256 / PBKDF2', 3),
  (7, 'Turborepo / pnpm', 0), (7, 'Next.js / React', 1), (7, 'Cloudflare Workers', 2), (7, 'Medusa', 3), (7, 'Supabase / PostgreSQL', 4),
  (9, 'Rust', 0), (9, 'Node.js', 1), (9, 'Python', 2), (9, 'MCP', 3),
  (10, 'React Native / Expo', 0), (10, 'ExecuTorch / Llama 3.2', 1), (10, 'op-sqlite / SQLite FTS5', 2),
  (11, 'Next.js / TypeScript', 0), (11, 'Hono', 1), (11, 'WebMCP', 2), (11, 'Cloudflare Workers', 3), (11, 'D1 / KV / R2 / Queues', 4),
  (14, 'Next.js', 0), (14, 'Prisma / PostgreSQL', 1), (14, 'GitLab', 2), (14, 'Neo4j', 3), (14, 'Gemini / Qwen routes', 4),
  (15, 'OpenAI-compatible API', 0), (15, 'TypeScript', 1), (15, 'Cloudflare Workers', 2), (15, 'Streaming / Fallback routing', 3),
  (27, 'Next.js / TypeScript', 0), (27, 'Solidity / Foundry', 1), (27, 'Morph Hoodi', 2), (27, 'x402 / Pyth', 3), (27, 'Postgres / Go merchant', 4);

DELETE FROM `project_responsibilities` WHERE `project_id` IN (1, 4, 5, 7, 9, 10, 11, 14, 15, 27);
INSERT INTO `project_responsibilities` (`project_id`, `responsibility`, `sort_order`) VALUES
  (1, 'Creator workflow design for Roblox Studio', 0), (1, 'Codex-assisted Luau planning and implementation', 1), (1, 'Review and verification loops for creator tools', 2),
  (4, 'Product and systems architecture for HyperKit Labs', 0), (4, 'Agent workflow orchestration and security gates', 1), (4, 'Contract generation, simulation, and deployment readiness', 2),
  (5, 'CLI architecture and implementation', 0), (5, 'Wallet generation and standards validation', 1), (5, 'Encryption and secret-handling workflows', 2), (5, 'Testing, diagnostics, and export formats', 3),
  (7, 'Commerce platform architecture and storefront delivery', 0), (7, 'Catalog, checkout, fulfillment, and staff workflows', 1), (7, 'Worker-native integrations and edge operations', 2),
  (9, 'Rust protocol and policy-evaluation design', 0), (9, 'Signed Mind Packages and review evidence', 1), (9, 'MCP adapter, registry, daemon, and artifact workflows', 2),
  (10, 'Local-first mobile product design', 0), (10, 'On-device intent parsing and schedule drafting', 1), (10, 'Conflict review, persistence, and privacy boundaries', 2),
  (11, 'Governed operations workspace design', 0), (11, 'WebMCP catalog and safe read-only tool boundary', 1), (11, 'Server-side auth, policy, approval, and audit flows', 2),
  (14, 'Reviewer-first audit workflow design', 0), (14, 'Bounded repository context and specialist orchestration', 1), (14, 'Evidence traceability and human-approved GitLab publication', 2),
  (15, 'OpenAI-compatible gateway design', 0), (15, 'Provider capacity routing and model selection', 1), (15, 'Streaming, fallback, and transparent limit handling', 2),
  (27, 'Morph-native treasury governance architecture', 0), (27, 'Mandate, policy, payment, and reconciliation workflows', 1), (27, 'Solidity contracts, Pyth guardrails, and x402 merchant integration', 2);

UPDATE `projects` SET `website_url` = 'https://kwago.vercel.app' WHERE `slug` = 'kwago';

DELETE FROM `project_tags` WHERE `project_id` IN (2, 3, 8, 13, 16);
DELETE FROM `project_technologies` WHERE `project_id` IN (2, 3, 8, 13, 16);
DELETE FROM `project_responsibilities` WHERE `project_id` IN (2, 3, 8, 13, 16);
DELETE FROM `project_networks` WHERE `project_id` IN (2, 3, 8, 13, 16);
