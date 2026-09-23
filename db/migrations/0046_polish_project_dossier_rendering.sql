-- Normalize legacy escaped Markdown and correct the MetaWalletGen project record.

UPDATE `projects`
SET `body_md` = replace(`body_md`, '\n', char(10));

UPDATE `projects`
SET `body_md` = replace(
  `body_md`,
  'Node.js, TypeScript, Ethereum standards, AES-256, PBKDF2, YAML, JSON, and CSV.',
  'Python 3.8+, BIP-39, BIP-44, EIP-55, AES-256, PBKDF2, YAML, JSON, and CSV.'
)
WHERE `slug` = 'wallet';

DELETE FROM `project_technologies`
WHERE `project_id` = (SELECT `id` FROM `projects` WHERE `slug` = 'wallet');

INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT `id`, 'Python', 0 FROM `projects` WHERE `slug` = 'wallet';
INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT `id`, 'BIP-39 / BIP-44', 1 FROM `projects` WHERE `slug` = 'wallet';
INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT `id`, 'EIP-55', 2 FROM `projects` WHERE `slug` = 'wallet';
INSERT INTO `project_technologies` (`project_id`, `technology`, `sort_order`)
SELECT `id`, 'AES-256 / PBKDF2', 3 FROM `projects` WHERE `slug` = 'wallet';

DELETE FROM `project_responsibilities`
WHERE `project_id` = (SELECT `id` FROM `projects` WHERE `slug` = 'wallet');

INSERT INTO `project_responsibilities` (`project_id`, `responsibility`, `sort_order`)
SELECT `id`, 'CLI architecture and implementation', 0 FROM `projects` WHERE `slug` = 'wallet';
INSERT INTO `project_responsibilities` (`project_id`, `responsibility`, `sort_order`)
SELECT `id`, 'Wallet generation and standards validation', 1 FROM `projects` WHERE `slug` = 'wallet';
INSERT INTO `project_responsibilities` (`project_id`, `responsibility`, `sort_order`)
SELECT `id`, 'Encryption and secret-handling workflows', 2 FROM `projects` WHERE `slug` = 'wallet';
INSERT INTO `project_responsibilities` (`project_id`, `responsibility`, `sort_order`)
SELECT `id`, 'Testing, diagnostics, and export formats', 3 FROM `projects` WHERE `slug` = 'wallet';
