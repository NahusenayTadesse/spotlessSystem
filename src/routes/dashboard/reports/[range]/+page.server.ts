import { db } from "$lib/server/db";
import { reports } from "$lib/server/db/schema";
import { and, asc, eq, sql } from "drizzle-orm";

import { currentMonthFilter } from "$lib/global.svelte";
import type { PageServerLoad } from "../$types";




export const load: PageServerLoad = async({params, locals})=>{

    const { range } = params as { range: string };    

     const [
  y1, m1, d1,
  y2, m2, d2,
] = range.split("-");

const start = `${y1}-${m1}-${d1}`;
const end   = `${y2}-${m2}-${d2}`; 




    

    const allReports = await db.select(
        {
            id: reports.id,
date: sql<string>`DATE_FORMAT(${reports.reportDate}, '%W %Y-%m-%d')`,
            bookedAppointments: reports.bookedAppointments,
            productsSold: reports.productsSold,
            serviceRendered: reports.servicesRendered,
            dailyExpenses: reports.dailyExpenses,
            dailyIncome: reports.dailyIncome,
            transactions: reports.transactions,
            staffPaid: reports.staffPaid,
            totalStaffPaid: reports.totalStaffPaid,
            staffHired: reports.staffHired,
            staffFired: reports.staffFired
        }
    ).from(reports)
    .where ( and(
        eq(reports.branchId, locals.user?.branch ),
        currentMonthFilter(reports.reportDate, start, end)
        ))
        .orderBy(asc(reports.reportDate));
  


    return{
         allReports,
         start,
         end
    }
}