ALTER TABLE `provider_usage_snapshots` ADD COLUMN `token_count_kind` text NOT NULL DEFAULT 'exact';
ALTER TABLE `provider_usage_snapshots` ADD COLUMN `model_breakdown` text;
