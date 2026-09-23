-- Turn the published journey into meaningful milestones backed by the same CMS section.

UPDATE `page_sections`
SET `meta_json` = json_set(
  json_set(`meta_json`, '$.entries[0].description', 'Joined a three-person team to build developer infrastructure for smart contracts, then continued shaping AI-assisted generation, auditing, and practical product workflows.'),
  '$.entries[0].projectDescription', 'Developer infrastructure and AI-native tooling shaped through hackathon building, team leadership, and continued independent development.'
)
WHERE `page_key` = 'experience' AND `section_key` = 'progress'
  AND json_extract(`meta_json`, '$.entries[0].id') = 'hyperkit';
--> statement-breakpoint

UPDATE `page_sections`
SET `meta_json` = json_insert(`meta_json`, '$.entries[#]', json_object(
  'id', 'founders-direction', 'year', '2026', 'company', 'Independent practice', 'status', 'DIRECTION', 'role', 'Founder / Product Engineer',
  'description', 'Studied purpose, validation, MVP building, and fundraising through Founders School, then led a Morph payment hackathon team while exploring freelance product work.',
  'logoUrl', NULL, 'project', 'Founders School → client work', 'projectDescription', 'Turning technical execution into clearer product choices, stronger collaboration, and useful software for real clients.',
  'icons', json_array(json_object('name', 'TypeScript', 'key', 'typescript'), json_object('name', 'React', 'key', 'react'), json_object('name', 'AI workflows', 'key', 'ai-workflows'))
))
WHERE `page_key` = 'experience' AND `section_key` = 'progress'
  AND NOT EXISTS (SELECT 1 FROM json_each(`meta_json`, '$.entries') WHERE json_extract(json_each.value, '$.id') = 'founders-direction');
--> statement-breakpoint

UPDATE `page_sections`
SET `meta_json` = json_insert(`meta_json`, '$.entries[#]', json_object(
  'id', 'hackathon-leadership', 'year', '2025', 'company', 'Independent practice', 'status', 'LEADERSHIP', 'role', 'Hackathon Builder / Project Lead',
  'description', 'Moved from smart-contract and UI work into leading teams, defining roadmaps, documenting systems, shaping MVPs, and shipping under pressure.',
  'logoUrl', NULL, 'project', 'HyperHack → Hack2Build → Morph', 'projectDescription', 'A sequence of team-building and leadership milestones: HyperHack placement, an Avalanche x402 win, and a Morph team led through delivery.',
  'icons', json_array(json_object('name', 'Solidity', 'key', 'solidity'), json_object('name', 'React', 'key', 'react'), json_object('name', 'TypeScript', 'key', 'typescript'), json_object('name', 'EVM', 'key', 'evm'))
))
WHERE `page_key` = 'experience' AND `section_key` = 'progress'
  AND NOT EXISTS (SELECT 1 FROM json_each(`meta_json`, '$.entries') WHERE json_extract(json_each.value, '$.id') = 'hackathon-leadership');
--> statement-breakpoint

UPDATE `page_sections`
SET `meta_json` = json_insert(`meta_json`, '$.entries[#]', json_object(
  'id', 'builder-pivot', 'year', '2024', 'company', 'Independent practice', 'status', 'PIVOT', 'role', 'Student → Independent Builder',
  'description', 'Left a BSIT program when its curriculum no longer matched the problems being pursued, then chose to learn by shipping secure tools and studying smart-contract architecture.',
  'logoUrl', NULL, 'project', 'MetaWalletGen-CLI', 'projectDescription', 'A secure Ethereum wallet-generation CLI with encrypted storage, flexible exports, and a focus on safer infrastructure.',
  'icons', json_array(json_object('name', 'Node.js', 'key', 'node'), json_object('name', 'TypeScript', 'key', 'typescript'), json_object('name', 'Cryptography', 'key', 'cryptography'))
))
WHERE `page_key` = 'experience' AND `section_key` = 'progress'
  AND NOT EXISTS (SELECT 1 FROM json_each(`meta_json`, '$.entries') WHERE json_extract(json_each.value, '$.id') = 'builder-pivot');
--> statement-breakpoint

UPDATE `page_sections`
SET `meta_json` = json_insert(`meta_json`, '$.entries[#]', json_object(
  'id', 'community-beginnings', 'year', '2022–24', 'company', 'Project One Percent', 'status', 'FOUNDATION', 'role', 'Volunteer Discord Moderator → Community Builder',
  'description', 'Entered Web3 through volunteer community work, built relationships through events, and found the people and encouragement that opened the path toward Solidity and software development.',
  'logoKey', 'brand.project-one-percent', 'logoUrl', NULL, 'project', 'Project One Percent', 'projectDescription', 'The community starting point: moderation, presence-building, peer learning, and the relationships behind the later builder journey.',
  'icons', json_array(json_object('name', 'Community', 'key', 'community'), json_object('name', 'Web3', 'key', 'web3'))
))
WHERE `page_key` = 'experience' AND `section_key` = 'progress'
  AND NOT EXISTS (SELECT 1 FROM json_each(`meta_json`, '$.entries') WHERE json_extract(json_each.value, '$.id') = 'community-beginnings');
