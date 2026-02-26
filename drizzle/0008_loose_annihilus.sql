CREATE TABLE `office_worker_commission` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `office_worker_commission_id` PRIMARY KEY(`id`),
	CONSTRAINT `office_worker_commission_staff_id_unique` UNIQUE(`staff_id`)
);
--> statement-breakpoint
CREATE TABLE `site_contracts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`contract_amount` decimal(10,2) NOT NULL,
	`service_id` int,
	`contract_year` year NOT NULL,
	`contract_date` date NOT NULL,
	`start_date` date NOT NULL,
	`end_date` date NOT NULL,
	`contract_file` varchar(255) NOT NULL,
	`commission_considered` boolean NOT NULL DEFAULT true,
	`signing_officer` int,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `site_contracts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_monthly_payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contract_id` int NOT NULL,
	`payment_request_file` varchar(255) NOT NULL,
	`penalty_amount` decimal(10,2) NOT NULL DEFAULT '0',
	`fs_number` varchar(255) NOT NULL,
	`invoice_number` varchar(255) NOT NULL,
	`request_amount` decimal(10,2) NOT NULL,
	`payment_amount` decimal(10,2) NOT NULL,
	`before_Vat` decimal(10,2) NOT NULL,
	`vat` decimal(10,2) NOT NULL,
	`withhold_amount` decimal(10,2) NOT NULL,
	`withhold_file` varchar(255) NOT NULL,
	`month` enum('መስከረም','ጥቅምት','ህዳር','ታህሳስ','ጥር','የካቲት','መጋቢት','ሚያዝያ','ግንቦት','ሰኔ','ሐምሌ','ነሐሴ') NOT NULL,
	`year` year NOT NULL,
	`date` date NOT NULL,
	`transaction_id` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `site_monthly_payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_penalties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contract_id` int NOT NULL,
	`penalty_type` varchar(255) NOT NULL,
	`penalty_letter` varchar(255),
	`penalty_amount` decimal(10,2) NOT NULL,
	`penalty_date` date NOT NULL,
	`month` enum('መስከረም','ጥቅምት','ህዳር','ታህሳስ','ጥር','የካቲት','መጋቢት','ሚያዝያ','ግንቦት','ሰኔ','ሐምሌ','ነሐሴ') NOT NULL,
	`year` year NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `site_penalties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `salaries` RENAME COLUMN `end_date` TO `end_date `;--> statement-breakpoint
ALTER TABLE `employee` MODIFY COLUMN `tin_no` varchar(10);--> statement-breakpoint
ALTER TABLE `site` ADD `service_id` int;--> statement-breakpoint
ALTER TABLE `office_worker_commission` ADD CONSTRAINT `office_worker_commission_staff_id_employee_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `employee`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `office_worker_commission` ADD CONSTRAINT `office_worker_commission_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `office_worker_commission` ADD CONSTRAINT `office_worker_commission_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `office_worker_commission` ADD CONSTRAINT `office_worker_commission_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_contracts` ADD CONSTRAINT `site_contracts_customer_id_site_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `site`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_contracts` ADD CONSTRAINT `site_contracts_service_id_services_id_fk` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_contracts` ADD CONSTRAINT `site_contracts_signing_officer_employee_id_fk` FOREIGN KEY (`signing_officer`) REFERENCES `employee`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_contracts` ADD CONSTRAINT `site_contracts_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_contracts` ADD CONSTRAINT `site_contracts_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_contracts` ADD CONSTRAINT `site_contracts_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_monthly_payments` ADD CONSTRAINT `site_monthly_payments_contract_id_site_contracts_id_fk` FOREIGN KEY (`contract_id`) REFERENCES `site_contracts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_monthly_payments` ADD CONSTRAINT `site_monthly_payments_transaction_id_transactions_id_fk` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_monthly_payments` ADD CONSTRAINT `site_monthly_payments_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_monthly_payments` ADD CONSTRAINT `site_monthly_payments_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_monthly_payments` ADD CONSTRAINT `site_monthly_payments_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_penalties` ADD CONSTRAINT `site_penalties_contract_id_site_contracts_id_fk` FOREIGN KEY (`contract_id`) REFERENCES `site_contracts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_penalties` ADD CONSTRAINT `site_penalties_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_penalties` ADD CONSTRAINT `site_penalties_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_penalties` ADD CONSTRAINT `site_penalties_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site` ADD CONSTRAINT `site_service_id_services_id_fk` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE no action ON UPDATE no action;