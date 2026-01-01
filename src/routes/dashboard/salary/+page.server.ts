function prevMonthLabel(): string {
  const d = new Date();
  d.setMonth(d.getMonth());          // roll back one month

  const month = d.toLocaleString('en-US', { month: 'long' }); // "April"
  const year  = d.getFullYear();                              // 2025

  return `${month}_${year}`;
}
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from "../$types";


export const load: PageServerLoad = async () => {
    throw redirect(302, `/dashboard/salary/${prevMonthLabel()}`);
  

};