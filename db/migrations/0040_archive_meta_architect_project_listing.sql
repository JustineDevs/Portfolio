UPDATE `projects`
SET `status` = 'archived', `updated_at` = CURRENT_TIMESTAMP
WHERE `slug` = 'meta-architect';
