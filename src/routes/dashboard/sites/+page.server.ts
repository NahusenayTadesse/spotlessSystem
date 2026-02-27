import { db } from '$lib/server/db';
import { customers, site, user, address, subcity } from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async () => {
	const siteList = await db
		.select({
			id: site.id,
			name: site.name,
			customerName: customers.name,
			customerId: site.customerId,
			phone: site.phone,
			startedOn: sql<string>`DATE_FORMAT(${site.startDate}, '%Y-%m-%d')`,
			addedBy: user.name,
			addedById: user.id,
			address: {
				id: address.id,
				street: address.street,
				subcity: subcity.name,
				subcityId: subcity.id,
				kebele: address.kebele,
				buildingNumber: address.buildingNumber,
				floor: address.floor,
				houseNumber: address.houseNumber,
				status: address.status
			}
		})
		.from(site)
		.leftJoin(user, eq(site.createdBy, user.id))
		.leftJoin(customers, eq(customers.id, site.customerId))
		.leftJoin(address, eq(address.id, site.address))
		.leftJoin(subcity, eq(subcity.id, address.subcityId))
		.where(eq(site.isActive, true))
		.groupBy(site.id, site.startDate);

	return {
		siteList
	};
};
