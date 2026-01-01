import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableLinks from '$lib/components/Table/data-table-links.svelte';
import DataTableActions from './data-table-actions.svelte';
import DataTableSort from '$lib/components/Table/data-table-sort.svelte';
import { minutesToHoursString } from '$lib/global.svelte';

export const columns = [
	{
		accessorKey: 'index',
		header: '#',
		cell: (info) => info.row.index + 1,
		sortable: false
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
				link: '/dashboard/services'
			});
		}
	},

	{
		accessorKey: 'price',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Price',

				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,

		cell: (info) => info.getValue() + ' ETB'
	},

	{
		accessorKey: 'category',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Category',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true
	},

	{
		accessorKey: 'description',
		header: 'Description'
	},

	{
		accessorKey: 'commission',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Commission',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => `${info.getValue()} ETB`
	},

	{
		accessorKey: 'duration',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Service Duration',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => minutesToHoursString(info.getValue())
	},

	{
		accessorKey: 'saleCount',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Sales',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: (info) => {
			const n = info.getValue(); // number of days
			return `${n === null ? '' : n} ${n === null ? 'Nothing Sold Yet' : 'Sold'}`;
		}
	},

	{
		accessorKey: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(DataTableActions, { id: row.original.id, name: row.original.name });
		}
	}
];
