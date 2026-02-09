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
	commission
} from '$lib/server/db/schema';
import { and, count, desc, eq, isNull, sql } from 'drizzle-orm';

import type { PageServerLoad } from '../$types';
import { House } from '@lucide/svelte';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { month_year } = params;

	const [m, y] = month_year.split('_');

	const month = m;
	const year = y;

	const payrollData = await db
		.select({
			id: employee.id,
			name: sql<string>`TRIM(CONCAT_WS(' ', ${employee.name}, ${employee.fatherName}, ${employee.grandFatherName}))`,
			department: department.name,

			basicSalary: salaries.amount,
			positionAllowance: sql<number>`COALESCE(SUM(${salaries.positionAllowance}), 0)`,
			housingAllowance: sql<number>`COALESCE(SUM(${salaries.housingAllowance}), 0)`,
			transport: sql<number>`COALESCE(SUM(${salaries.transportationAllowance}), 0)`,
			nonTaxable: sql<number>`COALESCE(SUM(${salaries.nonTaxAllowance}), 0)`,
			paymentMethod: paymentMethods.name,
			account: staffAccounts.accountDetail,
			missingDays: count(missingDays.id),
			bank: paymentMethods.name,
			overTime: sql<number>`COALESCE(SUM(${overTime.total}), 0)`,
			bonus: sql<number>`COALESCE(SUM(${bonuses.amount}), 0)`,
			commision: sql<number>`COALESCE(SUM(${commission.amount}), 0)`,
			deductions: sql<number>`COALESCE(SUM(${deductions.amount}), 0)`,
			gross: sql<number>`COALESCE(SUM(${salaries.amount}), 0) +
        COALESCE(SUM(${overTime.total}), 0) +
        COALESCE(SUM(${bonuses.amount}), 0) +
        COALESCE(SUM(${commission.amount}), 0) +
        ${salaries.amount} + ${salaries.nonTaxAllowance} +
        ${salaries.housingAllowance} + ${salaries.transportationAllowance} +
        ${salaries.positionAllowance}
        `
		})
		.from(employee)
		.leftJoin(
			staffAccounts,
			and(eq(staffAccounts.staffId, employee.id), eq(staffAccounts.isActive, true))
		)
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
			department.id,
			salaries.id,
			staffAccounts.id,
			paymentMethods.id,
			salaries.amount,
			salaries.nonTaxAllowance,
			salaries.housingAllowance,
			salaries.transportationAllowance,
			salaries.positionAllowance,
			salaries.nonTaxAllowance,
			salaries.housingAllowance,
			salaries.transportationAllowance,
			salaries.positionAllowance
		);

	return {
		payrollData,
		month,
		year
	};
};
