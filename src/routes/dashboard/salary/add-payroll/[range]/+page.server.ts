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
	taxType,
	payrollRuns,
	payrollReceipts,
	payrollEntries
} from '$lib/server/db/schema';
import { and, count, desc, asc, eq, isNull, sql } from 'drizzle-orm';

import { payrollSchema, type EmployeeFormType } from './schema';
import type { PageServerLoad, Actions } from '../$types';
import { setFlash, redirect } from 'sveltekit-flash-message/server';
import { superValidate, setError, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ params }) => {
	const form = await superValidate(zod4(payrollSchema));

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
			paymentMethodId: paymentMethods.id,
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

	return { payrollData, start, end, form };
};

import { fail } from '@sveltejs/kit';
import { saveUploadedFile } from '$lib/server/upload';
export const actions: Actions = {
	runPayroll: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(payrollSchema));

		const { employees, start, end, reciept, month, paymentDate } = form.data;

		const [m, y] = month.split('_');

		const monthName = m;
		const year = y;

		const calculateTotal = (employees: any[], key: keyof EmployeeFormType): number => {
			// If employees hasn't been populated by the effect yet, return 0
			if (!employees || !Array.isArray(employees)) return 0;

			const total = employees.reduce((sum, emp) => {
				const value = emp[key];
				// Cast to number just in case they are stringified numbers from an input
				const numValue = typeof value === 'string' ? parseFloat(value) : value;
				return sum + (typeof numValue === 'number' && !isNaN(numValue) ? numValue : 0);
			}, 0);

			return Math.round(total * 100) / 100;
		};

		// 1. Check for the existing record
		try {
			const result = await db.transaction(async (tx) => {
				// 1. Check or Create Payroll Run
				let payrollId: number;
				const existingPayroll = await tx
					.select({ id: payrollRuns.id })
					.from(payrollRuns)
					.where(and(eq(payrollRuns.month, monthName), eq(payrollRuns.year, Number(year))))
					.then((rows) => rows[0]);

				if (existingPayroll) {
					payrollId = existingPayroll.id;
				} else {
					const [newPayroll] = await tx
						.insert(payrollRuns)
						.values({
							month: monthName,
							year: year,
							totalGross: '0',
							totalTax: '0',
							totalPosition: '0',
							totalPenalities: '0',
							totalHousing: '0',
							totalNet: '0',
							totalDeductions: '0',
							createdBy: locals?.user?.id
						})
						.$returningId();
					payrollId = newPayroll.id;
				}

				await tx
					.update(payrollRuns)
					.set({
						totalNet: sql`${payrollRuns.totalNet} + ${calculateTotal(employees, 'netPay')}`,
						totalGross: sql`${payrollRuns.totalGross} + ${calculateTotal(employees, 'gross')}`,
						totalTransport: sql`${payrollRuns.totalTransport} + ${calculateTotal(employees, 'transportAllowance')}`,
						totalHousing: sql`${payrollRuns.totalHousing} + ${calculateTotal(employees, 'housingAllowance')}`,
						totalPosition: sql`${payrollRuns.totalPosition} + ${calculateTotal(employees, 'positionAllowance')}`,
						totalDeductions: sql`${payrollRuns.totalDeductions} + ${calculateTotal(employees, 'deductions')}`,
						totalTax: sql`${payrollRuns.totalTax} + ${calculateTotal(employees, 'taxAmount')}`,
						updatedBy: locals?.user?.id
					})
					.where(eq(payrollRuns.id, payrollId));

				// 2. Handle Receipt Upload
				const recieptLink = reciept ? await saveUploadedFile(reciept) : null;

				await tx.insert(payrollReceipts).values({
					payrollRunId: payrollId,
					numberOfEmployees: employees.length,
					payPeriodStart: start,
					payPeriodEnd: end,
					paidDate: paymentDate,
					amount: String(calculateTotal(employees, 'netPay')),
					recieptLink,
					createdBy: locals?.user?.id
				});

				// 3. Prepare and Insert Payroll Entries
				const entryValues = employees.map((emp) => ({
					payrollId: payrollId,
					staffId: Number(emp.id),
					month: monthName.trim() as
						| 'መስከረም'
						| 'ጥቅምት'
						| 'ህዳር'
						| 'ታህሳስ'
						| 'ጥር'
						| 'የካቲት'
						| 'መጋቢት'
						| 'ሚያዝያ'
						| 'ግንቦት'
						| 'ሰኔ'
						| 'ሐምሌ'
						| 'ነሐሴ',
					year: Number(year),
					payPeriodStart: start,
					payPeriodEnd: end,
					basicSalary: emp.basicSalary.toString(),
					overtimeAmount: emp.overtime.toString(),
					deductions: emp.deductions.toString(), // Matches schema key
					commissionAmount: emp.commission.toString(),
					bonusAmount: emp.bonus.toString(),
					allowances: '0',
					transportAllowance: emp.transportAllowance.toString(),
					positionAllowance: emp.positionAllowance.toString(),
					housingAllowance: emp.housingAllowance.toString(),
					nonTaxableAllowance: emp.nonTaxable.toString(),
					grossAmount: emp.gross.toString(),
					netAmount: emp.netPay.toString(),
					paidAmount: emp.netPay.toString(), // Added to ensure the record shows what was paid
					attendancePenality: emp.attendancePenality.toString(),
					taxAmount: emp.taxAmount.toString(),
					status: 'paid' as const,
					paymentMethodId: emp.paymentMethodId ? Number(emp.paymentMethodId) : null,
					createdBy: locals?.user?.id,
					recieptLink,
					notes: 'Salary Paid',
					paymentDate

					// notes and receiptLink will default to null/default automatically
				}));

				// Using upsert logic in case you re-run payroll for the same period
				await tx.insert(payrollEntries).values(entryValues);

				return message(form, {
					type: 'success',
					text: `Successfully Paid ${employees.length} employees`
				});
			});
		} catch (err) {
			console.error(err?.message);
			return message(
				form,
				{ type: 'error', text: `Error: ${err?.message}` },
				{
					status: 500
				}
			);
		}
	}
};
