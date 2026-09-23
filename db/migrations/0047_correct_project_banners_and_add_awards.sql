-- Use the supplied project banners and publish the latest recognition records.

UPDATE `projects` SET
  `cover_image_url` = '/assets/projects/curated/hyperagent-banner.png',
  `banner_image_url` = '/assets/projects/curated/hyperagent-banner.png'
WHERE `slug` = 'hyperagent';

UPDATE `projects` SET
  `cover_image_url` = '/assets/projects/curated/mandate402-thumbnail.jpeg',
  `banner_image_url` = '/assets/projects/curated/mandate402-thumbnail.jpeg'
WHERE `slug` = 'mandate402';

INSERT OR IGNORE INTO `awards` (
  `slug`, `title`, `event_name`, `description`, `award_type`, `year`, `proof_url`,
  `logo_url`, `status`, `featured`, `sort_order`
) VALUES (
  'morph-payment-hackathon',
  'Morph Payment Hackathon',
  'Morph L2',
  'Built and shipped Mandate402, a Morph-native governance and treasury control layer for x402 machine payments, turning agent payment intent into governed, auditable execution.',
  'Hackathon',
  'Jun 2026',
  'https://x.com/mandate402/status/2063885900954869928',
  NULL,
  'published',
  1,
  0
);

UPDATE `awards` SET
  `title` = 'Morph Payment Hackathon',
  `event_name` = 'Morph L2',
  `description` = 'Built and shipped Mandate402, a Morph-native governance and treasury control layer for x402 machine payments, turning agent payment intent into governed, auditable execution.',
  `award_type` = 'Hackathon',
  `year` = 'Jun 2026',
  `proof_url` = 'https://x.com/mandate402/status/2063885900954869928',
  `logo_url` = NULL,
  `status` = 'published',
  `featured` = 1,
  `sort_order` = 0
WHERE `slug` = 'morph-payment-hackathon';

INSERT OR IGNORE INTO `awards` (
  `slug`, `title`, `event_name`, `description`, `award_type`, `year`, `proof_url`,
  `logo_url`, `status`, `featured`, `sort_order`
) VALUES (
  'founder-school',
  'Founder School',
  'Founder School',
  'Completed Founder School FS26-1, strengthening product discovery, validation, founder communication, and the discipline of turning technical work into a clear venture direction.',
  'Program',
  'May 2026',
  'https://www.linkedin.com/posts/justine-lupasi-444608295_proud-to-complete-founder-school-fs26-1-as-share-7468465550797717506-Upp4/',
  '/assets/brands/founders-school.jpg',
  'published',
  1,
  1
);

UPDATE `awards` SET
  `title` = 'Founder School',
  `event_name` = 'Founder School',
  `description` = 'Completed Founder School FS26-1, strengthening product discovery, validation, founder communication, and the discipline of turning technical work into a clear venture direction.',
  `award_type` = 'Program',
  `year` = 'May 2026',
  `proof_url` = 'https://www.linkedin.com/posts/justine-lupasi-444608295_proud-to-complete-founder-school-fs26-1-as-share-7468465550797717506-Upp4/',
  `logo_url` = '/assets/brands/founders-school.jpg',
  `status` = 'published',
  `featured` = 1,
  `sort_order` = 1
WHERE `slug` = 'founder-school';

DELETE FROM `project_awards`
WHERE `award_id` = (SELECT `id` FROM `awards` WHERE `slug` = 'morph-payment-hackathon');

INSERT INTO `project_awards` (`project_id`, `award_id`, `sort_order`)
SELECT `projects`.`id`, `awards`.`id`, 0
FROM `projects`, `awards`
WHERE `projects`.`slug` = 'mandate402'
  AND `awards`.`slug` = 'morph-payment-hackathon';
