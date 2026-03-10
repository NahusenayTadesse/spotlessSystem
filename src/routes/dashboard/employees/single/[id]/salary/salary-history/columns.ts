import { renderComponent } from '$lib/components/ui/data-table/index.js';
// Assuming a new actions component
import DataTableSort from '$lib/components/Table/data-table-sort.svelte';
import { formatETB, formatEthiopianDate } from '$lib/global.svelte';
// NOTE: You must ensure your backend query includes 'name' and 'position'
// from the staff table to display them here!
// e.g., staffName: staff.name, staffPosition: staff.category

export const columns = [
	// 1. Row Index
	{
		accessorKey: 'index',
		header: '#',
		cell: (info) => {
			const rowIndex = info.table.getRowModel().rows.findIndex((row) => row.id === info.row.id);
			return rowIndex + 1;
		}
	},
	// --- Payroll Specific Fields ---
	{
		accessorKey: 'amount',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Salary',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => {
			return formatETB(info.getValue(), true);
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
		cell: (info) => {
			return formatETB(info.getValue(), true);
		}
	},
	{
		accessorKey: 'transportationAllowance',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Transportation Allowance',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => {
			return formatETB(info.getValue(), true);
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
		cell: (info) => {
			return formatETB(info.getValue(), true);
		}
	},

	{
		accessorKey: 'nonTaxAllowance',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Non Tax Allowance',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => {
			return formatETB(info.getValue(), true);
		}
	},
	{
		accessorKey: 'startDate',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Start Date',
				onclick: column.getToggleSortingHandler()
			}),
		// Show 'N/A' if the payroll entry is null
		cell: (info) => formatEthiopianDate(info.getValue()) || 'Salary Not Entered',
		sortable: false // Usually not sortable
	},

	{
		accessorKey: 'endDate',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'End Date',
				onclick: column.getToggleSortingHandler()
			}),
		// Show 'N/A' if the payroll entry is null
		cell: (info) => formatEthiopianDate(info.getValue()) || 'Current Salary',
		sortable: false // Usually not sortable
	}
];
