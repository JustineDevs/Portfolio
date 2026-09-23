-- The Go-Mirofish-led independent practice milestone belongs to 2026.

UPDATE `page_sections`
SET `meta_json` = json_set(
  `meta_json`,
  '$.entries[' || (
    SELECT `key` FROM json_each(`page_sections`.`meta_json`, '$.entries')
    WHERE json_extract(`value`, '$.id') = 'fullstack'
  ) || '].year',
  '2026'
),
`updated_at` = CURRENT_TIMESTAMP
WHERE `page_key` = 'experience' AND `section_key` = 'progress'
  AND EXISTS (
    SELECT 1 FROM json_each(`page_sections`.`meta_json`, '$.entries')
    WHERE json_extract(`value`, '$.id') = 'fullstack'
  );
