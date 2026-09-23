-- Store project collaborators as typed project links so each author retains an individual GitHub URL.
DELETE FROM `project_links`
WHERE `type` = 'author'
  AND `project_id` IN (SELECT `id` FROM `projects` WHERE `slug` IN ('hyperagent', 'mandate402'));
--> statement-breakpoint

INSERT INTO `project_links` (`project_id`, `type`, `label`, `url`, `sort_order`)
SELECT `id`, 'author', 'JustineDevs', 'https://github.com/JustineDevs/', 0 FROM `projects` WHERE `slug` = 'hyperagent'
UNION ALL SELECT `id`, 'author', 'Aaron Sopeña', 'https://github.com/ArhonJay', 1 FROM `projects` WHERE `slug` = 'hyperagent'
UNION ALL SELECT `id`, 'author', 'Tristan Triñanes', 'https://github.com/Tristan-T-Dev', 2 FROM `projects` WHERE `slug` = 'hyperagent'
UNION ALL SELECT `id`, 'author', 'JustineDevs', 'https://github.com/JustineDevs/', 0 FROM `projects` WHERE `slug` = 'mandate402'
UNION ALL SELECT `id`, 'author', 'Sherwin Limosnero', 'https://github.com/owenlim225', 1 FROM `projects` WHERE `slug` = 'mandate402'
UNION ALL SELECT `id`, 'author', 'John Abrahm Zapico', 'https://github.com/bam841', 2 FROM `projects` WHERE `slug` = 'mandate402'
UNION ALL SELECT `id`, 'author', 'Jay Parker', 'https://github.com/automatewithedward', 3 FROM `projects` WHERE `slug` = 'mandate402';
