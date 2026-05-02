import * as auth from '$lib/server/auth';
import { fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { reports, supplies, siteContracts, services, site } from '$lib/server/db/schema';
import { eq, lte, sql, and, inArray } from 'drizzle-orm';
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

	const expiringContracts = await db
		.select({
			id: siteContracts.id,
			service: services.name,
			site: site.name,
			endDate: siteContracts.endDate,
			// We re-calculate this here for use in the UI
			daysRemaining: sql<number>`DATEDIFF(${siteContracts.endDate}, NOW())`,
			monthlyAmount: siteContracts.monthlyAmount,
			status: siteContracts.isActive
		})
		.from(siteContracts)
		.leftJoin(services, eq(siteContracts.serviceId, services.id))
		.leftJoin(site, eq(siteContracts.siteId, site.id))
		.where(
			and(eq(siteContracts.isActive, true), sql`DATEDIFF(${siteContracts.endDate}, NOW()) < 30`)
		)
		.orderBy(sql`DATEDIFF(${siteContracts.endDate}, NOW()) ASC`);

	await db
		.update(siteContracts)
		.set({ isActive: false, inActiveReason: 'Automatic Expiration of Contract By System' })
		.where(
			inArray(
				siteContracts.id,
				expiringContracts.filter((c) => c.daysRemaining <= 0).map((c) => c.id)
			)
		);

	return {
		reorderSupplies,
		todayReport,
		expiringContracts
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
