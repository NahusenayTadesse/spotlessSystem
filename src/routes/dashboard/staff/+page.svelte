<script lang="ts">
	import { columns } from './columns';

	let { data } = $props();

	import DataTable from '$lib/components/Table/data-table.svelte';

	import Loading from '$lib/components/Loading.svelte';
	import { Frown, Plus } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
</script>

<svelte:head>
	<title>Staff List</title>
</svelte:head>

{#await data}
	<Loading name="Customers" />
{:then staffList}
	{#if data.staffList.length === 0}
		<div class="flex h-96 w-5xl flex-col items-center justify-center">
			<p class="justify-self-cente mt-4 flex flex-row gap-4 text-center text-4xl">
				<Frown class="h-12 w-16  animate-bounce" />
				No staff members added yet
			</p>
			<Button href="/dashboard/services/add-services"><Plus />Add New Staff Members</Button>
		</div>
	{:else}
		<h2 class="my-4 text-2xl">No of Staff {data.staffList?.length}</h2>

		<!-- <div class="lg:w-full w-[350px] lg:p-0 p-2 mt-8 mb-4 pt-4">

   <DataTable data={data.staffList} {columns} filterBlacklist={['id']} />
 </div> -->
		<DataTable data={data.staffList} {columns} filterBlacklist={['id']} />
	{/if}
{:catch}
	<div class="flex h-screen w-screen flex-col items-center justify-center">
		<h1 class="text-red-500">Unexpected Error: Reload</h1>
	</div>
{/await}
