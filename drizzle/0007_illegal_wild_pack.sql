ALTER TABLE `leave` DROP FOREIGN KEY `leave_site_id_site_id_fk`;
--> statement-breakpoint
ALTER TABLE `leave` DROP COLUMN `site_id`;