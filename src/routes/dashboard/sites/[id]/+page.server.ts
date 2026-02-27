import { zod4 } from 'sveltekit-superforms/adapters';
import { editCustomer } from '$lib/ZodSchema';
import { db } from '$lib/server/db';
import {
	customers,
	paymentMethods,
	transactions,
	site,
	user,
	address,
	subcity,
	customerContacts,
	customerContracts
} from '$lib/server/db/schema';
import { eq, desc, sql, count } from 'drizzle-orm';
import type { PageServerLoad } from '../$types';
import { superValidate } from 'sveltekit-superforms';
import { error, type Actions } from '@sveltejs/kit';
import { fail, message } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';

import { subcities, service } from '$lib/server/fastData';

import {
	editDetail,
	editAddress,
	addContact,
	editContact,
	addContract,
	editContract,
	addSites,
	editSites
} from './schema';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { id } = params;

	const detailForm = await superValidate(zod4(editDetail));
	const addressForm = await superValidate(zod4(editAddress));
	const addContactForm = await superValidate(zod4(addContact));
	const editContactForm = await superValidate(zod4(editContact));
	const addContractForm = await superValidate(zod4(addContract));
	const editContractForm = await superValidate(zod4(editContract));
	const editSiteForm = await superValidate(zod4(editSites));
	const addSiteForm = await superValidate(zod4(addSites));

	const subcityList = await subcities();
	const serviceList = await service();

	const singleSite = await db
		.select({
			id: site.id,
			name: site.name,
			customerName: customers.name,
			phone: site.phone,
			startedOn: sql<string>`DATE_FORMAT(${site.startDate}, '%Y-%m-%d')`,
			addedBy: user.name,
			addedById: user.id,
			status: site.isActive
		})
		.from(site)
		.leftJoin(user, eq(site.createdBy, user.id))
		.leftJoin(customers, eq(customers.id, site.customerId))
		.where(eq(site.id, Number(id)))
		.then((rows) => rows[0]);

	if (!singleSite) {
		error(404, 'Site with this id not found');
	}

	const customerAddress = await db
		.select({
			id: address.id,
			street: address.street,
			subcity: subcity.name,
			subcityId: subcity.id,
			kebele: address.kebele,
			buildingNumber: address.buildingNumber,
			floor: address.floor,
			houseNumber: address.houseNumber,
			status: address.status
		})
		.from(address)
		.leftJoin(site, eq(site.address, address.id))
		.leftJoin(subcity, eq(address.subcityId, subcity.id))
		.where(eq(site.id, Number(id)))
		.then((rows) => rows[0]);

	let contacts = await db
		.select({
			id: customerContacts.id,
			contactType: customerContacts.contactType,
			contactDetail: customerContacts.contactDetail,
			status: customerContacts.isActive,
			addedBy: user.name,
			addedById: user.id
		})
		.from(customerContacts)
		.leftJoin(user, eq(customerContacts.createdBy, user.id))
		.where(eq(customerContacts.customerId, Number(id)));

	let contracts = await db
		.select({
			id: customerContracts.id,
			contractType: customerContracts.contractType,
			contactAmount: customerContracts.contractAmount,
			status: customerContracts.isActive,
			addedBy: user.name,
			addedById: user.id
		})
		.from(customerContracts)
		.leftJoin(user, eq(customerContracts.createdBy, user.id))
		.where(eq(customerContracts.customerId, Number(id)))
		.orderBy(desc(customerContracts.contractDate));

	let sites = await db
		.select({
			id: site.id,
			name: site.name,
			phone: site.phone,
			startDate: site.startDate,
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
			},
			status: site.isActive,
			addedBy: user.name,
			addedById: user.id
		})
		.from(site)
		.leftJoin(user, eq(site.createdBy, user.id))
		.leftJoin(address, eq(address.id, site.address))
		.leftJoin(subcity, eq(subcity.id, address.subcityId))
		.where(eq(site.customerId, Number(id)));

	return {
		customer: singleSite,
		customerAddress,
		detailForm,
		addressForm,
		subcityList,
		addContactForm,
		editContactForm,
		addContractForm,
		editContractForm,
		contacts,
		contracts,
		serviceList,
		sites,
		editSiteForm,
		addSiteForm
	};
};

