-- Keep the builder milestone grounded in the smart-contract language it documents.

UPDATE `page_sections`
SET `meta_json` = json_set(
  `meta_json`,
  '$.entries[' || (
    SELECT `key` FROM json_each(`page_sections`.`meta_json`, '$.entries')
    WHERE json_extract(`value`, '$.id') = 'builder-pivot'
  ) || '].icons',
  json_array(
    json_object('name', 'Node.js', 'key', 'node'),
    json_object('name', 'TypeScript', 'key', 'typescript'),
    json_object('name', 'Solidity', 'key', 'solidity')
  )
),
`updated_at` = CURRENT_TIMESTAMP
WHERE `page_key` = 'experience' AND `section_key` = 'progress'
  AND EXISTS (
    SELECT 1 FROM json_each(`page_sections`.`meta_json`, '$.entries')
    WHERE json_extract(`value`, '$.id') = 'builder-pivot'
  );
