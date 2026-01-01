import { db } from "$lib/server/db";
import {  supplies } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "../$types";




export const load: PageServerLoad = async({locals})=>{
     
    

    let supplyList = await db.select(
        {
            id: supplies.id,
            name: supplies.name,
            price: supplies.costPerUnit,
            description: supplies.description,
            quantity: supplies.quantity,
            supplier: supplies.supplier,
            unitOfMeasure: supplies.unitOfMeasure

        }
    ).from(supplies)
    .where(eq(supplies.branchId, locals?.user?.branch));
  

   supplyList = supplyList.map(r => ({ ...r, price: Number(r.price), quantity: Number(r.quantity) }));
    return{
         supplyList
    }
}