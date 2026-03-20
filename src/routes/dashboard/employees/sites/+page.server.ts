import { db } from '$lib/server/db';
import {
	employee,
	department,
	employmentStatuses,
	educationalLevel,
	employeeTermination,
	missingDays,
	site,
	employeeGuarantor,
	staffAccounts,
	staffFamilies
} from '$lib/server/db/schema';
import { eq, and, sql, isNull, count, countDistinct } from 'drizzle-orm';
import type { PageServerLoad, Actions } from '../$types';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
	let siteList = await db
		.select({
			id: site.id,
			name: site.name,
			numbers: count(employee.id)
		})
		.from(site)
		.leftJoin(employee, eq(employee.siteId, site.id))
		.groupBy(site.id);

	return {
		siteList
	};
};
