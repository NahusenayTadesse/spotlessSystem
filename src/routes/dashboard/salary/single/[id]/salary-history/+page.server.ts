




import { db } from "$lib/server/db";
import { salaries } from "$lib/server/db/schema";

import { eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({params}) => {
             const {id} = params;

            const salaryHistory = await db.select({
               id: salaries.id,
               amount: salaries.amount,
               startDate: sql<string>`DATE_FORMAT(${salaries.startDate}, '%W, %b %d %Y')`,
               endDate: sql<string>`DATE_FORMAT(${salaries.endDate}, '%W, %b %d %Y')`,

               
            }).from(salaries)
            .where(eq(salaries.staffId, id));
            
        
        return {
             salaryHistory
        }
}  


