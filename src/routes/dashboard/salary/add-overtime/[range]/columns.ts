import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableLinks from '$lib/components/Table/data-table-links.svelte';
import Stasuses from '$lib/components/Table/statuses.svelte';
import DataTableSort from '$lib/components/Table/data-table-sort.svelte';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
const form = await superValidate(zod4(edit));
const deleteform = await superValidate(zod4(deleteOvertime));
const addform = await superValidate(zod4(add));

// import { minutesToHoursString } from '$lib/global.svelte';
// import Copy from '$lib/Copy.svelte';
import { edit, add, deleteOvertime } from './schema';
import Edit from './edit.svelte';
import Overtime from './overtime.svelte';

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
		accessorKey: 'name',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Name',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: ({ row }) => {
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(DataTableLinks, {
				id: row.original.id,
				name: row.original.name,
				link: '/dashboard/employees/single'
			});
		}
	},

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
		accessorKey: 'position',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Position',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true
	},
	{
		accessorKey: 'site',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Sites',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true
	},
	// {
	// 	accessorKey: 'overtime',
	// 	header: ({ column }) =>
	// 		renderComponent(DataTableSort, {
	// 			name: 'Overtime',
	// 			onclick: column.getToggleSortingHandler()
	// 		}),
	// 	sortable: true
	// },

	{
		accessorKey: 'overtimeDetails',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Overtime Details',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: ({ row }) => {
			return renderComponent(Overtime, {
				staffId: row.original.id,
				addForm: addform,
				data: deleteform,
				editForm: form,
				overtimeTypes: row.original.overtimeTypes,
				name: row.original.name,
				department: row.original.department,
				site: row.original.site,
				position: row.original.position,
				overtimeDetails: row.original.overtimeDetails,
				totalOvertimePay: row.original.totalOvertimePay
			});
		}
	},

	{
		accessorKey: 'absent',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Missing Days',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: ({ row }) => {
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(Edit, {
				data: form,
				id: row.original.id,
				name: row.original.name,
				count: row.original.absent
			});
		}
	},

	{
		accessorKey: 'deductable',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Deductable',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: ({ row }) => {
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(Edit, {
				data: form,
				id: row.original.id,
				name: row.original.name,
				count: row.original.deductable,
				days: row.original.deductableDays
			});
		}
	},

	{
		accessorKey: 'nonDeductable',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Non Deductable',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: ({ row }) => {
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(Edit, {
				data: form,
				id: row.original.id,
				name: row.original.name,
				count: row.original.nonDeductable,
				days: row.original.nonDeductableDays
			});
		}
	},

	{
		accessorKey: 'nonDeductable',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Missing Days',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: ({ row }) => {
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(Edit, {
				data: form,
				id: row.original.id,
				name: row.original.name,
				count: row.original.nonDeductable
			});
		}
	},

	// {
	// 	accessorKey: 'phone',
	// 	header: 'Phone',
	// 	sortable: true,
	// 	cell: ({ row }) => renderComponent(Copy, { data: row.original.phone })
	// },

	// { accessorKey: 'email', header: 'Email' },

	{
		accessorKey: 'status',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Status',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true
	}
];
