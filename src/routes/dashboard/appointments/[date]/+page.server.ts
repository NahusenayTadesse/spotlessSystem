

import { db } from "$lib/server/db";
import { appointments, appointmentStatuses, customers, transactionBookingFee, transactions, user  } from "$lib/server/db/schema";
import { eq, asc, and, sql } from "drizzle-orm";
import type { PageServerLoad } from "./$types";



export const load: PageServerLoad = async ({ params, locals }) => {


     const { date} = params;

        const appointmentsList = await db.select(
           {
            extraSettings: appointments.id,
            customerName: sql<string>`TRIM(CONCAT(${customers.firstName}, ' ', COALESCE(${customers.lastName}, '')))`,
            phone: customers.phone,
            status: appointmentStatuses.name,
            bookedById: user.id,
            bookedBy: user.name, 
            date: sql<string>`DATE_FORMAT(${appointments.appointmentDate}, '%Y-%m-%d')`,
            time: sql<string>`DATE_FORMAT(${appointments.appointmentTime}, '%H:%i')`,
            notes: appointments.notes,
            bookedAt: sql<string>`DATE_FORMAT(${appointments.createdAt}, '%Y-%m-%d')`,
            paidAmount: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`
        }
        ).from(appointments)
        .leftJoin(customers, eq(appointments.customerId, customers.id))
        .leftJoin(user, eq(appointments.createdBy, user.id))
        .leftJoin(transactionBookingFee, eq(appointments.id, transactionBookingFee.appointmentId))
        .leftJoin(transactions, eq(transactionBookingFee.transactionId, transactions.id))
        .leftJoin(appointmentStatuses, eq(appointments.statusId, appointmentStatuses.id))
        .where(
            and(
                eq(appointments.branchId, locals?.user?.branch),
                eq(appointments.appointmentDate, date)
            )
        )
        .groupBy(
    appointments.id,
    customers.firstName,
    customers.lastName,
    customers.phone,
    appointmentStatuses.name,
    user.name,
    appointments.appointmentDate,
    appointments.appointmentTime,
    appointments.notes,
    appointments.createdAt
)
        .orderBy(asc(appointments.appointmentTime));


        return {
            appointmentsList
        }
}