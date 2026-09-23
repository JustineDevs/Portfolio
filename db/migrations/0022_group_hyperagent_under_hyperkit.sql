UPDATE `page_sections`
SET `meta_json` = json_set(`meta_json`, '$.entries[1].company', 'HyperKit Labs'),
    `updated_at` = CURRENT_TIMESTAMP
WHERE `page_key` = 'experience'
  AND `section_key` = 'progress'
  AND json_extract(`meta_json`, '$.entries[1].id') = 'hyperagent'
  AND json_extract(`meta_json`, '$.entries[1].company') = 'HyperAgent';
