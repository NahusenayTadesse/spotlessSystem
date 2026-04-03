import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { formatEthiopianYearMonth } from '$lib/global.svelte';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;
	redirect(
		303,
		`/dashboard/employees/attendance/${formatEthiopianYearMonth(new Date().getFullYear(), new Date().getMonth() + 1).replace(' ', '_')}`
	);
};
