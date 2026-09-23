-- Replace generic catalog imagery with the project-owned banners and sharpen the public dossiers.

UPDATE `projects` SET
  `title` = 'Roblox AI OS',
  `category` = 'Creator Tools / AI',
  `summary` = 'A Roblox Studio operating layer for briefing, building, reviewing, and verifying Codex-assisted creator workflows.',
  `body_md` = '## Overview\n\nRoblox AI OS is a creator-tooling system that brings disciplined agent workflows into Roblox Studio. It treats a game idea as a product brief: clarify the intent, plan the build, implement in Roblox-native terms, review the result, and verify the experience before publishing.\n\n## What I built\n\n- Briefing and planning workflows for Roblox projects\n- Roblox-native build guidance for Codex-assisted creation\n- Review and verification loops for scripts, scenes, and interactions\n- Psychology-aware prompts that keep creator and player experience in view\n\n## Stack\n\nCodex, Roblox Studio, and TypeScript.\n\n## What I learned\n\nThe project taught me how to translate general-purpose agent workflows into the vocabulary and constraints of a specialized creative tool. The important work is not only generating code; it is creating checkpoints that help creators make better decisions before they ship.',
  `cover_image_url` = '/assets/projects/roblox-ai-os.png',
  `banner_image_url` = '/assets/projects/roblox-ai-os.png'
WHERE `id` = 1;

UPDATE `projects` SET
  `title` = 'HyperAgent: AI-powered smart contract development',
  `category` = 'Blockchain / AI / Developer Tools',
  `summary` = 'A verifiable workflow from natural-language contract specifications to audited artifacts, simulation, and deployment preparation.',
  `body_md` = '## Overview\n\nHyperAgent turns a contract idea written in natural language into a structured development workflow. It combines generation, compilation, security checks, simulation, and deployment preparation while keeping the important evidence visible to the developer.\n\nThe current release is scoped to SKALE Base Mainnet and SKALE Base Sepolia. It uses a service-oriented architecture, BYOK model access, audit stages, Tenderly simulation, and human oversight around high-risk decisions.\n\n## What I built\n\n- Natural-language specifications to Solidity contracts, tests, and artifacts\n- Agent orchestration across compile, audit, simulation, and deployment stages\n- BYOK handling so user model keys stay isolated from shared server configuration\n- Evidence and status boundaries for security findings and deployment gates\n- Wallet, network, and workflow integrations for multi-chain development\n\n## Stack\n\nPython, Solidity, TypeScript, React, Node.js, Supabase, LangGraph, Slither, Mythril, Tenderly, and IPFS-compatible storage.\n\n## What I learned\n\nThe central lesson was that AI-assisted development needs explicit trust boundaries. Generation is useful only when every important transition can be inspected, tested, simulated, and approved by a human.',
  `cover_image_url` = '/assets/projects/curated/hyperagent-banner.png',
  `banner_image_url` = '/assets/projects/curated/hyperagent-banner.png'
WHERE `id` = 4;

UPDATE `projects` SET
  `title` = 'MetaWalletGen CLI',
  `category` = 'Wallet Infrastructure / CLI',
  `summary` = 'A command-line wallet generator for Ethereum-compatible development with encrypted storage, validation, and export workflows.',
  `body_md` = '## Overview\n\nMetaWalletGen CLI is a developer utility for creating and managing Ethereum-compatible wallets without hiding the security model behind a graphical interface. It supports BIP-39 and BIP-44 conventions, validation, batch generation, encrypted storage, and automation-friendly exports.\n\n## What I built\n\n- Wallet generation with BIP-39 mnemonics and EIP-55 addresses\n- Batch operations with progress reporting and validation\n- AES-256 encryption with PBKDF2-derived keys\n- JSON, CSV, and YAML export paths\n- Import, list, validate, and diagnostic commands for repeatable workflows\n\n## Stack\n\nNode.js, TypeScript, Ethereum standards, AES-256, PBKDF2, YAML, JSON, and CSV.\n\n## What I learned\n\nSecurity-focused tooling has to make the safe path the easy path. Clear validation, explicit file formats, careful secret handling, and useful terminal feedback matter as much as the cryptographic primitives.',
  `cover_image_url` = 'https://raw.githubusercontent.com/JustineDevs/MetaWalletGen-CLI/main/public/img/Banner%20V1%20METAGEN%20WALLET.png',
  `banner_image_url` = 'https://raw.githubusercontent.com/JustineDevs/MetaWalletGen-CLI/main/public/img/Banner%20V1%20METAGEN%20WALLET.png'
WHERE `id` = 5;

