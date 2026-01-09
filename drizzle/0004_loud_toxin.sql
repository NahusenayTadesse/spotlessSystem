ALTER TABLE `service_categories` DROP FOREIGN KEY `service_categories_created_by_user_id_fk`;
--> statement-breakpoint
ALTER TABLE `service_categories` DROP FOREIGN KEY `service_categories_updated_by_user_id_fk`;
--> statement-breakpoint
ALTER TABLE `service_categories` DROP FOREIGN KEY `service_categories_deleted_by_user_id_fk`;
--> statement-breakpoint
ALTER TABLE `services` DROP FOREIGN KEY `services_created_by_user_id_fk`;
--> statement-breakpoint
ALTER TABLE `services` DROP FOREIGN KEY `services_updated_by_user_id_fk`;
--> statement-breakpoint
ALTER TABLE `services` DROP FOREIGN KEY `services_deleted_by_user_id_fk`;
--> statement-breakpoint
ALTER TABLE `service_categories` ADD `status` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `services` ADD `status` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `service_categories` DROP COLUMN `is_active`;--> statement-breakpoint
ALTER TABLE `service_categories` DROP COLUMN `created_by`;--> statement-breakpoint
ALTER TABLE `service_categories` DROP COLUMN `updated_by`;--> statement-breakpoint
ALTER TABLE `service_categories` DROP COLUMN `created_at`;--> statement-breakpoint
ALTER TABLE `service_categories` DROP COLUMN `updated_at`;--> statement-breakpoint
ALTER TABLE `service_categories` DROP COLUMN `deleted_at`;--> statement-breakpoint
ALTER TABLE `service_categories` DROP COLUMN `deleted_by`;--> statement-breakpoint
ALTER TABLE `services` DROP COLUMN `is_active`;--> statement-breakpoint
ALTER TABLE `services` DROP COLUMN `created_by`;--> statement-breakpoint
ALTER TABLE `services` DROP COLUMN `updated_by`;--> statement-breakpoint
ALTER TABLE `services` DROP COLUMN `created_at`;--> statement-breakpoint
ALTER TABLE `services` DROP COLUMN `updated_at`;--> statement-breakpoint
ALTER TABLE `services` DROP COLUMN `deleted_at`;--> statement-breakpoint
ALTER TABLE `services` DROP COLUMN `deleted_by`;