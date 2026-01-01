<script lang="ts">
	let { data } = $props();

	import DataTable from '$lib/components/Table/data-table.svelte';
	import { boughtSupplies, soldProduct, soldServices } from './columns.js';
	import SingleTable from '$lib/components/SingleTable.svelte';

	import { Button } from '$lib/components/ui/button/index.js';
	import { Download, Eye } from '@lucide/svelte';
	import SingleView from '$lib/components/SingleView.svelte';

	let singleTable = $derived([
		{ name: 'Date', value: data.singleTransaction?.date },
		{ name: 'Amount', value: 'ETB ' + data.singleTransaction?.amount },
		{ name: 'Payment Method', value: data.singleTransaction?.paymentMethods },
		{ name: 'No of Products', value: data.singleTransaction?.noOfProducts },
		{ name: 'No of Services', value: data.singleTransaction?.noOfServices },
		{ name: 'No of Supplies', value: data.singleTransaction?.noOfSupplies },
		{ name: 'Recieved By', value: data.singleTransaction?.recievedBy }
	]);
</script>

<svelte:head>
	<title>Transaction Details</title>
</svelte:head>
<SingleView title="Transaction Details">
	<div class="mt-4 flex w-full flex-row items-start justify-start pl-4">
		<div class="w-full p-4">
			<SingleTable {singleTable} />
			<div class="flex w-full flex-row justify-end gap-2">
				<Button href="/dashboard/files/{data.singleTransaction?.recieptLink}" target="_blank">
					<Eye />
					View Reciept
				</Button>
				<Button
					href="/dashboard/files/{data.singleTransaction.recieptLink}"
					download="Transaction Reciept"
				>
					<Download />
					Download Reciept
				</Button>
			</div>
		</div>
	</div></SingleView
>

<div class="my-8 w-full lg:w-1/2">
	{#if data.soldProducts.length || data.soldServices.length}
		<div class="mb-6">
			<h3 class="text-lg font-semibold">Products</h3>
			<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
				Product sold in this Transactions.
			</p>
			<DataTable data={data.soldProducts} columns={soldProduct} search={false} />
		</div>

		<div class="mb-6">
			<h3 class="text-lg font-semibold">Services</h3>
			<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
				Rendered Services in this Transaction.
			</p>
			<DataTable data={data.soldServices} columns={soldServices} search={false} />
		</div>
	{/if}

	{#if data.boughtSupplies.length}
		<div class="mb-6">
			<h3 class="text-lg font-semibold">Supplies</h3>
			<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
				Supplies Bought in this Transactions.
			</p>
			<DataTable data={data.boughtSupplies} columns={boughtSupplies} search={false} />
		</div>
	{/if}
</div>
