// Updated subcity snippet

import { mysqlTable, int, varchar, boolean, date, decimal } from 'drizzle-orm/mysql-core';
import { secureFields } from './secureFields';
import { customers } from './customers';
import { address } from './locations';

export const site = mysqlTable('site', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 50 }).notNull(),
	phone: varchar('phone', { length: 20 }).notNull(),
	address: int('address')
		.notNull()
		.references(() => address.id),
	startDate: date('start_date').notNull(),
	customerId: int('customer_id')
		.notNull()
		.references(() => customers.id),
	endDate: date('end_date').notNull(),
	includeVat: boolean().notNull().default(false),
	siteCommission: boolean().notNull().default(false),
	...secureFields
});

export const sitePaymentAdjustment = mysqlTable('site_payment_adjustment', {
	id: int('id').primaryKey().autoincrement(),
	siteId: int('site_id')
		.notNull()
		.references(() => site.id),
	amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
	...secureFields
});
