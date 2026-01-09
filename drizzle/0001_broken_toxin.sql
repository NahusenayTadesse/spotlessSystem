ALTER TABLE `damaged_supplies` ADD `deductable` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `supplies` DROP COLUMN `cost_per_unit`;