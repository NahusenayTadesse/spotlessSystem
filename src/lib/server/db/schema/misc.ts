// misc.ts - Handles miscellaneous items like positions and audit logs
import {
	mysqlTable,

	varchar,
	
	timestamp,
	int,
    json,
    date,
    decimal,
	
} from 'drizzle-orm/mysql-core';
import { user } from './user';
import { secureFields } from './secureFields';
import { branches } from './branches';

export const positions = mysqlTable('positions', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('name', { length: 50 }).notNull(),
    description: varchar('description', {length: 255}),
    ...secureFields
});

export const auditLog = mysqlTable('audit_log', {
    id: int('id').autoincrement().primaryKey(),
    userId: varchar('user_id', { length: 255 }).references(() => user.id, {onDelete: 'set null'}),
    action: varchar('action', { length: 32 }).notNull(),
    tableName: varchar('table_name', { length: 32 }).notNull(),
    recordId: varchar('record_id', { length: 255 }).notNull(),
    oldValues: json('old_values'),
    newValues: json('new_values'),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
    ipAddress: varchar('ip_address', { length: 45 })
}); 

export const reports = mysqlTable('reports', {
    id: int('id').autoincrement().primaryKey(),
    reportDate: date('report_date').notNull().unique(), 
    bookedAppointments: int('booked_appointments').default(0),
    cancelledAppointments: int('cancelled_appointments').default(0),
    productsSold: int('products_sold').notNull().default(0),
    servicesRendered: int('services_rendered').notNull(),
    dailyExpenses: decimal('daily_expenses', { precision: 10, scale: 2 }),
    dailyIncome: decimal('daily_income', { precision: 10, scale: 2 }),
    transactions: int('transactions').notNull(),
    staffPaid: int('staff_paid'),
    totalStaffPaid: decimal('total_staff_paid', {precision: 10, scale: 2}),
    staffHired: int('staff_hired'),
    staffFired: int('staff_fired'),
    branchId: int('branch_id').references(()=> branches.id, {onDelete:"set null"}),
})
