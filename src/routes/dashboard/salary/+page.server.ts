function prevMonthLabel(): string {
	const d = new Date();
	d.setMonth(d.getMonth()); // roll back one month

	const month = new Date().getMonth() + 2; // "April"
	const year = d.getFullYear(); // 2025

	return formatEthiopianYearMonth(year, month).replace(' ', '_');
}
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { formatEthiopianYearMonth } from '$lib/global.svelte';

export const load: PageServerLoad = async () => {
	throw redirect(302, `/dashboard/salary/${prevMonthLabel()}`);
};
