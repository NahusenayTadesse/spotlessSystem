import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { customerSchema as schema } from '../add-customer/schema';
import { error } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import {
	customers,
	user,
	address,
	subcity,
	customerContracts,
	customerServices
} from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {
	const { id } = params;
	const form = await superValidate(zod4(schema));

	const customer = await db
		.select({
			id: customers.id,

			name: customers.name,
			phone: customers.phone,
			email: customers.email,
			tinNo: customers.tinNo,
			subcityId: address.subcityId,
			subcity: subcity.name,
			addressId: address.id,
			street: address.street,
			kebele: address.kebele,
			buildingNumber: address.buildingNumber,
			floor: address.floor,
			houseNumber: address.houseNumber,

			createdBy: user.name,
			createdAt: sql<string>`DATE_FORMAT(${customers.createdAt}, '%Y-%m-%d')`
		})
		.from(customers)
		.leftJoin(user, eq(customers.createdBy, user.id))
		.leftJoin(address, eq(customers.address, address.id))
		.leftJoin(subcity, eq(address.subcityId, subcity.id))
		.where(eq(customers.id, Number(id)))
		.then((rows) => rows[0]);

	if (!customer) {
		throw error(404, 'Customer not found, it has been deleted or never have existed.');
	}

	const contracts = await db
		.select({
			type: customerContracts.id,
			service: customerServices.name,
			amount: customerContracts.contractAmount,
			year: customerContracts.contractYear,
			addedBy: user.name,
			status: customerContracts.isActive
		})
		.from(customerContracts);

	return {
		customer,
		form,
		contracts
	};
};
