import { db } from '$lib/server/db';
import {
	transactions,
	transactionSupplies,
	user,
	suppliesAdjustments
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
			id: suppliesAdjustments.id,
			date: sql<string>`DATE_FORMAT(${suppliesAdjustments.createdAt}, '%W %Y-%m-%d')`,
			quantity: suppliesAdjustments.adjustment,
			reason: suppliesAdjustments.reason,
			costPerItem: suppliesAdjustments.costPerItem,
			changedBy: user.name,
			changedById: user.id,
			reciept: transactions.recieptLink
		})
		.from(suppliesAdjustments)
		.leftJoin(transactionSupplies, eq(transactionSupplies.id, suppliesAdjustments.transactionId))
		.leftJoin(transactions, eq(transactions.id, transactionSupplies.transactionId))
		.leftJoin(user, eq(suppliesAdjustments.createdBy, user.id))
		.where(
			and(
				eq(suppliesAdjustments.suppliesId, id),
				currentMonthFilter(suppliesAdjustments.createdAt, start, end)
			)
		)
		.orderBy(asc(suppliesAdjustments.createdAt));

	return {
		allTransactions,
		start,
		end
	};
};
