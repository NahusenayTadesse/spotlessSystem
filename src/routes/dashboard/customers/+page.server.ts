import { zod4 } from 'sveltekit-superforms/adapters';
import { editCustomer } from '$lib/ZodSchema';
import { db } from '$lib/server/db';
import { customers, site, siteContracts, user } from '$lib/server/db/schema';
import { eq, and, sql, count } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { type Actions } from '@sveltejs/kit';
import { fail, message } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async () => {
	try {
		const form = await superValidate(zod4(editCustomer));

		const customerList = await db
			.select({
				id: customers.id,
				name: customers.name,
				phone: customers.phone,
				email: customers.email,
				tinNo: customers.tinNo,
				noOfSites: count(site.id),
				noOfContracts: count(siteContracts.id),
				joinedOn: sql<string>`DATE_FORMAT(${customers.createdAt}, '%Y-%m-%d')`,
				daysSinceJoined: sql<number>`DATEDIFF(CURRENT_DATE, ${customers.createdAt})`,
				addedBy: user.name,
				addedById: user.id
			})
			.from(customers)
			.leftJoin(user, eq(customers.createdBy, user.id))
			.leftJoin(site, eq(customers.id, site.customerId))
			.leftJoin(
				siteContracts,
				and(eq(site.id, siteContracts.isActive), eq(site.id, siteContracts.siteId))
			)
			.where(eq(customers.isActive, true))
			.groupBy(
				customers.id, // The primary key handles the "uniqueness"
				user.id, // Included because it's from a joined table
				user.name // Included to satisfy SQL strict mode
			);
		return {
			customerList,
			form
		};
	} catch (error) {
		console.error('Error loading customer dashboard:', error);
		return {
			customer: null,
			form: null,
			allMethods: [],
			reciepts: [],
			error: 'Failed to load customer dashboard.'
		};
	}
};
