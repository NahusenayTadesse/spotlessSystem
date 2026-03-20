import { db } from '$lib/server/db';
import { employee, site } from '$lib/server/db/schema';
import { eq, count } from 'drizzle-orm';
import type { PageServerLoad, Actions } from '../$types';

export const load: PageServerLoad = async () => {
	let siteList = await db
		.select({
			id: site.id,
			name: site.name,
			numbers: count(employee.id)
		})
		.from(site)
		.innerJoin(employee, eq(employee.siteId, site.id))
		.where(eq(employee.isActive, true))
		.groupBy(site.id);

	return {
		siteList
	};
};
