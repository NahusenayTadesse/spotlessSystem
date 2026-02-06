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

export const actions: Actions = {
	add: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(add));
		console.log(form);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const {
			idNo,
			name,
			fatherName,
			grandFatherName,
			email,
			birthDate,
			tinNo,
			phone,
			departmentId,
			salary,
			hireDate,
			govtId,
			photo,
			employmentStatus,
			newEmployeeVerified
		} = form.data;

		try {
			// Trim the strings to remove leading/trailing whitespace
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
					setError(form, 'fatherName', 'Employee with this Name already exists');
					setError(form, 'grandFatherName', 'Employee with this Name already exists');
					return message(form, {
						type: 'error',
						text: 'Employee with this name already exists',
						existingId: existingEmployee[0].id
					});
				}
			}
			const photoName = await saveUploadedFile(photo);

			const govId = await saveUploadedFile(govtId);

			const [staffMember] = await db
				.insert(employee)
				.values({
					idNo,
					name,
					fatherName,
					grandFatherName,
					email,
					phone,
					tinNo,
					birthDate,
					departmentId,
					photo: photoName,
					govtId: govId,
					employmentStatus,
					hireDate,
					createdBy: locals.user?.id
				})
				.$returningId();

			await db.insert(salaries).values({
				amount: salary,
				staffId: staffMember.id,
				createdBy: locals.user?.id
			});

			delete form.data.govtId;
			delete form.data.photo;
			return message(form, { type: 'success', text: 'Staff Successfully Added' });
		} catch (err) {
			console.error(err?.message);
			return message(form, { type: 'error', text: `Error: ${err?.message}` });
		}
	}
};
