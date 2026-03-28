import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { formatEthiopianYear, getCurrentMonthRange } from '$lib/global.svelte';

export const load: PageServerLoad = async () => {
	redirect(303, `/dashboard/reports/${formatEthiopianYear(new Date())}`);
};
