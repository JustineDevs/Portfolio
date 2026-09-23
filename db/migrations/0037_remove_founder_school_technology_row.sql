-- Founder School is a direction milestone, not a technology-stack entry.

UPDATE `page_sections`
SET `meta_json` = json_set(
  `meta_json`,
  '$.entries[' || (
    SELECT `key` FROM json_each(`page_sections`.`meta_json`, '$.entries')
    WHERE json_extract(`value`, '$.id') = 'founders-direction'
  ) || '].icons',
  json_array()
),
`updated_at` = CURRENT_TIMESTAMP
WHERE `page_key` = 'experience' AND `section_key` = 'progress'
  AND EXISTS (
    SELECT 1 FROM json_each(`page_sections`.`meta_json`, '$.entries')
    WHERE json_extract(`value`, '$.id') = 'founders-direction'
  );
