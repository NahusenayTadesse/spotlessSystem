import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { editStaff as schema } from '$lib/zodschemas/appointmentSchema';

import { db } from '$lib/server/db';
import {
	employmentStatuses,
	employee,
	user,
	department,
	educationalLevel
} from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params }) => {
	const { id } = params;

	const form = await superValidate(zod4(schema));

	const staffMember = await db
		.select({
			id: employee.id,
			idNo: employee.idNo,
			firstName: employee.name,
			fatherName: employee.fatherName,
			grandFatherName: employee.grandFatherName,
			gender: employee.gender,
			nationality: employee.nationality,
			religion: employee.religion,
			bloodType: employee.bloodType,
			tinNo: employee.tinNo,
			department: department.name,
			departmentId: department.id,
			status: employmentStatuses.name,
			statusId: employmentStatuses.id,

			birthDate: employee.birthDate,
			age: sql<number>`TIMESTAMPDIFF(YEAR, ${employee.birthDate}, CURDATE())`,
			educationalLevel: educationalLevel.name,
			educationalLevelId: educationalLevel.id,
			maritalStatus: employee.martialStatus,
			hireDate: sql<string>`DATE_FORMAT(${employee.hireDate}, '%Y-%m-%d')`,
			photo: employee.photo,
			govId: employee.govtId,
			isActive: employee.isActive,
			addedBy: user.name,
			updatedBy: user.name,
			terminationDate: employee.terminationDate,
			years: sql<number>`TIMESTAMPDIFF(YEAR, ${employee.hireDate}, CURDATE())`
		})
		.from(employee)
		.leftJoin(department, eq(employee.departmentId, department.id))
		.leftJoin(employmentStatuses, eq(employee.employmentStatus, employmentStatuses.id))
		.leftJoin(educationalLevel, eq(employee.educationalLevel, educationalLevel.id))
		.leftJoin(user, eq(employee.createdBy, user.id))
		.where(eq(employee.id, Number(id)))
		.then((rows) => rows[0]);

	if (!staffMember) {
		throw error(404, 'Staff member not found');
	}

	const today = new Date().toISOString().split('T')[0];

	return {
		staffMember,
		form
	};
};
