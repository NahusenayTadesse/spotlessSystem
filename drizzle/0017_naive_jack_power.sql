CREATE TABLE `missing_days` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int NOT NULL,
	`day` date NOT NULL,
	`reason` varchar(255) NOT NULL,
	`deductable` boolean NOT NULL DEFAULT false,
	`deductable_amount` decimal(10,2),
	`approval` enum('pending','approved','rejected') NOT NULL DEFAULT 'approved',
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `missing_days_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `missing_days` ADD CONSTRAINT `missing_days_staff_id_employee_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `employee`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `missing_days` ADD CONSTRAINT `missing_days_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `missing_days` ADD CONSTRAINT `missing_days_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `missing_days` ADD CONSTRAINT `missing_days_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;