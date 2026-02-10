ALTER TABLE `site` ADD `include_vat` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `site` ADD `site_commission` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `employee` DROP COLUMN `religion`;--> statement-breakpoint
ALTER TABLE `site` DROP COLUMN `includeVat`;--> statement-breakpoint
ALTER TABLE `site` DROP COLUMN `siteCommission`;