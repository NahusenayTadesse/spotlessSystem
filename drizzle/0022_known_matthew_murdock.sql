RENAME TABLE `tax_and_withhold` TO `vat_and_withhold`;--> statement-breakpoint
ALTER TABLE `vat_and_withhold` RENAME COLUMN `tax` TO `vat`;