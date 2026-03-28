import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableLinks from '$lib/components/Table/data-table-links.svelte';
import Copy from '$lib/Copy.svelte';
import DataTableActions from './data-table-actions.svelte';
import DataTableSort from '$lib/components/Table/data-table-sort.svelte';
import { formatETB } from '$lib/global.svelte';

export const columns = [
	{
		id: 'index',
		header: '#',
		cell: (info) => {
			const rowIndex = info.table.getRowModel().rows.findIndex((row) => row.id === info.row.id);
			return rowIndex + 1;
		},
		enableSorting: false
	},

	{
		accessorKey: 'month',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Month',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true
	},

	{
		accessorKey: 'year',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Year',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true
	},

	{
		accessorKey: 'totalSalaries',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Total Salaries',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => formatETB(info.getValue(), true)
	},
	{
		accessorKey: 'totalOvertime',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Total Overtime',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => formatETB(info.getValue(), true)
	},

	{
		accessorKey: 'totalTransport',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Total Transport',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => formatETB(info.getValue(), true)
	},

	{
		accessorKey: 'totalHousing',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Total Housing',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => formatETB(info.getValue(), true)
	},
	{
		accessorKey: 'totalPosition',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Total Position',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => formatETB(info.getValue(), true)
	},
	{
		accessorKey: 'totalNet',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Total Net',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => formatETB(info.getValue(), true)
	},
	{
		accessorKey: 'totalDeductions',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Total Deductions',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => formatETB(info.getValue(), true)
	},
	{
		accessorKey: 'totalPenalities',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Total Penalities',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => formatETB(info.getValue(), true)
	},
	{
		accessorKey: 'totalTax',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Total Tax',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => formatETB(info.getValue(), true)
	},
	{
		accessorKey: 'totalGross',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Total Gross',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => formatETB(info.getValue(), true)
	},
	{
		accessorKey: 'penEm',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Pen(EM)',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => formatETB(info.getValue(), true)
	},

	{
		accessorKey: 'penOrg',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Pen(ORG',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => formatETB(info.getValue(), true)
	}
];
