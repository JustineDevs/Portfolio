UPDATE `page_sections`
SET `meta_json` = json_set(
  `meta_json`,
  '$.entries[2].role', 'Software Developer',
  '$.entries[2].description', 'Building Go-Mirofish, a local-first swarm intelligence engine that turns documents into simulations and prediction reports.',
  '$.entries[2].projectDescription', 'A Go-native swarm intelligence engine with a Vue interface for local prediction workflows.',
  '$.entries[2].icons', json('[{"name":"Go","key":"go"},{"name":"Vue.js","key":"vue"},{"name":"Vite","key":"vite"}]')
),
`updated_at` = CURRENT_TIMESTAMP
WHERE `page_key` = 'experience'
  AND `section_key` = 'progress'
  AND json_extract(`meta_json`, '$.entries[2].project') = 'Go-Mirofish';
