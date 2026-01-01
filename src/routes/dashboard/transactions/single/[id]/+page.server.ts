

import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import {  editStaff as schema } from '$lib/zodschemas/appointmentSchema';



import { db } from "$lib/server/db"; 
import {  staff, salaries, user, products, services, transactionProducts, transactionServices, transactions, paymentMethods, transactionSupplies, supplies  } from "$lib/server/db/schema";
import { eq, and, sql } from "drizzle-orm";
import type { Actions, PageServerLoad } from "./$types";
import { fail } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';



export const load: PageServerLoad = async ({ params, locals }) => {


     const {id} = params;
       const form = await superValidate(zod4(schema));


      const singleTransaction = await db
         .select({
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
         .groupBy(
  transactions.id,
  transactions.createdAt,
  transactions.amount,
  paymentMethods.name,
  user.name,
  user.id,
  transactions.recieptLink
)
         .where(
            and(
               eq(transactions.branchId, locals?.user?.branch),
               eq(transactions.id, id)
            )
         )
         .groupBy(
            transactions.id,
            transactions.createdAt,
            transactions.amount,
            paymentMethods.name,
            user.name,
            user.id,
            transactions.recieptLink
         )
         .then(rows => rows[0]);

  
         const soldProducts = await db
  .select({
    name: products.name,
    quantity: transactionProducts.quantity,
    productId: products.id,
    price: transactionProducts.unitPrice,
    soldBy: sql<string>`
      TRIM(CONCAT(${staff.firstName}, ' ', COALESCE(${staff.lastName}, '')))
    `,
    tip: transactionProducts.tip,
    total: sql<number>`
      (${transactionProducts.quantity} * ${transactionProducts.unitPrice}) 
      + COALESCE(${transactionProducts.tip}, 0)
    `,
  })
  .from(transactionProducts)
  .leftJoin(products, eq(transactionProducts.productId, products.id))
  .leftJoin(staff, eq(transactionProducts.staffId, staff.id)) // <-- REQUIRED
  .where(eq(transactionProducts.transactionId, id));

         const soldServices = await db.select({
               name: services.name,
               price: transactionServices.price,
               serviceId: services.id,
               tip: transactionServices.tip,
doneBy: sql<string>`
      TRIM(CONCAT(${staff.firstName}, ' ', COALESCE(${staff.lastName}, '')))
    `,               total: sql<number>`${transactionServices.price} + ${transactionServices.tip}`,
               quantity: sql<number>`1`
         }).from(transactionServices)
         .leftJoin(services, eq(transactionServices.serviceId, services.id))
         .leftJoin(staff, eq(transactionServices.staffId, staff.id))
         .where(
            eq(transactionServices.transactionId, id)
         ); 


       const boughtSupplies = await db
  .select({
    name: supplies.name,
    supplyId: supplies.id,
    quantity: transactionSupplies.quantity,
    price: transactionSupplies.unitPrice,
    reciever: user.name,
    total: sql<number>`
      (${transactionSupplies.quantity} * ${transactionSupplies.unitPrice}) 
    `,
  })
  .from(transactionSupplies)
  .leftJoin(supplies, eq(transactionSupplies.supplyId, supplies.id))
  .leftJoin(user, eq(transactionSupplies.createdBy, user.id)) // <-- REQUIRED
  .where(eq(transactionSupplies.transactionId, id));

  



   







  

        return {
            singleTransaction,
            soldProducts,
            soldServices,
            boughtSupplies,
           
            form,
     
        }
}


import fs from 'node:fs';
import path from 'node:path';
import { generateUserId } from '$lib/global.svelte';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { env } from '$env/dynamic/private';
const FILES_DIR: string = env.FILES_DIR ?? '.tempFiles';
if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR, { recursive: true });
}

export const actions: Actions = {
  editStaff: async ({ request, cookies, locals }) => {
    const form = await superValidate(request, zod4(schema));

    if (!form.valid) {
      // Stay on the same page and set a flash message
      setFlash({ type: 'error', message: "Please check your form data." }, cookies);
      return fail(400, { form });
    }
    

        const { staffId, firstName, lastName, position, phone, email, salary, hiredAt, govId, contract } = form.data; 




   
       
    try{

       const files = await db.select({govtId: staff.govtId, contract: staff.contract}).from(staff).where(eq(staff.id, staffId)).then(rows => rows[0]);
       let newGovId: string | null;
       let newContract: string | null;
           if(govId && govId.size > 0){
             
             const imageName = `${generateUserId()}${path.extname(govId.name)}`;
                      
            
                       const govPath: string = path.normalize(
              path.join(FILES_DIR, imageName));    		
            
                const nodejs_wstream = fs.createWriteStream(govPath);
                const web_rstream = govId.stream();
                const nodejs_rstream = Readable.fromWeb(web_rstream);


                newGovId = imageName;
                await pipeline(nodejs_rstream, nodejs_wstream).catch(() => {
            
                  return fail(500);
                });
           }
           else {
             newGovId = files.govtId
           }



           if(contract && contract.size > 0){
             
            const contractName = `${generateUserId()}${path.extname(contract.name)}`;

           const contractPath: string = path.normalize(
  path.join(FILES_DIR, contractName));    		

    const nodejs_wstreamContract = fs.createWriteStream(contractPath);
    const web_rstreamContract = contract.stream();
    const nodejs_rstreamContract = Readable.fromWeb(web_rstreamContract);

     newContract = contractName;
    await pipeline(nodejs_rstreamContract, nodejs_wstreamContract).catch(() => {
      return fail(500);
    });
           }
           else {
             newContract = files.contract
           }
     

  
  
  
       await db.update(staff).set({
        firstName, lastName, 
        type: position,
        phone, email,
        hireDate: new Date(hiredAt),
        govtId: newGovId,
        contract: newContract,
        updatedBy: locals?.user?.id
    }).where(eq(staff.id, staffId));

    await db.update(salaries).set({
           amount: salary,
           staffId,
           updatedBy: locals.user?.id,
       })
 delete form.data.govId;
   delete form.data.contract;
 
      // Stay on the same page and set a flash message
      setFlash({ type: 'success', message: "Service Updated Successuflly" }, cookies);
    return {
      form
    } } catch(err){
         console.error("Error" + err)
    }
  },
    delete: async({cookies, params })=> {
     
        const {id} = params;
         
    
        try {
        if (!id) {
        setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
          return fail(400);
        }
  
        await db.delete(staff).where(eq(staff.id, id));
  
         
          setFlash({ type: 'success', message: "Staff Member Deleted Successfully!" }, cookies);
  
      } catch (err) {
        console.error('Error deleting staff member:', err);
        setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
        return fail(400)
      }
      
        
    
    
      },
};