import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableSort from '$lib/components/Table/data-table-sort.svelte';
import Statuses from '$lib/components/Table/statuses.svelte';
import Address from '$lib/components/Table/address.svelte';
import Copy from '$lib/Copy.svelte';

import Edit from './edit.svelte';
import DataTableLinks from '$lib/components/Table/data-table-links.svelte';
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
				link: `/dashboard/supplies/suppliers`
			});
		}
	},

	{
		accessorKey: 'phone',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Phone',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: ({ row }) => {
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(Copy, {
				data: row.original.phone
			});
		}
	},
	{
		accessorKey: 'email',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Email',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: ({ row }) => {
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(Copy, {
				data: row.original.email
			});
		}
	},
	{
		accessorKey: 'description',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Description',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		cell: ({ row }) => {
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(Copy, {
				data: row.original.description
			});
		}
	},

	{
		accessorKey: '',
		header: 'Address',
		sortable: true,
		cell: ({ row }) => {
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(Address, {
				street: row.original.street,
				buildingNumber: row.original.buildingNumber,
				floor: row.original.floor,
				subcity: row.original.subcity,
				kebele: row.original.kebele,
				houseNumber: row.original.houseNumber
			});
		}
	},

	{
		accessorKey: 'status',
		header: 'Status',
		sortable: true,
		cell: ({ row }) => {
			return renderComponent(Statuses, {
				status: row.original.status ? 'Active' : 'Inactive'
			});
		}
	}
];
