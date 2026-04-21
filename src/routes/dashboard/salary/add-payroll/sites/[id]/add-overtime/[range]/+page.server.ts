import { db } from '$lib/server/db';
import {
	employee,
	department,
	overTimeType,
	site,
	overTime,
	position,
	salaries
} from '$lib/server/db/schema';
import { eq, sql, between, inArray, and } from 'drizzle-orm';
import { add, edit, deleteOvertime, bulkAdd } from './schema';
import type { PageServerLoad, Actions } from './$types';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { overtimeTypes } from '$lib/server/fastData';

import { getMonthNumber, ethiopianRange, currentMonthFilter } from '$lib/global.svelte';

export const load: PageServerLoad = async ({ params }) => {
	const { range } = params;

	const { id } = params;

	const form = await superValidate(zod4(bulkAdd));
	const [m, y] = range.split('_');
	const monthNumber = getMonthNumber(m);
	const year = Number(y);
	const { startDate, endDate } = ethiopianRange(monthNumber, year);

	// Helper to ensure 1 becomes "01", 3 becomes "03", etc.
	const pad = (n: number) => n.toString().padStart(2, '0');

	// Construct the strings manually to avoid JS Date string conversion
	const start = `${startDate.year}-${pad(startDate.month)}-${pad(startDate.day)}`;
	const end = `${endDate.year}-${pad(endDate.month)}-${pad(endDate.day)}`;

	console.log('Start:', start, typeof start); // Should be: 2026-03-10 string
	console.log('End:', end, typeof end); // Should be: 2026-04-08 string
	console.log('endDate object:', endDate); // Check if this is a JS Date

	// Now use these in your Drizzle query

	// 1. Get all employees with their departments
	const employees = await db
		.select({
			id: employee.id,
			name: sql<string>`TRIM(CONCAT(
      COALESCE(${employee.name}, ''), ' ',
      COALESCE(${employee.fatherName}, ''), ' ',
      COALESCE(${employee.grandFatherName}, '')
    ))`,
			department: department.name,
			position: position.name,
			site: site.name
		})
		.from(employee)
		.leftJoin(department, eq(department.id, employee.departmentId))
		.leftJoin(position, eq(position.id, employee.positionId))
		.leftJoin(site, eq(site.id, employee.siteId))
		.where(and(eq(employee.isActive, true), eq(employee.siteId, Number(id))));

	// 2. Get all overtime records for the date range
	const overtimes = await db
		.select({
			id: overTime.id,
			staffId: overTime.staffId,
			date: sql<string>`DATE_FORMAT(${overTime.date}, '%Y-%m-%d')`,
			overtimeType: overTimeType.name,
			overtimeTypeId: overTimeType.id,
			hours: overTime.hours,
			total: overTime.total,
			reason: overTime.reason
		})
		.from(overTime)
		.leftJoin(overTimeType, eq(overTimeType.id, overTime.overTimeTypeId))
		.where(between(overTime.date, start, end));

	const types = await overtimeTypes();

	// 3. Merge them
	const staffList = employees.map((emp) => {
		const empOvertime = overtimes.filter((ot) => ot.staffId === emp.id);
		return {
			...emp,
			overtimeDetails: empOvertime,
			overtimeTypes: types,
			totalOvertimeHours: empOvertime.reduce((sum, ot) => sum + (Number(ot.hours) || 0), 0),
			totalOvertimePay: empOvertime.reduce((sum, ot) => sum + (Number(ot.total) || 0), 0)
		};
	});

	return {
		staffList,
		form,
		types
	};
};

