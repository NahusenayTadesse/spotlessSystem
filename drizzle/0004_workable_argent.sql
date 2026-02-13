CREATE TABLE `payroll_receipts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`payroll_run_id` int,
	`pay_period_start` date NOT NULL,
	`pay_period_end` date NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`paid_date` date NOT NULL,
	`number_of_employees` int NOT NULL,
	`reciept_link` varchar(255),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `payroll_receipts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `payroll_entries` MODIFY COLUMN `month` enum('መስከረም','ጥቅምት','ህዳር','ታህሳስ','ጥር','የካቲት','መጋቢት','ሚያዝያ','ግንቦት','ሰኔ','ሐምሌ','ነሐሴ') NOT NULL;--> statement-breakpoint
ALTER TABLE `payroll_entries` ADD `transport_allowance` decimal(10,2);--> statement-breakpoint
ALTER TABLE `payroll_entries` ADD `position_allowance` decimal(10,2);--> statement-breakpoint
ALTER TABLE `payroll_entries` ADD `housing_allowance` decimal(10,2);--> statement-breakpoint
ALTER TABLE `payroll_entries` ADD `non_taxable_allowance` decimal(10,2);--> statement-breakpoint
ALTER TABLE `payroll_entries` ADD `gross_amount` decimal(10,2);--> statement-breakpoint
ALTER TABLE `payroll_receipts` ADD CONSTRAINT `payroll_receipts_payroll_run_id_payroll_runs_id_fk` FOREIGN KEY (`payroll_run_id`) REFERENCES `payroll_runs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_receipts` ADD CONSTRAINT `payroll_receipts_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_receipts` ADD CONSTRAINT `payroll_receipts_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_receipts` ADD CONSTRAINT `payroll_receipts_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_runs` DROP COLUMN `pay_period_start`;--> statement-breakpoint
ALTER TABLE `payroll_runs` DROP COLUMN `pay_period_end`;--> statement-breakpoint
ALTER TABLE `payroll_runs` DROP COLUMN `payment_date`;--> statement-breakpoint
ALTER TABLE `payroll_runs` DROP COLUMN `status`;