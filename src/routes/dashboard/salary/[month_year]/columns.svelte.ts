import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableLinks from '$lib/components/Table/data-table-links.svelte';
import DataTableSort from '$lib/components/Table/data-table-sort.svelte';
import { formatETB, formatEthiopianDate } from '$lib/global.svelte';
import { getTaxTypes } from './data.remote';

interface TaxBracket {
	value: number | null;
	name: string | null;
	rate: number | null | string;
	threshold: number | string | null; // or string, depending on your DB driver
	deduction: number | null | string;
}

const calculateTax = (amount: number, taxTypes: TaxBracket[]): number => {
	// 1. Sort brackets by threshold ascending to ensure we hit the lowest valid bracket first
	const sortedBrackets = [...taxTypes].sort((a, b) => Number(a.threshold) - Number(b.threshold));

	// 2. Find the first bracket where amount <= threshold
	const bracket = sortedBrackets.find((b) => amount <= Number(b.threshold));

	if (!bracket) {
		return 0;
	}

	return Number(bracket.rate) * amount - Number(bracket.deduction);
};

// async function tax(row) {
// 	const types = await getTaxTypes();
// 	const taxableIncome = Number(Number(row.origional.gross) - Number(row.original.nonTaxable));
// 	const tax = calculateTax(taxableIncome, types);

// 	return formatETB(tax, true);
// }
//
//
let types: TaxBracket[] = [];
export const initColumns = async () => {
	types = await getTaxTypes();
};
export const columns = [
	// 1. Row Index
	//

	{
		id: 'index',
		header: '#',
		cell: (info) => {
			const rowIndex = info.table.getRowModel().rows.findIndex((row) => row.id === info.row.id);
			return rowIndex + 1;
		},
		enableSorting: false
	},
	// 2. Staff Name (Assumes staffName is included in the SELECT)

	{
		accessorKey: 'name',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Employee Name',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		// Using DataTableLinks to view staff profile
		cell: ({ row }) => {
			// Use staffId for the link, but ensure staffName is selected in the query
			return renderComponent(DataTableLinks, {
				id: row.original.id,
				name: row.original.name || 'N/A', // Fallback for safety
				link: '/dashboard/salary/single'
			});
		}
	},

	// 3. Position (Assumes staffPosition is included in the SELECT)
	{
		accessorKey: 'department',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Department',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true
	},

	{
		accessorKey: 'basicSalary',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Basic Salary',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: ({ row }) => {
			return formatETB(row.original.basicSalary);
		}
	},

	{
		accessorKey: 'overtime',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Over Time',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: ({ row }) => {
			return formatETB(row.original.overtime);
		}
	},

	{
		accessorKey: 'transport',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Transport Allowance',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: ({ row }) => {
			return formatETB(row.original.transportAllowance, true);
		}
	},

	{
		accessorKey: 'positionAllowance',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Position Allowance',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: ({ row }) => {
			return formatETB(row.original.positionAllowance, true);
		}
	},

	{
		accessorKey: 'housingAllowance',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Housing Allowance',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: ({ row }) => {
			return formatETB(row.original.housingAllowance, true);
		}
	},

	{
		accessorKey: 'nonTaxable',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Non-Taxable',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: ({ row }) => {
			return formatETB(row.original.nonTaxable, true);
		}
	},

	{
		accessorKey: 'gross',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Gross Salary',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: ({ row }) => {
			return formatETB(row.original.gross, true);
		}
	},

	{
		id: 'penality',
		accessorKey: '',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Attendance Penality',
				onclick: column.getToggleSortingHandler()
			}),
		cell: ({ row }) => {
			// const missingDays = Number(row.original.absentDays);
			// const totalPay = Number(row.original.basicSalary);

			// const amount = missingDays * (totalPay / 30);

			return formatETB(row.original.attendancePenality, true);
		}
	},

	// {
	// 	id: 'tax',
	// 	accessorKey: '',
	// 	header: ({ column }) =>
	// 		renderComponent(DataTableSort, {
	// 			name: 'Tax',
	// 			onclick: column.getToggleSortingHandler()
	// 		}),
	// 	cell: ({ row }) => {
	// 		const taxableIncome = Number(Number(row.original.gross) - Number(row.original.nonTaxable));
	// 		const tax = calculateTax(taxableIncome, types);

	// 		return formatETB(tax, true);
	// 	}
	// },

	{
		id: 'taxAmount',
		accessorKey: '',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Tax',
				onclick: column.getToggleSortingHandler()
			}),
		cell: ({ row }) => {
			return formatETB(row.original.taxAmount, true);
		}
	},

	{
		accessorKey: '',
		header: 'Net Pay',
		cell: ({ row }) => {
			// const missingDays = Number(row.original.absentDays);
			// const salary = Number(row.original.basicSalary);

			// const amount = missingDays * (salary / 30);

			// const totalPay = Number(row.original.gross);

			// const taxableIncome = Number(Number(row.original.gross) - Number(row.original.nonTaxable));
			// const tax = calculateTax(taxableIncome, types);

			// const penalityAmount = missingDays * (totalPay / 30);
			// const total = totalPay - (penalityAmount + Number(tax));

			return formatETB(row.original.netPay, true);
		}
	},

	{
		accessorKey: 'bank',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Bank',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => info.getValue() || 'Account Not Found' // Default to UNPROCESSED if payroll entry is missing
	}
];

export const reciepts = [
	// 1. Row Index
	//

	{
		id: 'index',
		header: '#',
		cell: (info) => {
			const rowIndex = info.table.getRowModel().rows.findIndex((row) => row.id === info.row.id);
			return rowIndex + 1;
		},
		enableSorting: false
	},
	// 2. Staff Name (Assumes staffName is included in the SELECT)
	{
		accessorKey: 'numberOfEmployees',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'No of Employees',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => info.getValue() + ' Employees'
	},
	{
		accessorKey: 'amount',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Amount',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => formatETB(info.getValue(), true)
	},
	{
		accessorKey: 'paidDate',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Amount',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => formatEthiopianDate(info.getValue())
	},
	{
		accessorKey: 'payPeriodStart',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Start Date',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => formatEthiopianDate(info.getValue())
	},
	{
		accessorKey: 'payPeriodEnd',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'End Date',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => formatEthiopianDate(info.getValue())
	},
	{
		accessorKey: 'recieptLink',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Bank Statement',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		// Using DataTableLinks to view staff profile
		cell: ({ row }) => {
			// Use staffId for the link, but ensure staffName is selected in the query
			return renderComponent(DataTableLinks, {
				id: row.original.recieptLink,
				name: 'View Bank Statement', // Fallback for safety
				link: '/dashboard/files',
				target: '_blank'
			});
		}
	},
	{
		accessorKey: 'uploadedBy',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Paying Officer',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		// Using DataTableLinks to view staff profile
		cell: ({ row }) => {
			// Use staffId for the link, but ensure staffName is selected in the query
			return renderComponent(DataTableLinks, {
				id: row.original.uploadedById,
				name: row.original.uploadedBy, // Fallback for safety
				link: '/dashboard/admin-panel/user',
				target: '_blank'
			});
		}
	}
];
