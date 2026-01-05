<script>
	import { renderComponent } from '$lib/components/ui/data-table/index.js';
	import DataTable from '$lib/components/Table/data-table.svelte';
	import DataTableLinks from '$lib/components/Table/data-table-links.svelte';
	import DataTableSort from '$lib/components/Table/data-table-sort.svelte';
	import DialogComp from '$lib/formComponents/DialogComp.svelte';
	import Empty from '$lib/components/Empty.svelte';
	import { Button } from '$lib/components/ui/button/index';
	import Edit from './edit.svelte';
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
				return renderComponent(Edit, {
					id: row.original.id,
					name: row.original.name,
					action: '?/edit',
					data: data.editForm,
					icon: false
				});
			}
		},

		{
			accessorKey: 'createdBy',
			header: ({ column }) =>
				renderComponent(DataTableSort, {
					name: 'Created By',
					onclick: column.getToggleSortingHandler()
				}),
			sortable: true,
			cell: ({ row }) => {
				// You can pass whatever you need from `row.original` to the component
				return renderComponent(DataTableLinks, {
					id: row.original.createdById,
					name: row.original.createdBy,
					link: '/dashboard/users'
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
					id: row.original.id,
					name: row.original.name,
					action: '?/edit',
					data: data.editForm,
					icon: true
				});
			}
		}
	];
	let { data } = $props();
	import { superForm } from 'sveltekit-superforms/client';
	import InputComp from '$lib/formComponents/InputComp.svelte';
	import LoadingBtn from '$lib/formComponents/LoadingBtn.svelte';
	import { Plus } from '@lucide/svelte';

	const { form, errors, enhance, delayed, message } = superForm(data.form, {});

	import { toast } from 'svelte-sonner';
	$effect(() => {
		if ($message) {
			if ($message.type === 'error') {
				toast.error($message.text);
			} else {
				toast.success($message.text);
			}
		}
	});
</script>

<DialogComp title="+ Add New Payment Method" variant="default">
	<form action="?/add" use:enhance id="main" class="flex flex-col gap-4" method="post">
		<h2>{$message ? $message.text : ''}</h2>
		<InputComp {form} {errors} label="name" type="text" name="name" required={true} />

		<Button type="submit" form="main">
			{#if $delayed}
				<LoadingBtn name="Adding Payment Method" />
			{:else}
				<Plus /> Add Payment Method
			{/if}
		</Button>
	</form>
</DialogComp>
{#if data.allPaymentMethods.length === 0}
	<Empty title="Payment Methods" />
{:else}
	<DataTable {columns} data={data?.allPaymentMethods} search={true} fileName="Payment Methods" />
{/if}
