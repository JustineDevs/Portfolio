ALTER TABLE `provider_usage_snapshots` ADD COLUMN `cost_currency` text NOT NULL DEFAULT 'USD';
ALTER TABLE `provider_usage_snapshots` ADD COLUMN `original_cost` real;
ALTER TABLE `provider_usage_snapshots` ADD COLUMN `original_currency` text;
ALTER TABLE `provider_usage_snapshots` ADD COLUMN `exchange_rate_to_usd` real;
