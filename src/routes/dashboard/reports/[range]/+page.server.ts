import { db } from '$lib/server/db';
import { payrollRuns } from '$lib/server/db/schema';
import { and, asc, eq, sql } from 'drizzle-orm';

import { currentMonthFilter } from '$lib/global.svelte';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { range } = params;

	const allPayrollRuns = await db
		.select()
		.from(payrollRuns)
		.where(eq(payrollRuns.year, Number(range)));

	return {
		allReports: allPayrollRuns,
		range
	};
};