UPDATE `projects` SET
  `title` = 'Universal Music Store',
  `category` = 'Commerce / Platform',
  `summary` = 'A worker-native music commerce platform covering discovery, checkout, catalog operations, fulfillment, CMS, and staff workflows.',
  `body_md` = '## Overview\n\nUniversal Music Store is a commerce platform for discovering and buying music equipment while giving staff a dependable operational surface behind the storefront. The project connects customer-facing commerce with catalog, fulfillment, content, and administration workflows.\n\n## What I built\n\n- Product discovery and storefront experiences\n- Catalog, inventory, and admin operations\n- Checkout and customer-account foundations\n- Fulfillment and internal workflow surfaces\n- CMS-backed content and partner-brand presentation\n\n## Stack\n\nNext.js, Cloudflare Workers, Medusa, Supabase, and edge-oriented web delivery.\n\n## What I learned\n\nCommerce is a systems problem, not only a storefront problem. The project strengthened my understanding of how catalog truth, customer state, fulfillment, and staff tooling need to share clear boundaries.',
  `cover_image_url` = '/assets/projects/curated/universal-music-store-banner.png',
  `banner_image_url` = '/assets/projects/curated/universal-music-store-banner.png'
WHERE `id` = 7;

UPDATE `projects` SET
  `title` = 'Lending-Mind Protocol',
  `category` = 'Developer Tools / Governance',
  `summary` = 'A local-first control plane that turns engineering judgment into signed packages, bounded evaluations, and reviewable evidence.',
  `body_md` = '## Overview\n\nLending-Mind Protocol makes engineering preferences executable without turning them into invisible prompt context. A Mind Package records the decisions, constraints, and evaluation rules that should govern an AI-assisted change.\n\n## What I built\n\n- Local-first control-plane concepts for engineering judgment\n- Signed preference and evaluation packages\n- Bounded execution with explicit review evidence\n- Durable protocol boundaries between intent, action, and approval\n- A foundation for repeatable AI-assisted software decisions\n\n## Stack\n\nRust, Node.js, signed packages, local persistence, and protocol-oriented tooling.\n\n## What I learned\n\nThe most useful AI systems are not only more capable; they are more accountable. Encoding preferences, evidence, and approval boundaries makes a system easier to audit and safer to evolve.',
  `cover_image_url` = '/assets/projects/curated/lending-mind-banner.png',
  `banner_image_url` = '/assets/projects/curated/lending-mind-banner.png'
WHERE `id` = 9;

UPDATE `projects` SET
  `title` = 'Kwago',
  `category` = 'Mobile / On-device AI',
  `summary` = 'A private local-first calendar that drafts schedules on-device, reviews conflicts, and keeps sensitive routines encrypted.',
  `body_md` = '## Overview\n\nKwago explores a calendar that can understand intent without sending a person''s schedule to a remote service by default. It combines local persistence, on-device drafting, conflict review, and encrypted synchronization.\n\n## What I built\n\n- Natural-language intent parsing for calendar actions\n- Conflict detection with a review step before changes are accepted\n- On-device intelligence for private schedule data\n- Local persistence and encrypted synchronization\n- A mobile interaction model for editing and confirming proposed events\n\n## Stack\n\nReact Native, ExecuTorch, SQLite, and local-first mobile architecture.\n\n## What I learned\n\nPrivacy is an architectural choice. Keeping intelligence close to the data changes the product constraints, but it also creates a more respectful and understandable experience for personal information.',
  `cover_image_url` = '/assets/projects/curated/kwago-banner.png',
  `banner_image_url` = '/assets/projects/curated/kwago-banner.png'
WHERE `id` = 10;

UPDATE `projects` SET
  `title` = 'AmbiOS AI',
  `category` = 'AI / Operations',
  `summary` = 'An operational workspace where human judgment governs context, incident response, approvals, budgets, integrations, and agent actions.',
  `body_md` = '## Overview\n\nAmbiOS AI is an operational workspace for teams that need AI assistance without surrendering control. It brings context, incident response, documentation proposals, guardrails, approvals, budgets, and integrations behind shared server-side policy.\n\n## What I built\n\n- Operational context and incident-response surfaces\n- Guardrails and approvals around governed actions\n- Budget and integration controls for agent workflows\n- Documentation proposals that remain reviewable before publication\n- WebMCP tools behind shared server-side governance\n\n## Stack\n\nNext.js, server-side controls, WebMCP, integrations, and policy-aware workflows.\n\n## What I learned\n\nAgent products need an operating model, not only a chat interface. Context, permissions, budgets, and review states are product primitives when actions can affect real systems.',
  `cover_image_url` = '/assets/projects/curated/ambios-banner.png',
  `banner_image_url` = '/assets/projects/curated/ambios-banner.png'
