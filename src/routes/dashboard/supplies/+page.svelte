<script lang="ts">
	import { columns } from './columns';

	let { data } = $props();

	import DataTable from '$lib/components/Table/data-table.svelte';

	import Loading from '$lib/components/Loading.svelte';
	import { Frown, Plus } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import FilterMenu from '$lib/components/Table/FilterMenu.svelte';

	let filteredList = $derived(data?.supplyList);
</script>

<svelte:head>
	<title>Supplies List</title>
</svelte:head>

{#await data}
	<Loading name="Customers" />
{:then customerList}
	{#if data.supplyList.length === 0}
		<div class="flex h-96 w-5xl flex-col items-center justify-center gap-4">
			<p class="mt-4 flex flex-row gap-4 justify-self-center text-center text-4xl">
				<Frown class="h-12 w-16  animate-bounce" />
				No supplies added Yet
			</p>
			<Button href="/dashboard/supplies/add-supplies"><Plus /> Add New Supplies</Button>
		</div>
	{:else}
		<h2 class="my-4 text-2xl">No of Supplies: {data.supplyList?.length}</h2>

		<!-- <div class="lg:w-full w-[350px] lg:p-0 p-2 mt-8 mb-4 pt-4">

   <DataTable data={data.supplyList} {columns} />
 </div> -->
		<FilterMenu data={data?.supplyList} filterKeys={['type']} bind:filteredList />
		<DataTable data={filteredList} {columns} fileName="Supplies" />
	{/if}
{:catch}
	<div class="flex h-screen w-screen flex-col items-center justify-center">
		<h1 class="text-red-500">Unexpected Error: Reload</h1>
	</div>
{/await}
