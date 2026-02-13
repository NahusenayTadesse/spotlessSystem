<script lang="ts">
	import { columns } from './columns.svelte';

	let { data } = $props();

	import DataTable from '$lib/components/Table/data-table.svelte';

	import Loading from '$lib/components/Loading.svelte';
	import { Frown, ArrowRight } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import MonthYear from '$lib/formComponents/MonthYear.svelte';

	// let month = $state(
	// 	new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString(undefined, {
	// 		month: 'long'
	// 	}) +
	// 		'_' +
	// 		new Date().getFullYear()
	// );
	//

	let month = $state('');

	let link = $derived(`${month}`);

	const MONTH_MAP: Record<string, number> = {
		january: 1,
		february: 2,
		march: 3,
		april: 4,
		may: 5,
		june: 6,
		july: 7,
		august: 8,
		september: 9,
		october: 10,
		november: 11,
		december: 12
	};

	const getEthiopianMonth = (month: number | string): string => {
		let monthNumber: number | undefined;

		if (typeof month === 'number') {
			monthNumber = month;
		} else {
			monthNumber = MONTH_MAP[month.toLowerCase()];
		}

		if (!monthNumber || monthNumber < 1 || monthNumber > 12) {
			return '';
		}

		// Fixed reference year to avoid edge cases
		const date = new Date(2024, monthNumber - 1, 1);

		const formatter = new Intl.DateTimeFormat('am-ET', {
			month: 'long',
			calendar: 'ethiopic'
		});

		return formatter.format(date);
	};

	export const getEthiopianYear = (year: number): string => {
		if (!year) return '';

		// Use January 1st to avoid Ethiopian new-year boundary issues
		const date = new Date(year, 0, 1);

		const formatter = new Intl.DateTimeFormat('am-ET', {
			year: 'numeric',
			calendar: 'ethiopic'
		});

		return formatter.format(date);
	};

	import Filter from '$lib/components/Table/FilterMenu.svelte';
	let filteredList = $derived(data?.payrollData);
</script>

<svelte:head>
	<title>Salaries List for {data.month} {data.year}</title>
</svelte:head>

{#await data}
	<Loading name="Salaries" />
{:then payrollData}
	{#if data?.payrollData.length === 0}
		<div class="flex h-96 w-5xl flex-col items-center justify-center">
			<p class="justify-self-cente mt-4 flex flex-row gap-4 text-center text-4xl"></p>
			<div class="flex items-center gap-2">
				<label class="sr-only" for="month-select">Month</label>
				<MonthYear bind:value={month} />
			</div>

			<Button
				href={`/dashboard/salary/${link}`}
				aria-label="Go to selected month and year"
				class="flex items-center gap-2"
			>
				Go
				<ArrowRight class="h-4 w-4" />
			</Button>
		</div>
		<Frown class="h-12 w-16  animate-bounce" />
		No salaries added yet for {data.month}
		{data.year}

		<!-- <Button href="/dashboard/services/add-services"><Plus />Add New Staff Members</Button> -->
	{:else}
		<div
			class="mx-auto max-w-4xl gap-4 rounded-lg bg-white/80 p-4 shadow-sm backdrop-blur-sm lg:flex lg:items-center lg:justify-between dark:bg-gray-800/80"
		>
			<div class="flex-1">
				<h1 class="text-lg font-semibold text-gray-900 lg:text-2xl dark:text-gray-100">
					Salaries — {data?.month}
					{data.year}
				</h1>
				<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
					Total Employees: <span class="font-medium text-gray-800 dark:text-gray-100"
						>{data?.payrollData.length}</span
					>
				</p>
			</div>

			<div class="mt-3 flex flex-col items-stretch gap-3 sm:mt-0 sm:flex-row sm:items-center">
				<div class="flex items-center gap-2">
					<label class="sr-only" for="month-select">Month</label>
					<MonthYear bind:value={month} />
				</div>

				<Button
					href={`/dashboard/salary/${link}`}
					aria-label="Go to selected month and year"
					class="flex items-center gap-2"
				>
					Go
					<ArrowRight class="h-4 w-4" />
				</Button>
			</div>
		</div>

		<Filter
			data={data?.payrollData}
			bind:filteredList
			filterKeys={['missingDays', 'bank', 'department', 'status']}
		/>

		<DataTable data={filteredList} class="w-6xl!" {columns} fileName="Bank Accounts" />
	{/if}
{:catch}
	<div class="flex h-screen w-screen flex-col items-center justify-center">
		<h1 class="text-red-500">Unexpected Error: Reload</h1>
	</div>
{/await}
