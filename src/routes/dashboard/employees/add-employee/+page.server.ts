import { superValidate, message, setError } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

import { add } from './schema';
import { db } from '$lib/server/db';
import { salaries, employee } from '$lib/server/db/schema/';
import type { Actions } from './$types';
import { departments, empStatus, eduLevel } from '$lib/server/fastData';
import type { PageServerLoad } from './$types.js';
import { and, eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(add));

	const departmentList = await departments();
	const empStatusList = await empStatus();
	const eduLevelList = await eduLevel();

	return {
		form,

		departmentList,
		empStatusList,
		eduLevelList
	};
};

import { saveUploadedFile } from '$lib/server/upload';
import { formatEthiopianYear } from '$lib/global.svelte';

export const actions: Actions = {
	add: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(add));

		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const {
			name,
			fatherName,
			grandFatherName,
			email,
			birthDate,
			tinNo,
			gender,
			nationality,
			religion,
			phone,
			bloodType,
			departmentId,
			educationalLevel,
			salary,
			hireDate,
			govtId,
			photo,
			martialStatus,
			employmentStatus,
			newEmployeeVerified
		} = form.data;

		try {
			// 1. Duplicate Check
			if (!newEmployeeVerified) {
				const sanitizedName = name?.replace(/\s+/g, ' ').trim();
				const sanitizedFatherName = fatherName?.replace(/\s+/g, ' ').trim();
				const sanitizedGrandFatherName = grandFatherName?.replace(/\s+/g, ' ').trim();

				const existingEmployee = await db
					.select({ id: employee.id })
					.from(employee)
					.where(
						and(
							eq(employee.name, sanitizedName),
							eq(employee.fatherName, sanitizedFatherName),
							eq(employee.grandFatherName, sanitizedGrandFatherName)
						)
					)
					.limit(1);

				if (existingEmployee.length > 0) {
					setError(form, 'name', 'Employee with this Name already exists');
					return message(form, {
						type: 'error',
						text: 'Employee with this name already exists',
						existingId: existingEmployee[0].id
					});
				}
			}

			// 2. Upload Files

			// 3. Database Transaction
			const finalIdNo = await db.transaction(async (tx) => {
				const photoName = await saveUploadedFile(photo);
				const govIdFile = await saveUploadedFile(govtId);
				// Insert main employee record
				const [staffMember] = await tx
					.insert(employee)
					.values({
						name,
						fatherName,
						grandFatherName,
						tinNo,
						gender,
						nationality,
						religion,
						birthDate: new Date(birthDate).toLocaleDateString('en-CA'),
						departmentId,
						photo: photoName,
						govtId: govIdFile,
						employmentStatus,
						martialStatus,
						educationalLevel,
						bloodType,
						hireDate: new Date(hireDate).toLocaleDateString('en-CA'),
						createdBy: locals.user?.id,
						leavesLeft: 15,
						isActive: true
					})
					.$returningId();

				// Generate idNo: SP + ID + Last 2 digits of hire year
				const yearSuffix = formatEthiopianYear(new Date(hireDate)).slice(-2);
				const generatedIdNo = `SP${staffMember.id}${yearSuffix}`;

				// Update the employee with the new idNo
				await tx
					.update(employee)
					.set({ idNo: generatedIdNo })
					.where(eq(employee.id, staffMember.id));

				// Insert salary
				await tx.insert(salaries).values({
					amount: salary,
					staffId: staffMember.id,
					createdBy: locals.user?.id
				});

				delete form.data.govtId;
				delete form.data.photo;
			});

			// Clean up form data for response

			return message(form, {
				type: 'success',
				text: `Staff Successfully Added with ID: ${finalIdNo}`
			});
		} catch (err) {
			console.error(err?.message);
			return message(
				form,
				{ type: 'error', text: `Error: ${err?.message}` },
				{
					status: 500
				}
			);
		}
	}
};
