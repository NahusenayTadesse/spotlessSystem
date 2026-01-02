// Updated subcity snippet

import { mysqlTable, int, varchar, boolean, date, decimal } from 'drizzle-orm/mysql-core';
import { secureFields } from './secureFields';
import { transactions } from './finance';
import { address } from './locations';

export const site = mysqlTable('site', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 50 }).notNull(),
	phone: varchar('phone', { length: 20 }).notNull(),
	address: int('address')
		.notNull()
		.references(() => address.id),
	startDate: date('startDate').notNull(),
	endDate: date('endDate').notNull(),
	includeVat: boolean().notNull().default(false),
	siteCommission: boolean().notNull().default(false),
	...secureFields
});

export const sitePaymentAdjustment = mysqlTable('site_payment_adjustment', {
	id: int('id').primaryKey().autoincrement(),
	siteId: int('siteId')
		.notNull()
		.references(() => site.id),
	amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
	...secureFields
});