WHERE `id` = 11;

UPDATE `projects` SET
  `title` = 'Premortem',
  `category` = 'Developer Tools / Audit',
  `summary` = 'A reviewer-first predictive audit system that turns bounded repository context into traceable issue candidates before changes are published.',
  `body_md` = '## Overview\n\nPremortem helps teams inspect a proposed change before it becomes an incident. It ingests bounded repository context, runs a fixed specialist review workflow, synthesizes traceable issue candidates, and keeps a human approval step before publication.\n\n## What I built\n\n- Bounded repository-context ingestion\n- Fixed specialist review passes with explicit responsibilities\n- Traceable issue candidates linked to supporting evidence\n- Human approval before findings are published to GitLab\n- A workflow that favors repeatability over unstructured agent output\n\n## Stack\n\nNext.js, Prisma, GitLab, structured review workflows, and evidence-oriented UI.\n\n## What I learned\n\nReview quality improves when the system narrows the question. Bounded context, stable specialist roles, and evidence links make AI review easier to challenge and much easier to trust.',
  `cover_image_url` = '/assets/projects/curated/premortem-banner.svg',
  `banner_image_url` = '/assets/projects/curated/premortem-banner.svg'
WHERE `id` = 14;

UPDATE `projects` SET
  `title` = 'LLM Faucet',
  `category` = 'AI Infrastructure',
  `summary` = 'An OpenAI-compatible gateway that aggregates available free model capacity through routing, fallback, streaming, and transparent limits.',
  `body_md` = '## Overview\n\nLLM Faucet gives developers one compatible API surface for model capacity that is otherwise fragmented across providers. It focuses on honest availability: route requests to usable capacity, stream responses, fall back when a provider is unavailable, and make limits visible.\n\n## What I built\n\n- OpenAI-compatible request and response surface\n- Provider-capacity aggregation and model selection\n- Smart routing with fallback behavior\n- Streaming responses for interactive clients\n- Transparent availability and usage limits\n\n## Stack\n\nOpenAI-compatible APIs, Cloudflare Workers, edge routing, streaming, and provider adapters.\n\n## What I learned\n\nInfrastructure products earn trust through predictable failure behavior. Compatibility is only the beginning; routing decisions, limits, and fallbacks must be understandable to the people building on top of them.',
  `cover_image_url` = '/assets/projects/curated/llmfaucet-banner.png',
  `banner_image_url` = '/assets/projects/curated/llmfaucet-banner.png'
WHERE `id` = 15;

UPDATE `projects` SET
  `cover_image_url` = '/assets/projects/curated/meta-architect-banner.png',
  `banner_image_url` = '/assets/projects/curated/meta-architect-banner.png'
WHERE `slug` IN ('meta-architect', 'codex');

DELETE FROM `project_tags` WHERE `project_id` IN (1, 4, 5, 7, 9, 10, 11, 14, 15);

INSERT INTO `project_tags` (`project_id`, `tag`, `sort_order`) VALUES
  (1, 'Roblox Studio', 0), (1, 'Creator Tools', 1), (1, 'AI Workflows', 2), (1, 'Codex', 3),
  (4, 'Smart Contracts', 0), (4, 'AI Agents', 1), (4, 'Security Auditing', 2), (4, 'Multi-chain', 3), (4, 'Developer Infrastructure', 4),
  (5, 'Ethereum', 0), (5, 'Wallet Security', 1), (5, 'CLI', 2), (5, 'Cryptography', 3),
  (7, 'E-commerce', 0), (7, 'Music Retail', 1), (7, 'Edge Workers', 2), (7, 'Operations', 3),
  (9, 'Local-first', 0), (9, 'Developer Tools', 1), (9, 'Governance', 2), (9, 'AI Safety', 3),
  (10, 'Mobile', 0), (10, 'On-device AI', 1), (10, 'Privacy', 2), (10, 'Local-first', 3),
  (11, 'Agent Operations', 0), (11, 'Governance', 1), (11, 'Incident Response', 2), (11, 'WebMCP', 3),
  (14, 'Repository Auditing', 0), (14, 'AI Review', 1), (14, 'Evidence', 2), (14, 'GitLab', 3),
  (15, 'AI Infrastructure', 0), (15, 'OpenAI-compatible', 1), (15, 'Routing', 2), (15, 'Streaming', 3), (15, 'Edge Runtime', 4);
