import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import {
	editSupply as schema,
	inventoryAdjustmentFormSchema as adjustSchema
} from '$lib/ZodSchema';
import { error } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { supplies, transactionSupplies, transactions, user } from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals }) => {
	const { id } = params;
	const form = await superValidate(zod4(schema));
	const adjustForm = await superValidate(zod4(adjustSchema));

	const supply = await db
		.select({
			id: supplies.id,
			name: supplies.name,
			costPerUnit: supplies.costPerUnit,
			description: supplies.description,
			quantity: supplies.quantity,
			reorderLevel: supplies.reorderLevel,
			unitOfMeasure: supplies.unitOfMeasure,
			supplier: supplies.supplier,
			createdBy: user.name,
			createdAt: sql<string>`DATE_FORMAT(${supplies.createdAt}, '%Y-%m-%d')`,
			paidAmount: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`
		})
		.from(supplies)
		.leftJoin(transactionSupplies, eq(supplies.id, transactionSupplies.supplyId))
		.leftJoin(transactions, eq(transactionSupplies.transactionId, transactions.id))
		.leftJoin(user, eq(supplies.createdBy, user.id))
		.where(and(eq(supplies.branchId, locals?.user?.branch), eq(supplies.id, id)))
		.groupBy(
			supplies.id,
			supplies.name,
			supplies.costPerUnit,
			supplies.description,
			supplies.quantity,
			supplies.reorderLevel,
			supplies.supplier,
			user.name,
			supplies.createdAt
		)
		.then((rows) => rows[0]);

	if (!supply) {
		throw error(404, 'Supply not found, it has been deleted or never have existed.');
	}

	return {
		supply,
		form,
		adjustForm
	};
};
