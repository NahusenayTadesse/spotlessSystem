import { db } from '$lib/server/db';
import { customers, site, user } from '$lib/server/db/schema';
import { eq, and, sql, count } from 'drizzle-orm';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async () => {
	const customerList = await db
		.select({
			id: customers.id,
			name: customers.name,
			phone: customers.phone,
			email: customers.email,
			status: customers.status,
			joinedOn: sql<string>`DATE_FORMAT(${customers.createdAt}, '%Y-%m-%d')`,
			addedBy: user.name,
			addedById: user.id
		})
		.from(customers)
		.leftJoin(user, eq(customers.createdBy, user.id))
		.leftJoin(site, eq(customers.id, site.customerId));

	return {
		customerList
	};
};
