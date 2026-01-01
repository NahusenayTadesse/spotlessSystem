import { setError, superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { eq, and, sql } from 'drizzle-orm';

import { appointmentSchema as schema, existingCustomerAppointment } from '$lib/ZodSchema';
import { db } from '$lib/server/db';
import { products, customers, appointments, reports } from '$lib/server/db/schema/';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types.js';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async ({ locals }) => {
	const form = await superValidate(zod4(schema));
	const existingForm = await superValidate(zod4(existingCustomerAppointment));
	const customersList = await db
		.select({
			value: customers.id,
			// name: customers.firstName
			name: sql<string>`concat(${customers.firstName}, ' ', ${customers.lastName}, ' - ', ${customers.phone})`
		})
		.from(customers)
		.where(and(eq(customers.isActive, true), eq(customers.branchId, locals?.user?.branch)));

	const productsList = await db
		.select({
			value: products.id,
			name: products.name
		})
		.from(products)
		.where(and(eq(products.isActive, true), eq(products.branchId, locals?.user?.branch)));

	return {
		form,
		existingForm,
		customersList,
		productsList
	};
};

export const actions: Actions = {
	addAppointment: async ({ request, cookies, locals }) => {
		const form = await superValidate(request, zod4(schema));

		if (!form.valid) {
			// Stay on the same page and set a flash message
			setFlash({ type: 'error', message: 'Please check your form data.' }, cookies);
			return fail(400, { form });
		}

		const { firstName, lastName, phone, gender, appointmentDate, appointmentTime, notes } =
			form.data;

		try {
			const [customer] = await db
				.insert(customers)
				.values({
					firstName,
					lastName,
					phone,
					gender,
					branchId: locals?.user?.branch,
					createdBy: locals?.user?.id
				})
				.$returningId();

			await db.insert(appointments).values({
				customerId: customer.id,
				appointmentDate,
				appointmentTime,
				appointmentStatusId: 1,
				notes,
				createdBy: locals?.user?.id,
				branchId: locals?.user?.branch
			});

			const today = new Date();

			const existingReport = await db
				.select({
					id: reports.id
				})
				.from(reports)
				.where(and(eq(reports.reportDate, sql`CURDATE()`)))
				.then((rows) => rows[0]);

			if (existingReport) {
				await db
					.update(reports)
					.set({
						bookedAppointments: sql<number>`${reports.bookedAppointments} + 1`
					})
					.where(eq(reports.id, existingReport.id));
			} else {
				await db.insert(reports).values({
					reportDate: today,
					bookedAppointments: 1,
					branchId: locals?.user?.branch
				});
			}

			setFlash({ type: 'success', message: 'New Appointment Successfully Added' }, cookies);
			return message(form, 'New Appointment Successfully Added');
		} catch (err) {
			return message(form, {
				type: 'error',
				text:
					err.code === 'ER_DUP_ENTRY'
						? 'Phone number is already taken. Please choose another one.'
						: err.message
			});

			// if (err.code === 'ER_DUP_ENTRY')
			// 	return setError(form, 'phone', 'Phone Number already exists.');

			// return fail(400, {
			// 	form
			// });
		}
	},

	addExistingCustomerAppointment: async ({ request, cookies, locals }) => {
		const form = await superValidate(request, zod4(existingCustomerAppointment));

		if (!form.valid) {
			// Stay on the same page and set a flash message
			setFlash({ type: 'error', message: 'Please check your form data.' }, cookies);
			return fail(400, { form });
		}
		const { customerId, appointmentDate, appointmentTime, notes } = form.data;

		if (!customerId) {
			setError(form, 'customerId', 'Customer is required.');
			setFlash({ type: 'error', message: 'Customer Name is required.' }, cookies);
			return fail(400, { form });
		}

		try {
			await db.insert(appointments).values({
				customerId,
				appointmentDate,
				appointmentTime,
				statusId: 1,
				notes,
				createdBy: locals?.user?.id,
				branchId: locals?.user?.branch
			});

			const today = new Date();

			const existingReport = await db
				.select({
					id: reports.id
				})
				.from(reports)
				.where(and(eq(reports.reportDate, sql`CURDATE()`)))
				.then((rows) => rows[0]);

			if (existingReport) {
				await db
					.update(reports)
					.set({
						bookedAppointments: sql<number>`${reports.bookedAppointments} + 1`
					})
					.where(and(eq(reports.id, existingReport.id)));
			} else {
				await db.insert(reports).values({
					reportDate: today,
					bookedAppointments: 1,
					branchId: locals?.user?.branch
				});
			}

			// Stay on the same page and set a flash message
			// setFlash({ type: 'success', message: 'New Appointment Successfully Added' }, cookies);
			return message(form, { type: 'success', text: 'New Appointment Successfully Added' });
		} catch (err) {
			console.error('Error' + err);

			return message(form, { type: 'error', text: 'Error: Something Went Wrong Try Again' });
		}
	}
};
