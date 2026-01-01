// import fs from 'node:fs';
// import path from 'node:path';
// import { generateUserId } from '$lib/global.svelte';
// import { Readable } from 'node:stream';
// import { pipeline } from 'node:stream/promises';
import { env } from '$env/dynamic/private';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { bookingFeeSchema as schema } from '$lib/zodschemas/appointmentSchema';
import { editAppointment } from '$lib/ZodSchema';

// const FILES_DIR: string = env.FILES_DIR ?? '.tempFiles';

// if (!fs.existsSync(FILES_DIR)) {
//   fs.mkdirSync(FILES_DIR, { recursive: true });
// }

import { db } from '$lib/server/db';
import {
	appointments,
	appointmentStatuses,
	customers,
	paymentMethods,
	transactionBookingFee,
	transactions,
	user
} from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { setError, fail, message } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';
import { saveUploadedFile } from '$lib/server/upload';
import { text } from 'drizzle-orm/sqlite-core';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { id } = params;
	const form = await superValidate(zod4(schema));
	const editForm = await superValidate(zod4(editAppointment));
	const customersList = await db
		.select({
			value: customers.id,
			name: sql<string>`concat(${customers.firstName}, ' ', ${customers.lastName}, ' - ', ${customers.phone})`
		})
		.from(customers)
		.where(and(eq(customers.isActive, true), eq(customers.branchId, locals?.user?.branch)));

	const appointmentsList = await db
		.select({
			id: appointments.id,
			customerName: sql<string>`TRIM(CONCAT(${customers.firstName}, ' ', COALESCE(${customers.lastName}, '')))`,
			customerId: customers.id,
			phone: customers.phone,
			date: sql<string>`DATE_FORMAT(${appointments.appointmentDate}, '%Y-%m-%d')`,
			time: sql<string>`DATE_FORMAT(${appointments.appointmentTime}, '%H:%i')`,
			bookedBy: user.name,
			status: appointmentStatuses.name,
			notes: appointments.notes,
			bookedAt: sql<string>`DATE_FORMAT(${appointments.createdAt}, '%Y-%m-%d')`,
			paidAmount: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`
		})
		.from(appointments)
		.leftJoin(customers, eq(appointments.customerId, customers.id))
		.leftJoin(user, eq(appointments.createdBy, user.id))
		.leftJoin(appointmentStatuses, eq(appointments.statusId, appointmentStatuses.id))
		.leftJoin(transactionBookingFee, eq(appointments.id, transactionBookingFee.appointmentId))
		.leftJoin(transactions, eq(transactionBookingFee.transactionId, transactions.id))
		.where(and(eq(appointments.branchId, locals?.user?.branch), eq(appointments.id, id)))
		.groupBy(
			appointments.id,
			customers.firstName,
			customers.lastName,
			customers.phone,
			appointmentStatuses.name,
			user.name,
			appointments.appointmentDate,
			appointments.appointmentTime,
			appointments.notes,
			appointments.createdAt
		)
		.then((rows) => rows[0]);

	const reciepts = await db
		.select({
			id: customers.id,
			customerName: sql<string>`TRIM(CONCAT(${customers.firstName}, ' ', COALESCE(${customers.lastName}, '')))`,
			appointmentDate: sql<string>`DATE_FORMAT(${appointments.appointmentDate}, '%Y-%m-%d')`,
			amount: transactions.amount,
			booker: user.id,
			recievedBy: user.name,
			paidAt: sql<string>`DATE_FORMAT(${transactions.createdAt}, '%Y-%m-%d')`,
			recieptLink: transactions.recieptLink
		})
		.from(transactionBookingFee)
		.innerJoin(appointments, eq(transactionBookingFee.appointmentId, appointments.id))
		.leftJoin(customers, eq(appointments.customerId, customers.id))
		.leftJoin(transactions, eq(transactionBookingFee.transactionId, transactions.id))
		.leftJoin(user, eq(transactions.createdBy, user.id))

		.where(and(eq(appointments.branchId, locals?.user?.branch), eq(appointments.id, id)))
		.orderBy(transactions.createdAt);

	const allMethods = await db
		.select({
			value: paymentMethods.id,
			name: paymentMethods.name,
			description: paymentMethods.description
		})
		.from(paymentMethods)
		.where(eq(paymentMethods.isActive, true));

	return {
		appointmentsList: appointmentsList ?? [],
		customersList: customersList ?? [],
		form,
		allMethods: allMethods ?? [],
		reciepts: reciepts ?? [],
		editForm
	};
};

export const actions: Actions = {
	confirmAppointment: async ({ request, cookies, locals }) => {
		const form = await superValidate(request, zod4(schema));

		if (!form.valid) {
			// Stay on the same page and set a flash message
			setFlash({ type: 'error', message: 'Please check your form data.' }, cookies);
			return fail(400, { form });
		}

		const { appointmentId, paymentStatus, amount, paymentMethod, image } = form.data;

		try {
			//      const imageName = `${generateUserId()}${path.extname(image.name)}`;

			// const file_path: string = path.normalize(
			//   path.join(FILES_DIR, imageName));

			//     const nodejs_wstream = fs.createWriteStream(file_path);
			//     const web_rstream = image.stream();
			//     const nodejs_rstream = Readable.fromWeb(web_rstream);
			//     await pipeline(nodejs_rstream, nodejs_wstream).catch(() => {
			//       return fail(500);
			//     });

			const imageName = await saveUploadedFile(image);

			const [transaction] = await db
				.insert(transactions)
				.values({
					amount,
					paymentMethodId: paymentMethod,
					recieptLink: imageName,
					paymentStatus,
					branchId: locals.user?.branch,
					createdBy: locals.user?.id
				})
				.$returningId();

			await db.insert(transactionBookingFee).values({
				fee: amount,
				transactionId: transaction.id,
				appointmentId
			});

			await db
				.update(appointments)
				.set({ statusId: 2, updatedBy: locals.user?.id })
				.where(eq(appointments.id, appointmentId));

			delete form.data.image;

			setFlash({ type: 'success', message: 'Successfully Confirmed Appointment ' }, cookies);
			return message(form, {
				type: 'success',
				text: 'Appointment confirmed successfully.'
			});
		} catch (err) {
			setFlash({ type: 'error', message: `Unexpected Error: ${err.message}` }, cookies);
			return message(form, {
				type: 'error',
				text: 'Unexpected error occurred.' + err.message
			});
		}
	},

	editAppointment: async ({ request, cookies, locals }) => {
		const form = await superValidate(request, zod4(editAppointment));

		if (!form.valid) {
			// Stay on the same page and set a flash message
			setFlash({ type: 'error', message: 'Please check your form data.' }, cookies);
			return fail(400, { form });
		}
		const { customerId, appointmentId, appointmentDate, appointmentTime, notes } = form.data;

		if (!customerId) {
			setError(form, 'customerId', 'Customer is required.');
			setFlash({ type: 'error', message: 'Customer Name is required.' }, cookies);
			return fail(400, { form });
		}

		const newDate = new Date(appointmentDate);

		try {
			await db
				.update(appointments)
				.set({
					customerId,
					appointmentDate: newDate,
					appointmentTime,
					notes,
					updatedBy: locals?.user?.id
				})
				.where(eq(appointments.id, appointmentId));

			// Stay on the same page and set a flash message
			setFlash({ type: 'success', message: 'Appointment updated Successfully Added' }, cookies);
			return message(form, {
				type: 'success',
				text: 'Appointment updated Successfully Added'
			});
		} catch (err) {
			console.error('Error' + err);
			setFlash({ type: 'error', message: 'Error: Something Went Wrong Try Again' }, cookies);

			return message(form, {
				type: 'error',
				text: 'Unexpected error occurred.' + err.message
			});
		}
	},
	delete: async ({ cookies, params }) => {
		const { id } = params;

		try {
			if (!id) {
				setFlash(
					{ type: 'error', message: `There is no appointment with the provided ID.` },
					cookies
				);
				return fail(400);
			}

			await db.delete(appointments).where(eq(appointments.id, id));

			setFlash({ type: 'success', message: 'Appointment Deleted Successfully!' }, cookies);
		} catch (err) {
			console.error('Error deleting appointment:', err);
			setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
			return fail(400);
		}
	}
};
