import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCurrentMonthRange } from '$lib/global.svelte';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	redirect(303, `/dashboard/employees/ranges/${getCurrentMonthRange()}-${id}`);
};

// import { superValidate } from 'sveltekit-superforms';
// import { zod4 } from 'sveltekit-superforms/adapters';
// import {  editStaff as schema } from '$lib/zodschemas/appointmentSchema';

// import { db } from "$lib/server/db";
// import {  staff, staffTypes, salaries, user, deductions, commissionService, commissionProduct, bonuses, overTime, products, services, transactionProducts, transactionServices  } from "$lib/server/db/schema";
// import { eq, and, sql } from "drizzle-orm";
// import type { Actions, PageServerLoad } from "./$types";
// import { fail } from 'sveltekit-superforms';
// import { setFlash } from 'sveltekit-flash-message/server';

// export const load: PageServerLoad = async ({ params, locals }) => {

//      const {id} = params;
//        const form = await superValidate(zod4(schema));

//         const staffMember = await db.select(
//           {
//            id: staff.id,
//            firstName: staff.firstName,
//            lastName: staff.lastName,

//             category: staffTypes.name,
//             categoryId: staffTypes.id,
//             phone: staff.phone,
//             email: staff.email,
//             status: staff.employmentStatus,
//             salary: salaries.amount,
//             hireDate: sql<string>`DATE_FORMAT(${staff.hireDate}, '%Y-%m-%d')`,
//             govId: staff.govtId,
//              contract: staff.contract,

//             addedBy: user.name,
//             years: sql<number>`TIMESTAMPDIFF(YEAR, ${staff.hireDate}, CURDATE())`,

//           }
//         )
//         .from(staff)
//         .leftJoin(staffTypes, eq(staff.type, staffTypes.id))
//         .leftJoin(salaries, eq(staff.id, salaries.staffId))
//         .leftJoin(user, eq(staff.createdBy, user.id))
//           .where(
//             and
//             (
//               eq(staff.branchId, locals?.user?.branch),
//               eq(staff.id, id)
//             ))
//         .then(rows => rows[0]);

//          const categories = await db
//                 .select({
//                   value: staffTypes.id,
//                   name: staffTypes.name,
//                   description: staffTypes.description
//                 })
//                 .from(staffTypes);

//     const currentYear = new Date().getFullYear();
//     const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed

//     // Helper function for date filtering logic (same for all compensation tables)
//     const currentMonthFilter = (dateField: any) =>
//         sql`${sql.raw('YEAR(')}${dateField}${sql.raw(')')} = ${currentYear}

//     AND ${sql.raw('MONTH(')}${dateField}${sql.raw(')')} = ${currentMonth}`;

//     // --- Select Commissions (Service) ---
//     const serviceCommissions = await db.select({
//         staffId: commissionService.staffId,
//         service: services.name,
//         amount: commissionService.amount,
//         date: commissionService.commissionDate,
//     })
//     .from(commissionService)
//      .leftJoin(transactionServices, eq(commissionService.saleItemId, transactionServices.id))
//   .leftJoin(services, eq(transactionServices.serviceId, services.id))

//     .where(and(
//       currentMonthFilter(commissionService.commissionDate),

//         eq(commissionService.staffId, id),
//     )
//     );

//     // --- Select Commissions (Product) ---
//   const productCommissions = await db  // <-- add await
//   .select({
//     staffId: commissionProduct.staffId,
//     product: products.name,
//     amount: commissionProduct.amount,
//     date: commissionProduct.commissionDate,
//   })
//   .from(commissionProduct)
//   .leftJoin(transactionProducts, eq(commissionProduct.saleItemId, transactionProducts.id))
//   .leftJoin(products, eq(transactionProducts.productId, products.id))

//   .where(
//     and(
//     eq(commissionProduct.staffId, id),
//     currentMonthFilter(commissionProduct.commissionDate)
//     )
//   );

//     // --- Select Bonuses ---
//     const staffBonuses =  await db.select({
//         staffId: bonuses.staffId,

//         description: bonuses.description,
//         amount: bonuses.amount,
//         date: bonuses.bonusDate,
//     })
//     .from(bonuses)
//     .where(
//       and(
//         eq(bonuses.staffId, id),
//         currentMonthFilter(bonuses.bonusDate)
//       )
//     );

//     // --- Select Overtime ---
//     const staffOvertime = await db.select({
//         staffId: overTime.staffId,
//         description: sql<string>`CONCAT('Overtime (', ${overTime.hours}, ' hours at $', ${overTime.amountPerHour}, '/hr)')`,
//         amount: overTime.total,
//         date: overTime.date,
//     })
//     .from(overTime)
//     .where(
//       and(
//         eq(overTime.staffId, id),
//         currentMonthFilter(overTime.date)
//       )
//     );

