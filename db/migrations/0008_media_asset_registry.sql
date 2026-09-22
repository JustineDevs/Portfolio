CREATE TABLE `media_assets` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `slug` text NOT NULL,
  `name` text NOT NULL,
  `kind` text DEFAULT 'brand' NOT NULL,
  `file_name` text NOT NULL,
  `mime_type` text NOT NULL,
  `source_url` text,
  `data_url` text,
  `alt_text` text DEFAULT '' NOT NULL,
  `width` integer,
  `height` integer,
  `checksum` text,
  `status` text DEFAULT 'draft' NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_assets_slug_unique` ON `media_assets` (`slug`);
--> statement-breakpoint
CREATE INDEX `media_assets_status_idx` ON `media_assets` (`status`);
--> statement-breakpoint
CREATE INDEX `media_assets_kind_idx` ON `media_assets` (`kind`);
--> statement-breakpoint
CREATE TABLE `asset_registry` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `semantic_key` text NOT NULL,
  `label` text NOT NULL,
  `category` text NOT NULL,
  `asset_id` integer NOT NULL REFERENCES `media_assets`(`id`) ON DELETE restrict,
  `aliases_json` text DEFAULT '[]' NOT NULL,
  `status` text DEFAULT 'draft' NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `asset_registry_semantic_key_unique` ON `asset_registry` (`semantic_key`);
--> statement-breakpoint
CREATE INDEX `asset_registry_asset_idx` ON `asset_registry` (`asset_id`);
--> statement-breakpoint
CREATE INDEX `asset_registry_status_idx` ON `asset_registry` (`status`);
