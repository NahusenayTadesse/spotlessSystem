import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import {
	editSupply as schema,
	inventoryAdjustmentFormSchema as adjustSchema
} from '$lib/ZodSchema';
import { error } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import {
	supplies,
	supplyTypes,
	supplySuppliers,
	suppliesAdjustments,
	user
} from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import { employees } from '$lib/server/fastData';

export const load: LayoutServerLoad = async ({ params }) => {
	const { id } = params;
	const form = await superValidate(zod4(schema));
	const adjustForm = await superValidate(zod4(adjustSchema));

	const supply = await db
		.select({
			id: supplies.id,

			name: supplies.name,
			supplyType: supplyTypes.name,
			quantity: supplies.quantity,
			description: supplies.description,
			unitOfMeasure: supplies.unitOfMeasure,
			reorderLevel: supplies.reorderLevel,
			createdBy: user.name,
			createdAt: sql<string>`DATE_FORMAT(${supplies.createdAt}, '%Y-%m-%d')`
		})
		.from(supplies)
		.leftJoin(supplyTypes, eq(supplies.supplyTypeId, supplyTypes.id))
		.leftJoin(user, eq(supplies.createdBy, user.id))
		.where(eq(supplies.id, Number(id)))
		.then((rows) => rows[0]);

	const employeesList = await employees();

	const suppliers = await db
		.selectDistinct({
			id: supplySuppliers.id,
			name: supplySuppliers.name,
			phone: supplySuppliers.phone,
			email: supplySuppliers.email,
			description: supplySuppliers.description
		})
		.from(supplySuppliers)
		.innerJoin(suppliesAdjustments, eq(supplySuppliers.id, suppliesAdjustments.supplierId))
		.where(eq(suppliesAdjustments.suppliesId, Number(id)));

	if (!supply) {
		throw error(404, 'Supply not found, it has been deleted or never have existed.');
	}

	return {
		supply,
		form,
		adjustForm,
		employeesList,
		suppliers
	};
};
