ALTER TABLE `site_contracts` ADD `terminated` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `site_contracts` ADD `termination_date` date;