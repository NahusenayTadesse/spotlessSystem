import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableLinks from '$lib/components/Table/data-table-links.svelte';
import DataTableActions from './data-table-actions.svelte'; // Assuming a new actions component
import DataTableSort from '$lib/components/Table/data-table-sort.svelte';
import Statuses from '$lib/components/Table/statuses.svelte';
import { formatEthiopianDate, formatETB } from '$lib/global.svelte';

// NOTE: You must ensure your backend query includes 'name' and 'position'
// from the staff table to display them here!
// e.g., staffName: staff.name, staffPosition: staff.category

export const columns = [
	// 1. Row Index
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
				name: 'Staff Name',
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

	// --- Payroll Specific Fields ---

	// 4. Pay Period
	// {
	// 	accessorKey: 'payPeriod',
	// 	header: 'Pay Period',
	// 	// Show 'N/A' if the payroll entry is null
	// 	cell: (info) => info.getValue() || '— N/A —',
	// 	sortable: false // Usually not sortable
	// },

	// 5. Basic Salary
	{
		accessorKey: 'totalPay',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Salary',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: ({ row }) => {
			return formatETB(row.original.totalPay);
		}
	},

	// 6. Deductions
	{
		id: 'tax',
		accessorKey: '',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Tax',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: ({ row }) => {
			return ((Number(row.original.basicSalary) * Number(row.original.taxType)) / 100).toFixed(2);
		}
	},

	{
		accessorKey: 'missingDays',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Missing Days',
				onclick: column.getToggleSortingHandler()
			})
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
			const missingDays = Number(row.original.missingDays);
			const totalPay = Number(row.original.totalPay);

			const amount = missingDays * (totalPay / 30);

			return amount.toFixed(2);
		}
	},

	{
		accessorKey: '',
		header: 'Payable Amount',
		cell: ({ row }) => {
			const missingDays = Number(row.original.missingDays);
			const totalPay = Number(row.original.totalPay);
			const taxType = Number(row.original.taxType / 100);

			const penalityAmount = missingDays * (totalPay / 30);
			const tax = totalPay * taxType;
			const total = totalPay - (penalityAmount + tax);

			return total.toFixed(2);
		}
	},

	// 7. Net Amount
	// {
	// 	accessorKey: 'netAmount',
	// 	header: ({ column }) =>
	// 		renderComponent(DataTableSort, {
	// 			name: 'Net Pay',
	// 			onclick: column.getToggleSortingHandler()
	// 		}),
	// 	sortable: true,
	// 	cell: (info) => {
	// 		const amount = info.getValue();
	// 		return amount ? 'ETB ' + amount : 'UNPROCESSED';
	// 	}
	// },

	// 8. Payment Status

	{
		accessorKey: 'account',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Bank Account',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => info.getValue() || 'No Account Found' // Default to UNPROCESSED if payroll entry is missing
	},

	{
		accessorKey: 'bank',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Bank',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => info.getValue() || 'UNPROCESSED' // Default to UNPROCESSED if payroll entry is missing
	},

	// 9. Payment Date
	{
		accessorKey: 'paymentDate',
		header: 'Payment Date',
		cell: (info) => formatEthiopianDate(info.getValue()) || formatEthiopianDate(new Date()),
		sortable: true
	},
	{
		accessorKey: 'status',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Status',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,

		cell: (info) => {
			const status = info.getValue() ? info.getValue() : 'unpaid';
			return renderComponent(Statuses, {
				status: status
			});
		}
	},
	{
		accessorKey: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			// Check if a payroll entry exists (by checking 'id')

			return renderComponent(DataTableActions, {
				id: row.original.id,
				name: row.original.name
				// You might need more props here
			});
		}
	}
];
