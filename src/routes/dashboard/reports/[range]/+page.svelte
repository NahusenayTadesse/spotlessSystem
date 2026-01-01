<script lang="ts">
	import { columns } from './columns';

	let { data } = $props();

	import DataTable from '$lib/components/Table/data-table.svelte';

	import Loading from '$lib/components/Loading.svelte';
	import { Frown } from '@lucide/svelte';
	import DateMonth from '$lib/formComponents/DateMonth.svelte';
</script>

<svelte:head>
	<title>Reports</title>
</svelte:head>

{#await data}
	<Loading name="Customers" />
{:then reports}
	{#if data.allReports.length === 0}
		<div class="flex h-96 w-full flex-col items-center justify-center lg:w-5xl">
			<p class="justify-self-cente mt-4 flex flex-row gap-4 text-center text-4xl">
				<Frown class="h-12 w-16  animate-bounce" />

				Reports is Empty for this Date Range Choose Another Range
			</p>
			<DateMonth start={data?.start} end={data?.end} link="/dashboard/reports" />
		</div>
	{:else}
		<h2 class="my-4 text-2xl">No of Reports {data.allReports?.length}</h2>

		<DateMonth start={data?.start} end={data?.end} link="/dashboard/reports" />
		<!--
		<div class="mt-8 mb-4 w-[350px] p-2 px-2 pt-4 lg:w-[1250px] lg:p-0">
			<DataTable data={data.allReports} {columns} />
		</div> -->
		<DataTable data={data.allReports} {columns} />
	{/if}
{:catch}
	<div class="flex h-screen w-screen flex-col items-center justify-center">
		<h1 class="text-red-500">Unexpected Error: Reload</h1>
	</div>
{/await}
