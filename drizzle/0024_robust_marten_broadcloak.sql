CREATE TABLE `payment_request` (
	`id` int AUTO_INCREMENT NOT NULL,
	`site_id` int NOT NULL,
	`contract_id` int NOT NULL,
	`invoice_number` varchar(255) NOT NULL,
	`request_date` date NOT NULL,
	`vat` decimal(10,2) NOT NULL DEFAULT '15',
	`withholding` decimal(10,2) NOT NULL DEFAULT '3',
	`amount` decimal(10,2) NOT NULL,
	`month` enum('መስከረም','ጥቅምት','ህዳር','ታህሳስ','ጥር','የካቲት','መጋቢት','ሚያዝያ','ግንቦት','ሰኔ','ሐምሌ','ነሐሴ') NOT NULL,
	`year` year NOT NULL,
	`penality` decimal(10,2) NOT NULL DEFAULT '0',
	`requested_by` int,
	`approved_by` int,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `payment_request_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_payment_per_month` UNIQUE(`contract_id`,`month`,`year`)
);
--> statement-breakpoint
ALTER TABLE `over_time_type` ADD `max_hours` int;--> statement-breakpoint
ALTER TABLE `payment_request` ADD CONSTRAINT `payment_request_site_id_site_id_fk` FOREIGN KEY (`site_id`) REFERENCES `site`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment_request` ADD CONSTRAINT `payment_request_contract_id_site_contracts_id_fk` FOREIGN KEY (`contract_id`) REFERENCES `site_contracts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment_request` ADD CONSTRAINT `payment_request_requested_by_employee_id_fk` FOREIGN KEY (`requested_by`) REFERENCES `employee`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment_request` ADD CONSTRAINT `payment_request_approved_by_employee_id_fk` FOREIGN KEY (`approved_by`) REFERENCES `employee`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment_request` ADD CONSTRAINT `payment_request_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment_request` ADD CONSTRAINT `payment_request_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment_request` ADD CONSTRAINT `payment_request_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;