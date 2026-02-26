// Updated subcity snippet

import {
	mysqlTable,
	int,
	varchar,
	boolean,
	date,
	decimal,
	year,
	mysqlEnum
} from 'drizzle-orm/mysql-core';
import { secureFields } from './secureFields';
import { customers } from './customers';
import { address } from './locations';
import { employee } from './staff';
import { services } from './services';
import { transactions } from './finance';

export const site = mysqlTable('site', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 50 }).notNull(),
	phone: varchar('phone', { length: 20 }).notNull(),
	serviceId: int('service_id').references(() => services.id),
	customerId: int('customer_id')
		.notNull()
		.references(() => customers.id),
	address: int('address')
		.notNull()
		.references(() => address.id),
	startDate: date('start_date').notNull(),
	endDate: date('end_date').notNull(),
	includeVat: boolean('include_vat').notNull().default(false),
	siteCommission: boolean('site_commission').notNull().default(false),
	...secureFields
});

export const siteContracts = mysqlTable('site_contracts', {
	id: int('id').primaryKey().autoincrement(),
	siteId: int('customer_id')
		.notNull()
		.references(() => site.id, { onDelete: 'cascade' }),
	monthlyAmount: decimal('contract_amount', { precision: 10, scale: 2 }).notNull(),
	serviceId: int('service_id').references(() => services.id),
	contractYear: year('contract_year').notNull(),
	contractDate: date('contract_date').notNull(),
	startDate: date('start_date').notNull(),
	endDate: date('end_date').notNull(),
	contractFile: varchar('contract_file', { length: 255 }).notNull(),
	commissionConsidered: boolean('commission_considered').notNull().default(true),
	signingOfficer: int('signing_officer').references(() => employee.id, { onDelete: 'set null' }),
	...secureFields
});

export const siteMonthlyPayments = mysqlTable('site_monthly_payments', {
	id: int('id').primaryKey().autoincrement(),

	contractId: int('contract_id')
		.notNull()
		.references(() => siteContracts.id, { onDelete: 'cascade' }),
	paymentRequestFile: varchar('payment_request_file', { length: 255 }).notNull(),
	penaltyAmount: decimal('penalty_amount', { precision: 10, scale: 2 }).notNull().default('0'),
	fsNumber: varchar('fs_number', { length: 255 }).notNull(),
	invoiceNumber: varchar('invoice_number', { length: 255 }).notNull(),
	requestAmount: decimal('request_amount', { precision: 10, scale: 2 }).notNull(),
	paymentAmount: decimal('payment_amount', { precision: 10, scale: 2 }).notNull(),
	beforeVat: decimal('before_Vat', { precision: 10, scale: 2 }).notNull(),
	vat: decimal('vat', { precision: 10, scale: 2 }).notNull(),
	withholdAmount: decimal('withhold_amount', { precision: 10, scale: 2 }).notNull(),
	withholdFile: varchar('withhold_file', { length: 255 }).notNull(),
	withholdInvoiceNumber: varchar('invoice_number', { length: 255 }).notNull(),
	month: mysqlEnum('month', [
		'መስከረም', // Meskerem
		'ጥቅምት', // Tikimt
		'ህዳር', // Hidar
		'ታህሳስ', // Tahsas
		'ጥር', // Tir
		'የካቲት', // Yekatit
		'መጋቢት', // Megabit
		'ሚያዝያ', // Miyazya
		'ግንቦት', // Ginbot
		'ሰኔ', // Sene
		'ሐምሌ', // Hamle
		'ነሐሴ' // Nehasse
	]).notNull(),
	year: year('year').notNull(),
	date: date('date').notNull(),
	transactionId: int('transaction_id')
		.notNull()
		.references(() => transactions.id, { onDelete: 'cascade' }),
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

export const sitePenalties = mysqlTable('site_penalties', {
	id: int('id').primaryKey().autoincrement(),
	contractId: int('contract_id')
		.notNull()
		.references(() => siteContracts.id, { onDelete: 'cascade' }),
	penaltyReason: varchar('penalty_type', { length: 255 }).notNull(),
	penaltyLetter: varchar('penalty_letter', { length: 255 }),
	penaltyAmount: decimal('penalty_amount', { precision: 10, scale: 2 }).notNull(),
	penaltyDate: date('penalty_date').notNull(),
	month: mysqlEnum('month', [
		'መስከረም', // Meskerem
		'ጥቅምት', // Tikimt
		'ህዳር', // Hidar
		'ታህሳስ', // Tahsas
		'ጥር', // Tir
		'የካቲት', // Yekatit
		'መጋቢት', // Megabit
		'ሚያዝያ', // Miyazya
		'ግንቦት', // Ginbot
		'ሰኔ', // Sene
		'ሐምሌ', // Hamle
		'ነሐሴ' // Nehasse
	]).notNull(),
	year: year('year').notNull(),

	...secureFields
});
