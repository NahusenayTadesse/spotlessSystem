CREATE TABLE `position` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(32) NOT NULL,
	`department_id` int NOT NULL,
	`description` varchar(255),
	`status` boolean NOT NULL DEFAULT true,
	CONSTRAINT `position_id` PRIMARY KEY(`id`),
	CONSTRAINT `position_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
ALTER TABLE `employee` ADD `position_id` int;--> statement-breakpoint
ALTER TABLE `position` ADD CONSTRAINT `position_department_id_department_id_fk` FOREIGN KEY (`department_id`) REFERENCES `department`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `name_idx` ON `position` (`name`);--> statement-breakpoint
ALTER TABLE `employee` ADD CONSTRAINT `employee_position_id_position_id_fk` FOREIGN KEY (`position_id`) REFERENCES `position`(`id`) ON DELETE no action ON UPDATE no action;