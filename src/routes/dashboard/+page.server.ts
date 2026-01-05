import * as auth from '$lib/server/auth';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { reports, supplies } from '$lib/server/db/schema';
import { eq, lte, sql } from 'drizzle-orm';
export const load: PageServerLoad = async ({ locals }) => {
	const reorderSupplies = await db
		.select({
			name: supplies.name,
			quantity: supplies.quantity
		})
		.from(supplies)
		.where(lte(supplies.quantity, supplies.reorderLevel));

	const todayReport = await db
		.select({
			id: reports.id,
			bookedAppointments: reports.bookedAppointments,
			productsSold: reports.productsSold,
			serviceRendered: reports.servicesRendered,
			dailyExpenses: reports.dailyExpenses,
			staffPaid: reports.staffPaid,
			dailyIncome: reports.dailyIncome,
			transactions: reports.transactions
		})
		.from(reports)
		.where(eq(reports.reportDate, sql`CURDATE()`))
		.then((rows) => rows[0]);

	return {
		reorderSupplies,
		todayReport
	};
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		redirect('/login', { type: 'success', message: 'Logout Successful' }, event.cookies);
	}
};
