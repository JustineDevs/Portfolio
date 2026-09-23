UPDATE `page_sections`
SET `meta_json` = json_set(
  `meta_json`,
  '$.entries',
  (
    SELECT json_group_array(
      CASE json_extract(value, '$.id')
        WHEN 'fullstack' THEN json_set(value, '$.company', 'Product Engineering')
        WHEN 'founders-direction' THEN json_set(value, '$.company', 'Founder School & Client Work')
        WHEN 'learning-path' THEN json_set(value, '$.company', 'Technical Learning Path')
        WHEN 'hackathon-leadership' THEN json_set(value, '$.company', 'Hackathon Leadership')
        WHEN 'foundation' THEN json_set(value, '$.company', 'Software Foundations')
        WHEN 'builder-pivot' THEN json_set(value, '$.company', 'Independent Builder')
        ELSE value
      END
    )
    FROM json_each(`meta_json`, '$.entries')
  )
)
WHERE `page_key` = 'experience' AND `section_key` = 'progress';
