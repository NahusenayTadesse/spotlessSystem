import { db } from '$lib/server/db';
import {
	employee,
	department,
	employmentStatuses,
	educationalLevel,
	employeeTermination,
	missingDays,
	site,
	employeeGuarantor,
	staffAccounts,
	staffFamilies
} from '$lib/server/db/schema';
import { eq, and, sql, isNull, count, countDistinct } from 'drizzle-orm';
import { edit } from './schema';
import type { PageServerLoad, Actions } from '../$types';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { getMonthNumber, ethiopianRange, currentMonthFilter } from '$lib/global.svelte';

export const load: PageServerLoad = async ({ params }) => {
	const { id, range } = params;

	const [m, y] = range.split('_');
	const monthNumber = getMonthNumber(m);
	const year = Number(y);

	const { startDate, endDate } = ethiopianRange(monthNumber, year);
	const start = `${startDate.year}-${startDate.month}-${startDate.day}`;
	const end = `${endDate.year}-${endDate.month}-${endDate.day}`;

	let staffList = await db
		.select({
			id: employee.id,
			name: sql<string>`TRIM(CONCAT(
    COALESCE(${employee.name}, ''), ' ',
    COALESCE(${employee.fatherName}, ''), ' ',
    COALESCE(${employee.grandFatherName}, '')
))`,
			department: department.name,
			status: employmentStatuses.name,
			absent: count(missingDays.id),
			active: employee.isActive
		})
		.from(employee)
		.leftJoin(department, eq(department.id, employee.departmentId))
		.leftJoin(
			missingDays,
			and(eq(missingDays.staffId, employee.id), currentMonthFilter(missingDays.day, start, end))
		)
		.leftJoin(employmentStatuses, eq(employmentStatuses.id, employee.employmentStatus))
		.where(and(eq(employee.siteId, Number(id)), eq(employee.isActive, true)))
		.groupBy(
			employee.id,
			employee.name,
			employee.fatherName,
			department.name,
			employmentStatuses.name,
			employee.isActive
		);

	return {
		staffList,
		start,
		end,
		range,
		id
	};
};

export const actions: Actions = {
	addDays: async ({ request, cookies, locals }) => {
		const form = await superValidate(request, zod4(edit));

		if (!form.valid) {
			return message(form, { type: 'error', text: `Error: check the form` });
		}

		const { id, day, reason, deductable, deductableAmount } = form.data;

		try {
			const dateList = day.split(',');
			await db.transaction(async (tx) => {
				const valuesToInsert = dateList.map((singleDay) => ({
					staffId: Number(id),
					day: singleDay.trim(), // trim() handles potential spaces like "2026-01-01, 2026-01-02"
					reason,
					deductable: Boolean(deductable),
					deductableAmount: deductableAmount ? parseFloat(deductableAmount) : null,
					createdBy: locals?.user?.id
				}));

				// 3. Perform a single batch insert
				await tx.insert(missingDays).values(valuesToInsert);
			});
			return message(form, {
				type: 'success',
				text: 'Missing Days added Successfully!'
			});
		} catch (err) {
			console.error(err?.message);
			return message(form, {
				type: 'error',
				text: `Adding missing days failed: ${err instanceof Error ? err.message : 'Unknown error'}`
			});
		}
	}
};
