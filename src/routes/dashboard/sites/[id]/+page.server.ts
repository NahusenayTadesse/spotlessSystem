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
	customerContracts,
	siteContacts,
	siteContracts,
	services
} from '$lib/server/db/schema';
import { eq, desc, sql, count } from 'drizzle-orm';
import type { PageServerLoad } from '../$types';
import { superValidate } from 'sveltekit-superforms';
import { error, type Actions } from '@sveltejs/kit';
import { fail, message } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';

import { subcities, service, customerList } from '$lib/server/fastData';

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
import { saveUploadedFile } from '$lib/server/upload';

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
	const customerListing = await customerList();

	const singleSite = await db
		.select({
			id: site.id,
			name: site.name,
			customerName: customers.name,
			customerId: site.customerId,
			phone: site.phone,
			officeCommission: site.officeCommission,
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
			id: siteContacts.id,
			contactType: siteContacts.contactType,
			contactDetail: siteContacts.contactDetail,
			status: siteContacts.isActive,
			addedBy: user.name,
			addedById: user.id
		})
		.from(siteContacts)
		.leftJoin(user, eq(siteContacts.createdBy, user.id))
		.where(eq(siteContacts.siteId, Number(id)));

	let contracts = await db
		.select({
			id: siteContracts.id,
			serviceName: services.name,
			serviceId: siteContracts.serviceId,
			startDate: siteContracts.startDate,
			endDate: siteContracts.endDate,
			monthlyAmount: siteContracts.monthlyAmount,
			contractYear: siteContracts.contractYear,
			signedDate: siteContracts.contractDate,
			contractFile: siteContracts.contractFile,
			officeCommission: siteContracts.commissionConsidered,
			status: siteContracts.isActive,
			signingOfficer: siteContracts.signingOfficer,
			addedBy: user.name,
			addedById: user.id
		})
		.from(siteContracts)
		.leftJoin(services, eq(siteContracts.serviceId, services.id))
		.leftJoin(user, eq(siteContracts.createdBy, user.id))
		.where(eq(siteContracts.siteId, Number(id)))
		.orderBy(desc(siteContracts.contractDate));

	return {
		customer: singleSite,
		customerList: customerListing,
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
		const { name, phone, status, officeCommission, customer } = form.data;

		try {
			await db
				.update(site)
				.set({
					name,
					phone,
					customerId: customer,
					isActive: status,
					officeCommission,
					updatedBy: locals?.user?.id
				})
				.where(eq(site.id, Number(id)));

			// Stay on the same page and set a flash message
			return message(form, { type: 'success', text: 'Site updated Successfully Added' });
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
						floor: Number(floor),
						houseNumber: Number(houseNumber),
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
				await tx.insert(siteContacts).values({
					siteId: Number(id),
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
					.update(siteContacts)
					.set({
						contactDetail,
						contactType,
						isActive: status,
						updatedBy: locals?.user?.id
					})
					.where(eq(siteContacts.id, id));

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
	addContract: async ({ request, locals, params }) => {
		const { id } = params;
		const form = await superValidate(request, zod4(addContract));

		if (!form.valid) {
			return message(form, { type: 'error', text: `Error: check the form` });
		}

		const {
			service,
			contractDate,
			contractYear,
			startDate,
			endDate,
			contractFile,
			monthlyAmount,
			status,
			commissionConsidered,
			signingOfficer
		} = form.data;

		try {
			await db.transaction(async (tx) => {
				const contractFileName = await saveUploadedFile(contractFile);
				await tx.insert(siteContracts).values({
					siteId: Number(id),
					serviceId: service,
					contractDate,
					contractYear,
					startDate,
					endDate,
					contractFile: contractFileName,
					monthlyAmount,
					isActive: status,
					commissionConsidered,
					signingOfficer,
					createdBy: locals?.user?.id
				});

				return message(form, {
					type: 'success',
					text: 'Contract Added Successfully!'
				});
			});
		} catch (err) {
			console.error(err?.message);
			return message(form, {
				type: 'error',
				text: `Adding Site failed: ${err instanceof Error ? err.message : 'Unknown error'}`
			});
		}
	},
	editContract: async ({ request, locals, params }) => {
		const form = await superValidate(request, zod4(editContract));

		if (!form.valid) {
			return message(form, { type: 'error', text: `Error: check the form` });
		}

		const {
			id,
			service,
			contractDate,
			contractYear,
			startDate,
			endDate,
			contractFile,
			monthlyAmount,
			status,
			commissionConsidered,
			signingOfficer
		} = form.data;

		try {
			await db.transaction(async (tx) => {
				if (contractFile) {
					const contractFileName = await saveUploadedFile(contractFile);

					await tx
						.update(siteContracts)
						.set({
							serviceId: service,
							contractDate: new Date(contractDate),
							contractYear,
							startDate: new Date(startDate),
							endDate: new Date(endDate),
							contractFile: contractFileName,
							monthlyAmount: String(monthlyAmount),
							isActive: status,
							commissionConsidered,
							signingOfficer,
							updatedBy: locals?.user?.id
						})
						.where(eq(siteContracts.id, id));
				} else {
					await tx
						.update(siteContracts)
						.set({
							serviceId: service,
							contractDate: new Date(contractDate),
							contractYear,
							startDate: new Date(startDate),
							endDate: new Date(endDate),
							monthlyAmount: String(monthlyAmount),
							isActive: status,
							commissionConsidered,
							signingOfficer,
							updatedBy: locals?.user?.id
						})
						.where(eq(siteContracts.id, id));
				}

				return message(form, {
					type: 'success',
					text: 'Contract Updated Successfully!'
				});
			});
		} catch (err) {
			console.error(err?.message);
			return message(form, {
				type: 'error',
				text: `Updating Contract failed: ${err instanceof Error ? err.message : 'Unknown error'}`
			});
		}
	}
};
