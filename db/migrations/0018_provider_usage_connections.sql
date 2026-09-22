CREATE TABLE `provider_connections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`provider` text NOT NULL,
	`external_account_id` text NOT NULL,
	`account_label` text NOT NULL,
	`account_email` text,
	`connection_ref` text,
	`scopes_json` text DEFAULT '[]' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`include_in_rollup` integer DEFAULT true NOT NULL,
	`last_synced_at` text,
	`last_error` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `provider_connections_account_unique` ON `provider_connections` (`provider`,`external_account_id`);
--> statement-breakpoint
CREATE INDEX `provider_connections_provider_idx` ON `provider_connections` (`provider`);
--> statement-breakpoint
CREATE INDEX `provider_connections_status_idx` ON `provider_connections` (`status`);
--> statement-breakpoint
CREATE TABLE `provider_usage_snapshots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`connection_id` integer NOT NULL,
	`period_date` text NOT NULL,
	`total_tokens` integer DEFAULT 0 NOT NULL,
	`cached_tokens` integer DEFAULT 0 NOT NULL,
	`estimated_cost` real DEFAULT 0 NOT NULL,
	`source_hash` text,
	`synced_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`connection_id`) REFERENCES `provider_connections`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `provider_usage_snapshots_connection_date_unique` ON `provider_usage_snapshots` (`connection_id`,`period_date`);
--> statement-breakpoint
CREATE INDEX `provider_usage_snapshots_connection_idx` ON `provider_usage_snapshots` (`connection_id`);
--> statement-breakpoint
CREATE INDEX `provider_usage_snapshots_period_date_idx` ON `provider_usage_snapshots` (`period_date`);
