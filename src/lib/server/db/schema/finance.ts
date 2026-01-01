// finance.ts - Handles sales, expenses, payroll, and other money-related transactions
import { relations } from 'drizzle-orm';
import {
	mysqlTable,
	mysqlEnum,
	varchar,
	int,
	decimal,
	date,
  year,
  unique,
} from 'drizzle-orm/mysql-core';
import { appointments } from './customer-appointment';
import { staff } from './staff';
import { secureFields } from './secureFields';
import { services } from './services';
import { products } from './inventory';
import { supplies } from '../schema';


export const paymentMethods = mysqlTable('payment_methods', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull().unique(), 
    description: varchar('description', {length: 255}),
    ...secureFields
});


export const transactions = mysqlTable('transactions', {
  id: int('id').primaryKey().autoincrement(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  paymentStatus: mysqlEnum('payment_status', [ 'pending',
  'pending',
  'paid',
  'unpaid',
  'refunded',
  'partially_paid',
  'partially_refunded',
  'overpaid',
  'disputed']).default('pending'),
  paymentMethodId: int('payment_method_id').references(() => paymentMethods.id, {onDelete: 'set null'}),  
  recieptLink: varchar('reciept_link', {length: 255}),
    ...secureFields
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
    paymentMethod: one(paymentMethods, {
    fields: [transactions.paymentMethodId],
    references: [paymentMethods.id]
  }),

}));

export const transactionServices = mysqlTable('transaction_services', {
  id: int('id').primaryKey().autoincrement(),
  appointmentId: int('appointment_id').references(() => appointments.id),
  staffId: int('staff_id').references(() => staff.id).notNull(),
  transactionId: int('transaction_id')
    .notNull()
    .references(() => transactions.id, {onDelete: 'cascade'}),
  serviceId: int('service_id')
    .notNull()
    .references(() => services.id),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  tip: decimal('tip', { precision: 10, scale: 2 }).notNull().default('0'),
  discount: int('discount').references(()=> discounts.id),
  tax: decimal('tax', { precision: 10, scale: 2 }),
  total: decimal('total', { precision: 10, scale: 2 }),
  ...secureFields
});




export const transactionProducts = mysqlTable('transaction_products', {
  id: int('id').primaryKey().autoincrement(),
  appointmentId: int('appointment_id').references(() => appointments.id),
  transactionId: int('transaction_id')
    .notNull()
    .references(() => transactions.id, {onDelete: 'cascade'}),
  staffId: int('staff_id').references(() => staff.id, {onDelete: 'set null'}),
  tip: decimal('tip', { precision: 10, scale: 2 }).notNull().default('0'),
  productId: int('product_id').references(()=>products.id, {onDelete: 'set null'}),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull().default('1'),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(), 
  discount: int('discount').references(()=> discounts.id),
  tax: decimal('tax', { precision: 10, scale: 2 }),
  total: decimal('total', { precision: 10, scale: 2 }),
  ...secureFields
});

export const discounts = mysqlTable('discounts', {
    id: int('id').primaryKey().autoincrement(),
    amount: decimal('amount', {precision: 10, scale: 2}),
    name: varchar('name', {length: 50}).notNull().unique(),
    description: varchar('description', {length: 255}),
    ...secureFields
})

export const transactionSupplies = mysqlTable('transaction_supplies', {
  id: int('id').primaryKey().autoincrement(),
  transactionId: int('transaction_id')
    .notNull()
    .references(() => transactions.id, {onDelete: 'cascade'}),
  supplyId: int('supply_id').references(()=>supplies.id, {onDelete: 'set null'}), 
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull().default("1"),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(), 
  ...secureFields
});

export const transactionBookingFee = mysqlTable('transaction_booking_fees', {
  id: int('id').primaryKey().autoincrement(),
  transactionId: int('transaction_id')
    .notNull()
    .references(() => transactions.id, {onDelete: 'cascade'}),
  appointmentId: int('appointment_id')
    .notNull().references(()=>appointments.id, {onDelete: 'cascade'}), 
  fee: decimal('fee', { precision: 10, scale: 2 }).notNull(), 
   ...secureFields
});




