import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { formatEthiopianYearMonth } from '$lib/global.svelte';

export const load: PageServerLoad = async () => {
	redirect(
		303,
		`/dashboard/salary/add-payroll/${formatEthiopianYearMonth(new Date().getFullYear(), new Date().getMonth() + 1).replace(' ', '_')}`
	);
};
