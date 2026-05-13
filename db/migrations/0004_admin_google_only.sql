CREATE TABLE `admin_users__new` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email_hash` text NOT NULL,
	`email_encrypted` text NOT NULL,
	`provider_subject` text,
	`role` text DEFAULT 'admin' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`last_login_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `admin_users__new` (
	`id`,
	`email_hash`,
	`email_encrypted`,
	`provider_subject`,
	`role`,
	`status`,
	`last_login_at`,
	`created_at`,
	`updated_at`
)
SELECT
	`id`,
	`email_hash`,
	`email_encrypted`,
	`provider_subject`,
	`role`,
	`status`,
	`last_login_at`,
	`created_at`,
	`updated_at`
FROM `admin_users`;
--> statement-breakpoint
DROP TABLE `admin_users`;
--> statement-breakpoint
ALTER TABLE `admin_users__new` RENAME TO `admin_users`;
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_email_hash_unique` ON `admin_users` (`email_hash`);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_provider_subject_unique` ON `admin_users` (`provider_subject`);
--> statement-breakpoint
CREATE INDEX `admin_users_status_idx` ON `admin_users` (`status`);
