<script>
	import { renderComponent } from '$lib/components/ui/data-table/index.js';
	import DataTable from '$lib/components/Table/data-table.svelte';
	import Copy from '$lib/Copy.svelte';
	import DataTableSort from '$lib/components/Table/data-table-sort.svelte';
	import Statuses from '$lib/components/Table/statuses.svelte';
	import Edit from './editFamily.svelte';
	import DataTableLinks from '$lib/components/Table/data-table-links.svelte';

	let { data, form } = $props();
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
				return renderComponent(Edit, {
					id: row.original?.id,
					name: row.original?.name,
					phone: row.original?.phone,
					email: row.original?.email,
					gender: data[row.index]?.gender,
					emergencyContact: row.original?.emergencyContact,
					relationShip: row.original?.relationShip,
					otherRelationShip: row.original?.relationShip,
					data: form,
					icon: false,
					status: row.original?.status
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
			accessorKey: 'gender',
			header: ({ column }) =>
				renderComponent(DataTableSort, {
					name: 'Gender',
					onclick: column.getToggleSortingHandler()
				})
		},

		{
			accessorKey: 'relationShip',
			header: ({ column }) =>
				renderComponent(DataTableSort, {
					name: 'RelationShip',
					onclick: column.getToggleSortingHandler()
				}),
			cell: ({ row }) => {
				return row.original.relationShip === 'other'
					? row.original.otherRelationShip
					: row.original.relationShip;
			}
		},

		{
			accessorKey: 'emergencyContact',
			header: ({ column }) =>
				renderComponent(DataTableSort, {
					name: 'Emergency Contact',
					onclick: column.getToggleSortingHandler()
				}),
			sortable: true,
			cell: ({ row }) => {
				return renderComponent(Statuses, {
					status: row.original.emergencyContact ? 'Yes' : 'No'
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
		},
		{
			accessorKey: 'addedBy',
			header: 'Added By',
			sortable: true,
			cell: ({ row }) => {
				return renderComponent(DataTableLinks, {
					id: row.original.addedById,
					name: row.original.addedBy,
					link: '/dashboard/admin-panel/users',

					target: '_blank'
				});
			}
		},

		{
			accessorKey: '',
			header: 'Edit',
			sortable: true,
			cell: ({ row }) => {
				// You can pass whatever you need from `row.original` to the component
				return renderComponent(Edit, {
					id: row.original?.id,
					name: row.original?.name,
					phone: row.original?.phone,
					email: row.original?.email,
					gender: data[row.index]?.gender,
					emergencyContact: row.original?.emergencyContact,
					relationShip: row.original?.relationShip,
					otherRelationShip: row.original?.relationShip,
					data: form,
					icon: true,
					status: row.original?.status
				});
			}
		}
	];
</script>

{#key data}
	<DataTable {columns} {data} search={true} fileName="Family" />
{/key}
