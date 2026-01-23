import { db } from '$lib/server/db';
import {
	paymentMethods,
	payrollEntries,
	salaries,
	employee,
	department,
	staffAccounts,
	taxType,
	missingDays,
	overTime,
	deductions,
	bonuses,
	commission
} from '$lib/server/db/schema';
import { and, count, desc, eq, isNull, sql } from 'drizzle-orm';

import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { month_year } = params;

	const [m, y] = month_year.split('_');

	const month = m;
	const year = y;

	// const payrollData = await db
	// 	.select({
	// 		// Select all payroll columns (these will be NULL if no matching entry exists)
	// 		id: employee.id,
	// 		staffId: payrollEntries.staffId,
	// 		name: sql<string>`TRIM(CONCAT(${employee.name}, ' ', COALESCE(${employee.fatherName}, '')))`,
	// 		position: department.name,
	// 		month: payrollEntries.month,
	// 		year: payrollEntries.year,
	// 		payPeriod: sql<string>`CONCAT(DATE_FORMAT(${payrollEntries.payPeriodStart}, '%Y-%m-%d'), ' to ', DATE_FORMAT(${payrollEntries.payPeriodEnd}, '%Y-%m-%d'))`,
	// 		basicSalary: salaries.amount,
	// 		taxType: taxType.rate,
	// 		bonusAmount: payrollEntries.bonusAmount,
	// 		netAmount: payrollEntries.netAmount,
	// 		paidAmount: payrollEntries.paidAmount,
	// 		paymentMethod: paymentMethods.name,
	// 		taxAmount: payrollEntries.taxAmount,
	// 		account: staffAccounts.accountDetail,
	// 		status: payrollEntries.status,
	// 		missingDays: count(missingDays.id),
	// 		paymentMethodId: payrollEntries.paymentMethodId,
	// 		bank: paymentMethods.name,
	// 		paymentDate: sql<string>`DATE_FORMAT(${payrollEntries.paymentDate}, '%W, %b %d %Y')`,
	// 		notes: payrollEntries.notes,
	// 		receiptLink: payrollEntries.recieptLink,
	// 		overtime: overTime.total,
	//      bonus: bonuses.amount,
	// 		commision: commission.amount,
	// 		deductions: sql<number>`COALESCE(SUM(${deductions.amount}), 0)`
	// 	})
	// 	.from(employee)
	// 	.leftJoin(
	// 		payrollEntries,
	// 		and(
	// 			eq(payrollEntries.staffId, employee.id),
	// 			eq(payrollEntries.month, month),
	// 			eq(payrollEntries.year, year)
	// 		)
	// 	)
	// 	.leftJoin(
	// 		staffAccounts,
	// 		and(
	// 			eq(staffAccounts.staffId, employee.id),
	// 			eq(staffAccounts.isActive, true) // Only join the active account
	// 		)
	// 	)
	// 	.leftJoin(taxType, eq(taxType.id, employee.taxType))
	// 	.leftJoin(
	// 		missingDays,
	// 		and(eq(missingDays.staffId, employee.id), eq(missingDays.deductable, true))
	// 	)
	// 	.leftJoin(paymentMethods, eq(staffAccounts.paymentMethodId, paymentMethods.id))
	// 	.leftJoin(salaries, and(eq(salaries.staffId, employee.id), isNull(salaries.endDate)))
	// 	.leftJoin(department, eq(department.id, employee.departmentId))
	// 	.where(eq(employee.isActive, true))
	// 	.groupBy(employee.id)
	// 	.orderBy(desc(payrollEntries.paymentDate));
	//

	const payrollData = await db
		.select({
			id: employee.id,
			staffId: payrollEntries.staffId,
			name: sql<string>`TRIM(CONCAT_WS(' ', ${employee.name}, ${employee.fatherName}, ${employee.grandFatherName}))`,
			department: department.name,
			month: payrollEntries.month,
			year: payrollEntries.year,
			payPeriod: sql<string>`CONCAT(DATE_FORMAT(${payrollEntries.payPeriodStart}, '%Y-%m-%d'), ' to ', DATE_FORMAT(${payrollEntries.payPeriodEnd}, '%Y-%m-%d'))`,
			basicSalary: salaries.amount,
			taxType: taxType.rate,
			bonusAmount: payrollEntries.bonusAmount,
			netAmount: payrollEntries.netAmount,
			paidAmount: payrollEntries.paidAmount,
			paymentMethod: paymentMethods.name,
			taxAmount: payrollEntries.taxAmount,
			account: staffAccounts.accountDetail,
			status: payrollEntries.status,
			missingDays: count(missingDays.id),
			paymentMethodId: payrollEntries.paymentMethodId,
			bank: paymentMethods.name,
			paymentDate: sql<string>`DATE_FORMAT(${payrollEntries.paymentDate}, '%W, %b %d %Y')`,
			notes: payrollEntries.notes,
			receiptLink: payrollEntries.recieptLink,
			// Ensure these are aggregated if multiple entries exist per employee
			overtime: sql<number>`COALESCE(SUM(${overTime.total}), 0)`,
			bonus: sql<number>`COALESCE(SUM(${bonuses.amount}), 0)`,
			commision: sql<number>`COALESCE(SUM(${commission.amount}), 0)`,
			deductions: sql<number>`COALESCE(SUM(${deductions.amount}), 0)`,
			totalPay: sql<number>`
        (COALESCE(${salaries.amount}, 0) +
         COALESCE(SUM(${overTime.total}), 0) +
         COALESCE(SUM(${bonuses.amount}), 0) +
         COALESCE(SUM(${commission.amount}), 0)) -
         COALESCE(SUM(${deductions.amount}), 0)
      `.as('total_pay')
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
		.leftJoin(
			staffAccounts,
			and(eq(staffAccounts.staffId, employee.id), eq(staffAccounts.isActive, true))
		)
		.leftJoin(taxType, eq(taxType.id, employee.taxType))
		.leftJoin(
			missingDays,
			and(eq(missingDays.staffId, employee.id), eq(missingDays.deductable, true))
		)
		.leftJoin(paymentMethods, eq(staffAccounts.paymentMethodId, paymentMethods.id))
		.leftJoin(salaries, and(eq(salaries.staffId, employee.id), isNull(salaries.endDate)))
		.leftJoin(department, eq(department.id, employee.departmentId))

		// --- ADDED JOINS BELOW ---
		.leftJoin(overTime, eq(overTime.staffId, employee.id))
		.leftJoin(bonuses, eq(bonuses.staffId, employee.id))
		.leftJoin(commission, eq(commission.staffId, employee.id))
		.leftJoin(deductions, eq(deductions.staffId, employee.id))
		// -------------------------

		.where(eq(employee.isActive, true))
		.groupBy(
			employee.id,
			payrollEntries.id,
			department.id,
			salaries.id,
			taxType.id,
			staffAccounts.id,
			paymentMethods.id,
			salaries.amount
		);

	return {
		payrollData,
		month,
		year
	};
};
