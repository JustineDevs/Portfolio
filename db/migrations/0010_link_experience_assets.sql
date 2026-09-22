UPDATE `page_sections`
SET `meta_json` = json_set(
  json_set(`meta_json`, '$.entries[0].logoKey', 'brand.hyperkit'),
  '$.entries[1].logoKey', 'project.hyperagent'
), `updated_at` = CURRENT_TIMESTAMP
WHERE `page_key` = 'experience' AND `section_key` = 'progress';
