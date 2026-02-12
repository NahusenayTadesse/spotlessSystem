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
	employmentStatuses,
	taxType
} from '$lib/server/db/schema';
import { and, count, desc, asc, eq, isNull, sql } from 'drizzle-orm';
import type { PageServerLoad } from '../$types';

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

	const missingSub = db
		.select({
			staffId: missingDays.staffId,
			missedCount: count(missingDays.id).as('missed_count')
		})
		.from(missingDays)
		.where(currentMonthFilter(missingDays.day, start, end))
		.groupBy(missingDays.staffId)
		.as('missing_sub');

	const taxBrackets = await db
		.select()
		.from(taxType)
		.where(eq(taxType.status, true))
		.orderBy(asc(taxType.threshold));

	// Expressions for cleaner SQL
	const grossExpression = sql<number>`
        COALESCE(${salaries.amount}, 0) +
        COALESCE(${otSub.total}, 0) +
        COALESCE(${bonusSub.total}, 0) +
        COALESCE(${commissionSub.total}, 0) +
        COALESCE(${salaries.housingAllowance}, 0) +
        COALESCE(${salaries.transportationAllowance}, 0) +
        COALESCE(${salaries.positionAllowance}, 0)
    `;

	const taxableIncomeExpression = sql<number>`
  (${grossExpression})
  - (COALESCE(${salaries.nonTaxAllowance}, 0)
  + (COALESCE(${missingSub.missedCount}, 0) * (${salaries.amount} / 30)))
`;
	let taxSql = sql`0`;
	if (taxBrackets.length > 0) {
		taxSql = sql`CASE `;
		taxBrackets.forEach((bracket) => {
			taxSql.append(sql`
                WHEN (${taxableIncomeExpression}) <= ${bracket.threshold}
                THEN ((${taxableIncomeExpression}) * ${bracket.rate}) - ${bracket.deduction} `);
		});
		taxSql.append(sql`ELSE 0 END`);
	}

	const payrollData = await db
		.select({
			id: employee.id,
			name: sql<string>`TRIM(CONCAT_WS(' ', ${employee.name}, ${employee.fatherName}, ${employee.grandFatherName}))`,
			department: department.name,
			basicSalary: salaries.amount,
			positionAllowance: salaries.positionAllowance,
			housingAllowance: salaries.housingAllowance,
			transportAllowance: salaries.transportationAllowance,
			nonTaxable: salaries.nonTaxAllowance,
			account: staffAccounts.accountDetail,
			bank: paymentMethods.name,
			employmentStatus: employmentStatuses.name,
			overtime: otSub.total,
			bonus: bonusSub.total,
			absent: missingSub.missedCount,
			attendancePenality: sql<number>`COALESCE(${missingSub.missedCount}, 0) * (${salaries.amount} / 30)`,
			commission: commissionSub.total,
			deductions: deductionSub.total,
			gross: grossExpression,
			taxable: taxableIncomeExpression,
			taxAmount: taxSql,
			netPay: sql<number>`(${grossExpression}) - (${taxSql} + (COALESCE(${missingSub.missedCount}, 0) * (${salaries.amount} / 30)) + COALESCE(${deductionSub.total}, 0))`
		})
		.from(employee)
		.leftJoin(department, eq(department.id, employee.departmentId))
		.leftJoin(salaries, and(eq(salaries.staffId, employee.id), isNull(salaries.endDate)))
		.leftJoin(
			staffAccounts,
			and(eq(staffAccounts.staffId, employee.id), eq(staffAccounts.isActive, true))
		)
		.leftJoin(paymentMethods, eq(staffAccounts.paymentMethodId, paymentMethods.id))
		.leftJoin(otSub, eq(otSub.staffId, employee.id))
		.leftJoin(bonusSub, eq(bonusSub.staffId, employee.id))
		.leftJoin(commissionSub, eq(commissionSub.staffId, employee.id))
		.leftJoin(deductionSub, eq(deductionSub.staffId, employee.id))
		.leftJoin(missingSub, eq(missingSub.staffId, employee.id))
		.leftJoin(employmentStatuses, eq(employmentStatuses.id, employee.employmentStatus))
		.where(and(eq(employee.isActive, true), eq(employmentStatuses.removeFromLists, false)))
		.groupBy(
			employee.id,
			employee.name,
			employee.fatherName,
			employee.grandFatherName,
			department.name,
			salaries.id, // Grouping by Salary ID ensures uniqueness
			staffAccounts.id,
			paymentMethods.id,
			employmentStatuses.id,
			otSub.total,
			bonusSub.total,
			commissionSub.total,
			deductionSub.total,
			missingSub.missedCount
		);

	return { payrollData, start, end };
};
