ALTER TABLE `admin_users` ADD `auth_provider` text DEFAULT 'credentials' NOT NULL;
--> statement-breakpoint
ALTER TABLE `admin_users` ADD `provider_subject` text;
--> statement-breakpoint
ALTER TABLE `admin_users` ADD `last_login_at` text;
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_provider_subject_unique` ON `admin_users` (`provider_subject`);
--> statement-breakpoint
CREATE INDEX `admin_users_auth_provider_idx` ON `admin_users` (`auth_provider`);
