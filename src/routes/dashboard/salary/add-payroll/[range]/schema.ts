import { z } from 'zod/v4';

export const payrollSchema = z.object({
	month: z.string('Month is required'),
	start: z.string(),
	end: z.string(),

	employees: z.array(
		z.object({
			id: z.union([z.string(), z.number()]),
			name: z.string(),
			department: z.string(),
			basicSalary: z.coerce.number(),
			positionAllowance: z.coerce.number().default(0),
			housingAllowance: z.coerce.number().default(0),
			transportAllowance: z.coerce.number().default(0),
			nonTaxable: z.coerce.number().default(0),
			account: z.string().nullable(),
			bank: z.string().nullable(),
			employmentStatus: z.string().nullable(),
			overtime: z.coerce.number().default(0),
			bonus: z.coerce.number().default(0),
			absent: z.coerce.number().default(0),
			attendancePenality: z.coerce.number().default(0),
			commission: z.coerce.number().default(0),
			deductions: z.coerce.number().default(0),
			gross: z.coerce.number().default(0),
			taxable: z.coerce.number().default(0),
			taxAmount: z.coerce.number().default(0),
			netPay: z.coerce.number().default(0)
		})
	)
});

export type EmployeeFormType = z.infer<typeof payrollSchema>['employees'][number];
