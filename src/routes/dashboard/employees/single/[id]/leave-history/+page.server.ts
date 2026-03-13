import { db } from '$lib/server/db';
import { leave } from '$lib/server/db/schema';

import { eq, desc, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	const salaryHistory = await db
		.select({
			id: leave.id,
			requestDate: leave.requestDate,
			startDate: leave.startDate,
			endDate: leave.endDate,
			reason: leave.reason,
			leaveLetter: leave.leaveLetter,
			numberOfDays: sql<number>`DATEDIFF(${leave.endDate}, ${leave.startDate}) + 1`
		})
		.from(leave)
		.where(eq(leave.staffId, Number(id)))
		.orderBy(desc(leave.requestDate));

	return {
		salaryHistory
	};
};
