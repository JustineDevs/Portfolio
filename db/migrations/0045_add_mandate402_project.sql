-- Add the supplied Mandate402 project banner and a complete project dossier.

INSERT OR IGNORE INTO `projects` (
  `slug`, `title`, `summary`, `body_md`, `category`, `status`, `published_at`,
  `featured`, `cover_image_url`, `banner_image_url`, `author_name`, `author_url`,
  `website_url`, `sort_order`
) VALUES (
  'mandate402',
  'Mandate402',
  'A governance and treasury control layer that lets AI agents use x402 machine payments inside explicit spending rules.',
  '## Overview\n\nMandate402 sits between an agent payment request and x402 settlement. It gives teams a way to define who an agent may pay, how much it may spend, which vendors are approved, when authority expires, and what evidence must remain reviewable.\n\n## What I built\n\n- Mandate creation, approval, expiry, and revocation workflows\n- Budget reservation before a paid vendor request is dispatched\n- Policy gates for vendors, spend limits, receipt requirements, and treasury rules\n- Reconciliation for ambiguous payment outcomes instead of guessing final truth\n- An operator-facing audit trail for allowed, blocked, and unresolved attempts\n- Morph-native contract anchors for mandate and treasury lifecycle events\n\n## Stack\n\nNext.js, TypeScript, Solidity, Morph, x402, Pyth, Postgres, and a Go x402 merchant.\n\n## What I learned\n\nAgentic payments need governance before they need more autonomy. The key design lesson was to separate payment transport from organizational policy, then preserve enough evidence for a human to understand why a payment was allowed, blocked, or held for reconciliation.\n\n## Scope\n\nThe MVP proves a complete operator loop: create a mandate, run an approved attempt, block an invalid attempt, reconcile an ambiguous result, and revoke authority.',
  'Blockchain / AI / Payments',
  'published',
  CURRENT_TIMESTAMP,
  1,
  '/assets/projects/curated/morph-banner.png',
  '/assets/projects/curated/morph-banner.png',
  'Justine Lupasi',
  'https://justinedevs.vercel.app',
  NULL,
  119
);

UPDATE `projects` SET
  `title` = 'Mandate402',
  `summary` = 'A governance and treasury control layer that lets AI agents use x402 machine payments inside explicit spending rules.',
  `category` = 'Blockchain / AI / Payments',
  `status` = 'published',
  `featured` = 1,
  `cover_image_url` = '/assets/projects/curated/morph-banner.png',
  `banner_image_url` = '/assets/projects/curated/morph-banner.png',
  `sort_order` = 119
WHERE `slug` = 'mandate402';

DELETE FROM `project_tags` WHERE `project_id` = (SELECT `id` FROM `projects` WHERE `slug` = 'mandate402');

INSERT INTO `project_tags` (`project_id`, `tag`, `sort_order`)
SELECT `id`, 'x402', 0 FROM `projects` WHERE `slug` = 'mandate402';
INSERT INTO `project_tags` (`project_id`, `tag`, `sort_order`)
SELECT `id`, 'Agent Governance', 1 FROM `projects` WHERE `slug` = 'mandate402';
INSERT INTO `project_tags` (`project_id`, `tag`, `sort_order`)
SELECT `id`, 'Treasury Controls', 2 FROM `projects` WHERE `slug` = 'mandate402';
INSERT INTO `project_tags` (`project_id`, `tag`, `sort_order`)
SELECT `id`, 'Morph', 3 FROM `projects` WHERE `slug` = 'mandate402';
INSERT INTO `project_tags` (`project_id`, `tag`, `sort_order`)
SELECT `id`, 'Solidity', 4 FROM `projects` WHERE `slug` = 'mandate402';
