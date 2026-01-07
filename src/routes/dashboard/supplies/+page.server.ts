import { db } from '$lib/server/db';
import { supplies } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async () => {
	let supplyList = await db
		.select({
			id: supplies.id,
			name: supplies.name,
			price: supplies.costPerUnit,
			description: supplies.description,
			quantity: supplies.quantity,
			unitOfMeasure: supplies.unitOfMeasure
		})
		.from(supplies);

	supplyList = supplyList.map((r) => ({
		...r,
		price: Number(r.price),
		quantity: Number(r.quantity)
	}));
	return {
		supplyList
	};
};
