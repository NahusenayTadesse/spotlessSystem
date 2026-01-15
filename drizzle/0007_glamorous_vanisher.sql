ALTER TABLE `employment_statuses` ADD `termination_status` boolean;--> statement-breakpoint
ALTER TABLE `employment_statuses` ADD CONSTRAINT `termination_status_idx` UNIQUE(`termination_status`);--> statement-breakpoint
ALTER TABLE `employment_statuses` DROP COLUMN `status`;