import { varchar, datetime, timestamp, int, boolean } from 'drizzle-orm/mysql-core';
import { user } from './user';
import { sql } from 'drizzle-orm';

export const secureFields = {
	isActive: boolean('is_active').default(true).notNull(),
	createdBy: varchar('created_by', { length: 255 }).references(() => user.id, {
		onDelete: 'set null'
	}),
	updatedBy: varchar('updated_by', { length: 255 }).references(() => user.id, {
		onDelete: 'set null'
	}),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`)
		.notNull(),
	deletedAt: datetime('deleted_at'),
	deletedBy: varchar('deleted_by', { length: 255 }).references(() => user.id, {
		onDelete: 'set null'
	})
};

export const lesserFields = {
	status: boolean('status').default(true).notNull()
};
