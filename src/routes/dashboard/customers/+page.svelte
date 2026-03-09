<script lang="ts">
	import { columns } from './columns';

	let { data } = $props();

	import DataTable from '$lib/components/Table/data-table.svelte';

	import Loading from '$lib/components/Loading.svelte';
	import { Frown } from '@lucide/svelte';
</script>

<svelte:head>
	<title>Customers List</title>
</svelte:head>

{#if data.customerList.length === 0}
	<div class="flex h-96 w-5xl items-center justify-center">
		<p class="justify-self-cente mt-4 flex flex-row gap-4 text-center text-4xl">
			<Frown class="h-12 w-16  animate-bounce" />
			No Uncontracted Customers
		</p>
	</div>
{:else}
	<h2 class="my-4 text-2xl">No of customers {data.customerList?.length}</h2>

	<DataTable data={data.customerList} {columns} class="max-w-7xl!" />
{/if}
