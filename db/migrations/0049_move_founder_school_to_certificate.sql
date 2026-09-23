-- Keep Founder School in certificates and reserve awards for competition recognition.

UPDATE `awards` SET
  `status` = 'archived',
  `featured` = 0
WHERE `slug` = 'founder-school';

INSERT OR IGNORE INTO `certificates` (
  `slug`, `title`, `issuer`, `description`, `proof_url`, `logo_url`,
  `status`, `featured`, `sort_order`
) VALUES (
  'founder-school',
  'Founder School FS26-1',
  'Founder School',
  'Completed Founder School FS26-1, strengthening product discovery, validation, founder communication, and the discipline of turning technical work into a clear venture direction.',
  'https://www.linkedin.com/posts/justine-lupasi-444608295_proud-to-complete-founder-school-fs26-1-as-share-7468465550797717506-Upp4/',
  '/assets/brands/founders-school.jpg',
  'published',
  1,
  0
);

UPDATE `certificates` SET
  `title` = 'Founder School FS26-1',
  `issuer` = 'Founder School',
  `description` = 'Completed Founder School FS26-1, strengthening product discovery, validation, founder communication, and the discipline of turning technical work into a clear venture direction.',
  `proof_url` = 'https://www.linkedin.com/posts/justine-lupasi-444608295_proud-to-complete-founder-school-fs26-1-as-share-7468465550797717506-Upp4/',
  `logo_url` = '/assets/brands/founders-school.jpg',
  `status` = 'published',
  `featured` = 1,
  `sort_order` = 0
WHERE `slug` = 'founder-school';

UPDATE `awards` SET `sort_order` = 0 WHERE `slug` = 'avalanche-hack2build-x402-agents-3rd-place';
UPDATE `awards` SET `sort_order` = 1 WHERE `slug` = 'metis-hyperhack-2025-1st-place';
UPDATE `awards` SET `sort_order` = 2 WHERE `slug` = 'morph-payment-hackathon';
