ALTER TABLE `payroll_runs` ADD `total_salaries` decimal(10,2);--> statement-breakpoint
ALTER TABLE `payroll_runs` ADD `total_overtime` decimal(10,2);--> statement-breakpoint
ALTER TABLE `payroll_runs` ADD `total_transport` decimal(10,2);--> statement-breakpoint
ALTER TABLE `payroll_runs` ADD `total_housing` decimal(10,2);--> statement-breakpoint
ALTER TABLE `payroll_runs` ADD `total_position` decimal(10,2);--> statement-breakpoint
ALTER TABLE `payroll_runs` ADD `total_penalities` decimal(10,2);--> statement-breakpoint
ALTER TABLE `payroll_runs` ADD `total_tax` decimal(10,2);--> statement-breakpoint
ALTER TABLE `payroll_runs` ADD `total_gross` decimal(10,2);--> statement-breakpoint
ALTER TABLE `payroll_runs` DROP COLUMN `total_paid`;