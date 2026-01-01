import { db } from "$lib/server/db";
import { serviceCategories, services, transactionServices } from "$lib/server/db/schema";
import { eq, sql } from "drizzle-orm";
import type { PageServerLoad } from "../$types";




export const load: PageServerLoad = async({locals})=>{
     
    

    let serviceList = await db.select(
        {
            id: services.id,
            name: services.name,
            price: services.price,
            description: services.description,
            category: serviceCategories.name,
            commission: services.commissionAmount,
            duration: services.durationMinutes,
            saleCount: sql<number>`SUM(${transactionServices.price })`,

        }
    ).from(services)
    .leftJoin(serviceCategories, eq(serviceCategories.id, services.categoryId))
    .leftJoin(transactionServices, eq(services.id, transactionServices.serviceId))
    .where(eq(services.branchId, locals?.user?.branch))
    .groupBy(
                services.id,
                services.name,
                services.price,
                services.description,
            serviceCategories.name,
                services.commissionAmount,
             
                services.id
            );
    serviceList =  serviceList.map(r => ({ ...r, price: Number(r.price), 
        commission: Number(r.commission), saleCount: Number(r.saleCount) }));

    return{
         serviceList
    }
}