import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableSort from '$lib/components/Table/data-table-sort.svelte';
import Statuses from '$lib/components/Table/statuses.svelte';
import Copy from '$lib/Copy.svelte';
import DataTableLinks from '$lib/components/Table/data-table-links.svelte';
import { formatEthiopianDate } from '$lib/global.svelte';
import type { ColumnDef } from '@tanstack/table-core';
import { Checkbox } from '$lib/components/ui/checkbox/index.js';
import type { EditContract } from './schema';
import Edit from './editContract.svelte';

export const columns = [
	{
		id: 'select',
		accessorKey: 'id',
		header: ({ table }) =>
			renderComponent(Checkbox, {
				checked: table.getIsAllPageRowsSelected(),
				indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
				onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
				'aria-label': 'Select all'
			}),
		cell: ({ row }) =>
			renderComponent(Checkbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (value) => row.toggleSelected(!!value),
				'aria-label': 'Select row'
			}),
		enableSorting: false,
		enableHiding: false
	},
	{
		id: 'index',
		header: '#',
		cell: (info) => info.table.getRowModel().rows.findIndex((r) => r.id === info.row.id) + 1
	},

	{
		accessorKey: 'editContract',
		header: 'Edit Contract',
		sortable: true,
		cell: ({ row }) => {
			return renderComponent(Edit, {
				data: row.original
			});
		}
	},

	{
		accessorKey: 'site',
		header: 'Site',
		sortable: true,
		cell: ({ row }) => {
			return renderComponent(DataTableLinks, {
				id: row.original.siteId,
				name: row.original.siteName,
				link: '/dashboard/sites',

				target: '_blank'
			});
		}
	},
	{
		accessorKey: 'serviceName',
		header: 'Service'
	},

	{
		accessorKey: 'month',
		header: 'Month',
		cell: ({ row }) => row.original.month
	},

	{
		accessorKey: 'year',
		header: 'Year',
		cell: ({ row }) => row.original.year
	},

	{
		accessorKey: 'date',
		header: 'Payment Date',
		cell: ({ row }) => formatEthiopianDate(new Date(row.original.date))
	},
	{
		accessorKey: 'paymentAmount',
		header: 'Total Paid',
		cell: ({ row }) => {
			const amount = parseFloat(row.original.paymentAmount);
			return new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(amount);
		}
	},

	{
		accessorKey: 'invoiceNumber',
		header: 'Invoice #',
		cell: ({ row }) => renderComponent(Copy, { data: row.original.invoiceNumber })
	},
	{
		accessorKey: 'addedBy',
		header: 'Processed By',
		cell: ({ row }) => row.original.addedBy
	},

	{
		accessorKey: 'requestFile',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Request Document',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		// Using DataTableLinks to view staff profile
		cell: ({ row }) => {
			// Use staffId for the link, but ensure staffName is selected in the query
			return renderComponent(DataTableLinks, {
				id: row.original.requestFile,
				name: row.original.requestFile ? 'View Request Document' : 'No Request Document Added', // Fallback for safety
				link: row.original.requestFile ? `/dashboard/files` : '',
				target: '_blank'
			});
		}
	},

	{
		accessorKey: 'withholdFile',
		header: ({ column }) =>
			renderComponent(DataTableSort, {
				name: 'Withhold Document',
				onclick: column.getToggleSortingHandler()
			}),
		sortable: true,
		// Using DataTableLinks to view staff profile
		cell: ({ row }) => {
			// Use staffId for the link, but ensure staffName is selected in the query
			return renderComponent(DataTableLinks, {
				id: row.original.withholdFile,
				name: row.original.withholdFile ? 'View Withhold Document' : 'No Withhold Document Added', // Fallback for safety
				link: row.original.withholdFile ? `/dashboard/files` : '',
				target: '_blank'
			});
		}
	},
	{
		accessorKey: 'receiptFile',
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
				id: row.original.receiptFile,
				name: row.original.receiptFile ? 'View Bank Statement' : 'No Bank Statement Added', // Fallback for safety
				link: row.original.receiptFile ? `/dashboard/files` : '',
				target: '_blank'
			});
		}
	}
];