export const actions: Actions = {
	bulkAdd: async ({ request, cookies, params, locals }) => {
		const form = await superValidate(request, zod4(bulkAdd));
		console.log(form);

		if (!form.valid) {
			// Stay on the same page and set a flash message

			return message(
				form,
				{ type: 'error', text: 'Please check the form for errors' },
				{ status: 400 }
			);
		}

		const { ids, reason, date, overtimeType, hours } = form.data;

		console.log(ids.length);

		try {
			await db.transaction(async (tx) => {
				// 1. Fetch the rate (Shared across all entries)
				//
				//
				const rateRow = await tx
					.select({ rate: overTimeType.rate })
					.from(overTimeType)
					.where(eq(overTimeType.id, overtimeType))
					.then((rows) => rows[0]);

				if (!rateRow) return message(form, { type: 'error', text: 'Overtime type not found' });

				// 2. Fetch salaries for ALL provided IDs
				// It's much faster to fetch them all in one query than inside a loop
				const staffSalaries = await tx
					.select({
						salary: salaries.amount,
						staffId: salaries.staffId
					})
					.from(salaries)
					.where(inArray(salaries.staffId, ids));

				// 3. Map the data into an array of insert objects
				const insertData = staffSalaries.map((staff) => {
					const hourlyRate = Number(staff.salary) / 192;
					const total = hourlyRate * (hours * Number(rateRow.rate));

					return {
						staffId: staff.staffId,
						overTimeTypeId: overtimeType,
						hours,
						total, // Ensuring decimal precision
						reason,
						date,
						createdBy: locals.user?.id
					};
				});

				// 4. Perform the bulk insert
				if (insertData.length > 0) {
					await tx.insert(overTime).values(insertData);
				}
			});

			return message(form, {
				type: 'success',
				text: `Overtime Successuflly for ${ids.length} Employees Added`
			});
		} catch (err) {
			return message(
				form,
				{
					type: 'error',
					text: 'An Error occured while adding Overtime' + err?.message
				},
				{ status: 500 }
			);
		}
	},
	add: async ({ request, cookies, params, locals }) => {
		const form = await superValidate(request, zod4(add));

		if (!form.valid) {
			// Stay on the same page and set a flash message

			return message(
				form,
				{ type: 'error', text: 'Please check the form for errors' },
				{ status: 400 }
			);
		}

		const { staffId, reason, date, overtimeType, hours } = form.data;

		try {
			await db.transaction(async (tx) => {
				const rate = await tx
					.select({
						rate: overTimeType.rate
					})
					.from(overTimeType)
					.where(eq(overTimeType.id, overtimeType))
					.then((rows) => rows[0]);
				const basicSalary = await tx
					.select({
						salary: salaries.amount
					})
					.from(salaries)
					.where(eq(salaries.staffId, staffId))
					.then((rows) => rows[0]);

				const total = (Number(basicSalary.salary) / 192) * (hours * Number(rate.rate));

				await tx.insert(overTime).values({
					staffId,
					overTimeTypeId: overtimeType,
					hours,
					total,
					reason,
					date,
					createdBy: locals.user?.id
				});
			});

			return message(form, { type: 'success', text: 'Overtime Successuflly Added' });
		} catch (err) {
			return message(
				form,
				{
					type: 'error',
					text: 'An Error occured while adding Overtime' + err?.message
				},
				{ status: 500 }
			);
		}
	},
	edit: async ({ request, cookies, params, locals }) => {
		const form = await superValidate(request, zod4(edit));

		if (!form.valid) {
			// Stay on the same page and set a flash message

			return message(
				form,
				{ type: 'error', text: 'Please check the form for errors' },
				{ status: 400 }
			);
		}

		const { id, staffId, reason, date, overtimeType, hours } = form.data;

		try {
			await db.transaction(async (tx) => {
				const rate = await tx
					.select({
						rate: overTimeType.rate
					})
					.from(overTimeType)
					.where(eq(overTimeType.id, overtimeType))
					.then((rows) => rows[0]);
				const basicSalary = await tx
					.select({
						salary: salaries.amount
					})
					.from(salaries)
					.where(eq(salaries.staffId, staffId))
					.then((rows) => rows[0]);

				const total = (Number(basicSalary.salary) / 192) * (hours * Number(rate.rate));
				await tx
					.update(overTime)
					.set({
						overTimeTypeId: overtimeType,
						hours: String(hours),
						total: String(total),
						reason,
						date: new Date(date),
						updatedBy: locals.user?.id
					})
					.where(eq(overTime.id, Number(id)));
			});
			return message(form, { type: 'success', text: 'Overtime Successuflly Updated' });
		} catch (err) {
			return message(
				form,
				{
					type: 'error',
					text: 'An Error occured while updating Overtime' + err?.message
				},
				{ status: 500 }
			);
		}
	},

	delete: async ({ request, cookies, params, locals }) => {
		const form = await superValidate(request, zod4(deleteOvertime));

		if (!form.valid) {
			// Stay on the same page and set a flash message

			return message(
				form,
				{ type: 'error', text: 'Please check the form for errors' },
				{ status: 400 }
			);
		}

		const { id } = form.data;

		try {
			await db
				.delete(overTime)

				.where(eq(overTime.id, Number(id)));

			return message(form, { type: 'success', text: 'Overtime Successuflly Deleted' });
		} catch (err) {
			return message(
				form,
				{
					type: 'error',
					text: 'An Error occured while deleting Overtime' + err?.message
				},
				{ status: 500 }
			);
		}
	}
};
