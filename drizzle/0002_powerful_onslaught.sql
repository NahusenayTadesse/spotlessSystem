ALTER TABLE `product_adjustments` DROP FOREIGN KEY `product_adjustments_transaction_id_transaction_products_id_fk`;
--> statement-breakpoint
ALTER TABLE `product_adjustments` ADD CONSTRAINT `product_adjustments_transaction_id_transactions_id_fk` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE no action ON UPDATE no action;