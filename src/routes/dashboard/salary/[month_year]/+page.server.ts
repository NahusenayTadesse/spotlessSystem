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

export const load: PageServerLoad = async ({ params, locals }) => {
	const { month_year } = params;

	const [m, y] = month_year.split('_');

	const month = m;
	const year = y;

	// 1. Create subqueries for your one-to-many relationships
	const otSub = db
		.select({
			staffId: overTime.staffId,
			total: sql<number>`COALESCE(SUM(${overTime.total}), 0)`.as('total_ot')
		})
		.from(overTime)
		.groupBy(overTime.staffId)
		.as('ot_sub');

	const bonusSub = db
		.select({
			staffId: bonuses.staffId,
			total: sql<number>`COALESCE(SUM(${bonuses.amount}), 0)`.as('total_bonus')
		})
		.from(bonuses)
		.groupBy(bonuses.staffId)
		.as('bonus_sub');

	const commissionSub = db
		.select({
			staffId: commission.staffId,
			total: sql<number>`COALESCE(SUM(${commission.amount}), 0)`.as('total_comm')
		})
		.from(commission)
		.groupBy(commission.staffId)
		.as('comm_sub');

	const deductionSub = db
		.select({
			staffId: deductions.staffId,
			total: sql<number>`COALESCE(SUM(${deductions.amount}), 0)`.as('total_deduct')
		})
		.from(deductions)
		.groupBy(deductions.staffId)
		.as('deduct_sub');

	// 2. Main Query
	const payrollData = await db
		.select({
			id: employee.id,
			name: sql<string>`TRIM(CONCAT_WS(' ', ${employee.name}, ${employee.fatherName}, ${employee.grandFatherName}))`,
			department: department.name,
			basicSalary: salaries.amount,
			positionAllowance: salaries.positionAllowance,
			housingAllowance: salaries.housingAllowance,
			transport: salaries.transportationAllowance,
			nonTaxable: salaries.nonTaxAllowance,
			paymentMethod: paymentMethods.name,
			account: staffAccounts.accountDetail,
			bank: paymentMethods.name,
			overTime: otSub.total,
			bonus: bonusSub.total,
			commision: commissionSub.total,
			deductions: deductionSub.total,
			gross: sql<number>`
            COALESCE(${salaries.amount}, 0) +
            COALESCE(${otSub.total}, 0) +
            COALESCE(${bonusSub.total}, 0) +
            COALESCE(${commissionSub.total}, 0) +
            COALESCE(${salaries.nonTaxAllowance}, 0) +
            COALESCE(${salaries.housingAllowance}, 0) +
            COALESCE(${salaries.transportationAllowance}, 0) +
            COALESCE(${salaries.positionAllowance}, 0)
        `
		})
		.from(employee)
		.leftJoin(department, eq(department.id, employee.departmentId))
		.leftJoin(salaries, and(eq(salaries.staffId, employee.id), isNull(salaries.endDate)))
		.leftJoin(
			staffAccounts,
			and(eq(staffAccounts.staffId, employee.id), eq(staffAccounts.isActive, true))
		)
		.leftJoin(paymentMethods, eq(staffAccounts.paymentMethodId, paymentMethods.id))
		// Join the subqueries instead of the raw tables
		.leftJoin(otSub, eq(otSub.staffId, employee.id))
		.leftJoin(bonusSub, eq(bonusSub.staffId, employee.id))
		.leftJoin(commissionSub, eq(commissionSub.staffId, employee.id))
		.leftJoin(deductionSub, eq(deductionSub.staffId, employee.id))
		.where(eq(employee.isActive, true));

	return {
		payrollData,
		month,
		year
	};
};
