import { db } from '$lib/server/db';
import {
	paymentMethods,
	payrollEntries,
	salaries,
	employee,
	department
} from '$lib/server/db/schema';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';

import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { month_year } = params;

	const [m, y] = month_year.split('_');

	const month = m;
	const year = y;

	const payrollData = await db
		.select({
			// Select all payroll columns (these will be NULL if no matching entry exists)
			id: employee.id,
			staffId: payrollEntries.staffId,
			name: sql<string>`TRIM(CONCAT(${employee.name}, ' ', COALESCE(${employee.fatherName}, '')))`,
			position: department.name,
			month: payrollEntries.month,
			year: payrollEntries.year,
			payPeriod: sql<string>`CONCAT(DATE_FORMAT(${payrollEntries.payPeriodStart}, '%Y-%m-%d'), ' to ', DATE_FORMAT(${payrollEntries.payPeriodEnd}, '%Y-%m-%d'))`,
			basicSalary: salaries.amount,
			overtimeAmount: payrollEntries.overtimeAmount,
			deductions: payrollEntries.deductions,
			commissionAmount: payrollEntries.commissionAmount,
			bonusAmount: payrollEntries.bonusAmount,
			netAmount: payrollEntries.netAmount,
			paidAmount: payrollEntries.paidAmount,
			taxAmount: payrollEntries.taxAmount,
			status: payrollEntries.status,
			paymentMethodId: payrollEntries.paymentMethodId,
			paymentMethodName: paymentMethods.name,
			paymentDate: sql<string>`DATE_FORMAT(${payrollEntries.paymentDate}, '%W, %b %d %Y')`,
			notes: payrollEntries.notes,
			receiptLink: payrollEntries.recieptLink
		})
		.from(employee)
		.leftJoin(
			payrollEntries,
			and(
				eq(payrollEntries.staffId, employee.id),
				eq(payrollEntries.month, month),
				eq(payrollEntries.year, year)
			)
		)
		.leftJoin(paymentMethods, eq(payrollEntries.paymentMethodId, paymentMethods.id))
		.leftJoin(salaries, and(eq(salaries.staffId, employee.id), isNull(salaries.endDate)))
		.leftJoin(department, eq(department.id, employee.departmentId))
		.where(eq(employee.isActive, true))
		.orderBy(desc(payrollEntries.paymentDate));

	return {
		payrollData,
		month,
		year
	};
};
