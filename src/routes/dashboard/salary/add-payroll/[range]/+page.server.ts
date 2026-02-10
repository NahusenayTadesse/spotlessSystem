import { currentMonthFilter } from '$lib/global.svelte';

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
	employmentStatuses
} from '$lib/server/db/schema';
import { and, count, desc, eq, isNull, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { range } = params as { range: string };

	const [y1, m1, d1, y2, m2, d2] = range.split('-');

	const start = `${y1}-${m1}-${d1}`;
	const end = `${y2}-${m2}-${d2}`;

	const otSub = db
		.select({
			staffId: overTime.staffId,
			total: sql<number>`COALESCE(SUM(${overTime.total}), 0)`.as('total_ot')
		})
		.from(overTime)
		.where(currentMonthFilter(overTime.date, start, end))

		.groupBy(overTime.staffId)
		.as('ot_sub');

	const bonusSub = db
		.select({
			staffId: bonuses.staffId,
			total: sql<number>`COALESCE(SUM(${bonuses.amount}), 0)`.as('total_bonus')
		})
		.from(bonuses)
		.where(currentMonthFilter(bonuses.bonusDate, start, end))
		.groupBy(bonuses.staffId)
		.as('bonus_sub');

	const commissionSub = db
		.select({
			staffId: commission.staffId,
			total: sql<number>`COALESCE(SUM(${commission.amount}), 0)`.as('total_comm')
		})
		.from(commission)
		.where(currentMonthFilter(commission.commissionDate, start, end))

		.groupBy(commission.staffId)
		.as('comm_sub');

	const deductionSub = db
		.select({
			staffId: deductions.staffId,
			total: sql<number>`COALESCE(SUM(${deductions.amount}), 0)`.as('total_deduct')
		})
		.from(deductions)
		.where(currentMonthFilter(deductions.deductionDate, start, end))
		.groupBy(deductions.staffId)
		.as('deduct_sub');

	// const absentDays = db
	// 	.select({
	// 		staffId: missingDays.staffId,
	// 		total: count(missingDays.id)
	// 	})
	// 	.from(missingDays)
	// 	.where(currentMonthFilter(missingDays.day, start, end))
	// 	.groupBy(missingDays.staffId)
	// 	.as('absent_sub');

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
			absentDays: count(missingDays.id),
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
		.leftJoin(
			missingDays,
			and(eq(missingDays.staffId, employee.id), currentMonthFilter(missingDays.day, start, end))
		)
		.leftJoin(employmentStatuses, eq(employmentStatuses.id, employee.employmentStatus))

		.where(and(eq(employee.isActive, true), eq(employmentStatuses.removeFromLists, false)))
		.groupBy(
			employee.id,
			employee.name,
			employee.fatherName,
			employee.grandFatherName,
			department.name,
			salaries.amount,
			salaries.positionAllowance,
			salaries.housingAllowance,
			salaries.transportationAllowance,
			salaries.nonTaxAllowance,
			paymentMethods.name,
			staffAccounts.accountDetail,
			otSub.total,
			bonusSub.total,
			commissionSub.total,
			deductionSub.total,
			employmentStatuses.removeFromLists
		);

	return {
		payrollData,
		start,
		end
	};
};
