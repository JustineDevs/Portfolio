CREATE TABLE `awards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`event_name` text NOT NULL,
	`description` text NOT NULL,
	`award_type` text,
	`year` text NOT NULL,
	`proof_url` text,
	`logo_url` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `awards_slug_unique` ON `awards` (`slug`);--> statement-breakpoint
CREATE INDEX `awards_status_idx` ON `awards` (`status`);--> statement-breakpoint
CREATE TABLE `github_activity_snapshots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`year` integer NOT NULL,
	`payload_json` text NOT NULL,
	`source_hash` text,
	`fetched_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `github_activity_snapshots_year_idx` ON `github_activity_snapshots` (`year`);--> statement-breakpoint
CREATE TABLE `highlights` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`highlight_type` text DEFAULT 'custom' NOT NULL,
	`target_id` integer,
	`title_override` text,
	`summary_override` text,
	`image_url_override` text,
	`link_override` text,
	`pinned` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `highlights_status_idx` ON `highlights` (`status`);--> statement-breakpoint
CREATE INDEX `highlights_pinned_idx` ON `highlights` (`pinned`);--> statement-breakpoint
CREATE TABLE `page_sections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`page_key` text NOT NULL,
	`section_key` text NOT NULL,
	`title` text,
	`subtitle` text,
	`body_md` text,
	`meta_json` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `page_sections_page_section_unique` ON `page_sections` (`page_key`,`section_key`);--> statement-breakpoint
CREATE INDEX `page_sections_status_idx` ON `page_sections` (`status`);--> statement-breakpoint
CREATE TABLE `posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`body_md` text,
	`post_type` text DEFAULT 'native' NOT NULL,
	`source_platform` text,
	`canonical_url` text,
	`cover_image_url` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` text,
	`featured` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `posts_status_idx` ON `posts` (`status`);--> statement-breakpoint
CREATE INDEX `posts_type_idx` ON `posts` (`post_type`);--> statement-breakpoint
CREATE TABLE `project_awards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`award_id` integer NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`award_id`) REFERENCES `awards`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `project_awards_project_idx` ON `project_awards` (`project_id`);--> statement-breakpoint
CREATE INDEX `project_awards_award_idx` ON `project_awards` (`award_id`);--> statement-breakpoint
CREATE TABLE `project_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`type` text NOT NULL,
	`label` text,
	`url` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `project_links_project_idx` ON `project_links` (`project_id`);--> statement-breakpoint
CREATE TABLE `project_networks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`network` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `project_networks_project_idx` ON `project_networks` (`project_id`);--> statement-breakpoint
CREATE TABLE `project_responsibilities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`responsibility` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `project_responsibilities_project_idx` ON `project_responsibilities` (`project_id`);--> statement-breakpoint
CREATE TABLE `project_tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`tag` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `project_tags_project_idx` ON `project_tags` (`project_id`);--> statement-breakpoint
CREATE TABLE `project_technologies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`technology` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `project_technologies_project_idx` ON `project_technologies` (`project_id`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`body_md` text,
	`category` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` text,
	`featured` integer DEFAULT false NOT NULL,
	`cover_image_url` text,
	`banner_image_url` text,
	`author_name` text NOT NULL,
	`author_url` text,
	`website_url` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);--> statement-breakpoint
CREATE INDEX `projects_status_idx` ON `projects` (`status`);--> statement-breakpoint
CREATE INDEX `projects_featured_idx` ON `projects` (`featured`);--> statement-breakpoint
CREATE TABLE `site_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value_json` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`role` text,
	`company` text,
	`quote` text NOT NULL,
	`avatar_url` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `testimonials_status_idx` ON `testimonials` (`status`);