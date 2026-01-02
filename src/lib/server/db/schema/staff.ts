// staff.ts - Handles staff profiles, types, contacts, services they provide, schedules, and compensation (salaries, bonuses, commissions)
import { relations } from 'drizzle-orm';
import {
	mysqlTable,
	mysqlEnum,
	varchar,
	datetime,
	timestamp,
	int,
	decimal,
	date,
	time,
	index,
	boolean
} from 'drizzle-orm/mysql-core';
import { secureFields, lesserFields } from './secureFields';
import { user } from './user';
import { paymentMethods, transactionProducts, transactionServices } from './finance';
import { services } from './services';
import { site } from './sites';

export const department = mysqlTable('department', {
	id: int('id').autoincrement().primaryKey(),
	name: varchar('name', { length: 32 }).notNull().unique(),
	phone: varchar('phone', { length: 20 }),
	location: varchar('location', { length: 255 }),
	description: varchar('description', { length: 255 }),
	...lesserFields
});

export const staff = mysqlTable(
	'staff',
	{
		id: int('id').primaryKey().autoincrement(),
		idNo: varchar('id_no', { length: 255 }).notNull(),
		name: varchar('name', { length: 50 }).notNull(),
		fatherName: varchar('father_name', { length: 50 }).notNull(),
		grandFatherName: varchar('grand_father_name', { length: 50 }).notNull(),
		gender: mysqlEnum('gender', ['male', 'female']).notNull().default('male'),
		nationality: varchar('nationality', { length: 50 }).notNull().default('Ethiopia'),
		religion: varchar('religion', { length: 50 }).notNull().default('Christianity'),
		bloodType: mysqlEnum('blood_type', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
		tinNo: varchar('tin_no', { length: 20 }).notNull(),
		departmentId: int('department_id')
			.notNull()
			.references(() => department.id),
		birthDate: date('birth_date').notNull(),
		photo: varchar('photo', { length: 255 }).notNull(),
		govtId: varchar('govt_id', { length: 255 }).notNull(),
		hireDate: timestamp('hire_date').notNull(),
		terminationDate: datetime('termination_date'),
		employmentStatus: mysqlEnum('employment_status', [
			'full_time',
			'on_leave',
			'terminated',
			'probation',
			'contract',
			'intern',
			'part_time',
			'sabbatical',
			'suspended',
			'resigned',
			'retired',
			'deceased'
		]).default('full_time'),

		martialStatus: mysqlEnum('martial_status', [
			'single',
			'married',
			'widowed',
			'divorced',
			'other'
		]).default('single'),

		...secureFields
	},
	(table) => [
		index('first_name_idx').on(table.name),
		index('last_name_idx').on(table.fatherName),
		index('grand_father_name_idx').on(table.grandFatherName)
	]
);

export const employmentStatus = mysqlTable('employment_status', {
	id: int('id').autoincrement().primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	staffId: int('staff_id')
		.references(() => staff.id)
		.notNull(),
	startDate: date('start_date').notNull(),
	endDate: date('end_date').notNull(),
	reason: varchar('reason', { length: 255 }),
	siteId: int('site_id')
		.references(() => site.id)
		.notNull()
});

export const staffFamilies = mysqlTable('staff_families', {
	id: int('id').autoincrement().primaryKey(),
	staffId: int('staff_id').references(() => staff.id, { onDelete: 'cascade' }),
	relationship: mysqlEnum('relationship', [
		'mother',
		'father',
		'spouse',
		'son',
		'daughter',
		'grandchild',
		'grandfather',
		'grandmother',
		'uncle',
		'aunt',
		'brother',
		'sister',
		'other'
	]).notNull(),
	gender: mysqlEnum('gender', ['male', 'female']).notNull().default('male'),
	otherRelationship: varchar('other_relationship', { length: 255 }),
	name: varchar('name', { length: 255 }).notNull(),
	phone: varchar('phone', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull(),
	emergencyContact: boolean('emergency_contact').notNull().default(false),
	...secureFields
});

export const userStaff = mysqlTable('user_staff', {
	id: int('id').autoincrement().primaryKey(),
	userId: varchar('user_id', { length: 255 }).references(() => user.id, { onDelete: 'cascade' }),
	staffId: int('staff_id').references(() => staff.id, { onDelete: 'cascade' })
});

export const staffContacts = mysqlTable('staff_contacts', {
	id: int('id').primaryKey().autoincrement(),
	staffId: int('staff_id')
		.notNull()
		.references(() => staff.id, { onDelete: 'cascade' }),
	contactType: varchar('contact_type', { length: 50 }).notNull(),
	contactDetail: varchar('contact_detail', { length: 255 }).notNull(),
	...secureFields
});

export const staffAccounts = mysqlTable('staff_accounts', {
	id: int('id').primaryKey().autoincrement(),
	staffId: int('staff_id')
		.notNull()
		.references(() => staff.id, { onDelete: 'cascade' }),
	paymentMethodId: int('payment_Method_id').references(() => paymentMethods.id, {
		onDelete: 'set null'
	}),
	accountDetail: varchar('account_detail', { length: 255 }).notNull(),
	...secureFields
});

export const salaries = mysqlTable('salaries', {
	id: int('id').primaryKey().autoincrement(),
	staffId: int('staff_id')
		.notNull()
		.references(() => staff.id, { onDelete: 'cascade' }),
	amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
	startDate: date('start_date').notNull(),
	endDate: date('end_date'),
	...secureFields
});

export const bonuses = mysqlTable('bonuses', {
	id: int('id').primaryKey().autoincrement(),
	staffId: int('staff_id').references(() => staff.id, { onDelete: 'set null' }),
	description: varchar('description', { length: 255 }),
	amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
	bonusDate: date('bonus_date').notNull(),
	...secureFields
});

export const overTime = mysqlTable('over_time', {
	id: int('id').primaryKey().autoincrement(),
	staffId: int('staff_id').references(() => staff.id, { onDelete: 'set null' }),
	reason: varchar('reason', { length: 255 }),
	amountPerHour: decimal('amount_per_hour', { precision: 10, scale: 2 }).notNull(),
	hours: decimal('hours', { precision: 10, scale: 2 }).notNull(),
	total: decimal('total', { precision: 10, scale: 2 }).notNull(),
	date: date('date').notNull(),
	...secureFields
});

export const commissionService = mysqlTable('commissions_services', {
	id: int('id').primaryKey().autoincrement(),
	saleItemId: int('sale_item_id').references(() => transactionServices.id, {
		onDelete: 'set null'
	}),
	staffId: int('staff_id').references(() => staff.id, { onDelete: 'set null' }),
	amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
	commissionDate: date('commission_date').notNull(),
	...secureFields
});

export const commissionProduct = mysqlTable('commissions_product', {
	id: int('id').primaryKey().autoincrement(),
	saleItemId: int('sale_item_id')
		.notNull()
		.references(() => transactionProducts.id, { onDelete: 'cascade' }),
	staffId: int('staff_id').references(() => staff.id, { onDelete: 'set null' }),
	amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
	commissionDate: date('commission_date').notNull(),
	...secureFields
});

export const tipsProduct = mysqlTable('tips_product', {
	id: int('id').primaryKey().autoincrement(),
	saleItemId: int('sale_item_id')
		.notNull()
		.references(() => transactionProducts.id, { onDelete: 'cascade' }),
	staffId: int('staff_id').references(() => staff.id, { onDelete: 'set null' }),
	amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
	tipDate: date('tip_date').notNull(),
	...secureFields
});

export const tipsService = mysqlTable('tips_service', {
	id: int('id').primaryKey().autoincrement(),
	saleItemId: int('sale_item_id').references(() => transactionServices.id, {
		onDelete: 'set null'
	}),
	staffId: int('staff_id').references(() => staff.id, { onDelete: 'set null' }),
	amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
	tipDate: date('tip_date').notNull(),
	...secureFields
});

export const staffServices = mysqlTable('staff_services', {
	id: int('id').autoincrement().primaryKey(),
	staffId: int('staff_id')
		.notNull()
		.references(() => staff.id, { onDelete: 'cascade' }),
	serviceId: int('service_id')
		.notNull()
		.references(() => services.id, { onDelete: 'cascade' }),
	...secureFields
});

export const deductions = mysqlTable('deductions', {
	id: int('id').autoincrement().primaryKey(),
	staffId: int('staff_id').references(() => staff.id, { onDelete: 'set null' }),
	type: varchar('type', { length: 100 }).notNull(), // e.g., 'Income Tax', 'Pension', 'Health Insurance'
	amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
	deductionDate: date('deduction_date').notNull(),
	...secureFields
});

export const staffSchedule = mysqlTable('staff_schedule', {
	id: int('id').autoincrement().primaryKey(),
	staffId: int('staff_id')
		.notNull()
		.references(() => staff.id, { onDelete: 'cascade' }),
	shiftDate: date('shift_date').notNull(),
	startTime: time('start_time').notNull(),
	endTime: time('end_time').notNull(),
	...secureFields
});

export const staffServicesRelations = relations(staffServices, ({ one }) => ({
	staff: one(staff, { fields: [staffServices.staffId], references: [staff.id] }),
	service: one(services, { fields: [staffServices.serviceId], references: [services.id] })
}));

export const staffScheduleRelations = relations(staffSchedule, ({ one }) => ({
	staff: one(staff, {
		fields: [staffSchedule.staffId],
		references: [staff.id]
	})
}));
