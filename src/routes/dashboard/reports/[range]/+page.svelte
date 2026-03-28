<script lang="ts">
	import { columns } from './columns';

	let { data } = $props();

	import DataTable from '$lib/components/Table/data-table.svelte';

	import { ArrowBigRight, Frown } from '@lucide/svelte';
	import DateMonth from '$lib/formComponents/DateMonth.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import { formatEthiopianYear } from '$lib/global.svelte';

	let max = formatEthiopianYear(new Date());

	let range = $derived(data?.range);
</script>

<svelte:head>
	<title>Reports</title>
</svelte:head>

{#if data.allReports.length === 0}
	<div class="flex h-96 w-full flex-col items-center justify-center lg:w-5xl">
		<p class="justify-self-cente mt-4 flex flex-row gap-4 text-center text-4xl">
			<Frown class="h-12 w-16  animate-bounce" />

			Reports is Empty for this Year Choose Another Year
		</p>
		<div class="flex w-full max-w-sm items-center gap-0">
			<div class="relative grow">
				<Input
					bind:value={range}
					type="number"
					min={2000}
					{max}
					class="rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
				/>
			</div>
			<Button
				href="/dashboard/reports/{range}"
				disabled={range > max}
				variant={range > max ? 'destructive' : 'default'}
				class="rounded-l-none border-l-0 bg-primary px-6 hover:bg-primary/90"
			>
				View {range > max ? 'ERROR MAX YEAR REACHED' : range} Reports <ArrowBigRight />
			</Button>
		</div>
	</div>
{:else}
	<h2 class="my-4 text-2xl">No of Salary Reports {data.allReports?.length}</h2>
	<div class="flex w-full max-w-sm items-center gap-0">
		<div class="relative grow">
			<Input
				bind:value={range}
				type="number"
				min={2000}
				{max}
				class="rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
			/>
		</div>
		<Button
			href="/dashboard/reports/{range}"
			disabled={range > max}
			variant={range > max ? 'destructive' : 'default'}
			class="rounded-l-none border-l-0 bg-primary px-6 hover:bg-primary/90"
		>
			View {range > max ? 'ERROR MAX YEAR REACHED' : range} Reports <ArrowBigRight />
		</Button>
	</div>
	<DataTable
		data={data.allReports}
		{columns}
		class="max-w-6xl"
		fileName="Salary Reports for {range}"
	/>
{/if}
