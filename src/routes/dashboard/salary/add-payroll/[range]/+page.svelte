<script lang="ts">
	import { columns } from './columns';

	let { data } = $props();

	import DataTable from '$lib/components/Table/data-table.svelte';

	import { Frown, Loader } from '@lucide/svelte';
	import DateMonth from '$lib/formComponents/DateMonth.svelte';
	import Filter from '$lib/components/Table/FilterMenu.svelte';
	let filteredList = $derived(data?.payrollData);
</script>

<svelte:head>
	<title>UnPaid Salaries</title>
</svelte:head>

{#await data?.payrollData}
	<div class="flex justify-center p-10">
		<Loader class="animate-spin" />
	</div>
{:then payrollData}
	{#if data.payrollData.length === 0}
		<div class="flex h-96 w-5xl flex-col items-center justify-center">
			<p class="justify-self-cente mt-4 flex flex-row gap-4 text-center text-4xl">
				<Frown class="h-12 w-16  animate-bounce" />

				Transactions is Empty for this Date Range Choose Another Range
			</p>
			<DateMonth start={data?.start} end={data?.end} link="/dashboard/salary/add-payroll" />
		</div>
	{:else}
		<div class="flex flex-col gap-4">
			<h2 class="my-4 text-2xl">No of Salaries {data.payrollData?.length}</h2>

			<DateMonth start={data?.start} end={data?.end} link="/dashboard/salary/add-payroll" />

			<Filter
				data={data?.payrollData}
				bind:filteredList
				filterKeys={[
					'employmentStatus',
					'absent',
					'bank',
					'department',
					'overtime',
					'basicSalary',
					'housingAllowance',
					'transportAllowance',
					'positionAllowance'
				]}
			/>

			<DataTable data={filteredList} class="w-6xl!" {columns} fileName="Bank Accounts" />
		</div>
	{/if}
{:catch}
	<div class="flex h-screen w-screen flex-col items-center justify-center">
		<h1 class="text-red-500">Unexpected Error: Reload</h1>
	</div>
{/await}
