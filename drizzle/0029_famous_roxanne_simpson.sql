ALTER TABLE `site_monthly_payments` MODIFY COLUMN `payment_request_file` varchar(255);--> statement-breakpoint
ALTER TABLE `site_monthly_payments` MODIFY COLUMN `vat` decimal(10,2) NOT NULL DEFAULT '15';--> statement-breakpoint
ALTER TABLE `site_monthly_payments` MODIFY COLUMN `withhold_amount` decimal(10,2);--> statement-breakpoint
ALTER TABLE `site_monthly_payments` MODIFY COLUMN `withhold_file` varchar(255);--> statement-breakpoint
ALTER TABLE `site_monthly_payments` MODIFY COLUMN `withhold_invoice_number` varchar(255);