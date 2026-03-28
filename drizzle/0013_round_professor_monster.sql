ALTER TABLE `leave` DROP FOREIGN KEY `leave_user_id_user_id_fk`;
--> statement-breakpoint
ALTER TABLE `site_monthly_payments` DROP FOREIGN KEY `site_monthly_payments_user_id_user_id_fk`;
--> statement-breakpoint
ALTER TABLE `leave` MODIFY COLUMN `user_id` varchar(255);--> statement-breakpoint
ALTER TABLE `site_monthly_payments` MODIFY COLUMN `user_id` varchar(255);--> statement-breakpoint
ALTER TABLE `leave` ADD CONSTRAINT `leave_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_monthly_payments` ADD CONSTRAINT `site_monthly_payments_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;