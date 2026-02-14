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

export const load: PageServerLoad = async ({ locals }) => {
	let staffList = await db
		.select({
			id: employee.id,
			// Handling potential nulls for both name parts
			name: sql<string>`TRIM(CONCAT(COALESCE(${employee.name}, ''), ' ', COALESCE(${employee.fatherName}, '')))`,
			department: department.name,
			site: site.name,
			education: educationalLevel.name,
			status: employmentStatuses.name,
			absent: countDistinct(missingDays.id),
			guarantor: countDistinct(employeeGuarantor.id),
			accounts: countDistinct(staffAccounts.id),
			families: countDistinct(staffFamilies.id),
			active: employee.isActive,
			years: sql<number>`TIMESTAMPDIFF(YEAR, ${employee.hireDate}, CURDATE())`,
			joined: sql<string>`DATE_FORMAT(${employee.hireDate}, '%Y-%m-%d')`
		})
		.from(employee)
		.leftJoin(site, eq(site.id, employee.siteId))
		.leftJoin(department, eq(department.id, employee.departmentId))
		.leftJoin(missingDays, eq(missingDays.staffId, employee.id))
		.leftJoin(employmentStatuses, eq(employmentStatuses.id, employee.employmentStatus))
		.leftJoin(educationalLevel, eq(educationalLevel.id, employee.educationalLevel))
		.leftJoin(employeeTermination, eq(employeeTermination.staffId, employee.id))
		.leftJoin(staffAccounts, eq(staffAccounts.staffId, employee.id))
		.leftJoin(employeeGuarantor, eq(employeeGuarantor.staffId, employee.id))
		.leftJoin(staffFamilies, eq(staffFamilies.staffId, employee.id))
		.where(eq(employee.isActive, true))
		.groupBy(
			employee.id,
			employee.name,
			employee.fatherName,
			department.name,
			site.name,
			educationalLevel.name,
			employmentStatuses.name,
			employee.isActive,
			employee.hireDate
		);

	staffList = staffList.map((r) => ({ ...r, years: Number(r.years) }));

	return {
		staffList
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
