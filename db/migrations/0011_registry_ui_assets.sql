ALTER TABLE `testimonials` ADD `avatar_asset_key` text;
--> statement-breakpoint

INSERT OR IGNORE INTO `media_assets` (`slug`, `name`, `kind`, `file_name`, `mime_type`, `source_url`, `alt_text`, `status`)
VALUES
  ('avatar-rommel-celestino', 'Rommel Celestino', 'avatar', 'Rommel Celestino.jpg', 'image/jpeg', '/v2/Testimonials/Rommel Celestino.jpg', 'Rommel Celestino', 'published'),
  ('avatar-shun', 'Shun', 'avatar', 'Avatar-shun.jpg', 'image/jpeg', '/Avatar-shun.jpg', 'Shun', 'published'),
  ('avatar-justine-mini', 'Justine Lupasi avatar', 'avatar', 'Avatar.png', 'image/png', '/Avatar.png', 'Justine Lupasi', 'published'),
  ('decorative-icon-pattern', 'Icon pattern', 'decorative', 'iconpattern.png', 'image/png', '/assets/demo/iconpattern.png', 'Decorative icon pattern', 'published');
--> statement-breakpoint

INSERT OR IGNORE INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'avatar.rommel-celestino', 'Rommel Celestino', 'avatar', id, '[]', 'published' FROM `media_assets` WHERE `slug` = 'avatar-rommel-celestino';
--> statement-breakpoint
INSERT OR IGNORE INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'avatar.shun', 'Shun', 'avatar', id, '[]', 'published' FROM `media_assets` WHERE `slug` = 'avatar-shun';
--> statement-breakpoint
INSERT OR IGNORE INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'avatar.justine-mini', 'Justine Lupasi avatar', 'avatar', id, '[]', 'published' FROM `media_assets` WHERE `slug` = 'avatar-justine-mini';
--> statement-breakpoint
INSERT OR IGNORE INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'decorative.icon-pattern', 'Icon pattern', 'decorative', id, '[]', 'published' FROM `media_assets` WHERE `slug` = 'decorative-icon-pattern';
--> statement-breakpoint

UPDATE `testimonials` SET `avatar_asset_key` = 'avatar.rommel-celestino' WHERE `avatar_url` LIKE '%Rommel Celestino%';
