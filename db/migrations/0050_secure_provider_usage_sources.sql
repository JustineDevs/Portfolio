CREATE TABLE `provider_usage_sources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source_key` text NOT NULL,
	`provider` text NOT NULL,
	`surface` text NOT NULL,
	`authority` text NOT NULL,
	`schema_version` integer DEFAULT 1 NOT NULL,
	`timezone` text DEFAULT 'UTC' NOT NULL,
	`coverage_start` text,
	`coverage_end` text,
	`last_source_hash` text,
	`status` text DEFAULT 'partial' NOT NULL,
	`last_validated_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `provider_usage_sources_source_key_unique` ON `provider_usage_sources` (`source_key`);
--> statement-breakpoint
CREATE INDEX `provider_usage_sources_provider_idx` ON `provider_usage_sources` (`provider`);
--> statement-breakpoint
CREATE INDEX `provider_usage_sources_status_idx` ON `provider_usage_sources` (`status`);
--> statement-breakpoint
ALTER TABLE `provider_usage_snapshots` ADD COLUMN `source_id` integer REFERENCES `provider_usage_sources`(`id`) ON UPDATE no action ON DELETE set null;
--> statement-breakpoint
CREATE INDEX `provider_usage_snapshots_source_idx` ON `provider_usage_snapshots` (`source_id`);
