ALTER TABLE `city` ADD CONSTRAINT `city_name_unique` UNIQUE(`name`);--> statement-breakpoint
ALTER TABLE `region` ADD CONSTRAINT `region_name_unique` UNIQUE(`name`);--> statement-breakpoint
ALTER TABLE `subcity` ADD CONSTRAINT `subcity_name_unique` UNIQUE(`name`);