import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableLinks from '$lib/components/Table/data-table-links.svelte';
import DataTableActions from './data-table-actions.svelte';
import DataTableSort from '$lib/components/Table/data-table-sort.svelte';
import { Row } from '$lib/components/ui/table';

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
				link: '/dashboard/supplies'
			});
		}
	},

	{
		accessorKey: 'quantity',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Quantity',
				onclick: column.getToggleSortingHandler()
			}),

		sortable: true,
		cell: (info) => info.getValue() // always “day”
	},

	{
		accessorKey: 'price',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Price',
				onclick: column.getToggleSortingHandler()
			}),

		sortable: true,
		cell: (info) => `${info.getValue()} ETB` // always “day”
	},

	{
		accessorKey: 'unitOfMeasure',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Unit of Measurement',
				onclick: column.getToggleSortingHandler()
			}),

		sortable: true,
		cell: (info) => info.getValue() // always “day”
	},

	{
		accessorKey: 'description',
		header: 'Description'
	},

	{
		accessorKey: 'supplier',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Supplier',
				onclick: column.getToggleSortingHandler()
			})
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
