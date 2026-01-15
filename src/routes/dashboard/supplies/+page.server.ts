import { db } from '$lib/server/db';
import { supplies, supplyTypes, supplySuppliers, supplyAdjustments } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async () => {
	let supplyList = await db
		.select({
			id: supplies.id,
			name: supplies.name,
			type: supplyTypes.name,
			description: supplies.description,
			quantity: supplies.quantity,
			unitOfMeasure: supplies.unitOfMeasure
		})
		.from(supplies)
		.leftJoin(supplyTypes, eq(supplies.supplyTypeId, supplyTypes.id));

	return {
		supplyList
	};
};
