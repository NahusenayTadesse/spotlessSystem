import { db } from '$lib/server/db';
import { leave, employee, department, site, user } from '$lib/server/db/schema';

import { eq, desc, sql, inArray } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { fail, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { approveLeave, editLeave } from './schema';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(approveLeave));
	const leaves = await db
		.select({
			id: leave.id,
			staffId: leave.staffId,
			name: sql<string>`TRIM(CONCAT(COALESCE(${employee.name}, ''), ' ', COALESCE(${employee.fatherName}, '')))`,
			department: department.name,
			siteName: site.name,
			requestDate: leave.requestDate,
			startDate: leave.startDate,
			endDate: leave.endDate,
			reason: leave.reason,
			leaveLetter: leave.leaveLetter,
			rejectionReason: leave.rejectionReason,
			approvedBy: user.name,
			approvedById: user.id,
			status: leave.status,
			numberOfDays: sql<number>`DATEDIFF(${leave.endDate}, ${leave.startDate}) + 1`
		})
		.from(leave)
		.leftJoin(employee, eq(leave.staffId, employee.id))
		.leftJoin(department, eq(employee.departmentId, department.id))
		.leftJoin(site, eq(employee.siteId, site.id))
		.leftJoin(user, eq(leave.approvedBy, user.id))
		.where(eq(leave.status, 'rejected'));

	const salaryHistory = await Promise.all(
		leaves.map(async (leave) => {
			return {
				...leave,
				form: await superValidate(zod4(editLeave))
			};
		})
	);

	return {
		salaryHistory,
		form
	};
};

import { saveUploadedFile } from '$lib/server/upload';

export const actions: Actions = {
	approve: async ({ request, locals, params }) => {
		const form = await superValidate(request, zod4(approveLeave));

		console.log(form.data);

		if (!form.valid) {
			return message(form, { type: 'error', text: `Error: check the form` });
		}

		const { ids, status } = form.data;

		try {
			await db.transaction(async (tx) => {
				const employeeIds = await tx
					.select({ id: leave.staffId })
					.from(leave)
					.where(inArray(leave.id, ids));

				const selectedLeaves = await tx
					.select({
						id: leave.id,
						staffId: leave.staffId,
						startDate: leave.startDate,
						endDate: leave.endDate
					})
					.from(leave)
					.where(inArray(leave.id, ids));

				if (selectedLeaves.length === 0) return;

				if (status === 'approved') {
					await tx
						.update(leave)
						.set({
							status,
							approvedBy: locals?.user?.id
						})
						.where(inArray(leave.id, ids));
					const refundMap = new Map<number, number>();

					selectedLeaves.forEach((l) => {
						const start = new Date(l.startDate);
						const end = new Date(l.endDate);
						const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

						const currentTotal = refundMap.get(l.staffId) || 0;
						refundMap.set(l.staffId, currentTotal + days);
					});

					// 4. Update each employee's balance
					for (const [staffId, totalDays] of refundMap.entries()) {
						await tx
							.update(employee)
							.set({
								leavesLeft: sql`${employee.leavesLeft} - ${totalDays}`
							})
							.where(eq(employee.id, Number(staffId)));
					}
				} else {
					await tx
						.update(leave)
						.set({
							status,
							updatedBy: locals?.user?.id
						})
						.where(inArray(leave.id, ids));
				}
			});

			return message(form, {
				type: 'success',
				text: `Leave Status changed to ${status === 'pending' ? 'Pending' : 'Approved'} Successfully!`
			});
		} catch (err) {
			console.error(err?.message);
			return message(form, {
				type: 'error',
				text: `Updating Leave failed: ${err instanceof Error ? err.message : 'Unknown error'}`
			});
		}
	},
	editLeave: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(editLeave));

		if (!form.valid) {
			// Stay on the same page and set a flash message
			return message(form, { type: 'error', text: 'Please check your form.' });
		}
		const { id, requestDate, startDate, endDate, leaveLetter, reason, status, rejectionReason } =
			form.data;

		console.log(form.data);

		try {
			await db.transaction(async (tx) => {
				if (leaveLetter) {
					const leaveLetterFile = await saveUploadedFile(leaveLetter);
					await tx
						.update(leave)
						.set({
							leaveLetter: leaveLetterFile
						})
						.where(eq(leave.id, id));
				}

				if (rejectionReason) {
					await tx
						.update(leave)
						.set({
							rejectionReason
						})
						.where(eq(leave.id, id));
				}
				await tx
					.update(leave)
					.set({
						requestDate,
						startDate,
						endDate,
						reason,
						status
					})
					.where(eq(leave.id, id));

				if (status === 'approved') {
					const singleEmployee = await tx
						.select({ id: leave.staffId })
						.from(leave)
						.where(eq(leave.id, id))
						.then((result) => result[0]);

					const start = new Date(startDate);
					const end = new Date(endDate);

					const differenceInDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

					await tx
						.update(employee)
						.set({
							leavesLeft: sql`${employee.leavesLeft} - ${differenceInDays}`
						})
						.where(eq(employee.id, singleEmployee.id));
				}
			});

			return message(form, { type: 'success', text: 'Leave Updated successfully' });
			// Stay on the same page and set a flash message
			// setFlash({ type: 'success', message: 'Customer Successfully Added' }, cookies);
		} catch (err) {
			console.error('Error' + err?.message);

			return message(form, {
				type: 'error',
				text: `Unexpected Errror: ${err?.message}`
			});
		}
	}
};
