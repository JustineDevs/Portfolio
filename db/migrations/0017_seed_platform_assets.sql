INSERT OR IGNORE INTO `media_assets` (`slug`, `name`, `kind`, `file_name`, `mime_type`, `source_url`, `alt_text`, `status`)
VALUES
  ('platform-1', 'Platform logo 1', 'brand', 'platform-1.svg', 'image/svg+xml', 'https://cdn.brandfetch.io/idsSceG8fK/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B', 'Platform development logo', 'published'),
  ('platform-2', 'Platform logo 2', 'brand', 'platform-2.svg', 'image/svg+xml', 'https://cdn.brandfetch.io/idJ3Cg8ymG/theme/dark/idRpwHe9Zf.svg?c=1dxbfHSJFAPEGdCLU4o5B', 'Platform development logo', 'published'),
  ('platform-3', 'Platform logo 3', 'brand', 'platform-3.svg', 'image/svg+xml', 'https://cdn.brandfetch.io/idFEnp00Rl/theme/dark/idXGMr_wi3.svg?c=1dxbfHSJFAPEGdCLU4o5B', 'Platform development logo', 'published'),
  ('platform-4', 'Platform logo 4', 'brand', 'platform-4.svg', 'image/svg+xml', 'https://cdn.brandfetch.io/idTVdakwPY/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B', 'Platform development logo', 'published'),
  ('platform-5', 'Platform logo 5', 'brand', 'platform-5.svg', 'image/svg+xml', 'https://cdn.brandfetch.io/idDpCfN4VD/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B', 'Platform development logo', 'published'),
  ('platform-6', 'Platform logo 6', 'brand', 'platform-6.svg', 'image/svg+xml', 'https://cdn.brandfetch.io/id0BqaqET6/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B', 'Platform development logo', 'published'),
  ('platform-7', 'Google Cloud', 'brand', 'platform-7.svg', 'image/svg+xml', 'https://cdn.brandfetch.io/id6O2oGzv-/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B', 'Google Cloud', 'published'),
  ('platform-8', 'Platform logo 8', 'brand', 'platform-8.svg', 'image/svg+xml', 'https://cdn.brandfetch.io/id8LeMTX5r/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B', 'Platform development logo', 'published');
--> statement-breakpoint
INSERT OR IGNORE INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'brand.platform-1', 'Platform logo 1', 'brand', id, '[]', 'published' FROM `media_assets` WHERE slug = 'platform-1';
--> statement-breakpoint
INSERT OR IGNORE INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'brand.platform-2', 'Platform logo 2', 'brand', id, '[]', 'published' FROM `media_assets` WHERE slug = 'platform-2';
--> statement-breakpoint
INSERT OR IGNORE INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'brand.platform-3', 'Platform logo 3', 'brand', id, '[]', 'published' FROM `media_assets` WHERE slug = 'platform-3';
--> statement-breakpoint
INSERT OR IGNORE INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'brand.platform-4', 'Platform logo 4', 'brand', id, '[]', 'published' FROM `media_assets` WHERE slug = 'platform-4';
--> statement-breakpoint
INSERT OR IGNORE INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'brand.platform-5', 'Platform logo 5', 'brand', id, '[]', 'published' FROM `media_assets` WHERE slug = 'platform-5';
--> statement-breakpoint
INSERT OR IGNORE INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'brand.platform-6', 'Platform logo 6', 'brand', id, '[]', 'published' FROM `media_assets` WHERE slug = 'platform-6';
--> statement-breakpoint
INSERT OR IGNORE INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'brand.platform-7', 'Google Cloud', 'brand', id, '[]', 'published' FROM `media_assets` WHERE slug = 'platform-7';
--> statement-breakpoint
INSERT OR IGNORE INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'brand.platform-8', 'Platform logo 8', 'brand', id, '[]', 'published' FROM `media_assets` WHERE slug = 'platform-8';
