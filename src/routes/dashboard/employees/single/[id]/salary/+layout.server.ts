import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { addLeavePayrollSchema as schema } from './schema';

import { db } from '$lib/server/db';
import {
	salaries,
	paymentMethods,
	overTime,
	deductions,
	bonuses,
	employee,
	missingDays
} from '$lib/server/db/schema';
import { eq, isNull, sql, and, count } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async ({ params }) => {
	const { id } = params;
	const form = await superValidate(zod4(schema));

	const salaryDetail = await db
		.select({
			id: employee.id,
			name: sql<string>`TRIM(CONCAT(${employee.name}, ' ', COALESCE(${employee.fatherName}, '')))`,

			// sum of all deductions for the staff
			deductions: sql<number>`COALESCE(SUM(${deductions.amount}), 0)`,

			// sum of all commissions from commissionProduct AND commissionService

			// base salary (assumed single row per staff)
			baseSalary: salaries.amount,
			missingDays: count(missingDays.id),
			overtime: overTime.total,
			bonus: bonuses.amount
		})
		.from(employee)
		.leftJoin(salaries, and(eq(salaries.staffId, employee.id), isNull(salaries.endDate)))
		.leftJoin(deductions, eq(deductions.staffId, employee.id))
		.leftJoin(missingDays, eq(missingDays.staffId, employee.id))
		.leftJoin(overTime, eq(overTime.staffId, employee.id))
		.leftJoin(bonuses, eq(bonuses.staffId, employee.id))
		.where(eq(employee.id, Number(id)))
		.groupBy(employee.id, salaries.amount)
		.then((rows) => rows[0]);

	const allMethods = await db
		.select({
			value: paymentMethods.id,
			name: paymentMethods.name,
			description: paymentMethods.description
		})
		.from(paymentMethods)
		.where(eq(paymentMethods.isActive, true));

	return {
		salaryDetail,
		allMethods,
		form,
		id
	};
};
