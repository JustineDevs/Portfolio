ALTER TABLE `highlights` ADD `placement_key` text;
--> statement-breakpoint
CREATE INDEX `highlights_placement_idx` ON `highlights` (`placement_key`);
