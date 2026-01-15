import { db } from '$lib/server/db';
import {
	employee,
	department,
	employmentStatuses,
	educationalLevel,
	employeeTermination
} from '$lib/server/db/schema';
import { eq, and, sql, isNull } from 'drizzle-orm';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals }) => {
	let staffList = await db
		.select({
			id: employee.id,
			// Handling potential nulls for both name parts
			name: sql<string>`TRIM(CONCAT(COALESCE(${employee.name}, ''), ' ', COALESCE(${employee.fatherName}, '')))`,
			department: department.name,
			education: educationalLevel.name,
			status: employmentStatuses.name,
			years: sql<number>`TIMESTAMPDIFF(YEAR, ${employee.hireDate}, CURDATE())`,
			joined: sql<string>`DATE_FORMAT(${employee.hireDate}, '%Y-%m-%d')`
		})
		.from(employee)
		.leftJoin(department, eq(department.id, employee.departmentId))
		.leftJoin(employmentStatuses, eq(employmentStatuses.id, employee.employmentStatus))
		.leftJoin(educationalLevel, eq(educationalLevel.id, employee.educationalLevel))
		// CRITICAL: Added the missing join for the termination check
		.leftJoin(employeeTermination, eq(employeeTermination.staffId, employee.id))
		.where(and(eq(employee.isActive, true), isNull(employeeTermination.staffId)));

	staffList = staffList.map((r) => ({ ...r, years: Number(r.years) }));

	return {
		staffList
	};
};
