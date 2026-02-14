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
	payrollEntries,
	payrollReceipts,
	payrollRuns,
	user
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
			transportAllowance: payrollEntries.transportAllowance,
			nonTaxable: payrollEntries.nonTaxableAllowance,
			paymentMethod: paymentMethods.name,
			attendancePenality: payrollEntries.attendancePenality,
			bank: paymentMethods.name,
			overTime: payrollEntries.overtimeAmount,
			bonus: payrollEntries.bonusAmount,
			taxAmount: payrollEntries.taxAmount,
			commision: payrollEntries.commissionAmount,
			deductions: payrollEntries.deductions,
			gross: payrollEntries.grossAmount,
			netPay: payrollEntries.netAmount
		})
		.from(payrollEntries)
		.leftJoin(employee, eq(payrollEntries.staffId, employee.id))
		.leftJoin(department, eq(department.id, employee.departmentId))
		.leftJoin(paymentMethods, eq(payrollEntries.paymentMethodId, paymentMethods.id))
		.where(and(eq(payrollEntries.month, month), eq(payrollEntries.year, Number(year))));

	const payrollReciept = await db
		.select({
			id: payrollReceipts.id,
			payPeriodStart: payrollReceipts.payPeriodStart,
			payPeriodEnd: payrollReceipts.payPeriodEnd,
			amount: payrollReceipts.amount,
			paidDate: payrollReceipts.paidDate,
			numberOfEmployees: payrollReceipts.numberOfEmployees,
			recieptLink: payrollReceipts.recieptLink,
			uploadedBy: user.name,
			uploadedById: user.id
		})
		.from(payrollReceipts)
		.leftJoin(payrollRuns, eq(payrollReceipts.payrollRunId, payrollRuns.id))
		.leftJoin(user, eq(payrollReceipts.createdBy, user.id))
		.where(and(eq(payrollRuns.month, month), eq(payrollRuns.year, Number(year))));

	return {
		payrollData,
		payrollReciept,
		month,
		year
	};
};
