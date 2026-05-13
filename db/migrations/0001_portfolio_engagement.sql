CREATE TABLE `portfolio_heart_visitors` (
	`visitor_id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portfolio_site_stats` (
	`id` integer PRIMARY KEY NOT NULL,
	`total_views` integer DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `portfolio_site_stats` (`id`, `total_views`, `updated_at`) VALUES (1, 0, CURRENT_TIMESTAMP) ON CONFLICT(`id`) DO NOTHING;