export const expenses = mysqlTable('expenses', {
	id: int('id').autoincrement().primaryKey(),
	expenseDate: date('expense_date').notNull(),
	type: int('type').notNull().references(()=> expensesType.id),
  description: varchar('description', {length: 255}),
	total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  transactionId: int('transaction_id')
    .notNull()
.references(() => transactions.id, {onDelete: 'cascade'}),
  ...secureFields
});

export const expensesType = mysqlTable('expenses_type', {
     	id: int('id').autoincrement().primaryKey(),
      name: varchar('name', {length: 255}).notNull().unique(),
    description: varchar('description', {length: 255}),
    ...secureFields
})



// export const payrollRuns = mysqlTable('payroll_runs', {
// 	id: int('id').autoincrement().primaryKey(),
// 	payPeriodStart: date('pay_period_start').notNull(),
// 	payPeriodEnd: date('pay_period_end').notNull(),
// 	paymentDate: date('payment_date').notNull(),

//    month: mysqlEnum("month", [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ]).notNull(),
  
//   year: year('year').notNull(),
// 	status: mysqlEnum('status', ['pending', 'processing', 'completed', 'failed'])
// 		.notNull()
// 		.default('pending'),
	
//     totalNet: decimal('total_net', { precision: 10, scale: 2 }),
//     totalDeductions: decimal('total_deductions', { precision: 10, scale: 2 }),
// 	  totalPaid: decimal('total_paid', { precision: 10, scale: 2 }),
// 	...secureFields
// }, (t) => [
//   unique().on(t.month, t.year)]);

export const payrollEntries = mysqlTable('payroll_entries', {
    id: int('id').autoincrement().primaryKey(),
    staffId: int('staff_id').references(() => staff.id),
    month: mysqlEnum("month", [
    "January",
    "February",
    "March",
    "April",
    "May", 
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]).notNull(),
    year: year('year').notNull(),
    payPeriodStart: date('pay_period_start').notNull(),
	  payPeriodEnd: date('pay_period_end').notNull(),
    basicSalary: decimal('basic_salary', { precision: 10, scale: 2 }),
    overtimeAmount: decimal('overtime_amount', { precision: 10, scale: 2 }),
    deductions: decimal('deduction', { precision: 10, scale: 2 }),    
    commissionAmount: decimal('commission_amount', { precision: 10, scale: 2 }),
    bonusAmount: decimal('bonus_amount', { precision: 10, scale: 2 }),
    allowances: decimal('allowances', { precision: 10, scale: 2 }),
    netAmount: decimal('net_amount', { precision: 10, scale: 2 }),
    paidAmount: decimal('paid_amount', { precision: 10, scale: 2 }),
    taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }),
    status: mysqlEnum('status', ['pending', 'approved', 'paid']).default('pending').notNull(),    
    paymentMethodId: int('payment_method_id').references(() => paymentMethods.id),  
    paymentDate: date('payment_date'),
    notes: varchar('notes', {length: 255}),
    recieptLink: varchar('reciept_link', {length: 255}),
    ...secureFields
}, (t) => [
  unique().on(t.staffId,t.payPeriodStart, t.payPeriodEnd)]);

export const transactionRelations = relations(transactions, ({ many }) => ({
	
	transactionProducts: many(transactionProducts), // this will be connected via saleId
	transactionServices: many(transactionServices), // this will be connected via saleId
	transactionSupplies: many(transactionSupplies), // this will be connected via saleId
	transactionBookingFee: many(transactionBookingFee), // this will be connected via saleId
}));

export const transactionProductsRelations = relations(transactionProducts, ({ one }) => ({
	sale: one(transactions, {
		fields: [transactionProducts.transactionId],
		references: [transactions.id],
	}),
	product: one(products, {
		fields: [transactionProducts.productId],
		references: [products.id],
	}),
}));


export const transactionServicessRelations = relations(transactionServices, ({ one }) => ({
	sale: one(transactions, {
		fields: [transactionServices.transactionId],
		references: [transactions.id],
	}),
	service: one(services, {
		fields: [transactionServices.serviceId],
		references: [services.id],
	}),
}));