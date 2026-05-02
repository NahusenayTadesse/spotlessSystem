import { db } from '$lib/server/db';
import { salaries, user } from '$lib/server/db/schema';

import { eq, sql, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	const salaryHistory = await db
		.select({
			id: salaries.id,
			amount: salaries.amount,
			baseSalary: salaries.amount,
			housingAllowance: salaries.housingAllowance,
			transportationAllowance: salaries.transportationAllowance,
			nonTaxAllowance: salaries.nonTaxAllowance,
			positionAllowance: salaries.positionAllowance,
			startDate: salaries.startDate,
			endDate: salaries.endDate,
			changedBy: user.name,
			changedById: user.id
		})
		.from(salaries)
		.leftJoin(user, eq(salaries.createdBy, user.id))
		.where(eq(salaries.staffId, Number(id)))
		.orderBy(desc(salaries.amount));

	return {
		salaryHistory
	};
};
