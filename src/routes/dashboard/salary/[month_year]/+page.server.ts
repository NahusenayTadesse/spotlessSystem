import { db } from '$lib/server/db';
import {
	paymentMethods,
	salaries,
	employee,
	department,
	staffAccounts,
	missingDays,
	overTime,
	deductions,
	bonuses,
	commission,
	payrollEntries
} from '$lib/server/db/schema';
import { and, count, desc, eq, isNull, sql } from 'drizzle-orm';

import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { month_year } = params;

	const [m, y] = month_year.split('_');

	const month = m;
	const year = y;

	// 1. Create subqueries for your one-to-many relationships

	// 2. Main Query
	const payrollData = await db
		.select({
			id: employee.id,
			name: sql<string>`TRIM(CONCAT_WS(' ', ${employee.name}, ${employee.fatherName}, ${employee.grandFatherName}))`,
			department: department.name,
			basicSalary: payrollEntries.basicSalary,
			positionAllowance: payrollEntries.positionAllowance,
			housingAllowance: payrollEntries.housingAllowance,
			transport: payrollEntries.transportAllowance,
			nonTaxable: payrollEntries.nonTaxableAllowance,
			paymentMethod: paymentMethods.name,
			account: staffAccounts.accountDetail,
			bank: paymentMethods.name,
			overTime: payrollEntries.overtimeAmount,
			bonus: payrollEntries.bonusAmount,
			commision: payrollEntries.commissionAmount,
			deductions: payrollEntries.deductions,
			gross: payrollEntries.grossAmount
		})
		.from(payrollEntries)
		.leftJoin(employee, eq(payrollEntries.staffId, employee.id))
		.leftJoin(department, eq(department.id, employee.departmentId))
		.leftJoin(
			staffAccounts,
			and(eq(staffAccounts.staffId, employee.id), eq(staffAccounts.isActive, true))
		)

		.leftJoin(paymentMethods, eq(staffAccounts.paymentMethodId, paymentMethods.id))
		.where(and(eq(payrollEntries.month, month), eq(payrollEntries.year, Number(year))));
	return {
		payrollData,
		month,
		year
	};
};