export const actions: Actions = {
	editDetail: async ({ request, locals, cookies, params }) => {
		const { id } = params;
		const form = await superValidate(request, zod4(editDetail));

		if (!form.valid) {
			// Stay on the same page and set a flash message
			return message(form, { type: 'error', text: 'Error: Please Check the form' });
		}
		const { name, phone, tinNo, email, status } = form.data;

		try {
			await db
				.update(customers)
				.set({
					name,
					phone,
					tinNo,
					email,
					status,
					updatedBy: locals?.user?.id
				})
				.where(eq(customers.id, Number(id)));

			// Stay on the same page and set a flash message
			return message(form, { type: 'success', text: 'Customer updated Successfully Added' });
		} catch (err) {
			return message(form, { type: 'error', text: 'Error: Something Went Wrong Try Again' });
		}
	},
	editAddress: async ({ request }) => {
		const form = await superValidate(request, zod4(editAddress));
		if (!form.valid) {
			// Stay on the same page and set a flash message
			return message(form, { type: 'error', text: `Error: check the form` });
		}
		const { id, street, subcity, kebele, buildingNumber, floor, houseNumber, status } = form.data;

		try {
			if (!id) {
				return message(form, { type: 'error', text: `Employee Not Found` });
			}

			// Wrap the database operations in a transaction
			await db.transaction(async (tx) => {
				// 1. Update the employee identity

				await tx
					.update(address)
					.set({
						subcityId: subcity,
						street,
						kebele,
						buildingNumber,
						floor,
						houseNumber,
						status
					})
					.where(eq(address.id, Number(id)));
			});
			return message(form, { type: 'success', text: 'Address Details Updated Successfully!' });
		} catch (err) {
			console.error('Error updating Address details:', err);
			return message(form, { type: 'error', text: `Unexpected Error: ${err?.message}` });
		}
	},
	delete: async ({ cookies, params }) => {
		const { id } = params;

		try {
			if (!id) {
				setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
				return fail(400);
			}

			await db.delete(customers).where(eq(customers.id, id));

			setFlash({ type: 'success', message: 'Customer Deleted Successfully!' }, cookies);
			return message(form, {
				type: 'success',
				text: 'Customer Deleted Successfully!'
			});
		} catch (err) {
			console.error('Error deleting customer:', err);
			setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
			return fail(400);
		}
	},
	addContact: async ({ request, locals, params }) => {
		const { id } = params;
		const form = await superValidate(request, zod4(addContact));

		if (!form.valid) {
			return message(form, { type: 'error', text: `Error: check the form` });
		}

		const { contactDetail, contactType, status } = form.data;

		try {
			await db.transaction(async (tx) => {
				await tx.insert(customerContacts).values({
					customerId: Number(id),
					contactDetail,
					contactType,
					isActive: status,
					createdBy: locals?.user?.id
				});

				return message(form, {
					type: 'success',
					text: 'Contact Details Created Successfully!'
				});
			});
		} catch (err) {
			return message(form, {
				type: 'error',
				text: `Creating Contact failed: ${err instanceof Error ? err.message : 'Unknown error'}`
			});
		}
	},
	editContact: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(editContact));

		if (!form.valid) {
			return message(form, { type: 'error', text: `Error: check the form` });
		}

		const { id, contactDetail, contactType, status } = form.data;

		try {
			await db.transaction(async (tx) => {
				await tx
					.update(customerContacts)
					.set({
						contactDetail,
						contactType,
						isActive: status,
						updatedBy: locals?.user?.id
					})
					.where(eq(customerContacts.id, id));

				return message(form, {
					type: 'success',
					text: 'Contact Details Updated Successfully!'
				});
			});
		} catch (err) {
			return message(form, {
				type: 'error',
				text: `Updated Contact failed: ${err instanceof Error ? err.message : 'Unknown error'}`
			});
		}
	},

	editSite: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(editSites));

		if (!form.valid) {
			return message(form, { type: 'error', text: `Error: check the form` });
		}

		const { id, name, phone, startDate, endDate, status } = form.data;

		try {
			await db.transaction(async (tx) => {
				await tx
					.update(site)
					.set({
						name,
						phone,
						startDate: new Date(startDate),
						endDate: new Date(endDate),
						isActive: status,
						updatedBy: locals?.user?.id
					})
					.where(eq(site.id, id));

				return message(form, {
					type: 'success',
					text: 'Site Details Updated Successfully!'
				});
			});
		} catch (err) {
			return message(form, {
				type: 'error',
				text: `Updated failed: ${err instanceof Error ? err.message : 'Unknown error'}`
			});
		}
	},
	addSite: async ({ request, locals, params }) => {
		const { id } = params;
		const form = await superValidate(request, zod4(addSites));

		if (!form.valid) {
			return message(form, { type: 'error', text: `Error: check the form` });
		}

		const {
			name,
			phone,
			startDate,
			endDate,
			status,
			street,
			subcity,
			kebele,
			buildingNumber,
			floor,
			houseNumber
		} = form.data;

		try {
			await db.transaction(async (tx) => {
				const [addressRes] = await tx
					.insert(address)
					.values({
						subcityId: Number(subcity), // Handle potential NaN
						street,
						kebele,
						buildingNumber,
						floor,
						houseNumber,
						status: true
					})
					.$returningId();
				await tx.insert(site).values({
					name,
					phone,
					customerId: Number(id),
					startDate: new Date(startDate).toISOString(),
					endDate: new Date(endDate).toISOString(),
					isActive: status,
					address: addressRes.id,
					createdBy: locals?.user?.id
				});

				return message(form, {
					type: 'success',
					text: 'Site Added Successfully!'
				});
			});
		} catch (err) {
			console.error(err?.message);
			return message(form, {
				type: 'error',
				text: `Adding Site failed: ${err instanceof Error ? err.message : 'Unknown error'}`
			});
		}
	}
};