//     // --- Select Deductions ---
//     const staffDeductions = await db.select({
//         staffId: deductions.staffId,
//         description: deductions.type, // Using the 'type' column for description
//         // Amount is stored as a positive number in the table, but we mark it as a deduction
//         amount: deductions.amount,
//         date: deductions.deductionDate,
//     })
//     .from(deductions)
//     .where(
//       and(
//         eq(deductions.staffId, id),
//         currentMonthFilter(deductions.deductionDate)
//       )
//     );

//     // --- Combine all results using unionAll ---

//         return {
//             staffMember,
//            staffDeductions,
//            staffOvertime,
//             staffBonuses,
//             productCommissions,
//             serviceCommissions,
//             form,
//             categories,

//         }
// }

// import fs from 'node:fs';
// import path from 'node:path';
// import { generateUserId } from '$lib/global.svelte';
// import { Readable } from 'node:stream';
// import { pipeline } from 'node:stream/promises';
// import { env } from '$env/dynamic/private';
// const FILES_DIR: string = env.FILES_DIR ?? '.tempFiles';
// if (!fs.existsSync(FILES_DIR)) {
//   fs.mkdirSync(FILES_DIR, { recursive: true });
// }

// export const actions: Actions = {
//   editStaff: async ({ request, cookies, locals }) => {
//     const form = await superValidate(request, zod4(schema));

//     if (!form.valid) {
//       // Stay on the same page and set a flash message
//       setFlash({ type: 'error', message: "Please check your form data." }, cookies);
//       return fail(400, { form });
//     }

//         const { staffId, firstName, lastName, position, phone, email, salary, hiredAt, govId, contract } = form.data;

//     try{

//        const files = await db.select({govtId: staff.govtId, contract: staff.contract}).from(staff).where(eq(staff.id, staffId)).then(rows => rows[0]);
//        let newGovId: string | null;
//        let newContract: string | null;
//            if(govId && govId.size > 0){

//              const imageName = `${generateUserId()}${path.extname(govId.name)}`;

//                        const govPath: string = path.normalize(
//               path.join(FILES_DIR, imageName));

//                 const nodejs_wstream = fs.createWriteStream(govPath);
//                 const web_rstream = govId.stream();
//                 const nodejs_rstream = Readable.fromWeb(web_rstream);

//                 newGovId = imageName;
//                 await pipeline(nodejs_rstream, nodejs_wstream).catch(() => {

//                   return fail(500);
//                 });
//            }
//            else {
//              newGovId = files.govtId
//            }

//            if(contract && contract.size > 0){

//             const contractName = `${generateUserId()}${path.extname(contract.name)}`;

//            const contractPath: string = path.normalize(
//   path.join(FILES_DIR, contractName));

//     const nodejs_wstreamContract = fs.createWriteStream(contractPath);
//     const web_rstreamContract = contract.stream();
//     const nodejs_rstreamContract = Readable.fromWeb(web_rstreamContract);

//      newContract = contractName;
//     await pipeline(nodejs_rstreamContract, nodejs_wstreamContract).catch(() => {
//       return fail(500);
//     });
//            }
//            else {
//              newContract = files.contract
//            }

//        await db.update(staff).set({
//         firstName, lastName,
//         type: position,
//         phone, email,
//         hireDate: new Date(hiredAt),
//         govtId: newGovId,
//         contract: newContract,
//         updatedBy: locals?.user?.id
//     }).where(eq(staff.id, staffId));

//     await db.update(salaries).set({
//            amount: salary,
//            staffId,
//            updatedBy: locals.user?.id,
//        })
//  delete form.data.govId;
//    delete form.data.contract;

//       // Stay on the same page and set a flash message
//       setFlash({ type: 'success', message: "Service Updated Successuflly" }, cookies);
//     return {
//       form
//     } } catch(err){
//          console.error("Error" + err)
//     }
//   },
//     delete: async({cookies, params })=> {

//         const {id} = params;

//         try {
//         if (!id) {
//         setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
//           return fail(400);
//         }

//         await db.delete(staff).where(eq(staff.id, id));

//           setFlash({ type: 'success', message: "Staff Member Deleted Successfully!" }, cookies);

//       } catch (err) {
//         console.error('Error deleting staff member:', err);
//         setFlash({ type: 'error', message: `Unexpected Error: ${err?.message}` }, cookies);
//         return fail(400)
//       }

//       },
// };
