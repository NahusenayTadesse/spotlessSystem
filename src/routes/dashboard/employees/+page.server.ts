import { db } from '$lib/server/db';
import { employee, department, employmentStatuses, educationalLevel } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals }) => {
	let staffList = await db
		.select({
			id: employee.id,
			name: sql<string>`TRIM(CONCAT(${employee.name}, ' ', COALESCE(${employee.fatherName}, '')))`,
			department: department.name,
			education: educationalLevel.name,
			status: employmentStatuses.name,
			years: sql<number>`TIMESTAMPDIFF(YEAR, ${employee.hireDate}, CURDATE())`,
			joined: sql<string>`DATE_FORMAT(${employee.hireDate}, '%Y-%m-%d')`
		})
		.from(employee)
		.leftJoin(department, eq(department.id, employee.departmentId))
		.leftJoin(employmentStatuses, eq(employmentStatuses.id, employee.employmentStatus))
		.leftJoin(educationalLevel, eq(educationalLevel.id, employee.educationalLevel));

	staffList = staffList.map((r) => ({ ...r, years: Number(r.years) }));

	return {
		staffList
	};
};
