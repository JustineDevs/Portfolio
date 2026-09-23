-- The published project is now HyperKit Labs — HyperAgent. Remove the
-- archived legacy record's image references so the old thumbnail cannot leak
-- back into public cards or CMS-derived fallbacks.
UPDATE `projects`
SET `cover_image_url` = NULL,
    `banner_image_url` = NULL
WHERE `slug` = 'hyperagent'
  AND `status` = 'archived';
