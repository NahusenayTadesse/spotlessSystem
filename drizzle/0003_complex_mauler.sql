ALTER TABLE `product_adjustments` ADD `reason` varchar(255);--> statement-breakpoint
ALTER TABLE `product_adjustments` DROP COLUMN `notes`;--> statement-breakpoint
ALTER TABLE `supplies_adjustments` DROP COLUMN `notes`;