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
import { paymentMethods, transactionServices } from './finance';
import { services } from './services';
import { site } from './sites';
import { address } from './locations';

export const department = mysqlTable('department', {
	id: int('id').autoincrement().primaryKey(),
	name: varchar('name', { length: 32 }).notNull().unique(),
	phone: varchar('phone', { length: 20 }),
	location: varchar('location', { length: 255 }),
	description: varchar('description', { length: 255 }),
	...lesserFields
});

export const employmentStatuses = mysqlTable('employment_statuses', {
	id: int('id').autoincrement().primaryKey(),
	name: varchar('name', { length: 32 }).notNull().unique(),
	description: varchar('description', { length: 255 }),
	...lesserFields
});

export const educationalLevel = mysqlTable('educational_level', {
	id: int('id').autoincrement().primaryKey(),
	name: varchar('name', { length: 32 }).notNull().unique(),
	description: varchar('description', { length: 255 }),
	...lesserFields
});

export const employee = mysqlTable(
	'employee',
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
		employmentStatus: int('employment_status')
			.references(() => employmentStatuses.id)
			.notNull(),
		educationalLevel: int('educational_level').references(() => educationalLevel.id),
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

export const employeeGuarantor = mysqlTable('employee_guarantor', {
	id: int('id').autoincrement().primaryKey(),
	staffId: int('staff_id')
		.notNull()
		.references(() => employee.id),
	name: varchar('name', { length: 255 }).notNull(),
	relationship: mysqlEnum('relationship', [
		'mother',
		'father',
		'spouse',
		'son',
		'daughter',
		'other'
	]).notNull(),
	relation: varchar('relation', { length: 255 }).notNull(),
	jobType: varchar('job_type', { length: 255 }).notNull(),
	company: varchar('company', { length: 255 }).notNull(),
	salary: decimal('salary', { precision: 10, scale: 2 }).notNull(),
	gurantorDocument: varchar('gurantor_document', { length: 255 }).notNull(),
	phone: varchar('phone', { length: 255 }).notNull(),
	photo: varchar('photo', { length: 255 }).notNull(),
	govtId: varchar('govt_id', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }),
	address: int('address')
		.references(() => address.id)
		.notNull(),
	...secureFields
});
export const taxType = mysqlTable('tax_type', {
	id: int('id').autoincrement().primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	rate: decimal('rate', { precision: 15, scale: 2 }).notNull(),
	...lesserFields
});

export const pensionType = mysqlTable('pension_type', {
	id: int('id').autoincrement().primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	rate: decimal('rate', { precision: 15, scale: 2 }).notNull(),
	taxtype: int('tax_type')
		.references(() => taxType.id)
		.notNull()
});

export const pension = mysqlTable('pension', {
	id: int('id').autoincrement().primaryKey(),
	staffId: int('staff_id')
		.references(() => employee.id)
		.notNull(),
	startDate: date('start_date').notNull(),
	endDate: date('end_date').notNull(),
	pensionAmount: decimal('pension_amount', { precision: 10, scale: 2 }).notNull(),
	pensionType: varchar('pension_type', { length: 255 }).notNull()
});

export const leave = mysqlTable('leave', {
	id: int('id').autoincrement().primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	staffId: int('staff_id')
		.references(() => employee.id)
		.notNull(),
	requestDate: date('request_date').notNull(),
	startDate: date('start_date').notNull(),
	endDate: date('end_date').notNull(),
	reason: varchar('reason', { length: 255 }),
	leaveLetter: varchar('leave_letter', { length: 100 }),
	siteId: int('site_id')
		.references(() => site.id)
		.notNull(),
	...secureFields
});

export const staffFamilies = mysqlTable('staff_families', {
	id: int('id').autoincrement().primaryKey(),
	staffId: int('staff_id').references(() => employee.id, { onDelete: 'cascade' }),
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
	staffId: int('staff_id').references(() => employee.id, { onDelete: 'cascade' })
});

export const staffContacts = mysqlTable('staff_contacts', {
	id: int('id').primaryKey().autoincrement(),
	staffId: int('staff_id')
		.notNull()
		.references(() => employee.id, { onDelete: 'cascade' }),
	contactType: varchar('contact_type', { length: 50 }).notNull(),
	contactDetail: varchar('contact_detail', { length: 255 }).notNull(),
	...secureFields
});

