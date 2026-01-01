// inventory.ts - Handles products, supplies, categories, and inventory adjustments

import { mysqlTable, varchar, int, decimal } from 'drizzle-orm/mysql-core';
import { secureFields } from './secureFields';

import { transactions, transactionSupplies } from './finance';

export const supplies = mysqlTable('supplies', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 50 }).notNull(),
	description: varchar('description', { length: 255 }),
	quantity: int('quantity').notNull().default(0),
	unitOfMeasure: varchar('unit_of_measure', { length: 20 }),
	costPerUnit: decimal('cost_per_unit', { precision: 10, scale: 2 }).notNull(),
	supplier: varchar('supplier', { length: 255 }),
	reorderLevel: int('reorder_level'),
	...secureFields
});

export const products = mysqlTable('products', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 50 }).notNull(),
	description: varchar('description', { length: 255 }),
	categoryId: int('category_id').references(() => productCategories.id, { onDelete: 'set null' }),
	quantity: int('quantity').notNull().default(0),
	price: decimal('price', { precision: 10, scale: 2 }).notNull(),
	cost: decimal('cost', { precision: 10, scale: 2 }).notNull(),
	commissionAmount: decimal('commission_amount', { precision: 10, scale: 2 }).notNull(),
	supplier: varchar('supplier', { length: 255 }),
	reorderLevel: int('reorder_level'),
	...secureFields
});

export const productCategories = mysqlTable('product_categories', {
	id: int('id').autoincrement().primaryKey(),
	name: varchar('name', { length: 50 }).notNull().unique(),
	description: varchar('description', { length: 255 }),
	...secureFields
});

export const productAdjustments = mysqlTable('product_adjustments', {
	id: int('id').autoincrement().primaryKey(),
	productsId: int('product_id')
		.notNull()
		.references(() => products.id),
	adjustment: int('adjustment').notNull(), // e.g., +50 for new stock, -1 for a sale, -1 for internal use
	reason: varchar('reason', { length: 255 }),
	transactionId: int('transaction_id').references(() => transactions.id), // Link directly to the sale that caused the adjustment
	...secureFields
});

export const suppliesAdjustments = mysqlTable('supplies_adjustments', {
	id: int('id').autoincrement().primaryKey(),
	suppliesId: int('supplies_id')
		.notNull()
		.references(() => supplies.id),
	adjustment: int('adjustment').notNull(), // e.g., +50 for new stock, -1 for a sale, -1 for internal use
	reason: varchar('reason', { length: 255 }),
	transactionId: int('transaction_id').references(() => transactionSupplies.id, {
		onDelete: 'set null'
	}), //if the adjustment is caused by new stuff coming in
	...secureFields
});
