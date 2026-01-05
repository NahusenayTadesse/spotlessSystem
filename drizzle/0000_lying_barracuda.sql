CREATE TABLE `customer_contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`contact_type` varchar(50) NOT NULL,
	`contact_detail` varchar(255) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `customer_contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customer_contracts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`contract_type` varchar(50) NOT NULL,
	`services_id` int,
	`contract_amount` decimal(10,2) NOT NULL,
	`contract_year` year NOT NULL,
	`contract_date` date NOT NULL,
	`transaction_id` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `customer_contracts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customer_monthly_payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`payment_type` varchar(50) NOT NULL,
	`payment_amount` decimal(10,2) NOT NULL,
	`payment_month` int NOT NULL,
	`payment_date` date NOT NULL,
	`transaction_id` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `customer_monthly_payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customer_payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`payment_type` varchar(50) NOT NULL,
	`payment_amount` decimal(10,2) NOT NULL,
	`payment_date` date NOT NULL,
	`transaction_id` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `customer_payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customer_penalties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`penalty_type` varchar(50) NOT NULL,
	`penalty_amount` decimal(10,2) NOT NULL,
	`penalty_date` date NOT NULL,
	`transaction_id` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `customer_penalties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customer_services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customer_id` int NOT NULL,
	`service_id` int,
	`service_start_date` date NOT NULL,
	`service_end_date` date,
	`service_end_reason` varchar(50),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `customer_services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`email` varchar(100) NOT NULL,
	`tin_no` varchar(50) NOT NULL,
	`region` int NOT NULL,
	`city` int NOT NULL,
	`address` int,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `customers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `discounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`amount` decimal(10,2),
	`name` varchar(50) NOT NULL,
	`description` varchar(255),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `discounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `discounts_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`expense_date` date NOT NULL,
	`type` int NOT NULL,
	`description` varchar(255),
	`total` decimal(10,2) NOT NULL,
	`transaction_id` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `expenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expenses_type` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` varchar(255),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `expenses_type_id` PRIMARY KEY(`id`),
	CONSTRAINT `expenses_type_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `payment_methods` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` varchar(255),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `payment_methods_id` PRIMARY KEY(`id`),
	CONSTRAINT `payment_methods_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `payroll_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`payroll_id` int,
	`staff_id` int,
	`month` enum('January','February','March','April','May','June','July','August','September','October','November','December') NOT NULL,
	`year` year NOT NULL,
	`pay_period_start` date NOT NULL,
	`pay_period_end` date NOT NULL,
	`basic_salary` decimal(10,2),
	`overtime_amount` decimal(10,2),
	`deduction` decimal(10,2),
	`commission_amount` decimal(10,2),
	`bonus_amount` decimal(10,2),
	`allowances` decimal(10,2),
	`net_amount` decimal(10,2),
	`paid_amount` decimal(10,2),
	`tax_amount` decimal(10,2),
	`status` enum('pending','approved','paid') NOT NULL DEFAULT 'pending',
	`payment_method_id` int,
	`payment_date` date,
	`notes` varchar(255),
	`reciept_link` varchar(255),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `payroll_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `payroll_entries_staff_id_pay_period_start_pay_period_end_unique` UNIQUE(`staff_id`,`pay_period_start`,`pay_period_end`)
);
--> statement-breakpoint
CREATE TABLE `payroll_runs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pay_period_start` date NOT NULL,
	`pay_period_end` date NOT NULL,
	`payment_date` date NOT NULL,
	`month` varchar(50) NOT NULL,
	`year` year NOT NULL,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`total_net` decimal(10,2),
	`total_deductions` decimal(10,2),
	`total_paid` decimal(10,2),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `payroll_runs_id` PRIMARY KEY(`id`),
	CONSTRAINT `payroll_runs_month_year_unique` UNIQUE(`month`,`year`)
);
--> statement-breakpoint
CREATE TABLE `transaction_services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int NOT NULL,
	`transaction_id` int NOT NULL,
	`service_id` int NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`tip` decimal(10,2) NOT NULL DEFAULT '0',
	`discount` int,
	`tax` decimal(10,2),
	`total` decimal(10,2),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `transaction_services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transaction_supplies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`transaction_id` int NOT NULL,
	`supply_id` int,
	`quantity` decimal(10,2) NOT NULL DEFAULT '1',
	`unit_price` decimal(10,2) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `transaction_supplies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`payment_status` enum('pending','pending','paid','unpaid','refunded','partially_paid','partially_refunded','overpaid','disputed') DEFAULT 'pending',
	`payment_method_id` int,
	`reciept_link` varchar(255),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` varchar(255),
	CONSTRAINT `permissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `permissions_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`role_id` int NOT NULL,
	`permission_id` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `role_permissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `special_permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`permission_id` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `special_permissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(32) NOT NULL,
	`description` varchar(255),
	`is_active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `roles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`expires_at` datetime NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	CONSTRAINT `session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`username` varchar(32) NOT NULL,
	`name` varchar(100) NOT NULL DEFAULT 'User',
	`email` varchar(100) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`role_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_username_unique` UNIQUE(`username`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `damaged_supplies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supply_id` int NOT NULL,
	`quantity` int NOT NULL,
	`damaged_by` int,
	`reason` varchar(255) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `damaged_supplies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supplies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` varchar(255),
	`quantity` int NOT NULL DEFAULT 0,
	`unit_of_measure` varchar(20),
	`cost_per_unit` decimal(10,2) NOT NULL,
	`reorder_level` int,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `supplies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supplies_adjustments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supplies_id` int NOT NULL,
	`adjustment` int NOT NULL,
	`supplier_id` int,
	`reason` varchar(255),
	`transaction_id` int,
	`damaged_supplies_id` int,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `supplies_adjustments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supply_suppliers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` varchar(255),
	`address` int,
	CONSTRAINT `supply_suppliers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `supply_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` varchar(255),
	CONSTRAINT `supply_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255),
	`action` varchar(32) NOT NULL,
	`table_name` varchar(32) NOT NULL,
	`record_id` varchar(255) NOT NULL,
	`old_values` json,
	`new_values` json,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`ip_address` varchar(45),
	CONSTRAINT `audit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`report_date` date NOT NULL,
	`booked_appointments` int DEFAULT 0,
	`cancelled_appointments` int DEFAULT 0,
	`products_sold` int NOT NULL DEFAULT 0,
	`services_rendered` int NOT NULL,
	`daily_expenses` decimal(10,2),
	`daily_income` decimal(10,2),
	`transactions` int NOT NULL,
	`staff_paid` int,
	`total_staff_paid` decimal(10,2),
	`staff_hired` int,
	`staff_fired` int,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`),
	CONSTRAINT `reports_report_date_unique` UNIQUE(`report_date`)
);
--> statement-breakpoint
CREATE TABLE `service_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` varchar(255),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `service_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `service_categories_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`category_id` int,
	`description` varchar(255),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `services_id` PRIMARY KEY(`id`),
	CONSTRAINT `services_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `bonuses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int,
	`description` varchar(255),
	`amount` decimal(10,2) NOT NULL,
	`bonus_date` date NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `bonuses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `commissions_services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int,
	`amount` decimal(10,2) NOT NULL,
	`reason` varchar(255),
	`commission_date` date NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `commissions_services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deductions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int,
	`type` varchar(100) NOT NULL,
	`reason` varchar(255) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`deduction_date` date NOT NULL,
	`warning_type` varchar(100),
	`warning_reason` varchar(255),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `deductions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `department` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(32) NOT NULL,
	`phone` varchar(20),
	`location` varchar(255),
	`description` varchar(255),
	`status` boolean NOT NULL DEFAULT true,
	CONSTRAINT `department_id` PRIMARY KEY(`id`),
	CONSTRAINT `department_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `educational_level` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(32) NOT NULL,
	`description` varchar(255),
	`status` boolean NOT NULL DEFAULT true,
	CONSTRAINT `educational_level_id` PRIMARY KEY(`id`),
	CONSTRAINT `educational_level_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `employee` (
	`id` int AUTO_INCREMENT NOT NULL,
	`id_no` varchar(255) NOT NULL,
	`name` varchar(50) NOT NULL,
	`father_name` varchar(50) NOT NULL,
	`grand_father_name` varchar(50) NOT NULL,
	`gender` enum('male','female') NOT NULL DEFAULT 'male',
	`nationality` varchar(50) NOT NULL DEFAULT 'Ethiopia',
	`religion` varchar(50) NOT NULL DEFAULT 'Christianity',
	`blood_type` enum('A+','A-','B+','B-','AB+','AB-','O+','O-'),
	`tin_no` varchar(20) NOT NULL,
	`department_id` int NOT NULL,
	`birth_date` date NOT NULL,
	`photo` varchar(255) NOT NULL,
	`govt_id` varchar(255) NOT NULL,
	`hire_date` timestamp NOT NULL,
	`termination_date` datetime,
	`employment_status` int NOT NULL,
	`educational_level` int,
	`martial_status` enum('single','married','widowed','divorced','other') DEFAULT 'single',
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `employee_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employee_guarantor` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`relationship` enum('mother','father','spouse','son','daughter','other') NOT NULL,
	`relation` varchar(255) NOT NULL,
	`job_type` varchar(255) NOT NULL,
	`company` varchar(255) NOT NULL,
	`salary` decimal(10,2) NOT NULL,
	`gurantor_document` varchar(255) NOT NULL,
	`phone` varchar(255) NOT NULL,
	`photo` varchar(255) NOT NULL,
	`govt_id` varchar(255) NOT NULL,
	`email` varchar(255),
	`address` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `employee_guarantor_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `empoloyee_termination` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int NOT NULL,
	`reason` varchar(255),
	`termination_date` date NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `empoloyee_termination_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employment_statuses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(32) NOT NULL,
	`description` varchar(255),
	`status` boolean NOT NULL DEFAULT true,
	CONSTRAINT `employment_statuses_id` PRIMARY KEY(`id`),
	CONSTRAINT `employment_statuses_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `leave` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`staff_id` int NOT NULL,
	`request_date` date NOT NULL,
	`start_date` date NOT NULL,
	`end_date` date NOT NULL,
	`reason` varchar(255),
	`leave_letter` varchar(100),
	`site_id` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `leave_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `over_time` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int,
	`reason` varchar(255),
	`amount_per_hour` decimal(10,2) NOT NULL,
	`hours` decimal(10,2) NOT NULL,
	`total` decimal(10,2) NOT NULL,
	`date` date NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `over_time_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pension` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int NOT NULL,
	`start_date` date NOT NULL,
	`end_date` date NOT NULL,
	`pension_amount` decimal(10,2) NOT NULL,
	`pension_type` varchar(255) NOT NULL,
	CONSTRAINT `pension_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pension_type` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`rate` decimal(15,2) NOT NULL,
	`tax_type` int NOT NULL,
	CONSTRAINT `pension_type_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `qualification` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int NOT NULL,
	`field` varchar(255),
	`education_level` int NOT NULL,
	`school_name` varchar(255),
	`qualification_date` date NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `qualification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `salaries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`start_date` date NOT NULL,
	`end_date` date,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `salaries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `staff_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int NOT NULL,
	`payment_Method_id` int,
	`account_detail` varchar(255) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `staff_accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `staff_contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int NOT NULL,
	`contact_type` varchar(50) NOT NULL,
	`contact_detail` varchar(255) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `staff_contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `staff_families` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int,
	`relationship` enum('mother','father','spouse','son','daughter','grandchild','grandfather','grandmother','uncle','aunt','brother','sister','other') NOT NULL,
	`gender` enum('male','female') NOT NULL DEFAULT 'male',
	`other_relationship` varchar(255),
	`name` varchar(255) NOT NULL,
	`phone` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`emergency_contact` boolean NOT NULL DEFAULT false,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `staff_families_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `staff_schedule` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int NOT NULL,
	`shift_date` date NOT NULL,
	`start_time` time NOT NULL,
	`end_time` time NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `staff_schedule_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `staff_services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staff_id` int NOT NULL,
	`service_id` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `staff_services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tax_type` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`rate` decimal(15,2) NOT NULL,
	`status` boolean NOT NULL DEFAULT true,
	CONSTRAINT `tax_type_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_staff` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255),
	`staff_id` int,
	CONSTRAINT `user_staff_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `address` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subcity_id` int NOT NULL,
	`street` varchar(100),
	`kebele` varchar(100) NOT NULL,
	`building_number` varchar(10),
	`floor` int NOT NULL DEFAULT 0,
	`house_number` int NOT NULL DEFAULT 0,
	`status` boolean NOT NULL DEFAULT true,
	CONSTRAINT `address_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `city` (
	`id` int AUTO_INCREMENT NOT NULL,
	`region_id` int NOT NULL,
	`name` varchar(50) NOT NULL,
	`status` boolean NOT NULL DEFAULT true,
	CONSTRAINT `city_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `region` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`status` boolean NOT NULL DEFAULT true,
	CONSTRAINT `region_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subcity` (
	`sc_id` int AUTO_INCREMENT NOT NULL,
	`city_id` int NOT NULL,
	`name` varchar(50) NOT NULL,
	`status` boolean NOT NULL DEFAULT true,
	CONSTRAINT `subcity_sc_id` PRIMARY KEY(`sc_id`)
);
--> statement-breakpoint
CREATE TABLE `site` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`address` int NOT NULL,
	`startDate` date NOT NULL,
	`endDate` date NOT NULL,
	`includeVat` boolean NOT NULL DEFAULT false,
	`siteCommission` boolean NOT NULL DEFAULT false,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `site_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_payment_adjustment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`siteId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_by` varchar(255),
	`updated_by` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	`deleted_at` datetime,
	`deleted_by` varchar(255),
	CONSTRAINT `site_payment_adjustment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `customer_contacts` ADD CONSTRAINT `customer_contacts_customer_id_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_contacts` ADD CONSTRAINT `customer_contacts_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_contacts` ADD CONSTRAINT `customer_contacts_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_contacts` ADD CONSTRAINT `customer_contacts_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_contracts` ADD CONSTRAINT `customer_contracts_customer_id_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_contracts` ADD CONSTRAINT `customer_contracts_services_id_customer_services_id_fk` FOREIGN KEY (`services_id`) REFERENCES `customer_services`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_contracts` ADD CONSTRAINT `customer_contracts_transaction_id_transactions_id_fk` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_contracts` ADD CONSTRAINT `customer_contracts_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_contracts` ADD CONSTRAINT `customer_contracts_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_contracts` ADD CONSTRAINT `customer_contracts_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_monthly_payments` ADD CONSTRAINT `customer_monthly_payments_customer_id_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_monthly_payments` ADD CONSTRAINT `customer_monthly_payments_transaction_id_transactions_id_fk` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_monthly_payments` ADD CONSTRAINT `customer_monthly_payments_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_monthly_payments` ADD CONSTRAINT `customer_monthly_payments_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_monthly_payments` ADD CONSTRAINT `customer_monthly_payments_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_payments` ADD CONSTRAINT `customer_payments_customer_id_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_payments` ADD CONSTRAINT `customer_payments_transaction_id_transactions_id_fk` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_payments` ADD CONSTRAINT `customer_payments_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_payments` ADD CONSTRAINT `customer_payments_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_payments` ADD CONSTRAINT `customer_payments_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_penalties` ADD CONSTRAINT `customer_penalties_customer_id_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_penalties` ADD CONSTRAINT `customer_penalties_transaction_id_transactions_id_fk` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_penalties` ADD CONSTRAINT `customer_penalties_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_penalties` ADD CONSTRAINT `customer_penalties_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_penalties` ADD CONSTRAINT `customer_penalties_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_services` ADD CONSTRAINT `customer_services_customer_id_customers_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_services` ADD CONSTRAINT `customer_services_service_id_services_id_fk` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_services` ADD CONSTRAINT `customer_services_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_services` ADD CONSTRAINT `customer_services_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customer_services` ADD CONSTRAINT `customer_services_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customers` ADD CONSTRAINT `customers_address_address_id_fk` FOREIGN KEY (`address`) REFERENCES `address`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customers` ADD CONSTRAINT `customers_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customers` ADD CONSTRAINT `customers_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customers` ADD CONSTRAINT `customers_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `discounts` ADD CONSTRAINT `discounts_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `discounts` ADD CONSTRAINT `discounts_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `discounts` ADD CONSTRAINT `discounts_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_type_expenses_type_id_fk` FOREIGN KEY (`type`) REFERENCES `expenses_type`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_transaction_id_transactions_id_fk` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expenses_type` ADD CONSTRAINT `expenses_type_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expenses_type` ADD CONSTRAINT `expenses_type_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expenses_type` ADD CONSTRAINT `expenses_type_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment_methods` ADD CONSTRAINT `payment_methods_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment_methods` ADD CONSTRAINT `payment_methods_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment_methods` ADD CONSTRAINT `payment_methods_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_entries` ADD CONSTRAINT `payroll_entries_payroll_id_payroll_runs_id_fk` FOREIGN KEY (`payroll_id`) REFERENCES `payroll_runs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_entries` ADD CONSTRAINT `payroll_entries_staff_id_employee_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `employee`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_entries` ADD CONSTRAINT `payroll_entries_payment_method_id_payment_methods_id_fk` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_entries` ADD CONSTRAINT `payroll_entries_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_entries` ADD CONSTRAINT `payroll_entries_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_entries` ADD CONSTRAINT `payroll_entries_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_runs` ADD CONSTRAINT `payroll_runs_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_runs` ADD CONSTRAINT `payroll_runs_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_runs` ADD CONSTRAINT `payroll_runs_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transaction_services` ADD CONSTRAINT `transaction_services_staff_id_employee_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `employee`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transaction_services` ADD CONSTRAINT `transaction_services_transaction_id_transactions_id_fk` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transaction_services` ADD CONSTRAINT `transaction_services_service_id_services_id_fk` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transaction_services` ADD CONSTRAINT `transaction_services_discount_discounts_id_fk` FOREIGN KEY (`discount`) REFERENCES `discounts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transaction_services` ADD CONSTRAINT `transaction_services_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transaction_services` ADD CONSTRAINT `transaction_services_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transaction_services` ADD CONSTRAINT `transaction_services_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transaction_supplies` ADD CONSTRAINT `transaction_supplies_transaction_id_transactions_id_fk` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transaction_supplies` ADD CONSTRAINT `transaction_supplies_supply_id_supplies_id_fk` FOREIGN KEY (`supply_id`) REFERENCES `supplies`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transaction_supplies` ADD CONSTRAINT `transaction_supplies_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transaction_supplies` ADD CONSTRAINT `transaction_supplies_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transaction_supplies` ADD CONSTRAINT `transaction_supplies_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_payment_method_id_payment_methods_id_fk` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permission_id_permissions_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `special_permissions` ADD CONSTRAINT `special_permissions_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `special_permissions` ADD CONSTRAINT `special_permissions_permission_id_permissions_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `special_permissions` ADD CONSTRAINT `special_permissions_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `special_permissions` ADD CONSTRAINT `special_permissions_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `special_permissions` ADD CONSTRAINT `special_permissions_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `damaged_supplies` ADD CONSTRAINT `damaged_supplies_supply_id_supplies_id_fk` FOREIGN KEY (`supply_id`) REFERENCES `supplies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `damaged_supplies` ADD CONSTRAINT `damaged_supplies_damaged_by_employee_id_fk` FOREIGN KEY (`damaged_by`) REFERENCES `employee`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `damaged_supplies` ADD CONSTRAINT `damaged_supplies_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `damaged_supplies` ADD CONSTRAINT `damaged_supplies_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `damaged_supplies` ADD CONSTRAINT `damaged_supplies_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplies` ADD CONSTRAINT `supplies_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplies` ADD CONSTRAINT `supplies_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplies` ADD CONSTRAINT `supplies_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplies_adjustments` ADD CONSTRAINT `supplies_adjustments_supplies_id_supplies_id_fk` FOREIGN KEY (`supplies_id`) REFERENCES `supplies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplies_adjustments` ADD CONSTRAINT `supplies_adjustments_supplier_id_supply_suppliers_id_fk` FOREIGN KEY (`supplier_id`) REFERENCES `supply_suppliers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplies_adjustments` ADD CONSTRAINT `supplies_adjustments_transaction_id_transaction_supplies_id_fk` FOREIGN KEY (`transaction_id`) REFERENCES `transaction_supplies`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplies_adjustments` ADD CONSTRAINT `supplies_adjustments_damaged_supplies_id_damaged_supplies_id_fk` FOREIGN KEY (`damaged_supplies_id`) REFERENCES `damaged_supplies`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplies_adjustments` ADD CONSTRAINT `supplies_adjustments_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplies_adjustments` ADD CONSTRAINT `supplies_adjustments_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supplies_adjustments` ADD CONSTRAINT `supplies_adjustments_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `supply_suppliers` ADD CONSTRAINT `supply_suppliers_address_address_id_fk` FOREIGN KEY (`address`) REFERENCES `address`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audit_log` ADD CONSTRAINT `audit_log_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `service_categories` ADD CONSTRAINT `service_categories_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `service_categories` ADD CONSTRAINT `service_categories_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `service_categories` ADD CONSTRAINT `service_categories_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `services` ADD CONSTRAINT `services_category_id_service_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `service_categories`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `services` ADD CONSTRAINT `services_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `services` ADD CONSTRAINT `services_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `services` ADD CONSTRAINT `services_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bonuses` ADD CONSTRAINT `bonuses_staff_id_employee_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `employee`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bonuses` ADD CONSTRAINT `bonuses_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bonuses` ADD CONSTRAINT `bonuses_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bonuses` ADD CONSTRAINT `bonuses_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `commissions_services` ADD CONSTRAINT `commissions_services_staff_id_employee_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `employee`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `commissions_services` ADD CONSTRAINT `commissions_services_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `commissions_services` ADD CONSTRAINT `commissions_services_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `commissions_services` ADD CONSTRAINT `commissions_services_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deductions` ADD CONSTRAINT `deductions_staff_id_employee_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `employee`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deductions` ADD CONSTRAINT `deductions_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deductions` ADD CONSTRAINT `deductions_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `deductions` ADD CONSTRAINT `deductions_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee` ADD CONSTRAINT `employee_department_id_department_id_fk` FOREIGN KEY (`department_id`) REFERENCES `department`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee` ADD CONSTRAINT `employee_employment_status_employment_statuses_id_fk` FOREIGN KEY (`employment_status`) REFERENCES `employment_statuses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee` ADD CONSTRAINT `employee_educational_level_educational_level_id_fk` FOREIGN KEY (`educational_level`) REFERENCES `educational_level`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee` ADD CONSTRAINT `employee_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee` ADD CONSTRAINT `employee_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee` ADD CONSTRAINT `employee_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_guarantor` ADD CONSTRAINT `employee_guarantor_staff_id_employee_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `employee`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_guarantor` ADD CONSTRAINT `employee_guarantor_address_address_id_fk` FOREIGN KEY (`address`) REFERENCES `address`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_guarantor` ADD CONSTRAINT `employee_guarantor_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_guarantor` ADD CONSTRAINT `employee_guarantor_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_guarantor` ADD CONSTRAINT `employee_guarantor_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `empoloyee_termination` ADD CONSTRAINT `empoloyee_termination_staff_id_employee_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `employee`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `empoloyee_termination` ADD CONSTRAINT `empoloyee_termination_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `empoloyee_termination` ADD CONSTRAINT `empoloyee_termination_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `empoloyee_termination` ADD CONSTRAINT `empoloyee_termination_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leave` ADD CONSTRAINT `leave_staff_id_employee_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `employee`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leave` ADD CONSTRAINT `leave_site_id_site_id_fk` FOREIGN KEY (`site_id`) REFERENCES `site`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leave` ADD CONSTRAINT `leave_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leave` ADD CONSTRAINT `leave_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leave` ADD CONSTRAINT `leave_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `over_time` ADD CONSTRAINT `over_time_staff_id_employee_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `employee`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `over_time` ADD CONSTRAINT `over_time_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `over_time` ADD CONSTRAINT `over_time_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `over_time` ADD CONSTRAINT `over_time_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pension` ADD CONSTRAINT `pension_staff_id_employee_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `employee`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pension_type` ADD CONSTRAINT `pension_type_tax_type_tax_type_id_fk` FOREIGN KEY (`tax_type`) REFERENCES `tax_type`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `qualification` ADD CONSTRAINT `qualification_staff_id_employee_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `employee`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `qualification` ADD CONSTRAINT `qualification_education_level_educational_level_id_fk` FOREIGN KEY (`education_level`) REFERENCES `educational_level`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `qualification` ADD CONSTRAINT `qualification_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `qualification` ADD CONSTRAINT `qualification_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `qualification` ADD CONSTRAINT `qualification_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `salaries` ADD CONSTRAINT `salaries_staff_id_employee_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `employee`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `salaries` ADD CONSTRAINT `salaries_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `salaries` ADD CONSTRAINT `salaries_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `salaries` ADD CONSTRAINT `salaries_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_accounts` ADD CONSTRAINT `staff_accounts_staff_id_employee_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `employee`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_accounts` ADD CONSTRAINT `staff_accounts_payment_Method_id_payment_methods_id_fk` FOREIGN KEY (`payment_Method_id`) REFERENCES `payment_methods`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_accounts` ADD CONSTRAINT `staff_accounts_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_accounts` ADD CONSTRAINT `staff_accounts_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_accounts` ADD CONSTRAINT `staff_accounts_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_contacts` ADD CONSTRAINT `staff_contacts_staff_id_employee_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `employee`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_contacts` ADD CONSTRAINT `staff_contacts_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_contacts` ADD CONSTRAINT `staff_contacts_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_contacts` ADD CONSTRAINT `staff_contacts_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_families` ADD CONSTRAINT `staff_families_staff_id_employee_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `employee`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_families` ADD CONSTRAINT `staff_families_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_families` ADD CONSTRAINT `staff_families_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_families` ADD CONSTRAINT `staff_families_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_schedule` ADD CONSTRAINT `staff_schedule_staff_id_employee_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `employee`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_schedule` ADD CONSTRAINT `staff_schedule_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_schedule` ADD CONSTRAINT `staff_schedule_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_schedule` ADD CONSTRAINT `staff_schedule_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_services` ADD CONSTRAINT `staff_services_staff_id_employee_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `employee`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_services` ADD CONSTRAINT `staff_services_service_id_services_id_fk` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_services` ADD CONSTRAINT `staff_services_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_services` ADD CONSTRAINT `staff_services_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `staff_services` ADD CONSTRAINT `staff_services_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_staff` ADD CONSTRAINT `user_staff_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_staff` ADD CONSTRAINT `user_staff_staff_id_employee_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `employee`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `address` ADD CONSTRAINT `address_subcity_id_subcity_sc_id_fk` FOREIGN KEY (`subcity_id`) REFERENCES `subcity`(`sc_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `city` ADD CONSTRAINT `city_region_id_region_id_fk` FOREIGN KEY (`region_id`) REFERENCES `region`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subcity` ADD CONSTRAINT `subcity_city_id_city_id_fk` FOREIGN KEY (`city_id`) REFERENCES `city`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site` ADD CONSTRAINT `site_address_address_id_fk` FOREIGN KEY (`address`) REFERENCES `address`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site` ADD CONSTRAINT `site_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site` ADD CONSTRAINT `site_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site` ADD CONSTRAINT `site_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_payment_adjustment` ADD CONSTRAINT `site_payment_adjustment_siteId_site_id_fk` FOREIGN KEY (`siteId`) REFERENCES `site`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_payment_adjustment` ADD CONSTRAINT `site_payment_adjustment_created_by_user_id_fk` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_payment_adjustment` ADD CONSTRAINT `site_payment_adjustment_updated_by_user_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `site_payment_adjustment` ADD CONSTRAINT `site_payment_adjustment_deleted_by_user_id_fk` FOREIGN KEY (`deleted_by`) REFERENCES `user`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `name_idx` ON `user` (`name`);--> statement-breakpoint
CREATE INDEX `first_name_idx` ON `employee` (`name`);--> statement-breakpoint
CREATE INDEX `last_name_idx` ON `employee` (`father_name`);--> statement-breakpoint
CREATE INDEX `grand_father_name_idx` ON `employee` (`grand_father_name`);