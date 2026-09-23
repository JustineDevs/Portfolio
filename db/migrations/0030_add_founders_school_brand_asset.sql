-- Register the Founder School mark and attach it to the published story milestone.

INSERT INTO `media_assets` (`slug`, `name`, `kind`, `file_name`, `mime_type`, `source_url`, `alt_text`, `width`, `height`, `status`)
VALUES
  ('brand.founders-school', 'Founder School', 'brand', 'founders-school.jpg', 'image/jpeg', '/assets/brands/founders-school.jpg', 'Founder School logo', 200, 200, 'published')
ON CONFLICT (`slug`) DO UPDATE SET
  `name` = excluded.`name`, `file_name` = excluded.`file_name`, `mime_type` = excluded.`mime_type`,
  `source_url` = excluded.`source_url`, `alt_text` = excluded.`alt_text`, `width` = excluded.`width`,
  `height` = excluded.`height`, `status` = excluded.`status`, `updated_at` = CURRENT_TIMESTAMP;
--> statement-breakpoint

INSERT INTO `asset_registry` (`semantic_key`, `label`, `category`, `asset_id`, `aliases_json`, `status`)
SELECT 'brand.founders-school', 'Founder School', 'brand', id, '[]', 'published'
FROM `media_assets` WHERE slug = 'brand.founders-school'
ON CONFLICT (`semantic_key`) DO UPDATE SET
  `label` = excluded.`label`, `category` = excluded.`category`, `asset_id` = excluded.`asset_id`,
  `aliases_json` = excluded.`aliases_json`, `status` = excluded.`status`, `updated_at` = CURRENT_TIMESTAMP;
--> statement-breakpoint

UPDATE `page_sections`
SET `meta_json` = json_set(
  `meta_json`,
  '$.entries[' || (
    SELECT `key` FROM json_each(`page_sections`.`meta_json`, '$.entries')
    WHERE json_extract(`value`, '$.id') = 'founders-direction'
  ) || '].logoKey',
  'brand.founders-school'
),
`updated_at` = CURRENT_TIMESTAMP
WHERE `page_key` = 'experience' AND `section_key` = 'progress'
  AND EXISTS (
    SELECT 1 FROM json_each(`page_sections`.`meta_json`, '$.entries')
    WHERE json_extract(`value`, '$.id') = 'founders-direction'
  );
