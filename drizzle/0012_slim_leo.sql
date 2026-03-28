ALTER TABLE `leave` DROP FOREIGN KEY `leave_signing_officer_employee_id_fk`;
--> statement-breakpoint
ALTER TABLE `leave` ADD `user_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `leave` ADD CONSTRAINT `leave_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leave` DROP COLUMN `signing_officer`;