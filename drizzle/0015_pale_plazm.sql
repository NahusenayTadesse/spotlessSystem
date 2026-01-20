ALTER TABLE `staff_schedule` ADD `week_day` tinyint NOT NULL;--> statement-breakpoint
ALTER TABLE `staff_schedule` ADD CONSTRAINT `real_days_only` CHECK (`staff_schedule`.`week_day` >= 0 AND `staff_schedule`.`week_day` <= 6);--> statement-breakpoint
ALTER TABLE `staff_schedule` DROP COLUMN `shift_date`;