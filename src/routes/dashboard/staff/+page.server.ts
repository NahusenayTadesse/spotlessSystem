import { db } from '$lib/server/db';
import { employee, staffTypes } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals }) => {
	let staffList = await db
		.select({
			id: employee.id,
			name: sql<string>`TRIM(CONCAT(${employee.firstName}, ' ', COALESCE(${employee.lastName}, '')))`,

			category: staffTypes.name,
			phone: employee.phone,
			email: employee.email,
			status: employee.employmentStatus,
			years: sql<number>`TIMESTAMPDIFF(YEAR, ${employee.hireDate}, CURDATE())`
		})
		.from(employee)
		.leftJoin(staffTypes, eq(staffTypes.id, employee.type))
		.where(eq(employee.branchId, locals?.user?.branch));

	staffList = staffList.map((r) => ({ ...r, years: Number(r.years) }));

	return {
		staffList
	};
};
