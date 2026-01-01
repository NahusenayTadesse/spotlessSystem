import { db } from "$lib/server/db";
import { paymentMethods, transactionProducts, transactions, transactionServices, transactionSupplies, user } from "$lib/server/db/schema";
import { and, asc, eq, sql } from "drizzle-orm";

import { currentMonthFilter } from "$lib/global.svelte";
import type { PageServerLoad } from "./$types";




export const load: PageServerLoad = async({params, locals})=>{

    const { range } = params as { range: string };    

     const [
  y1, m1, d1,
  y2, m2, d2,
] = range.split("-");

const start = `${y1}-${m1}-${d1}`;
const end   = `${y2}-${m2}-${d2}`; 




    

    const allTransactions = await db.select(
        {
            
             id: transactions.id,
                        date: sql<string>`DATE_FORMAT(${transactions.createdAt}, '%W %Y-%m-%d')`,
                        amount: transactions.amount,
                        paymentMethods: paymentMethods.name,
                        noOfProducts: sql<number>`COUNT(${transactionProducts.id})`,
                        noOfServices: sql<number>`COUNT(${transactionServices.id})`,
                        noOfSupplies: sql<number>`COUNT(${transactionSupplies.id})`,
                        recievedBy: user.name,
                        recievedById: user.id,
                        recieptLink: transactions.recieptLink
                     })
                     .from(transactions)
                     .leftJoin(transactionProducts, eq(transactionProducts.transactionId, transactions.id))
                     .leftJoin(transactionServices, eq(transactionServices.transactionId, transactions.id))
                     .leftJoin(transactionSupplies, eq(transactionSupplies.transactionId, transactions.id))
                    .leftJoin(paymentMethods, eq(transactions.paymentMethodId, paymentMethods.id))
                    .leftJoin(user, eq(transactions.createdBy, user.id))
                    .where ( and(
        eq(transactions.branchId, locals.user?.branch ),
        currentMonthFilter(transactions.createdAt, start, end)
        ))
        .groupBy(
  transactions.id,
  transactions.createdAt,
  transactions.amount,
  paymentMethods.name,
  user.name,
  user.id,
  transactions.recieptLink
)
        .orderBy(asc(transactions.createdAt));
  


    return{
         allTransactions,
         start,
         end
    }
}