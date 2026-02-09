CREATE TABLE `commission_registers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`email` varchar(100) NOT NULL,
	`feedback` varchar(255) NOT NULL,
	`contacted_by` int,
	`tin_no` varchar(50) NOT NULL,
	`address` int,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `commission_registers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `over_time_type` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`rate` decimal(10,2) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `over_time_type_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `penality` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`rate` decimal(15,2) NOT NULL,
	`status` boolean NOT NULL DEFAULT true,
	CONSTRAINT `penality_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `customer_contracts` DROP FOREIGN KEY `customer_contracts_services_id_customer_services_id_fk`;
--> statement-breakpoint
ALTER TABLE `customer_contracts` DROP FOREIGN KEY `customer_contracts_transaction_id_transactions_id_fk`;
--> statement-breakpoint
ALTER TABLE `employee` DROP FOREIGN KEY `employee_tax_type_tax_type_id_fk`;
--> statement-breakpoint
ALTER TABLE `customer_contracts` ADD `contract_file` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `customer_contracts` ADD `signing_officer` int;--> statement-breakpoint
ALTER TABLE `over_time` ADD `over_time_type_id` int;--> statement-breakpoint
ALTER TABLE `salaries` ADD `transportation_allowance` decimal(10,2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE `salaries` ADD `housing_allowance` decimal(10,2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE `salaries` ADD `non_tax_allowance` decimal(10,2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE `salaries` ADD `position_allowance` decimal(10,2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE `tax_type` ADD `threshold` decimal(12,2);--> statement-breakpoint
ALTER TABLE `tax_type` ADD `deduction` decimal(12,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `commission_registers` ADD CONSTRAINT `commission_registers_contacted_by_employee_id_fk` FOREIGN KEY (`contacted_by`) REFERENCES `employee`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `commission_registers` ADD CONSTRAINT `commission_registers_address_address_id_fk` FOREIGN KEY (`address`) REFERENCES `address`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `commission_registers` ADD CONSTRAINT `commission_registers_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `commission_registers` ADD CONSTRAINT `commission_registers_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `commission_registers` ADD CONSTRAINT `commission_registers_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `over_time_type` ADD CONSTRAINT `over_time_type_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `over_time_type` ADD CONSTRAINT `over_time_type_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `over_time_type` ADD CONSTRAINT `over_time_type_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_contracts` ADD CONSTRAINT `customer_contracts_signing_officer_employee_id_fk` FOREIGN KEY (`signing_officer`) REFERENCES `employee`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `over_time` ADD CONSTRAINT `over_time_over_time_type_id_over_time_type_id_fk` FOREIGN KEY (`over_time_type_id`) REFERENCES `over_time_type`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_contracts` DROP COLUMN `services_id`;--> statement-breakpoint
ALTER TABLE `customer_contracts` DROP COLUMN `transaction_id`;--> statement-breakpoint
ALTER TABLE `employee` DROP COLUMN `tax_type`;