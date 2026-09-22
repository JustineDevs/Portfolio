INSERT INTO `media_assets` (`slug`, `name`, `kind`, `file_name`, `mime_type`, `source_url`, `alt_text`, `status`)
VALUES
  ('hyperkit', 'HyperKit', 'brand', 'hyperkit.svg', 'image/svg+xml', '/assets/associates/hyperkit.svg', 'HyperKit logo', 'published'),
  ('project-one-percent', 'Project One Percent', 'brand', 'one-percent.jpg', 'image/jpeg', '/Logo/one percent/one percent.jpg', 'Project One Percent logo', 'published'),
  ('jstn', 'JSTN', 'brand', 'jstn-logo.svg', 'image/svg+xml', '/JSTN Logo/SVG/Logo Header - B.svg', 'JSTN logo', 'published'),
  ('justine-lupasi', 'Justine Lupasi', 'avatar', 'justine-lupasi.png', 'image/png', '/assets/hyperkit/justine-lupasi.png', 'Portrait of Justine Lupasi', 'published'),
  ('shun', 'Shun', 'avatar', 'avatar-shun.jpg', 'image/jpeg', '/Avatar-shun.jpg', 'Portrait of Shun', 'published'),
  ('hyperagent', 'HyperAgent', 'project', 'hyperagent.png', 'image/png', '/v2/showcase/HyperAgent.png', 'HyperAgent project mark', 'published'),
  ('universal-studios', 'Universal Studios', 'brand', 'uvs-logo.png', 'image/png', '/UVS/UVS_logo_landscape.png', 'Universal Studios logo', 'published')
ON CONFLICT (`slug`) DO UPDATE SET
  `source_url` = excluded.`source_url`,
  `alt_text` = excluded.`alt_text`,
  `status` = excluded.`status`,
  `updated_at` = CURRENT_TIMESTAMP;
--> statement-breakpoint
INSERT INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'brand.hyperkit', 'HyperKit', 'brand', id, '[]', 'published' FROM `media_assets` WHERE slug = 'hyperkit'
ON CONFLICT (`semantic_key`) DO UPDATE SET `asset_id` = excluded.`asset_id`, `status` = excluded.`status`, `updated_at` = CURRENT_TIMESTAMP;
--> statement-breakpoint
INSERT INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'brand.project-one-percent', 'Project One Percent', 'brand', id, '[]', 'published' FROM `media_assets` WHERE slug = 'project-one-percent'
ON CONFLICT (`semantic_key`) DO UPDATE SET `asset_id` = excluded.`asset_id`, `status` = excluded.`status`, `updated_at` = CURRENT_TIMESTAMP;
--> statement-breakpoint
INSERT INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'brand.jstn', 'JSTN', 'brand', id, '[]', 'published' FROM `media_assets` WHERE slug = 'jstn'
ON CONFLICT (`semantic_key`) DO UPDATE SET `asset_id` = excluded.`asset_id`, `status` = excluded.`status`, `updated_at` = CURRENT_TIMESTAMP;
--> statement-breakpoint
INSERT INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'avatar.justine-lupasi', 'Justine Lupasi', 'avatar', id, '[]', 'published' FROM `media_assets` WHERE slug = 'justine-lupasi'
ON CONFLICT (`semantic_key`) DO UPDATE SET `asset_id` = excluded.`asset_id`, `status` = excluded.`status`, `updated_at` = CURRENT_TIMESTAMP;
--> statement-breakpoint
INSERT INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'avatar.shun', 'Shun', 'avatar', id, '[]', 'published' FROM `media_assets` WHERE slug = 'shun'
ON CONFLICT (`semantic_key`) DO UPDATE SET `asset_id` = excluded.`asset_id`, `status` = excluded.`status`, `updated_at` = CURRENT_TIMESTAMP;
--> statement-breakpoint
INSERT INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'project.hyperagent', 'HyperAgent', 'project', id, '[]', 'published' FROM `media_assets` WHERE slug = 'hyperagent'
ON CONFLICT (`semantic_key`) DO UPDATE SET `asset_id` = excluded.`asset_id`, `status` = excluded.`status`, `updated_at` = CURRENT_TIMESTAMP;
--> statement-breakpoint
INSERT INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'brand.universal-studios', 'Universal Studios', 'brand', id, '[]', 'published' FROM `media_assets` WHERE slug = 'universal-studios'
ON CONFLICT (`semantic_key`) DO UPDATE SET `asset_id` = excluded.`asset_id`, `status` = excluded.`status`, `updated_at` = CURRENT_TIMESTAMP;
