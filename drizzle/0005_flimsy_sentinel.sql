ALTER TABLE `address` MODIFY COLUMN `subcity_id` int;--> statement-breakpoint
ALTER TABLE `address` ADD `other_subcity` varchar(50);--> statement-breakpoint
CREATE INDEX `period_idx` ON `commissions_services` (`year`,`month`);