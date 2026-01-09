import { db } from '$lib/server/db';
import {
	transactions,
	transactionSupplies,
	user,
	suppliesAdjustments,
	damagedSupplies,
	employee
} from '$lib/server/db/schema';
import { and, asc, eq, sql } from 'drizzle-orm';

import { currentMonthFilter } from '$lib/global.svelte';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.id);
	const { range } = params as { range: string };

	const [y1, m1, d1, y2, m2, d2] = range.split('-');

	const start = `${y1}-${m1}-${d1}`;
	const end = `${y2}-${m2}-${d2}`;

	const allTransactions = await db
		.select({
			id: damagedSupplies.id,
			date: sql<string>`DATE_FORMAT(${damagedSupplies.createdAt}, '%W %Y-%m-%d')`,
			quantity: damagedSupplies.quantity,
			reason: damagedSupplies.reason,
			damagedBy: sql<string>`CONCAT(${employee.name}, ' ', ${employee.fatherName})`,
			damagedById: damagedSupplies.damagedBy,
			changedById: user.id,
			changedBy: user.name
		})
		.from(damagedSupplies)
		.leftJoin(user, eq(damagedSupplies.createdBy, user.id))
		.leftJoin(employee, eq(employee.id, damagedSupplies.damagedBy))
		.where(
			and(
				eq(damagedSupplies.supplyId, Number(id)),
				currentMonthFilter(damagedSupplies.createdAt, start, end)
			)
		)
		.orderBy(asc(damagedSupplies.createdAt));

	return {
		allTransactions,
		start,
		end
	};
};
