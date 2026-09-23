UPDATE `page_sections`
SET `meta_json` = json_set(
  `meta_json`,
  '$.entries', json_array(
    json(json_extract(`meta_json`, '$.entries[0]')),
    json(json_extract(`meta_json`, '$.entries[1]')),
    json('{"id":"learning-path","year":"2024–25","company":"Independent practice","status":"LEARNING PATH","role":"Software foundations → AI and Web3","description":"June 2024 — C programming language fundamentals, memory management, and system programming. January 2025 — MySQL database fundamentals, SQL queries, and data management. February–March 2025 — Unreal Engine Blueprint visual scripting, HTML5 fundamentals, semantic markup, responsive design, Tailwind CSS utility classes, custom components, and responsive layouts. April 2025 — Java OOP concepts, data structures, basic algorithms, and Visual Basic .NET Windows Forms with database connectivity. May–June 2025 — Solidity smart contracts, DeFi protocols, Web3 integration, Python scripting, automation, and data manipulation. July–August 2025 — TypeScript, JavaScript, React, Node.js, Express.js, RESTful APIs, MongoDB, and Supabase backend services. Current — n8n workflow automation, LLM integration, and AI-powered processes.","logoUrl":null,"project":"Roadmap learning path","projectDescription":"A dated progression from programming and database fundamentals into full-stack, AI automation, and Web3 systems.","icons":[{"name":"C","key":"c"},{"name":"MySQL","key":"mysql"},{"name":"Unreal Engine","key":"unreal"},{"name":"HTML5","key":"html5"},{"name":"Tailwind CSS","key":"tailwind"},{"name":"Java","key":"java"},{"name":"Visual Basic","key":"visual-basic"},{"name":"Solidity","key":"solidity"},{"name":"Python","key":"python"},{"name":"TypeScript","key":"typescript"},{"name":"JavaScript","key":"javascript"},{"name":"React","key":"react"},{"name":"Node.js","key":"node"},{"name":"MongoDB","key":"mongo"},{"name":"Supabase","key":"supabase"},{"name":"n8n","key":"n8n"}]}'),
    json(json_extract(`meta_json`, '$.entries[2]')),
    json(json_extract(`meta_json`, '$.entries[3]'))
  )
),
`updated_at` = CURRENT_TIMESTAMP
WHERE `page_key` = 'experience'
  AND `section_key` = 'progress'
  AND json_extract(`meta_json`, '$.entries[2].id') = 'fullstack'
  AND NOT EXISTS (
    SELECT 1
    FROM json_each(`meta_json`, '$.entries')
    WHERE json_extract(json_each.value, '$.id') = 'learning-path'
  );
