// inventory.ts - Handles products, supplies, categories, and inventory adjustments

import { mysqlTable, varchar, int, decimal } from 'drizzle-orm/mysql-core';
import { secureFields } from './secureFields';

import { transactionSupplies } from './finance';
import { employee } from './staff';
import { address } from './locations';

export const supplies = mysqlTable('supplies', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 50 }).notNull(),
	description: varchar('description', { length: 255 }),
	quantity: int('quantity').notNull().default(0),
	unitOfMeasure: varchar('unit_of_measure', { length: 20 }),
	costPerUnit: decimal('cost_per_unit', { precision: 10, scale: 2 }).notNull(),
	reorderLevel: int('reorder_level'),
	...secureFields
});

export const damagedSupplies = mysqlTable('damaged_supplies', {
	id: int('id').primaryKey().autoincrement(),
	supplyId: int('supply_id')
		.notNull()
		.references(() => supplies.id),
	quantity: int('quantity').notNull(),
	damagedBy: int('damaged_by').references(() => employee.id),
	reason: varchar('reason', { length: 255 }).notNull(),
	...secureFields
});

export const supplyTypes = mysqlTable('supply_types', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 50 }).notNull(),
	description: varchar('description', { length: 255 })
});

export const suppliesAdjustments = mysqlTable('supplies_adjustments', {
	id: int('id').autoincrement().primaryKey(),
	suppliesId: int('supplies_id')
		.notNull()
		.references(() => supplies.id),
	adjustment: int('adjustment').notNull(), // e.g., +50 for new stock, -1 for a sale, -1 for internal use
	supplierId: int('supplier_id').references(() => supplySuppliers.id),
	reason: varchar('reason', { length: 255 }),
	transactionId: int('transaction_id').references(() => transactionSupplies.id, {
		onDelete: 'set null'
	}), //if the adjustment is caused by new stuff coming in
	damagedSuppliesId: int('damaged_supplies_id').references(() => damagedSupplies.id, {
		onDelete: 'set null'
	}),
	...secureFields
});

export const supplySuppliers = mysqlTable('supply_suppliers', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 50 }).notNull(),
	description: varchar('description', { length: 255 }),
	address: int('address').references(() => address.id, {
		onDelete: 'set null'
	})
});