export const staffAccounts = mysqlTable('staff_accounts', {
	id: int('id').primaryKey().autoincrement(),
	staffId: int('staff_id')
		.notNull()
		.references(() => employee.id, { onDelete: 'cascade' }),
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
		.references(() => employee.id, { onDelete: 'cascade' }),
	amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
	startDate: date('start_date').notNull(),
	endDate: date('end_date'),
	...secureFields
});

export const bonuses = mysqlTable('bonuses', {
	id: int('id').primaryKey().autoincrement(),
	staffId: int('staff_id').references(() => employee.id, { onDelete: 'set null' }),
	description: varchar('description', { length: 255 }),
	amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
	bonusDate: date('bonus_date').notNull(),
	...secureFields
});

export const overTime = mysqlTable('over_time', {
	id: int('id').primaryKey().autoincrement(),
	staffId: int('staff_id').references(() => employee.id, { onDelete: 'set null' }),
	reason: varchar('reason', { length: 255 }),
	amountPerHour: decimal('amount_per_hour', { precision: 10, scale: 2 }).notNull(),
	hours: decimal('hours', { precision: 10, scale: 2 }).notNull(),
	total: decimal('total', { precision: 10, scale: 2 }).notNull(),
	date: date('date').notNull(),
	...secureFields
});

export const commission = mysqlTable('commissions_services', {
	id: int('id').primaryKey().autoincrement(),

	staffId: int('staff_id').references(() => employee.id, { onDelete: 'set null' }),
	amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
	reason: varchar('reason', { length: 255 }),
	commissionDate: date('commission_date').notNull(),
	...secureFields
});

export const staffServices = mysqlTable('staff_services', {
	id: int('id').autoincrement().primaryKey(),
	staffId: int('staff_id')
		.notNull()
		.references(() => employee.id, { onDelete: 'cascade' }),
	serviceId: int('service_id')
		.notNull()
		.references(() => services.id, { onDelete: 'cascade' }),
	...secureFields
});

export const deductions = mysqlTable('deductions', {
	id: int('id').autoincrement().primaryKey(),
	staffId: int('staff_id').references(() => employee.id, { onDelete: 'set null' }),
	type: varchar('type', { length: 100 }).notNull(),
	reason: varchar('reason', { length: 255 }).notNull(),

	amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
	deductionDate: date('deduction_date').notNull(),
	warningType: varchar('warning_type', { length: 100 }),
	warningReason: varchar('warning_reason', { length: 255 }),
	...secureFields
});

export const staffSchedule = mysqlTable('staff_schedule', {
	id: int('id').autoincrement().primaryKey(),
	staffId: int('staff_id')
		.notNull()
		.references(() => employee.id, { onDelete: 'cascade' }),
	shiftDate: date('shift_date').notNull(),
	startTime: time('start_time').notNull(),
	endTime: time('end_time').notNull(),
	...secureFields
});

export const staffServicesRelations = relations(staffServices, ({ one }) => ({
	staff: one(employee, { fields: [staffServices.staffId], references: [employee.id] }),
	service: one(services, { fields: [staffServices.serviceId], references: [services.id] })
}));

export const staffScheduleRelations = relations(staffSchedule, ({ one }) => ({
	staff: one(employee, {
		fields: [staffSchedule.staffId],
		references: [employee.id]
	})
}));

export const employeeTermination = mysqlTable('empoloyee_termination', {
	id: int('id').autoincrement().primaryKey(),
	staffId: int('staff_id')
		.notNull()
		.references(() => employee.id),
	reason: varchar('reason', { length: 255 }),
	terminationDate: date('termination_date').notNull(),
	...secureFields
});

export const qualification = mysqlTable('qualification', {
	id: int('id').autoincrement().primaryKey(),
	staffId: int('staff_id')
		.notNull()
		.references(() => employee.id),
	field: varchar('field', { length: 255 }),
	educationLevel: int('education_level')
		.references(() => educationalLevel.id)
		.notNull(),
	schoolName: varchar('school_name', { length: 255 }),
	graduationDate: date('qualification_date').notNull(),
	...secureFields
});

export const staffQualificationRelations = relations(qualification, ({ one }) => ({
	staff: one(employee, {
		fields: [qualification.staffId],
		references: [employee.id]
	})
}));
