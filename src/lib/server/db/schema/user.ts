import {
	mysqlTable,
	varchar,
	timestamp,
	int,
	boolean,
	datetime,
	index
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const user = mysqlTable(
	'user',
	{
		id: varchar('id', { length: 255 }).primaryKey(),
		username: varchar('username', { length: 32 }).notNull().unique(),
		name: varchar('name', { length: 100 }).notNull().default('User'),
		email: varchar('email', { length: 100 }).notNull().unique(),
		passwordHash: varchar('password_hash', { length: 255 }).notNull(),
		isActive: boolean('is_active').default(true).notNull(),
		roleId: int('role_id')
			.references(() => roles.id, { onDelete: 'restrict' })
			.notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`)
			.notNull()
	},
	(table) => [index('name_idx').on(table.name)]
);

export const session = mysqlTable('session', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	expiresAt: datetime('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`)
		.notNull()
});

export const roles = mysqlTable('roles', {
	id: int('id').autoincrement().primaryKey(),
	name: varchar('name', { length: 32 }).notNull().unique(),
	description: varchar('description', { length: 255 }),
	isActive: boolean('is_active').default(true).notNull()
});
